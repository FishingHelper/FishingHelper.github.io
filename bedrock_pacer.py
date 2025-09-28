# bedrock_pacer.py
# Simple safe script to open Bedrock Learning in your browser on a schedule.
# It does NOT fill in answers or scrape content. Use this to remind/pace yourself.

import webbrowser
import time
import datetime
import sys

# CONFIG
BEDROCK_URL = "https://www.bedrocklearning.org/"   # change if needed
SESSIONS_PER_DAY = 2        # how many times to open site per day
SESSION_INTERVAL_MIN = 30   # if you want repeated opens in one run (minutes)
INITIAL_DELAY_SEC = 5       # seconds before the first open (gives you time to alt-tab)

# Simple usage modes:
# 1) single run with repeated opens: runs SESSIONS_PER_DAY times waiting SESSION_INTERVAL_MIN minutes between.
# 2) daily loop mode: runs forever once each day at the times you choose (basic example below).

def open_with_message(url):
    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Opening {url}")
    webbrowser.open(url, new=2)  # new=2 -> open in a new tab, if possible

def paced_run():
    print("Starting paced run. Press Ctrl+C to stop.")
    time.sleep(INITIAL_DELAY_SEC)
    for i in range(SESSIONS_PER_DAY):
        open_with_message(BEDROCK_URL)
        if i < SESSIONS_PER_DAY - 1:
            print(f"Waiting {SESSION_INTERVAL_MIN} minutes until next session...")
            time.sleep(SESSION_INTERVAL_MIN * 60)
    print("Paced run finished.")

def daily_loop(target_hours):
    """
    target_hours: list of hours (24h ints) at which to open the site daily, e.g. [16, 19] -> 4pm and 7pm
    """
    print("Starting daily loop. Press Ctrl+C to stop.")
    while True:
        now = datetime.datetime.now()
        for h in target_hours:
            target_dt = now.replace(hour=h, minute=0, second=0, microsecond=0)
            if target_dt < now:
                target_dt += datetime.timedelta(days=1)
            wait_seconds = (target_dt - now).total_seconds()
            print(f"Next auto-open scheduled at {target_dt.strftime('%Y-%m-%d %H:%M:%S')} (in {int(wait_seconds//60)} min).")
            time.sleep(wait_seconds)
            open_with_message(BEDROCK_URL)
        # small sleep to avoid tight loop in case target_hours empty
        time.sleep(60)

if __name__ == "__main__":
    # Simple CLI: run python bedrock_pacer.py paced  OR  python bedrock_pacer.py daily 16 19
    if len(sys.argv) >= 2 and sys.argv[1] == "daily":
        if len(sys.argv) < 3:
            print("Usage: python bedrock_pacer.py daily <hour1> <hour2> ... (24-hour hours)")
            sys.exit(1)
        hours = [int(x) for x in sys.argv[2:]]
        daily_loop(hours)
    else:
        # paced run (default)
        paced_run()
