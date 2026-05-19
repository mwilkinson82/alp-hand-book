# Handbook v2 — Structural Tightening

## 1. Replace Author's Note + add "How to Use This Handbook"

- **Foreword.tsx** — Replace the body of the existing Author's Note with the new draft you provided. Keep the audio player and the existing "Author's Note" header. Keep the signature line.
- **New file: `HowToUse.tsx`** — Render the new "How to Use This Handbook" section as front matter. Position it directly **after the Foreword and before Part I**.
- **Dedication** — Untouched, per your instruction.
- **TOC entries** — Add "How to Use This Handbook" under Front Matter in all three TOCs.

## 2. New 6-part structure

```
Front Matter
  Dedication
  Author's Note
  How to Use This Handbook        ← new

Part I — The Frame
  1. The ALP Doctrine — Altitude, Logic, Pressure
  2. All Problems Are Entrepreneurial Problems
  3. The ALP Scaling Stool

Part II — The Operating System (Volume 2)
  Why the Operating System
  4. A Contracting Company Cannot Run on the Owner
  5. Hierarchy Is Not Accountability
  6. The Six Components of a Contracting Operating System
  7. Weekly Execution Is Where the Company Is Won
  8. Systems Remove Personality from the Business
  9. Why AOS Belongs in an Application

Part III — The Business Systems
  10. Marketing as Infrastructure
  11. Upstream Marketing & Being "In the Know"
  12. Sales, Pressure, and Clarity
  13. Operations as Margin Protection
  14. From Chaos to Control

Part IV — Time, Money, and Commercial Control
  15. Documentation, Entitlement, and Proof
  16. Notices & Playing Offense
  17. Scheduling, Start–Stop Work, and the Cost of Disorder
  18. General Conditions: From Invisible Cost to Profit Center
  19. Change Order Velocity and Monetizing Disruption
  20. Financial Command and Financial Authority
  21. The ALP Decision Matrix

Part V — Identity, Leadership, and Scale
  22. Identity, Pressure, and the Entrepreneur's Responsibility
  23. Leadership, Standards, and Cultural Enforcement
  24. Scaling Without Losing Control

Part VI — Real-Time Application & Commitment
  25. Using the ALP Handbook in Real Time
  26. The ALP Way — Doctrine & Commitment
```

## 3. How the duplicates get consolidated

Each merge **keeps both chapter files** (so anchor IDs and existing deep links stay valid) and renders them as a **single escalating chapter** in the reading flow. The second file becomes a clearly-labeled escalation section ("From Tactic to Standard", "At Scale", etc.) under the first chapter's display number — no separate number in the TOC.

| Topic | Files involved (anchors preserved) | Result |
|---|---|---|
| Decision Matrix | `chapter-9` + `chapter-22` | One chapter (#21), Ch 22 becomes an "At Scale" coda |
| Notices / Docs / Offense | `chapter-12`, `chapter-13`, `chapter-20` | Two chapters: Documentation (#15) absorbs old Ch 12 + the docs half of Ch 20; Notices (#16) absorbs Ch 13 + the offense half of Ch 20 |
| General Conditions | `chapter-8` + `chapter-17` | One chapter (#18) with two parts: "Invisible Cost" → "Profit Center" |
| Scheduling / Start-Stop / CPM | `chapter-14`, `chapter-15`, `chapter-18` | One chapter (#17) — scheduling as time control → start-stop loss → CPM and disorder |
| Financial Command / Authority | `chapter-16` + `chapter-21` | One chapter (#20) — seeing the business clearly → authority at scale |

Net chapter count drops from 32 displayed chapters to **26**. AOS (6) + Frame (3) + Business Systems (5) + Time/Money (7) + Identity (3) + Real-Time (2) = 26.

## 4. Technical approach

- **No file renames, no anchor changes.** All existing `chapter-X` IDs stay so any saved links or magic-link bookmarks still resolve.
- For each merged pair/trio:
  - Keep the first file rendering normally with the new display number via `ChapterHeader number={X}`.
  - Strip the `ChapterHeader` from the merged-in files and replace with an in-chapter `<Section title="...">` heading so they read as continuation, not new chapters.
  - Render the merged files back-to-back inside the same `<div id="chapter-X">` wrapper in `Handbook.tsx` — visually one chapter, but both anchor IDs still exist for backlinks.
- Update `TableOfContents.tsx`, `PreviewTableOfContents.tsx`, `FloatingTOC.tsx` to the new 6-part / 26-chapter structure.
- Update `FloatingTOC.tsx` parable mappings to the new display numbers.
- Update `mem://content/handbook-structure` to reflect the 6-part shape + the anchor-vs-display mapping.

## 5. AOS-as-natural-home framing (your last point)

The Volume 2 intro already opens with "the operating system" as a concept. I'll do a light pass on `Volume2Intro.tsx` and Chapter 9 (`Why AOS Belongs in an Application`) to make sure the *application* is positioned as "the natural home for the system you've now been convinced you need" — not as a product pitch. No new content, just tone tightening on the bridge sentences.

## 6. Explicitly out of scope (queued for next turns)

- New cover photo
- Styling changes
- Volume 2 announcement email to existing members

Once you approve, I'll execute in one pass: Foreword replacement → HowToUse → consolidation edits → TOC updates → Handbook.tsx render order → memory update.