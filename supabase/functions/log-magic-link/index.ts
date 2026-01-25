import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[LOG-MAGIC-LINK] ${step}${detailsStr}`);
};

interface LogMagicLinkRequest {
  email: string;
  user_id?: string;
  purchase_id?: string;
  source: string;
  status: 'sent' | 'failed';
  error_message?: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service role key for inserting logs
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const body: LogMagicLinkRequest = await req.json();
    
    if (!body.email) {
      throw new Error("Email is required");
    }

    logStep("Logging magic link", { 
      email: body.email, 
      source: body.source, 
      status: body.status 
    });

    // Look up user_id if not provided
    let userId = body.user_id;
    if (!userId) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const user = users?.users?.find(u => u.email === body.email);
      userId = user?.id;
    }

    // Look up purchase_id if not provided
    let purchaseId = body.purchase_id;
    if (!purchaseId && userId) {
      const { data: purchase } = await supabaseAdmin
        .from('book_purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('purchased_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      purchaseId = purchase?.id;
    }

    const { data, error } = await supabaseAdmin
      .from('magic_link_logs')
      .insert({
        email: body.email,
        user_id: userId || null,
        purchase_id: purchaseId || null,
        source: body.source || 'unknown',
        status: body.status,
        error_message: body.error_message || null,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      logStep("Error inserting log", { error: error.message });
      throw error;
    }

    logStep("Magic link logged successfully", { logId: data.id, email: body.email });

    return new Response(JSON.stringify({ success: true, log: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
