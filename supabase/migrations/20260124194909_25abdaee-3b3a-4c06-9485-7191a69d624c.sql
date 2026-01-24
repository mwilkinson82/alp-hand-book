-- Create a table to track book purchases
CREATE TABLE public.book_purchases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending',
    purchased_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.book_purchases ENABLE ROW LEVEL SECURITY;

-- Users can only view their own purchases
CREATE POLICY "Users can view their own purchases" 
ON public.book_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

-- Service role can insert/update (for webhook processing)
-- Users cannot insert directly - only through Stripe webhook
CREATE POLICY "Service role can manage purchases"
ON public.book_purchases
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_book_purchases_updated_at
BEFORE UPDATE ON public.book_purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();