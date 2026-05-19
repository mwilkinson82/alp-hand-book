DROP POLICY IF EXISTS "Service role can manage magic link logs" ON public.magic_link_logs;
CREATE POLICY "Service role can manage magic link logs"
ON public.magic_link_logs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);