import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import {
  V2_BROADCAST_HTML,
  V2_BROADCAST_SUBJECT,
  V2_BROADCAST_PREVIEW,
} from "./email-template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "wilkinson.marshall@gmail.com";
const BROADCAST_ID = "v2-launch";
const FROM_ADDRESS = "ALP Handbook <marshall@alphandbook.com>";

async function sendEmail(to: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return { ok: false, error: "RESEND_API_KEY not configured" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject: V2_BROADCAST_SUBJECT,
      html,
      headers: {
        "List-Unsubscribe": "<mailto:marshall@alphandbook.com?subject=unsubscribe>",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${body}` };
  }
  return { ok: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user || user.email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const mode: string = body.mode || "preview"; // preview | test | send
    const testEmail: string | undefined = body.testEmail;

    // Resolve unsubscribe placeholder (no managed unsubscribe per-recipient yet)
    const html = V2_BROADCAST_HTML.replace(
      /\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}/g,
      "mailto:marshall@alphandbook.com?subject=unsubscribe"
    );

    // Build recipient list (completed purchasers, deduped by email)
    const { data: purchases, error: pErr } = await supabaseAdmin
      .from("book_purchases")
      .select("user_id, status")
      .eq("status", "completed");
    if (pErr) throw pErr;

    const userIds = Array.from(new Set((purchases || []).map((p) => p.user_id)));
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const emailById = new Map(usersList?.users?.map((u) => [u.id, u.email]) || []);
    const recipients = Array.from(
      new Set(
        userIds
          .map((id) => emailById.get(id))
          .filter((e): e is string => !!e && e.includes("@"))
          .map((e) => e.toLowerCase())
      )
    );

    if (mode === "preview") {
      return new Response(
        JSON.stringify({
          subject: V2_BROADCAST_SUBJECT,
          preview: V2_BROADCAST_PREVIEW,
          recipientCount: recipients.length,
          recipients,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    if (mode === "test") {
      const target = (testEmail || ADMIN_EMAIL).trim();
      const result = await sendEmail(target, html);
      await supabaseAdmin.from("broadcast_logs").insert({
        broadcast_id: `${BROADCAST_ID}-test`,
        email: target,
        status: result.ok ? "sent" : "failed",
        error_message: result.error ?? null,
      });
      return new Response(JSON.stringify({ test: true, target, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.ok ? 200 : 500,
      });
    }

    if (mode === "send") {
      // Idempotency: skip emails already successfully sent for this broadcast
      const { data: already } = await supabaseAdmin
        .from("broadcast_logs")
        .select("email")
        .eq("broadcast_id", BROADCAST_ID)
        .eq("status", "sent");
      const alreadySent = new Set((already || []).map((r) => r.email.toLowerCase()));
      const toSend = recipients.filter((e) => !alreadySent.has(e));

      let sent = 0;
      let failed = 0;
      for (const email of toSend) {
        const result = await sendEmail(email, html);
        if (result.ok) sent++;
        else failed++;
        await supabaseAdmin.from("broadcast_logs").insert({
          broadcast_id: BROADCAST_ID,
          email,
          status: result.ok ? "sent" : "failed",
          error_message: result.error ?? null,
        });
        // ~2 req/sec ceiling
        await new Promise((r) => setTimeout(r, 550));
      }

      return new Response(
        JSON.stringify({
          broadcast_id: BROADCAST_ID,
          totalRecipients: recipients.length,
          skipped: recipients.length - toSend.length,
          attempted: toSend.length,
          sent,
          failed,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid mode" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("send-v2-broadcast error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
