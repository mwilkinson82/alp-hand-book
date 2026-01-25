import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send, RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

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

const ADMIN_EMAIL = 'ajhoover@mac.com'; // Hardcoded admin for now

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

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/');
        return;
      }
      setIsAdmin(true);
      setLoading(false);
      fetchData();
    };
    checkAdmin();
  }, [navigate]);

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
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const sendMagicLink = async (targetEmail: string) => {
    if (!targetEmail.trim()) {
      toast({ title: 'Please enter an email address', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const redirectTo = `${window.location.origin}/read`;
      const { error } = await supabase.auth.signInWithOtp({
        email: targetEmail.trim(),
        options: { 
          emailRedirectTo: redirectTo,
          shouldCreateUser: false
        }
      });

      if (error) throw error;

      // Log the send
      await supabase.functions.invoke('log-magic-link', {
        body: {
          email: targetEmail.trim(),
          source: 'admin_manual',
          status: 'sent',
          metadata: { sent_by: ADMIN_EMAIL }
        }
      });

      toast({ title: 'Magic link sent!', description: `Sent to ${targetEmail}` });
      setEmail('');
      fetchData();
    } catch (err: any) {
      toast({ title: 'Failed to send', description: err.message, variant: 'destructive' });
      
      // Log the failure
      await supabase.functions.invoke('log-magic-link', {
        body: {
          email: targetEmail.trim(),
          source: 'admin_manual',
          status: 'failed',
          error_message: err.message,
          metadata: { sent_by: ADMIN_EMAIL }
        }
      });
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
                      <td className="py-2 px-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => sendMagicLink(purchase.email)}
                          disabled={sending}
                        >
                          Send Link
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
