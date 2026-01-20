#!/usr/bin/env python3
"""
Podcast Intelligence Agent

An agentic script that runs daily to:
1. Check Podscribe for the latest 20VC episode
2. Extract and analyze the transcript for AI/Semiconductor keywords
3. Generate structured summaries using Claude AI
4. Update the Kabuten podcasts page with the new data

This script is designed to run as a daily cron job or scheduled task.

Usage:
    # Run the full agent workflow
    python podcast_agent.py

    # Run in dry-run mode (no file updates)
    python podcast_agent.py --dry-run

    # Run with specific podcast
    python podcast_agent.py --podcast "20VC"

Requirements:
    pip install playwright anthropic
    playwright install chromium
"""

import os
import re
import json
import argparse
import logging
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional

# Browser automation
try:
    from playwright.sync_api import sync_playwright, Page, Browser
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

# AI summarization
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# =============================================================================
# Configuration
# =============================================================================

@dataclass
class PodcastConfig:
    """Configuration for a podcast source."""
    name: str
    series_id: str  # Podscribe series ID (or empty for non-Podscribe sources)
    color: str
    emoji: str
    keywords: list[str]
    url: str = ""  # Full URL (overrides series_id if provided)
    source: str = "podscribe"  # "podscribe" or "podscripts"

    def __post_init__(self):
        if not self.url and self.series_id:
            self.url = f"https://app.podscribe.com/series/{self.series_id}?uid=b448f478-f041-70f1-aa51-f9dd28c4f86a"


# Podcast configurations - all 8 tracked podcasts
PODCAST_CONFIGS = {
    "20VC": PodcastConfig(
        name="20VC",
        series_id="1864",
        color="from-purple-600 to-purple-500",
        emoji="🎙️",
        keywords=[
            "AI", "artificial intelligence", "model", "GPU", "chip",
            "semiconductor", "NVIDIA", "compute", "inference", "training",
            "startup", "venture", "funding", "enterprise", "B2B", "SaaS"
        ]
    ),
    "All-In": PodcastConfig(
        name="All-In Podcast",
        series_id="",
        color="from-yellow-500 to-yellow-400",
        emoji="🎯",
        url="https://podscripts.co/podcasts/all-in-with-chamath-jason-sacks-friedberg",
        source="podscripts",
        keywords=[
            "AI", "semiconductor", "NVIDIA", "chip", "GPU", "TSMC",
            "China", "trade", "tech", "startup", "IPO", "market",
            "tariff", "geopolitics", "Apple", "Google", "Meta"
        ]
    ),
    "ChinaTalk": PodcastConfig(
        name="ChinaTalk",
        series_id="692695",
        color="from-red-600 to-red-500",
        emoji="🇨🇳",
        keywords=[
            "China", "semiconductor", "chip", "SMIC", "Huawei", "ASML",
            "export control", "trade", "AI", "technology", "manufacturing",
            "supply chain", "Taiwan", "TSMC", "geopolitics"
        ]
    ),
    "Dwarkesh": PodcastConfig(
        name="Dwarkesh Podcast",
        series_id="2169846",
        color="from-orange-500 to-orange-400",
        emoji="🎤",
        keywords=[
            "AI", "semiconductor", "chip", "TSMC", "ASML", "EUV",
            "manufacturing", "compute", "scaling", "model", "training",
            "inference", "Moore's law", "fabrication"
        ]
    ),
    "Hard Fork": PodcastConfig(
        name="Hard Fork",
        series_id="1217941",
        color="from-pink-600 to-pink-500",
        emoji="🍴",
        keywords=[
            "AI", "agent", "OpenAI", "Anthropic", "Google", "Microsoft",
            "compute", "chip", "datacenter", "GPU", "model", "ChatGPT",
            "Claude", "Gemini", "Meta", "Llama"
        ]
    ),
    "No Priors": PodcastConfig(
        name="No Priors",
        series_id="2265113",
        color="from-emerald-600 to-emerald-500",
        emoji="🧠",
        keywords=[
            "AI", "model", "scaling", "training", "inference", "GPU",
            "compute", "transformer", "LLM", "benchmark", "capability",
            "alignment", "safety", "AGI", "frontier"
        ]
    ),
    "BG2": PodcastConfig(
        name="BG2 Pod",
        series_id="2349338",
        color="from-blue-600 to-blue-500",
        emoji="💼",
        keywords=[
            "AI", "enterprise", "startup", "venture", "funding", "IPO",
            "semiconductor", "chip", "NVIDIA", "cloud", "infrastructure",
            "SaaS", "B2B", "market", "valuation"
        ]
    ),
    "a16z": PodcastConfig(
        name="The a16z Podcast",
        series_id="188",
        color="from-gray-700 to-gray-600",
        emoji="🅰️",
        keywords=[
            "AI", "startup", "venture", "technology", "infrastructure",
            "compute", "chip", "semiconductor", "enterprise", "consumer",
            "platform", "developer", "cloud", "edge"
        ]
    )
}

# Keywords to search for in transcripts
DEFAULT_KEYWORDS = [
    "AI", "artificial intelligence", "semiconductor", "chip", "GPU",
    "NVIDIA", "AMD", "TSMC", "inference", "training", "model",
    "compute", "datacenter", "HBM", "memory"
]

# File paths
KABUTEN_PODCASTS_PAGE = Path(__file__).parent.parent / "app" / "podcasts" / "page.jsx"
PODCAST_AGENT_LOG = Path(__file__).parent.parent / "public" / "data" / "podcast_agent_log.json"


# =============================================================================
# Data Classes
# =============================================================================

@dataclass
class EpisodeInfo:
    """Information about a podcast episode."""
    title: str
    episode_num: Optional[int]
    date: str
    url: str
    duration: Optional[str] = None


@dataclass
class IdeaSummary:
    """A summarized idea from the podcast."""
    summary: str
    detail: str
    timestamp: str


@dataclass
class PodcastSummary:
    """Complete summary for a podcast episode."""
    name: str
    color: str
    emoji: str
    episode: str
    episode_num: int
    date: str
    url: str
    ideas: list[IdeaSummary]


# =============================================================================
# Browser Agent
# =============================================================================

class PodscribeBrowserAgent:
    """
    Browser agent for navigating Podscribe/Podscripts and extracting podcast data.
    Supports both app.podscribe.com and podscripts.co sources.
    """

    def __init__(self, headless: bool = True):
        self.headless = headless
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None

    def __enter__(self):
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError("Playwright required. Install: pip install playwright && playwright install")

        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=self.headless)
        self.page = self.browser.new_page()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.browser:
            self.browser.close()
        if hasattr(self, 'playwright'):
            self.playwright.stop()

    def get_latest_episode(self, config: PodcastConfig) -> Optional[EpisodeInfo]:
        """
        Navigate to podcast series page and get the latest episode info.
        Handles both Podscribe and Podscripts sources.
        """
        logger.info(f"Fetching latest episode for {config.name} from {config.source}...")

        try:
            self.page.goto(config.url, wait_until="networkidle", timeout=30000)
            self.page.wait_for_timeout(2000)

            if config.source == "podscripts":
                return self._get_latest_episode_podscripts(config)
            else:
                return self._get_latest_episode_podscribe(config)

        except Exception as e:
            logger.error(f"Failed to get latest episode: {e}")
            return None

    def _get_latest_episode_podscribe(self, config: PodcastConfig) -> Optional[EpisodeInfo]:
        """Get latest episode from Podscribe."""
        # Click Episodes tab if needed
        episodes_tab = self.page.locator("text=Episodes")
        if episodes_tab.is_visible():
            episodes_tab.click()
            self.page.wait_for_timeout(1000)

        # Get the first (latest) episode from the list
        episode_rows = self.page.locator("table tbody tr, [class*='episode']").first

        if not episode_rows:
            logger.warning("No episodes found")
            return None

        # Extract episode info from the page
        page_text = self.page.evaluate("document.body.innerText")
        return self._parse_episode_info(page_text, config)

    def _get_latest_episode_podscripts(self, config: PodcastConfig) -> Optional[EpisodeInfo]:
        """Get latest episode from Podscripts.co."""
        # Podscripts has a different page structure
        page_text = self.page.evaluate("document.body.innerText")

        # Parse episode list from Podscripts format
        lines = page_text.split('\n')
        title = None
        date = None
        episode_num = None

        for line in lines:
            line = line.strip()
            # Podscripts typically shows episode titles prominently
            if len(line) > 30 and ('E' in line or '#' in line or ':' in line):
                # Look for episode-like patterns
                if any(kw in line.lower() for kw in ['episode', 'ep', 'e', '#']):
                    title = line
                    num_match = re.search(r'[Ee](\d+)|#(\d+)', line)
                    if num_match:
                        episode_num = int(num_match.group(1) or num_match.group(2))
                    break

        # Find date
        date_match = re.search(r'(\w+ \d+, \d{4}|\d{1,2}/\d{1,2}/\d{2,4})', page_text)
        if date_match:
            date = date_match.group(1)
        else:
            date = datetime.now().strftime("%b %d, %Y")

        if not title:
            # Fallback: get first substantial text line after navigation
            for line in lines[10:50]:  # Skip header lines
                if len(line) > 40 and not line.startswith(('Home', 'Search', 'About')):
                    title = line
                    break

        if not title:
            return None

        return EpisodeInfo(
            title=title,
            episode_num=episode_num,
            date=date,
            url=config.url,
            duration=None
        )

    def _parse_episode_info(self, page_text: str, config: PodcastConfig) -> Optional[EpisodeInfo]:
        """Parse episode information from page text."""
        lines = page_text.split('\n')

        # Look for episode title pattern (usually starts with "20VC:" or podcast name)
        title = None
        date = None
        duration = None
        episode_num = None

        for i, line in enumerate(lines):
            line = line.strip()

            # Find title (usually contains podcast prefix)
            if config.name in line and ':' in line and len(line) > 20:
                title = line

                # Try to extract episode number
                num_match = re.search(r'E(\d+)', line) or re.search(r'#(\d+)', line)
                if num_match:
                    episode_num = int(num_match.group(1))

            # Find date (format: 1/19 or Jan 19, 2026)
            date_match = re.search(r'(\d{1,2}/\d{1,2}(?:/\d{2,4})?)', line)
            if date_match and not date:
                date = date_match.group(1)

            # Find duration (format: 1h 14m or 46m)
            duration_match = re.search(r'(\d+h\s*\d+m|\d+m)', line)
            if duration_match and not duration:
                duration = duration_match.group(1)

        if not title:
            return None

        # Format date
        if date:
            try:
                # Convert 1/19 to Jan 19, 2026
                parts = date.split('/')
                month = int(parts[0])
                day = int(parts[1])
                year = int(parts[2]) if len(parts) > 2 else datetime.now().year
                date_obj = datetime(year, month, day)
                date = date_obj.strftime("%b %d, %Y")
            except (ValueError, IndexError):
                date = datetime.now().strftime("%b %d, %Y")
        else:
            date = datetime.now().strftime("%b %d, %Y")

        return EpisodeInfo(
            title=title,
            episode_num=episode_num,
            date=date,
            url=config.url,
            duration=duration
        )

    def get_episode_transcript(self, episode_url: str) -> str:
        """
        Navigate to episode page and extract full transcript.
        """
        logger.info(f"Extracting transcript from {episode_url}...")

        try:
            self.page.goto(episode_url, wait_until="networkidle", timeout=30000)
            self.page.wait_for_timeout(3000)

            # Click TRANSCRIPT tab
            transcript_tab = self.page.locator("text=TRANSCRIPT")
            if transcript_tab.is_visible():
                transcript_tab.click()
                self.page.wait_for_timeout(2000)

            # Clear any search filters
            search_input = self.page.locator("input[type='search']")
            if search_input.is_visible():
                search_input.fill("")
                self.page.wait_for_timeout(500)

            # Extract transcript text
            transcript = self.page.evaluate("document.body.innerText")

            logger.info(f"Extracted transcript: {len(transcript)} characters")
            return transcript

        except Exception as e:
            logger.error(f"Failed to extract transcript: {e}")
            return ""

    def find_episode_url(self, config: PodcastConfig, episode_title: str) -> Optional[str]:
        """
        Find the URL for a specific episode by clicking on it.
        """
        try:
            self.page.goto(config.url, wait_until="networkidle")
            self.page.wait_for_timeout(2000)

            # Find and click the episode link
            episode_link = self.page.locator(f"text={episode_title[:50]}").first
            if episode_link:
                episode_link.click()
                self.page.wait_for_timeout(2000)
                return self.page.url

            return None

        except Exception as e:
            logger.error(f"Failed to find episode URL: {e}")
            return None


# =============================================================================
# AI Summarizer
# =============================================================================

class AITranscriptSummarizer:
    """
    Uses Claude AI to analyze transcripts and generate structured summaries.
    """

    def __init__(self, api_key: Optional[str] = None):
        if not ANTHROPIC_AVAILABLE:
            raise ImportError("Anthropic SDK required. Install: pip install anthropic")

        self.client = anthropic.Anthropic(api_key=api_key or os.getenv("ANTHROPIC_API_KEY"))

    def extract_keyword_context(self, transcript: str, keywords: list[str], context_size: int = 300) -> list[str]:
        """Extract passages containing keywords."""
        passages = []
        sentences = re.split(r'(?<=[.!?])\s+', transcript)

        for i, sentence in enumerate(sentences):
            sentence_lower = sentence.lower()

            if any(kw.lower() in sentence_lower for kw in keywords):
                # Get surrounding context
                start = max(0, i - 1)
                end = min(len(sentences), i + 2)
                context = ' '.join(sentences[start:end])

                if len(context) > 50:  # Filter out very short passages
                    passages.append(context[:context_size])

        # Deduplicate similar passages
        unique_passages = []
        seen = set()
        for p in passages:
            normalized = p.lower()[:100]
            if normalized not in seen:
                seen.add(normalized)
                unique_passages.append(p)

        return unique_passages[:30]  # Limit to top 30 passages

    def generate_ideas(
        self,
        transcript: str,
        keywords: list[str],
        episode_title: str,
        max_ideas: int = 5
    ) -> list[IdeaSummary]:
        """
        Use Claude to generate structured idea summaries from transcript.
        """
        # Extract relevant passages
        passages = self.extract_keyword_context(transcript, keywords)

        if not passages:
            logger.warning("No keyword passages found in transcript")
            return []

        combined_passages = "\n\n---\n\n".join(passages)

        prompt = f"""Analyze this podcast transcript excerpt from "{episode_title}" and extract the most important ideas related to AI, semiconductors, technology, and investing.

TRANSCRIPT EXCERPTS:
{combined_passages}

Generate exactly {max_ideas} key insights in JSON format. Each insight should:
1. Have a concise summary title (5-10 words, descriptive headline)
2. Have a detailed explanation (2-3 sentences explaining the insight and its implications)
3. Include an approximate timestamp if mentioned (format: "MM:SS" or "HH:MM:SS")

Focus on:
- AI/ML developments, model performance, enterprise adoption
- Semiconductor/chip insights (NVIDIA, AMD, TSMC, etc.)
- Investment implications and market trends
- Technology predictions and analysis

Return ONLY valid JSON in this exact format:
{{
  "ideas": [
    {{
      "summary": "Brief headline title",
      "detail": "Detailed 2-3 sentence explanation of the insight and its implications.",
      "timestamp": "23:45"
    }}
  ]
}}"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )

            response_text = response.content[0].text

            # Extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                data = json.loads(json_match.group())
                ideas = data.get("ideas", [])

                return [
                    IdeaSummary(
                        summary=idea["summary"],
                        detail=idea["detail"],
                        timestamp=idea.get("timestamp", "00:00")
                    )
                    for idea in ideas
                ]

            logger.warning("Could not parse AI response as JSON")
            return []

        except Exception as e:
            logger.error(f"AI summarization failed: {e}")
            return []


# =============================================================================
# Kabuten Page Updater
# =============================================================================

class KabutenPageUpdater:
    """
    Updates the Kabuten podcasts page with new podcast summaries.
    """

    def __init__(self, page_path: Path):
        self.page_path = page_path

    def read_current_data(self) -> list[dict]:
        """Read current podcast data from the page file."""
        if not self.page_path.exists():
            logger.warning(f"Page file not found: {self.page_path}")
            return []

        content = self.page_path.read_text()

        # Extract the podcasts array from the JSX
        match = re.search(r'const podcasts = \[([\s\S]*?)\];', content)
        if not match:
            logger.warning("Could not find podcasts array in page")
            return []

        # This is a simplified extraction - in production, use a proper parser
        try:
            # Clean up JSX to valid JSON (very simplified)
            array_content = match.group(1)
            # This would need more sophisticated parsing for production
            return []  # Placeholder
        except Exception as e:
            logger.error(f"Failed to parse current data: {e}")
            return []

    def update_podcast(self, summary: PodcastSummary, dry_run: bool = False) -> bool:
        """
        Update or add a podcast summary to the page.
        """
        if not self.page_path.exists():
            logger.error(f"Page file not found: {self.page_path}")
            return False

        content = self.page_path.read_text()

        # Generate the new podcast entry JSX
        ideas_jsx = ",\n        ".join([
            f'''{{
          summary: "{idea.summary}",
          detail: "{idea.detail.replace('"', '\\"')}",
          timestamp: "{idea.timestamp}"
        }}'''
            for idea in summary.ideas
        ])

        new_entry = f'''{{
      name: "{summary.name}",
      color: "{summary.color}",
      emoji: "{summary.emoji}",
      episode: "{summary.episode}",
      episodeNum: {summary.episode_num},
      date: "{summary.date}",
      url: "{summary.url}",
      ideas: [
        {ideas_jsx}
      ]
    }}'''

        # Check if podcast already exists in the array
        podcast_pattern = rf'(\{{\s*name:\s*"{re.escape(summary.name)}"[\s\S]*?\}})\s*,'

        if re.search(podcast_pattern, content):
            # Replace existing entry
            logger.info(f"Updating existing entry for {summary.name}")
            new_content = re.sub(podcast_pattern, new_entry + ',', content)
        else:
            # Add new entry at the beginning of the array
            logger.info(f"Adding new entry for {summary.name}")
            array_start = content.find('const podcasts = [')
            if array_start == -1:
                logger.error("Could not find podcasts array")
                return False

            insert_pos = array_start + len('const podcasts = [')
            new_content = content[:insert_pos] + '\n    ' + new_entry + ',' + content[insert_pos:]

        # Update the "Last updated" timestamp
        now = datetime.now().strftime("%b %d, %Y %H:%M JST")
        new_content = re.sub(
            r'Last: [A-Za-z]+ \d+, \d+ \d+:\d+ JST',
            f'Last: {now}',
            new_content
        )

        if dry_run:
            logger.info("Dry run - would write:")
            logger.info(new_entry[:500] + "...")
            return True

        # Write updated content
        self.page_path.write_text(new_content)
        logger.info(f"Successfully updated {self.page_path}")
        return True

    def generate_full_page(self, summaries: list[PodcastSummary]) -> str:
        """
        Generate a complete new page.jsx with all podcast summaries.
        """
        podcasts_jsx = ",\n    ".join([
            self._summary_to_jsx(s) for s in summaries
        ])

        total_ideas = sum(len(s.ideas) for s in summaries)
        now = datetime.now().strftime("%b %d, %Y %H:%M JST")

        return f'''\'use client\';

import React from 'react';
import Link from 'next/link';

export default function PodcastsPage() {{
  // Podcast data - auto-updated by podcast_agent.py
  // Last update: {now}
  const podcasts = [
    {podcasts_jsx}
  ];

  const totalIdeas = podcasts.reduce((sum, p) => sum + p.ideas.length, 0);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-sm">
      {{/* Header */}}
      <header className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">
            ← Homepage
          </Link>
          <div>
            <span className="font-semibold">Podcast Ideas Tracker</span>
            <span className="text-gray-400 text-xs ml-2">AI & Semiconductor insights</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">Updated every 2 days • Last: {now}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4">

        {{/* Summary Stats */}}
        <div className="bg-white border border-gray-300 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">🎙️ AI & Semiconductor Podcast Intelligence</h1>
              <p className="text-gray-500 text-xs mt-1">Key insights extracted from {{podcasts.length}} tech podcasts • Transcripts via Podscribe</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{{podcasts.length}}</div>
                <div className="text-xs text-gray-400">Podcasts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{{totalIdeas}}</div>
                <div className="text-xs text-gray-400">Ideas</div>
              </div>
            </div>
          </div>
        </div>

        {{/* Podcast Cards */}}
        <div className="space-y-4">
          {{podcasts.map((podcast) => (
            <div key={{podcast.name}} className="bg-white border border-gray-300 rounded-xl overflow-hidden">
              {{/* Podcast Header */}}
              <div className={{`px-4 py-3 border-b border-gray-200 bg-gradient-to-r ${{podcast.color}} flex justify-between items-center`}}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{{podcast.emoji}}</span>
                  <div>
                    <span className="text-white font-semibold">{{podcast.name}}</span>
                    <span className="text-white/70 text-xs ml-2">E{{podcast.episodeNum}} • {{podcast.date}}</span>
                  </div>
                </div>
                <a
                  href={{podcast.url}}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
                >
                  View Transcript →
                </a>
              </div>

              {{/* Episode Title */}}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-gray-700 font-medium">"{{podcast.episode}}"</span>
              </div>

              {{/* Ideas */}}
              <div className="p-4 space-y-4">
                {{podcast.ideas.map((idea, index) => (
                  <div key={{index}} className="flex gap-3">
                    <span className="text-purple-500 mt-0.5 text-base">💡</span>
                    <div>
                      <p className="text-gray-800">
                        <strong>{{idea.summary}}:</strong> {{idea.detail}}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Timestamp: {{idea.timestamp}}</p>
                    </div>
                  </div>
                ))}}
              </div>
            </div>
          ))}}
        </div>

        {{/* Methodology Footer */}}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
          <strong>Methodology:</strong> Transcripts sourced from Podscribe. Filtered for AI, semiconductor, chip, GPU, NVIDIA, TSMC, and related keywords. Summarized by Claude AI.
          <br />
          <strong>Auto-updated:</strong> Every day at 10:00 JST by podcast_agent.py
        </div>

      </div>
    </div>
  );
}}
'''

    def _summary_to_jsx(self, summary: PodcastSummary) -> str:
        """Convert a PodcastSummary to JSX object notation."""
        ideas_jsx = ",\n        ".join([
            f'''{{
          summary: "{idea.summary}",
          detail: "{idea.detail.replace('"', '\\"').replace('\n', ' ')}",
          timestamp: "{idea.timestamp}"
        }}'''
            for idea in summary.ideas
        ])

        return f'''{{
      name: "{summary.name}",
      color: "{summary.color}",
      emoji: "{summary.emoji}",
      episode: "{summary.episode.replace('"', '\\"')}",
      episodeNum: {summary.episode_num or 0},
      date: "{summary.date}",
      url: "{summary.url}",
      ideas: [
        {ideas_jsx}
      ]
    }}'''


# =============================================================================
# Main Agent
# =============================================================================

def update_agent_log(
    podcast_name: str,
    episode_title: str,
    episode_num: int,
    ideas_count: int,
    status: str,
    duration: str
) -> None:
    """
    Update the podcast agent log file with a new run entry.
    Keeps the last 20 runs.
    """
    try:
        # Read existing log
        if PODCAST_AGENT_LOG.exists():
            with open(PODCAST_AGENT_LOG, 'r') as f:
                log_data = json.load(f)
        else:
            log_data = {"lastUpdated": "", "runs": []}

        # Create new entry
        new_entry = {
            "timestamp": datetime.now().isoformat(),
            "podcast": podcast_name,
            "episode": episode_title,
            "episodeNum": episode_num,
            "ideasGenerated": ideas_count,
            "status": status,
            "duration": duration
        }

        # Add new entry at the beginning
        log_data["runs"].insert(0, new_entry)

        # Keep only last 20 runs
        log_data["runs"] = log_data["runs"][:20]

        # Update timestamp
        log_data["lastUpdated"] = datetime.now().isoformat()

        # Write back
        PODCAST_AGENT_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(PODCAST_AGENT_LOG, 'w') as f:
            json.dump(log_data, f, indent=2)

        logger.info(f"Updated agent log: {podcast_name}")

    except Exception as e:
        logger.error(f"Failed to update agent log: {e}")


class PodcastIntelligenceAgent:
    """
    Main agent that orchestrates the entire workflow.
    """

    def __init__(
        self,
        dry_run: bool = False,
        headless: bool = True,
        api_key: Optional[str] = None
    ):
        self.dry_run = dry_run
        self.headless = headless
        self.api_key = api_key
        self.summaries: list[PodcastSummary] = []
        self.run_times: dict[str, float] = {}  # Track run times per podcast

    def run(self, podcast_names: Optional[list[str]] = None) -> bool:
        """
        Run the full agent workflow.

        Args:
            podcast_names: List of podcast names to process (default: all configured)

        Returns:
            True if successful, False otherwise
        """
        logger.info("=" * 60)
        logger.info("Podcast Intelligence Agent Starting")
        logger.info("=" * 60)

        # Determine which podcasts to process
        if podcast_names:
            configs = {name: PODCAST_CONFIGS[name] for name in podcast_names if name in PODCAST_CONFIGS}
        else:
            configs = PODCAST_CONFIGS

        if not configs:
            logger.error("No valid podcast configurations found")
            return False

        # Initialize AI summarizer
        try:
            summarizer = AITranscriptSummarizer(api_key=self.api_key)
        except ImportError as e:
            logger.error(f"AI summarizer initialization failed: {e}")
            return False

        # Process each podcast
        import time as time_module
        with PodscribeBrowserAgent(headless=self.headless) as browser:
            for name, config in configs.items():
                logger.info(f"\n--- Processing {name} ---")
                start_time = time_module.time()

                try:
                    # Step 1: Get latest episode info
                    episode = browser.get_latest_episode(config)
                    if not episode:
                        logger.warning(f"Could not get latest episode for {name}")
                        continue

                    logger.info(f"Found episode: {episode.title}")

                    # Step 2: Get episode transcript
                    # First navigate to the episode page
                    episode_url = browser.find_episode_url(config, episode.title)
                    if not episode_url:
                        episode_url = config.url

                    transcript = browser.get_episode_transcript(episode_url)
                    if not transcript:
                        logger.warning(f"Could not extract transcript for {name}")
                        continue

                    # Step 3: Generate AI summaries
                    ideas = summarizer.generate_ideas(
                        transcript=transcript,
                        keywords=config.keywords,
                        episode_title=episode.title,
                        max_ideas=4
                    )

                    if not ideas:
                        logger.warning(f"No ideas generated for {name}")
                        continue

                    logger.info(f"Generated {len(ideas)} ideas")

                    # Create summary object
                    summary = PodcastSummary(
                        name=config.name,
                        color=config.color,
                        emoji=config.emoji,
                        episode=episode.title,
                        episode_num=episode.episode_num or 0,
                        date=episode.date,
                        url=episode_url,
                        ideas=ideas
                    )

                    self.summaries.append(summary)

                    # Calculate duration and log the run
                    elapsed = time_module.time() - start_time
                    duration_str = f"{int(elapsed)}s"
                    self.run_times[name] = elapsed

                    # Update the agent log file
                    if not self.dry_run:
                        update_agent_log(
                            podcast_name=config.name,
                            episode_title=episode.title,
                            episode_num=episode.episode_num or 0,
                            ideas_count=len(ideas),
                            status="success",
                            duration=duration_str
                        )

                except Exception as e:
                    logger.error(f"Error processing {name}: {e}")
                    # Log failed runs too
                    elapsed = time_module.time() - start_time
                    if not self.dry_run:
                        update_agent_log(
                            podcast_name=config.name,
                            episode_title="Error",
                            episode_num=0,
                            ideas_count=0,
                            status="failed",
                            duration=f"{int(elapsed)}s"
                        )
                    continue

        # Step 4: Update Kabuten page
        if self.summaries:
            logger.info(f"\n--- Updating Kabuten page with {len(self.summaries)} podcasts ---")

            updater = KabutenPageUpdater(KABUTEN_PODCASTS_PAGE)

            for summary in self.summaries:
                success = updater.update_podcast(summary, dry_run=self.dry_run)
                if success:
                    logger.info(f"Updated {summary.name}")
                else:
                    logger.error(f"Failed to update {summary.name}")

        logger.info("\n" + "=" * 60)
        logger.info("Agent workflow complete")
        logger.info("=" * 60)

        return len(self.summaries) > 0

    def get_summaries_json(self) -> str:
        """Return summaries as JSON for debugging or API use."""
        return json.dumps(
            [asdict(s) for s in self.summaries],
            indent=2,
            default=str
        )


# =============================================================================
# CLI Entry Point
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Podcast Intelligence Agent - Daily podcast summarizer"
    )

    parser.add_argument(
        "--podcast",
        type=str,
        help="Specific podcast to process (e.g., '20VC', 'All-In')"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without updating files"
    )
    parser.add_argument(
        "--no-headless",
        action="store_true",
        help="Show browser window (for debugging)"
    )
    parser.add_argument(
        "--api-key",
        type=str,
        help="Anthropic API key (or set ANTHROPIC_API_KEY env var)"
    )
    parser.add_argument(
        "--output-json",
        type=str,
        help="Output summaries to JSON file"
    )

    args = parser.parse_args()

    # Determine podcasts to process
    podcasts = [args.podcast] if args.podcast else None

    # Run agent
    agent = PodcastIntelligenceAgent(
        dry_run=args.dry_run,
        headless=not args.no_headless,
        api_key=args.api_key
    )

    success = agent.run(podcast_names=podcasts)

    # Output JSON if requested
    if args.output_json:
        with open(args.output_json, 'w') as f:
            f.write(agent.get_summaries_json())
        logger.info(f"Summaries written to {args.output_json}")

    return 0 if success else 1


if __name__ == "__main__":
    exit(main())
