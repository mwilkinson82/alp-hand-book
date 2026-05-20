import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send, RefreshCw, CheckCircle, XCircle, ArrowLeft, Sparkles, Megaphone, Eye } from 'lucide-react';

interface MagicLinkLog {
  id: string;
  email: string;
  sent_at: string;
  status: string;
  error_message: string | null;
  source: string;
}

interface Purchase {
  id: string;
  user_id: string;
  email: string;
  amount_cents: number;
  status: string;
  purchased_at: string | null;
  created_at: string;
}

const ADMIN_EMAIL = 'wilkinson.marshall@gmail.com';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const [logs, setLogs] = useState<MagicLinkLog[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Broadcast state
  const [broadcastRecipientCount, setBroadcastRecipientCount] = useState<number | null>(null);
  const [broadcastBusy, setBroadcastBusy] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();

  // Check if user is admin (wait for auth to hydrate first)
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.email !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }
    setIsAdmin(true);
    setLoading(false);
    fetchData();
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Fetch magic link logs
      const { data: logsData } = await supabase
        .from('magic_link_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);
      
      if (logsData) setLogs(logsData);

      // Fetch purchases with user emails via edge function
      const { data: purchasesData } = await supabase.functions.invoke('admin-get-purchases');
      if (purchasesData?.purchases) setPurchases(purchasesData.purchases);

      // Fetch broadcast recipient count
      const { data: bData } = await supabase.functions.invoke('send-v2-broadcast', {
        body: { mode: 'preview' },
      });
      if (typeof bData?.recipientCount === 'number') setBroadcastRecipientCount(bData.recipientCount);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const runBroadcast = async (mode: 'test' | 'send', testEmail?: string) => {
    if (mode === 'send') {
      const ok = window.confirm(
        `Send V2 launch email to ${broadcastRecipientCount ?? '?'} purchaser(s)? This cannot be undone.`,
      );
      if (!ok) return;
    }
    setBroadcastBusy(true);
    setBroadcastResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('send-v2-broadcast', {
        body: { mode, testEmail },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (mode === 'test') {
        toast({ title: 'Test sent', description: `Sent to ${data.target}` });
      } else {
        toast({
          title: 'Broadcast complete',
          description: `Sent ${data.sent} • Failed ${data.failed} • Skipped ${data.skipped}`,
        });
        setBroadcastResult(JSON.stringify(data, null, 2));
      }
    } catch (err: unknown) {
      toast({ title: 'Broadcast failed', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setBroadcastBusy(false);
    }
  };

  const previewBroadcastInNewTab = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-v2-broadcast', {
        body: { mode: 'html' },
      });
      if (error) throw error;
      if (!data?.html) throw new Error('No HTML returned');
      const blob = new Blob([data.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err: unknown) {
      toast({ title: 'Preview failed', description: getErrorMessage(err), variant: 'destructive' });
    }
  };

  const sendMagicLink = async (targetEmail: string) => {
    if (!targetEmail.trim()) {
      toast({ title: 'Please enter an email address', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-email-admin', {
        body: { email: targetEmail.trim() }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Magic link sent!', description: `Sent to ${targetEmail}` });
      setEmail('');
      fetchData();
    } catch (err: unknown) {
      toast({ title: 'Failed to send', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const sendWelcomeEmail = async (targetEmail: string) => {
    if (!targetEmail.trim()) {
      toast({ title: 'Please enter an email address', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      // First generate a magic link
      const { data, error } = await supabase.functions.invoke('send-welcome-email-admin', {
        body: { email: targetEmail.trim() }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Welcome email sent!', description: `Sent to ${targetEmail}` });
      fetchData();
    } catch (err: unknown) {
      toast({ title: 'Failed to send welcome email', description: getErrorMessage(err), variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin opacity-50" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* V2 Broadcast */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            V2 Launch Broadcast
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sends the "ALP Handbook Version 2 is live." email to all completed purchasers. Idempotent — already-sent
            recipients are skipped.
          </p>
          <div className="text-sm mb-4">
            Recipients:{' '}
            <span className="font-medium">
              {broadcastRecipientCount === null ? '—' : broadcastRecipientCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={previewBroadcastInNewTab} disabled={broadcastBusy}>
              <Eye className="w-4 h-4 mr-2" />
              Preview in new tab
            </Button>
            <Button variant="outline" onClick={() => runBroadcast('test')} disabled={broadcastBusy}>
              <Mail className="w-4 h-4 mr-2" />
              Send test to me
            </Button>
            <Button onClick={() => runBroadcast('send')} disabled={broadcastBusy}>
              {broadcastBusy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Send to all purchasers
            </Button>
          </div>
          {broadcastResult && (
            <pre className="mt-4 text-xs bg-muted p-3 rounded overflow-auto">{broadcastResult}</pre>
          )}
        </div>

        {/* Send Magic Link */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Magic Link
          </h2>
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMagicLink(email)}
              className="max-w-md"
            />
            <Button onClick={() => sendMagicLink(email)} disabled={sending}>
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
              Send
            </Button>
          </div>
        </div>

        {/* Magic Link Logs */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Magic Link Logs</h2>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No magic links logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                    <th className="text-left py-2 px-3 font-medium">Email</th>
                    <th className="text-left py-2 px-3 font-medium">Source</th>
                    <th className="text-left py-2 px-3 font-medium">Sent At</th>
                    <th className="text-left py-2 px-3 font-medium">Error</th>
                    <th className="text-left py-2 px-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-muted/50">
                      <td className="py-2 px-3">
                        {log.status === 'sent' ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-xs">{log.email}</td>
                      <td className="py-2 px-3 text-muted-foreground">{log.source}</td>
                      <td className="py-2 px-3 text-muted-foreground">{formatDate(log.sent_at)}</td>
                      <td className="py-2 px-3 text-destructive text-xs">{log.error_message || '—'}</td>
                      <td className="py-2 px-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => sendMagicLink(log.email)}
                          disabled={sending}
                        >
                          Resend
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Recent Purchases</h2>
          {purchases.length === 0 ? (
            <p className="text-muted-foreground text-sm">No purchases found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                    <th className="text-left py-2 px-3 font-medium">Email</th>
                    <th className="text-left py-2 px-3 font-medium">Amount</th>
                    <th className="text-left py-2 px-3 font-medium">Purchased At</th>
                    <th className="text-left py-2 px-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-muted/50">
                      <td className="py-2 px-3">
                        {purchase.status === 'completed' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-accent text-accent-foreground">
                            {purchase.status}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-xs">{purchase.email}</td>
                      <td className="py-2 px-3">${(purchase.amount_cents / 100).toFixed(2)}</td>
                      <td className="py-2 px-3 text-muted-foreground">{formatDate(purchase.purchased_at)}</td>
                      <td className="py-2 px-3 space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => sendMagicLink(purchase.email)}
                          disabled={sending}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Link
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => sendWelcomeEmail(purchase.email)}
                          disabled={sending}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Welcome
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
