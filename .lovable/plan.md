## Reorder the Handbook — Insert AOS as Part II

Move the Operating System content from the end of the book into Part II, immediately after Chapter 3 (The ALP Scaling Stool). Renumber all downstream chapters and parts. Keep "Volume 2" wording in the TOC as an update signal — but inline, not as a separate part.

### Why "Volume 2" inside the TOC still works

Nothing wrong with it — it just needs to live in the right place. Instead of being its own Part VII at the end, it becomes a small badge on the Part II header and intro: *"Part II — The Operating System (Volume 2)."* Readers immediately see what's new without the structural awkwardness of jumping back to "Volume 1" material for Identity & Scale.

### New structure

```
Front Matter
  Dedication
  Foreword

Part I — The Frame
  1. The ALP Doctrine — Altitude, Logic, Pressure
  2. All Problems Are Entrepreneurial Problems
  3. The ALP Scaling Stool

Part II — The Operating System  (Volume 2)
  Why the Operating System  (intro)
  4. A Contracting Company Cannot Run on the Owner
  5. Hierarchy Is Not Accountability
  6. The Six Components of a Contracting Operating System
  7. Weekly Execution Is Where the Company Is Won
  8. Systems Are How You Take the Personality Out of the Business
  9. Why AOS Belongs in an Application

Part III — The Stool: Business Systems
  10. Marketing as Infrastructure
  11. Upstream Marketing & Being "In the Know"
  12. Sales, Pressure, and Clarity
  13. Operations as Margin Protection
  14. General Conditions & Invisible Costs
  15. The ALP Decision Matrix
  16. From Chaos to Control

Part IV — Time, Money, & Leverage
  17. Operations Is Logistics — Not Labor
  18. Documentation, Entitlement, and Proof
  19. Notices & Playing Offense
  20. Scheduling as Time Control
  21. Start–Stop Work and Productivity Loss
  22. Financial Command: Seeing the Business Clearly
  23. General Conditions Are Not Overhead — They Are a Profit Center
  24. CPM Schedules, Start–Stop Work, and the Cost of Disorder

Part V — Identity & Scale
  25. Change Order Velocity and Monetizing Disruption
  26. Notices, Documentation, and Playing Offense
  27. Financial Authority at Scale
  28. The Decision Matrix: How Operators Decide Under Pressure
  29. Identity, Pressure, and the Entrepreneur's Responsibility

Part VI — Real-Time Application
  30. Using the ALP Handbook in Real Time
  31. Scaling Without Losing Control
  32. Leadership, Standards, and Cultural Enforcement

Part VII — Commitment
  The ALP Way — Doctrine & Commitment
```

### Chapter renumbering map

| Old | New | Title |
|---|---|---|
| 27 | 4  | A Contracting Company Cannot Run on the Owner |
| 28 | 5  | Hierarchy Is Not Accountability |
| 29 | 6  | The Six Components of a Contracting Operating System |
| 30 | 7  | Weekly Execution Is Where the Company Is Won |
| 31 | 8  | Systems Are How You Take the Personality Out of the Business |
| 32 | 9  | Why AOS Belongs in an Application |
| 4–10  | 10–16 | (old Part II — The Stool, shifted +6) |
| 11–18 | 17–24 | (old Part III — Time, Money, & Leverage, shifted +6) |
| 19–23 | 25–29 | (old Part IV — Identity & Scale, shifted +6) |
| 24–26 | 30–32 | (old Part V — Real-Time Application, shifted +6) |
| Final | Final | (unchanged, now Part VII) |

### Technical section

**Component file IDs stay the same.** Renaming files (e.g. `Chapter4.tsx` → `Chapter10.tsx`) would touch every import and every section anchor ID. Instead:

- Keep file names and component names as-is (`Chapter4`, `Chapter27`, etc.).
- Keep anchor IDs as-is (`#chapter-4`, `#chapter-27`, etc.) so existing magic-link references and any external links don't break.
- Update only the **displayed chapter number** inside each chapter's `ChapterHeader` (the "Chapter 4" → "Chapter 10" label).
- Update the **render order** in `src/pages/Handbook.tsx` to place Volume 2 components after `Chapter3` and before `Chapter4`.
- Update the **TOC files** (`TableOfContents.tsx`, `PreviewTableOfContents.tsx`, `FloatingTOC.tsx`) to reflect new part structure, new chapter numbers, and new ordering. The clickable IDs keep pointing at the existing anchors.
- Update `PartHeader` calls in `Handbook.tsx` to the new Roman numerals (I → VII).
- Add a small "Volume 2" eyebrow/badge to the Part II header and to `Volume2Intro` so the update is visible without making it a separate part.

**Free preview chapters** in `PreviewTableOfContents.tsx`:
- `FREE_CHAPTERS` currently unlocks Ch 2, 3, 11, 15, 19, 23 (by old numbers / IDs). The IDs don't change, so the array stays valid. We should review whether to also unlock one AOS chapter as a preview teaser — recommendation: add `chapter-27` (now Ch 4 — "A Contracting Company Cannot Run on the Owner") as a preview hook for the updated edition.

**Memory updates** after implementation:
- Update `mem://content/handbook-structure` to reflect the new 7-part / 32-chapter layout with AOS as Part II.
- Note in memory: "Anchor IDs preserve original chapter numbers; displayed numbers are the source of truth for readers."

### Out of scope for this plan

- Cover photo swap (waiting on the new asset from you).
- Styling changes (waiting on your direction).
- Volume 2 announcement email to existing members (queued for after styling).
