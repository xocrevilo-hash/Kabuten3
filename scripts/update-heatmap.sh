#!/bin/bash
# Heatmap Update Script
# Runs daily at 8am HKT via cron to update semiconductor keyword rankings
# Uses Claude Code CLI with browser automation to scrape X/Twitter

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$SCRIPT_DIR/logs/heatmap-update-$(date +%Y%m%d).log"
PROMPT_FILE="$SCRIPT_DIR/heatmap-update-prompt.md"

# Ensure log directory exists
mkdir -p "$SCRIPT_DIR/logs"

# Log start time
echo "=== Heatmap Update Started: $(date) ===" >> "$LOG_FILE"

# Change to project directory
cd "$PROJECT_DIR"

# Run Claude Code with the update prompt
# The --print flag outputs the result without interactive mode
# The --dangerously-skip-permissions flag allows automated execution
npx @anthropic-ai/claude-code --print --dangerously-skip-permissions < "$PROMPT_FILE" >> "$LOG_FILE" 2>&1

# Log completion
echo "=== Heatmap Update Completed: $(date) ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
