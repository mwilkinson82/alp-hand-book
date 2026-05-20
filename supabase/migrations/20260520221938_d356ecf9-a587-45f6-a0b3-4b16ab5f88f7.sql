CREATE TABLE public.broadcast_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_broadcast_logs_broadcast_email ON public.broadcast_logs(broadcast_id, email);
CREATE INDEX idx_broadcast_logs_sent_at ON public.broadcast_logs(sent_at DESC);

ALTER TABLE public.broadcast_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages broadcast logs"
ON public.broadcast_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);