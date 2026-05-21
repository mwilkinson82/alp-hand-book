## The Bug

In the preview page, the Table of Contents marks 8 chapters as unlocked (clickable "Preview" pills), but the page below only actually renders 6 of them. Tapping the two that aren't on the page does nothing — that's what you're seeing on mobile.

**TOC says unlocked:** Dedication, Foreword, How to Use, Ch 2, Ch 3, Ch 27 (Owner), Ch 19 (Change Orders), Ch 23 (Identity)

**Actually rendered on page:** Dedication, Foreword, Ch 2, Ch 3, Ch 11, Ch 15, Ch 19, Ch 23

**Mismatches:**
- "How to Use This Handbook" → unlocked in TOC, not on page (tap = nothing)
- "A Contracting Company Cannot Run on the Owner" (ch-27) → unlocked in TOC, not on page (tap = nothing)
- Ch 11 and Ch 15 are on the page but locked in the TOC (so you can't jump to them)

## The Fix

Align the two lists. Two clean options:

**Option A (recommended):** Make the page match the TOC's intent. Add `HowToUse` and `Chapter27` to the rendered preview, and remove `Chapter11` and `Chapter15`. This keeps the Volume 2 teaser (Ch 27) in the free preview — which matches the broadcast email's pitch.

**Option B:** Make the TOC match what's currently rendered. Swap `how-to-use` and `chapter-27` out of `FREE_CHAPTERS`, and add `chapter-11` and `chapter-15` in. Faster, but you lose the Volume 2 teaser in the free read.

## Files touched

- `src/pages/PreviewExperience.tsx` — adjust which chapter components render
- `src/components/handbook/PreviewTableOfContents.tsx` — adjust `FREE_CHAPTERS` array (Option B only)
- `src/components/handbook/PreviewFloatingTOC.tsx` — verify the floating TOC's unlocked list matches (will check during implementation)

Which option do you want — A (add the missing chapters to the page) or B (lock them in the TOC instead)?