#!/usr/bin/env python3
"""
Podcast Transcript Keyword Summarizer

This script extracts and summarizes content from podcast transcripts
based on specified keywords. It supports multiple transcript sources
including Podscribe URLs and local text files.

Usage:
    python podcast_keyword_summarizer.py --url <podscribe_url> --keywords "AI,Technology,Semiconductor"
    python podcast_keyword_summarizer.py --file <transcript.txt> --keywords "AI,Technology,Semiconductor"
"""

import argparse
import re
import json
from dataclasses import dataclass
from typing import Optional
from collections import defaultdict

# Optional: for web scraping
try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

# Optional: for AI-powered summarization
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


@dataclass
class TranscriptSegment:
    """Represents a segment of transcript with timestamp."""
    timestamp: str
    speaker: Optional[str]
    text: str


@dataclass
class KeywordMatch:
    """Represents a keyword match in the transcript."""
    keyword: str
    context: str
    timestamp: Optional[str]


class PodcastTranscriptExtractor:
    """Extracts transcripts from various podcast sources."""

    def __init__(self):
        self.transcript_text = ""
        self.segments: list[TranscriptSegment] = []

    def extract_from_podscribe(self, url: str) -> str:
        """
        Extract transcript from a Podscribe URL using Playwright.

        Args:
            url: Podscribe episode URL

        Returns:
            Full transcript text
        """
        if not PLAYWRIGHT_AVAILABLE:
            raise ImportError(
                "Playwright is required for web scraping. "
                "Install with: pip install playwright && playwright install"
            )

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            print(f"Loading {url}...")
            page.goto(url, wait_until="networkidle")

            # Wait for transcript content to load
            page.wait_for_timeout(3000)

            # Click on TRANSCRIPT tab if needed
            try:
                transcript_tab = page.locator("text=TRANSCRIPT")
                if transcript_tab.is_visible():
                    transcript_tab.click()
                    page.wait_for_timeout(1000)
            except Exception:
                pass

            # Extract all text content
            self.transcript_text = page.evaluate("document.body.innerText")

            browser.close()

        return self.transcript_text

    def extract_from_file(self, filepath: str) -> str:
        """
        Extract transcript from a local text file.

        Args:
            filepath: Path to transcript file

        Returns:
            Full transcript text
        """
        with open(filepath, 'r', encoding='utf-8') as f:
            self.transcript_text = f.read()
        return self.transcript_text

    def extract_from_text(self, text: str) -> str:
        """
        Use provided text directly as transcript.

        Args:
            text: Raw transcript text

        Returns:
            The same text (stored internally)
        """
        self.transcript_text = text
        return self.transcript_text


class KeywordSearcher:
    """Searches transcript for keywords and extracts relevant context."""

    def __init__(self, transcript: str, context_chars: int = 500):
        self.transcript = transcript
        self.context_chars = context_chars

    def search(self, keywords: list[str], case_sensitive: bool = False) -> dict[str, list[KeywordMatch]]:
        """
        Search for keywords in transcript and return matches with context.

        Args:
            keywords: List of keywords to search for
            case_sensitive: Whether search should be case-sensitive

        Returns:
            Dictionary mapping keywords to their matches
        """
        results = defaultdict(list)

        # Split into sentences for better context extraction
        sentences = re.split(r'(?<=[.!?])\s+', self.transcript)

        for keyword in keywords:
            pattern = keyword if case_sensitive else keyword.lower()

            for i, sentence in enumerate(sentences):
                search_text = sentence if case_sensitive else sentence.lower()

                if pattern in search_text:
                    # Get surrounding sentences for context
                    start_idx = max(0, i - 1)
                    end_idx = min(len(sentences), i + 2)
                    context = ' '.join(sentences[start_idx:end_idx])

                    # Extract timestamp if present
                    timestamp = self._extract_timestamp(context)

                    match = KeywordMatch(
                        keyword=keyword,
                        context=context[:self.context_chars],
                        timestamp=timestamp
                    )
                    results[keyword].append(match)

        return dict(results)

    def _extract_timestamp(self, text: str) -> Optional[str]:
        """Extract timestamp from text if present."""
        timestamp_pattern = r'\d{1,2}:\d{2}:\d{2}'
        match = re.search(timestamp_pattern, text)
        return match.group(0) if match else None

    def get_keyword_sentences(self, keywords: list[str]) -> list[str]:
        """
        Get all sentences containing any of the keywords.

        Args:
            keywords: List of keywords to search for

        Returns:
            List of matching sentences
        """
        sentences = re.split(r'(?<=[.!?])\s+', self.transcript)
        matches = []

        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(kw.lower() in sentence_lower for kw in keywords):
                # Clean up the sentence
                cleaned = re.sub(r'\s+', ' ', sentence).strip()
                if len(cleaned) > 20:  # Filter out very short matches
                    matches.append(cleaned)

        return matches


class TranscriptSummarizer:
    """Summarizes transcript content, optionally using AI."""

    def __init__(self, use_ai: bool = False, api_key: Optional[str] = None):
        self.use_ai = use_ai and ANTHROPIC_AVAILABLE
        self.client = None

        if self.use_ai:
            self.client = anthropic.Anthropic(api_key=api_key)

    def summarize_matches(
        self,
        matches: dict[str, list[KeywordMatch]],
        max_items_per_keyword: int = 10
    ) -> dict[str, list[str]]:
        """
        Summarize keyword matches into key points.

        Args:
            matches: Dictionary of keyword matches
            max_items_per_keyword: Maximum number of points per keyword

        Returns:
            Dictionary of keyword summaries
        """
        summaries = {}

        for keyword, match_list in matches.items():
            if self.use_ai:
                summaries[keyword] = self._ai_summarize(keyword, match_list)
            else:
                summaries[keyword] = self._basic_summarize(
                    match_list,
                    max_items_per_keyword
                )

        return summaries

    def _basic_summarize(
        self,
        matches: list[KeywordMatch],
        max_items: int
    ) -> list[str]:
        """Basic summarization without AI - extracts unique contexts."""
        seen_contexts = set()
        summaries = []

        for match in matches:
            # Create a normalized version for deduplication
            normalized = re.sub(r'\s+', ' ', match.context.lower())[:100]

            if normalized not in seen_contexts:
                seen_contexts.add(normalized)

                # Format the summary point
                timestamp_prefix = f"[{match.timestamp}] " if match.timestamp else ""
                summary = f"{timestamp_prefix}{match.context}"
                summaries.append(summary)

                if len(summaries) >= max_items:
                    break

        return summaries

    def _ai_summarize(
        self,
        keyword: str,
        matches: list[KeywordMatch]
    ) -> list[str]:
        """Use Claude to generate intelligent summaries."""
        if not self.client:
            return self._basic_summarize(matches, 10)

        # Compile all contexts
        contexts = [m.context for m in matches]
        combined_text = "\n\n".join(contexts)

        prompt = f"""Analyze the following transcript excerpts related to "{keyword}" and extract the key ideas and insights. Return a bulleted list of the most important points.

Transcript excerpts:
{combined_text}

Provide 5-10 key points as a JSON array of strings."""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}]
            )

            # Parse the response
            response_text = response.content[0].text

            # Try to extract JSON array
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())

            # Fallback: split by newlines and bullets
            lines = response_text.split('\n')
            return [
                line.strip().lstrip('•-*').strip()
                for line in lines
                if line.strip() and len(line.strip()) > 10
            ]

        except Exception as e:
            print(f"AI summarization failed: {e}")
            return self._basic_summarize(matches, 10)


def format_output(
    keyword_summaries: dict[str, list[str]],
    output_format: str = "text"
) -> str:
    """
    Format the summarized results for output.

    Args:
        keyword_summaries: Dictionary of keyword summaries
        output_format: Output format ('text', 'json', 'markdown')

    Returns:
        Formatted output string
    """
    if output_format == "json":
        return json.dumps(keyword_summaries, indent=2)

    elif output_format == "markdown":
        output = "# Podcast Keyword Summary\n\n"
        for keyword, points in keyword_summaries.items():
            output += f"## {keyword}\n\n"
            for point in points:
                output += f"- {point}\n"
            output += "\n"
        return output

    else:  # text format
        output = "=" * 60 + "\n"
        output += "PODCAST KEYWORD SUMMARY\n"
        output += "=" * 60 + "\n\n"

        for keyword, points in keyword_summaries.items():
            output += f"\n### {keyword.upper()} ###\n"
            output += "-" * 40 + "\n"
            for i, point in enumerate(points, 1):
                output += f"{i}. {point}\n\n"

        return output


def main():
    parser = argparse.ArgumentParser(
        description="Extract and summarize podcast transcripts by keywords"
    )

    # Input source (mutually exclusive)
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument(
        "--url",
        type=str,
        help="Podscribe URL to extract transcript from"
    )
    input_group.add_argument(
        "--file",
        type=str,
        help="Path to local transcript file"
    )
    input_group.add_argument(
        "--text",
        type=str,
        help="Raw transcript text (for piping)"
    )

    # Keywords
    parser.add_argument(
        "--keywords",
        type=str,
        required=True,
        help="Comma-separated list of keywords to search for"
    )

    # Options
    parser.add_argument(
        "--output-format",
        type=str,
        choices=["text", "json", "markdown"],
        default="markdown",
        help="Output format (default: markdown)"
    )
    parser.add_argument(
        "--use-ai",
        action="store_true",
        help="Use Claude AI for intelligent summarization"
    )
    parser.add_argument(
        "--context-chars",
        type=int,
        default=500,
        help="Characters of context around each keyword match"
    )
    parser.add_argument(
        "--output-file",
        type=str,
        help="Output file path (prints to stdout if not specified)"
    )

    args = parser.parse_args()

    # Parse keywords
    keywords = [k.strip() for k in args.keywords.split(",")]
    print(f"Searching for keywords: {keywords}")

    # Extract transcript
    extractor = PodcastTranscriptExtractor()

    if args.url:
        transcript = extractor.extract_from_podscribe(args.url)
    elif args.file:
        transcript = extractor.extract_from_file(args.file)
    else:
        transcript = extractor.extract_from_text(args.text)

    print(f"Transcript length: {len(transcript)} characters")

    # Search for keywords
    searcher = KeywordSearcher(transcript, context_chars=args.context_chars)
    matches = searcher.search(keywords)

    # Print match counts
    for keyword, match_list in matches.items():
        print(f"Found {len(match_list)} matches for '{keyword}'")

    # Summarize
    summarizer = TranscriptSummarizer(use_ai=args.use_ai)
    summaries = summarizer.summarize_matches(matches)

    # Format output
    output = format_output(summaries, args.output_format)

    # Output results
    if args.output_file:
        with open(args.output_file, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"Results written to {args.output_file}")
    else:
        print("\n" + output)


if __name__ == "__main__":
    main()
