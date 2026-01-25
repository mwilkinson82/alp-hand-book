-- Create table to log all magic link sends
CREATE TABLE public.magic_link_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  user_id UUID,
  purchase_id UUID REFERENCES public.book_purchases(id),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'purchase_success', -- where the link was triggered from
  status TEXT NOT NULL DEFAULT 'sent', -- sent, failed
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.magic_link_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for edge functions)
CREATE POLICY "Service role can manage magic link logs"
  ON public.magic_link_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for quick lookups by email
CREATE INDEX idx_magic_link_logs_email ON public.magic_link_logs(email);
CREATE INDEX idx_magic_link_logs_sent_at ON public.magic_link_logs(sent_at DESC);