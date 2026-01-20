# Podcast Intelligence Agent

Automated system for extracting AI & semiconductor insights from tech podcasts and updating the Kabuten platform.

## Overview

This agent:
1. **Discovers** the latest episodes from configured podcasts (20VC, All-In, etc.)
2. **Extracts** full transcripts using browser automation via Playwright
3. **Analyzes** content for AI/semiconductor keywords
4. **Summarizes** key insights using Claude AI
5. **Updates** the Kabuten podcasts page with structured summaries

## Installation

```bash
# Install dependencies
pip install playwright anthropic

# Install browser binaries
playwright install chromium

# Set API key
export ANTHROPIC_API_KEY="your-api-key"
```

## Usage

### Manual Run

```bash
# Process all configured podcasts
python podcast_agent.py

# Process specific podcast
python podcast_agent.py --podcast "20VC"

# Dry run (no file updates)
python podcast_agent.py --dry-run

# Debug mode (show browser)
python podcast_agent.py --no-headless

# Output to JSON
python podcast_agent.py --output-json summaries.json
```

### Scheduled Run (Daily)

**Option 1: Using the scheduler daemon**
```bash
python podcast_agent_scheduler.py --daemon
```

**Option 2: macOS launchd**
```bash
# Generate plist
python podcast_agent_scheduler.py --generate-launchd > ~/Library/LaunchAgents/com.kabuten.podcast-agent.plist

# Load the agent
launchctl load ~/Library/LaunchAgents/com.kabuten.podcast-agent.plist

# Check status
launchctl list | grep podcast
```

**Option 3: Cron (Linux/macOS)**
```bash
# Generate crontab entry
python podcast_agent_scheduler.py --generate-cron

# Add to crontab
crontab -e
# Paste the generated entry
```

## Configuration

Edit `podcast_agent.py` to configure:

### Podcasts (8 configured)

| Podcast | Source | Series ID |
|---------|--------|-----------|
| 20VC | Podscribe | 1864 |
| All-In Podcast | Podscripts.co | - |
| ChinaTalk | Podscribe | 692695 |
| Dwarkesh Podcast | Podscribe | 2169846 |
| Hard Fork | Podscribe | 1217941 |
| No Priors | Podscribe | 2265113 |
| BG2 Pod | Podscribe | 2349338 |
| The a16z Podcast | Podscribe | 188 |

```python
# Example configuration
PODCAST_CONFIGS = {
    "20VC": PodcastConfig(
        name="20VC",
        series_id="1864",
        color="from-purple-600 to-purple-500",
        emoji="🎙️",
        keywords=["AI", "semiconductor", "GPU", ...]
    ),
    "All-In": PodcastConfig(
        name="All-In Podcast",
        series_id="",
        url="https://podscripts.co/podcasts/all-in-with-chamath-jason-sacks-friedberg",
        source="podscripts",  # Different source
        ...
    ),
}
```

### Keywords
```python
DEFAULT_KEYWORDS = [
    "AI", "semiconductor", "chip", "GPU", "NVIDIA",
    "inference", "training", "model", "compute"
]
```

## Output Format

The agent generates ideas in this structure:

```json
{
  "name": "20VC",
  "episode": "How Model Performance is Plateauing",
  "episodeNum": 158,
  "date": "Jan 19, 2026",
  "ideas": [
    {
      "summary": "AI model plateau for consumer use cases",
      "detail": "Winston Weinberg argues that consumer AI has plateaued...",
      "timestamp": "23:41"
    }
  ]
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Podcast Agent                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Browser    │───▶│  Transcript  │───▶│     AI       │  │
│  │    Agent     │    │  Extractor   │    │  Summarizer  │  │
│  │ (Playwright) │    │              │    │   (Claude)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                       │          │
│         ▼                                       ▼          │
│  ┌──────────────┐                      ┌──────────────┐    │
│  │  Podscribe   │                      │   Kabuten    │    │
│  │    API       │                      │ Page Updater │    │
│  └──────────────┘                      └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Files

- `podcast_agent.py` - Main agent script
- `podcast_agent_scheduler.py` - Scheduling utilities
- `podcast_keyword_summarizer.py` - Standalone summarizer (legacy)

## Troubleshooting

### Browser fails to launch
```bash
# Reinstall Playwright browsers
playwright install --force chromium
```

### API rate limits
The agent uses Claude Sonnet for summarization. If you hit rate limits:
- Reduce `max_ideas` parameter
- Add delays between podcast processing

### Transcript extraction fails
Some podcasts may have different page structures. Check:
- Is the transcript tab visible?
- Is there a login required?
- Has Podscribe changed their UI?

## Development

```bash
# Test with dry run
python podcast_agent.py --dry-run --no-headless

# Check generated output
python podcast_agent.py --output-json test.json
cat test.json
```
