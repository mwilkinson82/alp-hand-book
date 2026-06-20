## Goal

Send a one-time editorial-style announcement email to all 75 completed ALP handbook purchasers letting them know their purchase now also grants them access to AOS at `https://alpos.alpcontractorcircle.com/signup`.

## Approach

Clone the existing v2-broadcast pattern (proven, idempotent, logs to `broadcast_logs`). Same admin gating, preview/test/send modes, Resend sender `marshall@alphandbook.com`, ~2 req/sec throttle.

## Files

1. **New: `supabase/functions/send-aos-access-broadcast/email-template.ts`**
   - Editorial DDB/Ogilvy layout matching v2 template: eyebrow ("A NOTE FROM MARSHALL" or "BONUS ACCESS"), Fraunces-style serif headline, hairline rule, short body paragraphs, single black pill CTA → `https://alpos.alpcontractorcircle.com/signup`.
   - Frame: handbook gave them the doctrine; AOS is the operating system that runs it day-to-day. Their handbook purchase now includes AOS access — sign up with the same email used at checkout.
   - Subject: "Your ALP Handbook now includes AOS access" (final copy in implementation).
   - Cream `#faf7f0` outer, white card, brand orange `hsl(24 95% 53%)` rationed to one element.
   - `{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder + List-Unsubscribe header.

2. **New: `supabase/functions/send-aos-access-broadcast/index.ts`**
   - Copy of `send-v2-broadcast/index.ts` with:
     - `BROADCAST_ID = "aos-access-launch"` (separate idempotency key from v2 so all 75 are eligible)
     - Imports from local `email-template.ts`
     - Same admin gate (`wilkinson.marshall@gmail.com`), same modes: `preview` | `html` | `test` | `send`
     - Same recipient resolution: `book_purchases` where `status='completed'` → dedupe → emails via `auth.admin.listUsers`
     - Same `broadcast_logs` writes and 550ms throttle

3. **No DB migration** — reuses existing `broadcast_logs` table.

4. **No Admin UI changes required** — drive it the same way you ran v2: I'll invoke `preview` → `test` (to you) → wait for your go-ahead → `send`.

## Execution sequence (after build)

1. Deploy `send-aos-access-broadcast`.
2. `preview` → confirm recipient count = 75 and recipient list looks right.
3. `test` → sends to `wilkinson.marshall@gmail.com`; you review in inbox on desktop + mobile.
4. On your approval, `send` → blasts to all 75 with idempotent logging.

## Technical notes

- AOS signup URL is hardcoded into the template; no env var needed.
- Idempotency key isolated per broadcast, so resending v2 in the future is unaffected.
- No suppression-list logic beyond what `broadcast_logs` already provides; matches existing pattern.
- No changes to magic-link / purchase / auth flows.

## Out of scope

- Auto-provisioning AOS accounts (user signs up on the AOS side with their handbook email).
- Sending AOS access info to *future* purchasers — if you want that, follow-up task: add a line + CTA to the existing welcome email in `send-welcome-email`.
