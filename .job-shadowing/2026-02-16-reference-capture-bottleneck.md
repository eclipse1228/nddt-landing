# Reference Capture Bottleneck - 2026-02-16

## What got blocked
- `https://www.refokus.com/` uses heavy dynamic rendering and animation layers.
- Full-page capture in headless mode produced large blank areas in the screenshot.

## Why this matters
- Step 2 requires reliable full-page reference capture for layout/theme extraction.
- Blank captures reduce the quality of downstream token extraction and section planning.

## Manual preconditions that improve automation
1. Prefer headed browser capture when site relies on GPU/canvas animations.
2. Allow a warm-up delay after load and scroll through all major sections.
3. If the site gates effects behind a user action (e.g., sound toggle), trigger it before final capture.

## What was done now
- Saved baseline captures and snapshots in `capture-images/references-1/`.
- Recorded this bottleneck for future automation hardening.
