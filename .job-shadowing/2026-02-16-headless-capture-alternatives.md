# Headless Full-Page Blank Capture Alternatives

## Symptom
- Headless `fullPage` screenshot returns large blank bands on animation-heavy pages.

## Ranked alternatives
1. **Headed capture with GPU enabled**
   - Best for WebGL/canvas/scroll-timeline sites.
   - Keep viewport fixed and wait for animation warm-up before capture.
2. **Segmented scroll capture + stitching**
   - Capture multiple viewport images at fixed scroll intervals.
   - Stitch images into one long reference canvas.
   - Most robust fallback when fullPage fails.
3. **Interaction-first capture**
   - Trigger required UI gates (sound toggle, cookie modal close, intro overlay).
   - Capture after state change, not immediately on first paint.
4. **DOM/a11y snapshot as canonical structure source**
   - If visual frame quality is unstable, use DOM snapshot for section hierarchy and copy extraction.
5. **Hybrid capture set**
   - Save both: (a) fullPage attempt, (b) section-level viewport captures.
   - Downstream tokenizer/planner selects highest-fidelity source.

## Operational recommendation
- Default: headless fullPage.
- Auto-fallback trigger: if blank-region ratio or render anomalies exceed threshold, switch to segmented capture.
- For known problematic hosts (e.g., refokus.com), prefer headed/segmented mode immediately.
