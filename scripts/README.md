# Heatmap Update Automation

Automated daily update of the Semiconductor Buzz heatmap using Claude Code CLI and browser automation.

## Files

- `update-heatmap.sh` - Main script that invokes Claude Code
- `heatmap-update-prompt.md` - Instructions for Claude to follow
- `crontab-entry.txt` - Cron job configuration
- `logs/` - Daily log files (auto-created)

## Setup

### 1. Prerequisites

- Claude Code CLI (`npx @anthropic-ai/claude-code`) installed and authenticated
- Chrome browser with Claude in Chrome extension
- Git configured with push access to the repository
- Node.js/npm installed (for npx)

### 2. Install Cron Job

```bash
# View current crontab
crontab -l

# Edit crontab and add the entry from crontab-entry.txt
crontab -e

# Add this line:
0 8 * * * /Users/olivercox/.claude-worktrees/kabuten-nextjs/sleepy-wu/scripts/update-heatmap.sh
```

### 3. Important Notes

- **Chrome must be running** with the Claude extension active for browser automation
- The script runs at 8:00 AM HKT daily
- Logs are saved to `scripts/logs/heatmap-update-YYYYMMDD.log`
- The script will commit and push changes automatically

## Manual Run

To run the update manually:

```bash
cd /Users/olivercox/.claude-worktrees/kabuten-nextjs/sleepy-wu
./scripts/update-heatmap.sh
```

Or interactively with Claude Code:

```bash
cd /Users/olivercox/.claude-worktrees/kabuten-nextjs/sleepy-wu
npx @anthropic-ai/claude-code
# Then paste the prompt from heatmap-update-prompt.md
```

## Troubleshooting

### Script fails with permission error
```bash
chmod +x scripts/update-heatmap.sh
```

### Browser automation not working
- Ensure Chrome is open
- Ensure Claude in Chrome extension is installed and active
- Check that you're logged into X/Twitter in Chrome

### Git push fails
- Check that you have push access to the repository
- Ensure your Git credentials are configured
