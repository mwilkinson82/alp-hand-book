import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-WELCOME-EMAIL] ${step}${detailsStr}`);
};

interface WelcomeEmailRequest {
  email: string;
  magic_link_url: string;
  customer_name?: string;
}

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
    logStep("Resend API key verified");

    const resend = new Resend(resendApiKey);

    const body: WelcomeEmailRequest = await req.json();
    
    if (!body.email) {
      throw new Error("Email is required");
    }
    if (!body.magic_link_url) {
      throw new Error("Magic link URL is required");
    }

    logStep("Sending welcome email", { email: body.email });

    const greeting = body.customer_name ? `Hi ${body.customer_name},` : "Hi there,";

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
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.5px;">
                Welcome to The ALP Handbook
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px 30px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                ${greeting}
              </p>
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for purchasing <strong>The ALP Handbook</strong>! Your lifetime access is now active.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="text-align: center; padding: 10px 0 30px 0;">
                    <a href="${body.magic_link_url}" style="display: inline-block; padding: 16px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; letter-spacing: 0.5px;">
                      Access The Handbook Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Fallback info -->
              <div style="padding: 20px; background-color: #f9f9f9; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                  <strong>Didn't receive this email or need a new sign-in link?</strong>
                </p>
                <p style="margin: 0; font-size: 14px; color: #666666;">
                  No problem — request one anytime at:<br>
                  <a href="https://alphandbook.com/auth" style="color: #1a1a1a; text-decoration: underline;">https://alphandbook.com/auth</a>
                </p>
              </div>
              
              <!-- Support info -->
              <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                Questions? Just reply to this email or contact me directly at 
                <a href="mailto:marshall@marshallwilkinson.com" style="color: #1a1a1a; text-decoration: underline;">marshall@marshallwilkinson.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
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
        
        <!-- Footer note -->
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

    const textContent = `
Welcome to The ALP Handbook

${greeting}

Thank you for purchasing The ALP Handbook! Your lifetime access is now active.

Click here to access the handbook:
${body.magic_link_url}

---

Didn't receive this email or need a new sign-in link?
No problem — request one anytime at: https://alphandbook.com/auth

Questions? Reply to this email or contact me directly at marshall@marshallwilkinson.com

Welcome aboard,
Marshall Wilkinson

---
This link will expire in 1 hour for security purposes.
    `;

    const { data, error } = await resend.emails.send({
      from: "Marshall Wilkinson <marshall@alphandbook.com>",
      replyTo: "marshall@marshallwilkinson.com",
      to: [body.email],
      subject: "Welcome to The ALP Handbook - Your Access is Ready",
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      logStep("Resend error", { error: error.message });
      throw new Error(`Failed to send email: ${error.message}`);
    }

    logStep("Welcome email sent successfully", { email: body.email, messageId: data?.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message_id: data?.id,
      email: body.email 
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
