import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT-SUCCESS] ${step}${detailsStr}`);
};

// Generate a secure random password
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  const randomValues = new Uint32Array(16);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 16; i++) {
    password += chars[randomValues[i] % chars.length];
  }
  return password;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service role key for admin operations
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const { session_id } = await req.json();
    if (!session_id) throw new Error("No session_id provided");
    logStep("Session ID received", { session_id });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent', 'customer'],
    });

    logStep("Session retrieved", { 
      status: session.payment_status, 
      customerEmail: session.customer_details?.email,
      customerId: typeof session.customer === 'string' ? session.customer : (session.customer as Stripe.Customer)?.id,
      hasPaymentIntent: !!session.payment_intent,
      amountTotal: session.amount_total
    });

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    const customerEmail = session.customer_details?.email;
    if (!customerEmail) {
      throw new Error("No customer email found in session");
    }

    // For $0 checkouts (100% discount), there's no payment_intent
    // Use checkout session ID as the unique identifier in that case
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    const uniquePaymentId = paymentIntent?.id || `checkout_${session.id}`;
    
    logStep("Payment identifier", { uniquePaymentId, isZeroAmount: !paymentIntent });

    // Get customer ID (handle both string and expanded object)
    const stripeCustomerId = typeof session.customer === 'string' 
      ? session.customer 
      : (session.customer as Stripe.Customer)?.id;

    // Check if purchase already exists by payment identifier
    const { data: existingPurchase } = await supabaseAdmin
      .from('book_purchases')
      .select('id, user_id')
      .eq('stripe_payment_intent_id', uniquePaymentId)
      .maybeSingle();

    if (existingPurchase) {
      logStep("Purchase already recorded", { purchaseId: existingPurchase.id });
      return new Response(JSON.stringify({ 
        success: true, 
        already_recorded: true,
        user_id: existingPurchase.user_id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if user already exists with this email
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === customerEmail);

    let userId: string;
    let isNewUser = false;
    let passwordResetRequired = false;

    if (existingUser) {
      userId = existingUser.id;
      logStep("Found existing user", { userId, email: customerEmail });
    } else {
      // Create new user with a secure random password
      const tempPassword = generateSecurePassword();
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        password: tempPassword,
        email_confirm: true, // Auto-confirm since they paid
      });

      if (createError) {
        logStep("Error creating user", { error: createError.message });
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      userId = newUser.user.id;
      isNewUser = true;
      passwordResetRequired = true;
      logStep("Created new user", { userId, email: customerEmail });

      // Send password reset email so they can set their own password
      const origin = req.headers.get("origin") || "https://alp-handbook.lovable.app";
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: customerEmail,
        options: {
          redirectTo: `${origin}/auth?mode=reset`,
        },
      });

      if (resetError) {
        logStep("Warning: Could not generate password reset link", { error: resetError.message });
      } else {
        logStep("Password reset link generated");
      }
    }

    // Create purchase record
    const { data: purchase, error: insertError } = await supabaseAdmin
      .from('book_purchases')
      .insert({
        user_id: userId,
        stripe_payment_intent_id: uniquePaymentId,
        stripe_customer_id: stripeCustomerId || null,
        amount_cents: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'completed',
        purchased_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      // React StrictMode / retry behavior can call the success endpoint more than once.
      // Treat unique-constraint duplicates as success.
      const isDuplicate =
        // Postgres unique violation
        (insertError as any)?.code === '23505' ||
        insertError.message.includes('duplicate key value');

      if (isDuplicate) {
        logStep('Duplicate purchase insert detected; returning existing record', {
          uniquePaymentId,
        });

        const { data: existingAfterInsert } = await supabaseAdmin
          .from('book_purchases')
          .select('*')
          .eq('stripe_payment_intent_id', uniquePaymentId)
          .maybeSingle();

        if (existingAfterInsert) {
          return new Response(
            JSON.stringify({
              success: true,
              already_recorded: true,
              purchase: existingAfterInsert,
              user_id: existingAfterInsert.user_id,
              is_new_user: false,
              password_reset_required: false,
              email: customerEmail,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }
      }

      logStep("Error inserting purchase", { error: insertError.message });
      throw new Error(`Failed to record purchase: ${insertError.message}`);
    }

    logStep("Purchase recorded successfully", { 
      purchaseId: purchase.id, 
      userId, 
      isNewUser, 
      passwordResetRequired 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      purchase,
      user_id: userId,
      is_new_user: isNewUser,
      password_reset_required: passwordResetRequired,
      email: customerEmail
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-payment-success", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
