

# ALP Handbook — Addressing Review Gaps

I've read the full review PDF. You've already handled Gap 6 (www redirect). Here's the plan for the remaining actionable gaps, focused on the core problem: **people think they're buying a physical book or PDF**.

---

## Changes Overview

### 1. Gap 1: Explicitly State the Format on the Sales Page

**Hero section** — Replace the "Instant Access" trust badge with **"Interactive Web Experience"** (with a monitor/globe icon). Add a short format descriptor line near the CTA area:

> *"A premium digital reading experience — read instantly in your browser with dark mode, audio commentary, and chapter navigation."*

**"What You Get" section** — Add a new section after the "Operating System" section, clearly listing what the buyer receives:
- 26 chapters + final commitment chapter
- Interactive web-based reading experience (not a PDF)
- Dark mode / light mode toggle
- Floating chapter navigation
- Audio commentary from Marshall Wilkinson
- Lifetime access from any device with a browser

This section will use a card-style layout with icons to make the format unmistakably clear.

### 2. Gap 2: Surface Audio as a Feature

Include "Audio commentary from Marshall Wilkinson on key chapters" in the new "What You Get" section above, with a headphones/volume icon. Also add a brief mention in the hero area's format descriptor line.

### 3. Gap 3: Testimonials Context

Add a clarifying line below the testimonials section header:

> *"The Handbook is the foundation of everything these operators learned through ALP."*

This bridges the gap between broader ALP program testimonials and this specific $47 product without needing new testimonials.

### 4. Gap 4: Lifetime Access — Clarify on Sales Page

The confirmation page already says "lifetime access." Add "Lifetime Access" as one of the trust badges on the sales page (both hero and final CTA), replacing or supplementing the current "Instant Access" badge. This is a strong selling point.

### 5. Gap 5: Footer with Refund Policy & Privacy Links

Add refund policy and privacy policy links to the footer on the sales page. Create minimal `/refund-policy` and `/privacy-policy` pages with standard digital product terms (no-refund policy for digital goods, basic privacy policy covering Stripe/auth data collection).

### 6. Gap 7: Remove Placeholder Media Labels

Remove the "(to be added)" placeholder labels from Chapters 16 and 17 so paying customers don't see incomplete content markers. Either replace with the actual diagrams if available, or remove the placeholder references entirely.

---

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/pages/SalesPage.tsx` | Add format descriptor, "What You Get" section, testimonial clarifier, update trust badges to include "Lifetime Access" and "Web Experience", update footer with legal links |
| `src/pages/RefundPolicy.tsx` | New — minimal refund policy page |
| `src/pages/PrivacyPolicy.tsx` | New — minimal privacy policy page |
| `src/App.tsx` | Add routes for `/refund-policy` and `/privacy-policy` |
| `src/pages/PreviewExperience.tsx` | Add format clarity near hero (minor) |
| `src/components/handbook/content/Chapter16.tsx` | Remove "(to be added)" placeholder text |
| `src/components/handbook/content/Chapter17.tsx` | Remove "(to be added)" placeholder text |

---

## Priority Order

1. Format clarity on sales page (Gaps 1 + 2 + 4) — highest conversion impact
2. Testimonial clarifier (Gap 3) — quick win
3. Remove placeholders (Gap 7) — product quality
4. Footer legal pages (Gap 5) — compliance

