## Plan: V2 Broadcast Email to Purchasers

Use your exact HTML, verbatim. No design, copy, or CTA changes.

### 1. Store the email template
Create `supabase/functions/_shared/v2-broadcast-email.ts` containing your HTML as a string constant. Subject and preview text stored alongside:
- Subject: `ALP Handbook Version 2 is live.`
- Preview: `The updated handbook includes AOS, reorganized chapters, new material, and expanded operating-system insights.`
- CTA already points to `https://www.alphandbook.com`

### 2. New edge function: `send-v2-broadcast`
- Admin-only (verifies caller email is `wilkinson.marshall@gmail.com` via JWT)
- Queries `book_purchases` for rows where `status = 'completed'`, deduped by email
- Sends the HTML via Resend (already configured, `RESEND_API_KEY` present) from `marshall@alphandbook.com`
- Logs each send to a new `broadcast_logs` table (email, status, error, sent_at, broadcast_id)
- Skips emails already successfully sent for the same `broadcast_id` (idempotent — safe to re-run)
- Supports `?dryRun=true` mode that returns recipient count + list without sending
- Supports `?testEmail=you@x.com` mode that sends only to that address

### 3. New DB table: `broadcast_logs`
Columns: `id`, `broadcast_id` (text, e.g. `v2-launch`), `email`, `status` (sent/failed), `error_message`, `sent_at`. RLS: service role only.

### 4. Admin UI additions (`/admin`)
New "Broadcast" card above Magic Link Logs:
- Shows recipient count (completed purchasers, deduped)
- "Preview in new tab" button — opens HTML rendered preview
- "Send test to me" button — sends one copy to `wilkinson.marshall@gmail.com`
- "Send to all purchasers" button — confirmation dialog showing count, then triggers broadcast
- Below: broadcast send log table (email, status, time)

### Technical notes
- Resend `{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder in your HTML is preserved; Resend auto-substitutes when `headers: { 'List-Unsubscribe': ... }` is set, OR we use Resend's broadcasts feature. Since we're sending individually via the `/emails` endpoint, we'll replace `{{{RESEND_UNSUBSCRIBE_URL}}}` with `https://www.alphandbook.com` as a safe fallback link (you can swap later if you want true unsubscribe handling).
- Sends are sequential with a 100ms delay to stay under Resend's 2 req/sec default limit.
- No design system changes, no frontend changes outside `/admin`.

### What I will NOT do
- Modify your HTML, copy, fonts, colors, or CTA
- Re-render via a templating engine
- Touch the reader experience or sales page

Confirm and I'll build it.