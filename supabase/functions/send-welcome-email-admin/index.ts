import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-WELCOME-EMAIL-ADMIN] ${step}${detailsStr}`);
};

const normalizeEmail = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const findUserByEmail = async (supabaseAdmin: ReturnType<typeof createClient>, email: string) => {
  const perPage = 1000;
  let page = 1;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`Failed to verify account: ${error.message}`);

    const match = data?.users?.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;

    if (!data?.users || data.users.length < perPage) return null;
    page += 1;
  }
};

const genericSuccessResponse = (email: string) =>
  new Response(JSON.stringify({ success: true, email }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const resend = new Resend(resendApiKey);

    const { email } = await req.json();
    const normalizedEmail = normalizeEmail(email);
    
    if (!normalizedEmail) {
      throw new Error("Email is required");
    }

    const user = await findUserByEmail(supabaseAdmin, normalizedEmail);
    if (!user) {
      logStep("No account found for requested magic link", { email: normalizedEmail });
      return genericSuccessResponse(normalizedEmail);
    }

    const { data: purchases, error: purchaseError } = await supabaseAdmin
      .from('book_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    if (purchaseError) {
      throw new Error(`Failed to verify purchase: ${purchaseError.message}`);
    }

    const purchase = purchases?.[0];
    if (!purchase) {
      logStep("No completed purchase found for requested magic link", { email: normalizedEmail, userId: user.id });
      return genericSuccessResponse(normalizedEmail);
    }

    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
    const { data: recentSends } = await supabaseAdmin
      .from('magic_link_logs')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('status', 'sent')
      .gte('sent_at', oneMinuteAgo)
      .limit(1);

    if (recentSends && recentSends.length > 0) {
      logStep("Skipping duplicate magic link request inside cooldown", { email: normalizedEmail });
      return genericSuccessResponse(normalizedEmail);
    }

    logStep("Generating magic link for", { email: normalizedEmail, userId: user.id, purchaseId: purchase.id });

    // Generate magic link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
      options: {
        redirectTo: 'https://alphandbook.com/read',
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      throw new Error(`Failed to generate magic link: ${linkError?.message || 'No link generated'}`);
    }

    const magicLinkUrl = linkData.properties.action_link;
    logStep("Magic link generated");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The ALP Handbook</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">
                Welcome to The ALP Handbook
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 30px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Hi there,
              </p>
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for purchasing <strong>The ALP Handbook</strong>! Your lifetime access is now active.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 10px 0 30px 0;">
                    <a href="${magicLinkUrl}" style="display: inline-block; padding: 16px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; letter-spacing: 0.5px;">
                      Access The Handbook Now
                    </a>
                  </td>
                </tr>
              </table>
              <div style="padding: 20px; background-color: #f9f9f9; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                  <strong>Didn't receive this email or need a new sign-in link?</strong>
                </p>
                <p style="margin: 0; font-size: 14px; color: #666666;">
                  No problem — request one anytime at:<br>
                  <a href="https://alphandbook.com/auth" style="color: #1a1a1a; text-decoration: underline;">https://alphandbook.com/auth</a>
                </p>
              </div>
              <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                Questions? Just reply to this email or contact me directly at 
                <a href="mailto:marshall@marshallwilkinson.com" style="color: #1a1a1a; text-decoration: underline;">marshall@marshallwilkinson.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #333333;">
                Welcome aboard,
              </p>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">
                Marshall Wilkinson
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" style="max-width: 560px; margin: 20px auto 0 auto;">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #999999;">
                This link will expire in 1 hour for security purposes.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Marshall Wilkinson <marshall@alphandbook.com>",
      replyTo: "marshall@marshallwilkinson.com",
      to: [email],
      subject: "Welcome to The ALP Handbook - Your Access is Ready",
      html: htmlContent,
    });

    if (error) {
      logStep("Resend error", { error: error.message });
      
      // Log failure
      await supabaseAdmin.from('magic_link_logs').insert({
        email: normalizedEmail,
        user_id: user.id,
        purchase_id: purchase.id,
        source: 'admin_welcome_email',
        status: 'failed',
        error_message: error.message,
        metadata: { admin_triggered: true },
      });
      
      throw new Error(`Failed to send email: ${error.message}`);
    }

    // Log success
    await supabaseAdmin.from('magic_link_logs').insert({
      email: normalizedEmail,
      user_id: user.id,
      purchase_id: purchase.id,
      source: 'admin_welcome_email',
      status: 'sent',
      metadata: { admin_triggered: true, message_id: data?.id },
    });

    logStep("Welcome email sent successfully", { email: normalizedEmail, messageId: data?.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message_id: data?.id,
      email: normalizedEmail 
    }), {
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
