
# DDB/Ogilvy Editorial System — Site-Wide Restyle

The cover and the AOS portal are doing the same thing: **a print ad pretending to be tech.** Massive serif type, microscopic tracked sans labels, hairline rules, one orange accent, oceans of cream, black pill CTAs. Right now the handbook is using Cormorant Garamond (too soft, too literary) and Space Grotesk body — that reads "literary blog," not "DDB 1962." We need to harden it.

## 1. Typography swap — the foundation

- **Display serif**: Cormorant Garamond → **Fraunces** (high opsz, semibold/black). This is the face on the cover ("THE ALP HANDBOOK") and on the portal ("Welcome aboard.", "Boring wins."). Warm transitional, high contrast, slight quirk — reads as both editorial and human. Pulled via Google Fonts.
- **Body / micro-labels**: keep **Space Grotesk** for body and for the tiny tracked uppercase eyebrows. It's the right neutral against Fraunces.
- **Italic tagline serif**: Fraunces italic, used for one-line emotional pulls ("Build the company behind the projects.")
- Update `index.css` `h1–h6`, `.handbook-title`, `.chapter-heading`, `.section-heading`, `.subsection-heading`, `.blockquote-doctrine` to Fraunces. Tighten tracking (`-0.02em` on display sizes). Push weight up where needed.

## 2. The DDB component vocabulary

Six reusable patterns that appear on the cover and need to appear everywhere:

1. **Eyebrow + hairline** — short horizontal rule above a tiny tracked uppercase label (e.g. `——  AOS EDITION`). Rule is 24–40px, hairline, foreground at ~40% opacity. New component: `<Eyebrow rule label accent?>`.
2. **One-orange rule** — orange (`--brand-accent`) used on a single eyebrow per screen, never twice. Acts like the cover's "AOS EDITION" pop.
3. **Display lockup** — Fraunces headline, hairline rule beneath, italic tagline below. New component: `<DisplayLockup eyebrow title tagline />`.
4. **Editorial column body** — for marketing copy (sales page sections, portal-style descriptions), 2–3 column justified body text with `text-justify` + `hyphens-auto`, set at ~16–17px in Space Grotesk. This is the portal "Boring wins." block — needs to become the sales-page voice too.
5. **Black pill CTA** — long radius, generous tracking on label, full-bleed black. Replace current primary buttons on `/` and `/preview`.
6. **Card with soft shadow** — cream card, 16–20px radius, very soft 0/24/60 black/8% shadow, optional tracked uppercase footer band ("MEMBERS ONLY"). For the purchase block and preview gates.

All six become real components under `src/components/editorial/` so the handbook and homepage share them.

## 3. Where it lands

**Handbook (`/read`)**
- `HeroSection.tsx` — wrap the cover image inside a `DisplayLockup` echoing the cover's eyebrow / title / tagline / orange "AOS EDITION" line.
- `ChapterHeader.tsx` — chapter number becomes an eyebrow-with-rule; chapter title in Fraunces black. Tighter, more "page from a coffee-table book."
- `PartHeader.tsx` — Part numeral lockup with hairline rules above and below the title; "Volume 2 — New" pill stays but restyled to match the orange eyebrow treatment.
- `TableOfContents.tsx` — strip the box hover; switch to a true editorial index: tracked uppercase Part labels, Fraunces chapter titles, generous leading, hairline row separators only.
- `Foreword`, `HowToUse`, `Dedication` — replace generic headers with `DisplayLockup`.
- `Volume2Intro.tsx` — same `DisplayLockup` pattern, with the orange eyebrow taking the "Volume 2" slot (matches cover hierarchy).

**Homepage / sales (`/`, `/preview`)**
- `SalesPage.tsx` — Hero becomes a portal-grade split: cover image left, `DisplayLockup` + editorial-column body + black pill CTA right. Mirror exactly the portal "Boring wins." composition the user shared.
- Section heads on the sales page move to Fraunces with eyebrows.
- Existing testimonial / promise blocks become DDB cards (cream, soft shadow, "MEMBERS ONLY"-style tracked footer where appropriate).
- `StickyPurchaseButton`, `StickyPreviewButton` — repaint to the black pill CTA spec.
- `PreviewExperience.tsx` — same treatment on the locked preview chrome.

**Auth / Purchase flows**
- `/auth` and `/purchase-success` get the soft-shadow card + Fraunces head, matching the portal exactly (the user explicitly named this aesthetic).

## 4. Color discipline

- Cream background stays (`40 30% 96%`) — already correct.
- Foreground stays near-black (`30 10% 12%`).
- **Orange (`24 95% 53%`) is now a rationed accent.** Rule: at most one orange element visible per screen. Used for the one eyebrow that carries the page's identity ("AOS EDITION," "VOLUME 2," "MEMBERS ONLY" when it's the page's anchor). Never on body, never on two things at once.
- Retire the gradient hero tokens (`--hero-gradient-start/mid`) — DDB doesn't gradient.

## 5. Technical scope

New files:
- `src/components/editorial/Eyebrow.tsx`
- `src/components/editorial/DisplayLockup.tsx`
- `src/components/editorial/EditorialColumns.tsx`
- `src/components/editorial/PillButton.tsx` (or a `variant="pill"` on shadcn `Button`)
- `src/components/editorial/EditorialCard.tsx`

Edited:
- `src/index.css` — swap font import (drop Cormorant, add Fraunces), rewrite all `.handbook-*` / `.chapter-heading` / `.section-heading` / `.toc-*` / `.parable-*` classes to Fraunces + new tracking.
- `tailwind.config.ts` — register `font-display: ['Fraunces', 'serif']`, keep `font-sans: ['Space Grotesk']`.
- `HeroSection.tsx`, `ChapterHeader.tsx`, `PartHeader.tsx`, `TableOfContents.tsx`, `PreviewTableOfContents.tsx`, `FloatingTOC.tsx`, `Volume2Intro.tsx`, `Foreword.tsx`, `HowToUse.tsx`, `Dedication.tsx`.
- `SalesPage.tsx`, `PreviewExperience.tsx`, `StickyPurchaseButton.tsx`, `StickyPreviewButton.tsx`, `PreviewHeader.tsx`, `ReadingHeader.tsx`.
- `Auth.tsx`, `PurchaseSuccess.tsx` — restyle their cards.

No content changes. No backend changes. No chapter renumbering. No routing changes.

## 6. What's explicitly NOT in this pass

- New illustration or photography (the cover photo is enough for now).
- Chapter body copy edits.
- Dark mode tuning (will follow once the light-mode editorial pass settles).
- Email templates (separate pass).

## 7. Execution order

1. Fonts + tokens (`index.css`, `tailwind.config.ts`).
2. Build the five `editorial/` primitives.
3. Repaint handbook chrome (Hero, Part, Chapter, TOCs, Foreword group).
4. Repaint sales/preview/auth chrome.
5. Visual QA pass: screenshot `/`, `/preview`, `/read` top-of-book, mid-book chapter, `/auth` — check against the cover + portal screenshot for tone match.

Once you approve, I'll execute in one pass.
