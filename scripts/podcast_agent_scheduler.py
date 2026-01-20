#!/usr/bin/env python3
"""
Podcast Agent Scheduler

Runs the podcast intelligence agent on a schedule.
Can be run as a daemon or triggered by cron/launchd.

Usage:
    # Run once (for cron)
    python podcast_agent_scheduler.py --once

    # Run as daemon (checks every hour, runs at 10:00 JST)
    python podcast_agent_scheduler.py --daemon

    # Generate launchd plist for macOS
    python podcast_agent_scheduler.py --generate-launchd

    # Generate crontab entry
    python podcast_agent_scheduler.py --generate-cron
"""

import os
import sys
import time
import argparse
import logging
from datetime import datetime, timedelta
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
SCRIPT_DIR = Path(__file__).parent
AGENT_SCRIPT = SCRIPT_DIR / "podcast_agent.py"
LOG_FILE = SCRIPT_DIR / "podcast_agent.log"
RUN_HOUR = 6  # 6:00 AM JST (= 5:00 AM HKT)
PODCASTS_TO_TRACK = [
    "20VC",
    "All-In",
    "ChinaTalk",
    "Dwarkesh",
    "Hard Fork",
    "No Priors",
    "BG2",
    "a16z"
]


def run_agent(podcasts: list[str] = None) -> bool:
    """Run the podcast agent."""
    import subprocess

    cmd = [sys.executable, str(AGENT_SCRIPT)]

    if podcasts:
        for podcast in podcasts:
            cmd.extend(["--podcast", podcast])

    logger.info(f"Running: {' '.join(cmd)}")

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600  # 10 minute timeout
        )

        if result.returncode == 0:
            logger.info("Agent completed successfully")
            logger.info(result.stdout)
            return True
        else:
            logger.error(f"Agent failed with code {result.returncode}")
            logger.error(result.stderr)
            return False

    except subprocess.TimeoutExpired:
        logger.error("Agent timed out after 10 minutes")
        return False
    except Exception as e:
        logger.error(f"Failed to run agent: {e}")
        return False


def should_run_today(last_run_file: Path) -> bool:
    """Check if we should run today (haven't run yet)."""
    if not last_run_file.exists():
        return True

    try:
        last_run = datetime.fromisoformat(last_run_file.read_text().strip())
        return last_run.date() < datetime.now().date()
    except (ValueError, IOError):
        return True


def mark_run_complete(last_run_file: Path):
    """Mark that we've completed a run today."""
    last_run_file.write_text(datetime.now().isoformat())


def daemon_loop():
    """Run as a daemon, checking every hour."""
    last_run_file = SCRIPT_DIR / ".last_podcast_run"

    logger.info("Starting podcast agent daemon")
    logger.info(f"Will run daily at {RUN_HOUR}:00")

    while True:
        now = datetime.now()

        # Check if it's time to run (within the run hour and haven't run today)
        if now.hour == RUN_HOUR and should_run_today(last_run_file):
            logger.info("Starting scheduled run")

            success = run_agent(PODCASTS_TO_TRACK)

            if success:
                mark_run_complete(last_run_file)
                logger.info("Run complete, waiting for next day")
            else:
                logger.warning("Run failed, will retry in 1 hour")

        # Sleep for 1 hour
        time.sleep(3600)


def generate_launchd_plist() -> str:
    """Generate macOS launchd plist for scheduling."""
    plist = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.kabuten.podcast-agent</string>

    <key>ProgramArguments</key>
    <array>
        <string>{sys.executable}</string>
        <string>{AGENT_SCRIPT}</string>
        <string>--podcast</string>
        <string>20VC</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>{RUN_HOUR}</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>{LOG_FILE}</string>

    <key>StandardErrorPath</key>
    <string>{LOG_FILE}</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>ANTHROPIC_API_KEY</key>
        <string>${{ANTHROPIC_API_KEY}}</string>
    </dict>

    <key>RunAtLoad</key>
    <false/>
</dict>
</plist>
"""
    return plist


def generate_crontab() -> str:
    """Generate crontab entry for scheduling."""
    return f"""# Podcast Intelligence Agent - runs daily at {RUN_HOUR}:00
# Add to crontab with: crontab -e
0 {RUN_HOUR} * * * cd {SCRIPT_DIR} && {sys.executable} {AGENT_SCRIPT} --podcast 20VC >> {LOG_FILE} 2>&1
"""


def main():
    parser = argparse.ArgumentParser(description="Podcast Agent Scheduler")

    mode_group = parser.add_mutually_exclusive_group(required=True)
    mode_group.add_argument(
        "--once",
        action="store_true",
        help="Run agent once and exit"
    )
    mode_group.add_argument(
        "--daemon",
        action="store_true",
        help="Run as daemon process"
    )
    mode_group.add_argument(
        "--generate-launchd",
        action="store_true",
        help="Generate macOS launchd plist"
    )
    mode_group.add_argument(
        "--generate-cron",
        action="store_true",
        help="Generate crontab entry"
    )

    args = parser.parse_args()

    if args.once:
        success = run_agent(PODCASTS_TO_TRACK)
        return 0 if success else 1

    elif args.daemon:
        daemon_loop()

    elif args.generate_launchd:
        plist = generate_launchd_plist()
        plist_path = Path.home() / "Library" / "LaunchAgents" / "com.kabuten.podcast-agent.plist"
        print(f"# Save this to: {plist_path}")
        print(f"# Then run: launchctl load {plist_path}")
        print()
        print(plist)

    elif args.generate_cron:
        print(generate_crontab())

    return 0


if __name__ == "__main__":
    exit(main())
