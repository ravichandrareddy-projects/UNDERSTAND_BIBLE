# Reading pace and temporary focus

Research only · 2026-11-23 · Proposed for Antigravity and the project owner

A reader may pause to reflect, listen to a screen reader, compare editions or hand the device to someone else. The browser can observe exposure and navigation. A pace estimate describes movement through the reader and cannot establish attention, comprehension or religious engagement. D-001 and future analytics decisions have no bearing on the local estimate.

## A local estimation method

1. Observe the active reading pane and verse element intersections. Keep the edition-specific ordered row IDs, intersection ratios and time in a central reading band. An intersection callback is a threshold crossing. Use a monotonic clock to measure the interval until the next eligible event. [Intersection Observer specification](https://www.w3.org/TR/intersection-observer/)
2. Measure scroll displacement in viewport heights per second. It is comparable across zoom levels more readily than pixels, but is still affected by font size and layout. Use it to detect a fling or jump. Exclude resize, font reflow, initial restore, chapter-picker navigation and programmatic scrolling. Track the user-controlled pane once during linked parallel reading. [CSSOM View specification](https://www.w3.org/TR/cssom-view-1/)
3. Accumulate dwell only while the document is visible, the reader pane is active and no modal obscures it. End the interval on a visibility change, route change or unmount. Cap long idle gaps. A stable viewport without a later forward transition gives insufficient evidence for a pace update. [HTML document visibility](https://html.spec.whatwg.org/multipage/interaction.html#page-visibility)
4. Count newly traversed source rows only after stable, forward progression. Track reverse movement as rereading. A bridge is one displayed unit. Avoid subtracting printed verse numbers or comparing units across editions. Keep note expansions and parallel views out of the denominator.
5. For eligible intervals, estimate rows per minute as `60 × forward rows / visible active seconds`. Four new rows across 48 eligible seconds give 5 rows/min. One fast jump across forty rows gives no sample. Smooth a small session window with a median and suppress the estimate when samples are sparse or disagree. Candidate dwell thresholds, idle caps and minimum sample counts require usability testing by script, device and assistive technology.

## State and user control

| State                                                 | Lifetime                                                                      | Who changes it                                                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Focus preference, intensity and reduced-motion choice | Device preference, optional account sync under existing consent               | Reader through settings                                                                               |
| Temporary emphasis and recent timing samples          | Memory for the current reading session                                        | Local estimate or explicit keyboard/pointer navigation. Clear on disable, route change or hidden tab. |
| Saved highlights                                      | Personal annotations keyed to a validated passage mapping and edition context | Reader through an explicit save/edit/delete action                                                    |

Keep focus styling distinct from saved highlights. Never write a highlight, mark a plan complete, move keyboard focus, advance the page or announce every estimated transition from these observations. Offer manual focus and a visible off switch. Avoid animation when reduced motion is requested. [W3C guidance on interaction-triggered animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)

## Evaluation and privacy

Test slow continuous reading, long reflection, quick scanning, backtracking, mixed RTL/LTR panes, voice or keyboard navigation, browser zoom, mobile resize and leaving the tab open. Evaluate false movements and whether users can regain control. Compare against voluntary self-reports in a consented usability session. Use synthetic event traces for engineering tests. Under PR-04/06, keep fine-grained timestamps, references and movement histories on device and ephemeral. This proposal adds no API, telemetry, persistent behaviour profile or model.
