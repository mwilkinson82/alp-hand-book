import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import bookCover from '@/assets/book-cover.png';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Target, 
  Shield, 
  Clock, 
  TrendingUp,
  FileText,
  Zap,
  Moon,
  Sun
} from 'lucide-react';

const SalesPage: React.FC = () => {
  const { user, hasPurchased, loading } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('handbook-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('handbook-theme', newTheme ? 'dark' : 'light');
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // If user has purchased, show access message
  if (!loading && user && hasPurchased) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <h1 className="chapter-heading text-3xl md:text-4xl mb-6">You Own This Handbook</h1>
        <p className="body-text mb-8 opacity-70">Thank you for your purchase. Access the complete operating system.</p>
        <Link to="/read">
          <Button className="font-sans uppercase tracking-widest">
            Read the Handbook
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm uppercase tracking-[0.2em] font-medium opacity-70">
            The ALP Handbook
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <Link to="/read">
                <Button variant="outline" size="sm" className="font-sans uppercase tracking-wider text-xs">
                  My Handbook
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="font-sans uppercase tracking-wider text-xs">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-sm uppercase tracking-[0.3em] opacity-50 mb-6 font-sans">
              The Operating Doctrine
            </p>
            <h1 className="handbook-title text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              THE ALP HANDBOOK
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 opacity-80 leading-relaxed">
              The Operating System for Contractors Who Want to Scale — Without Losing Control
            </p>
            
            <div className="body-text space-y-4 mb-10 opacity-70">
              <p>Most contractors don't fail because they lack skill.</p>
              <p className="body-text-emphasis text-foreground opacity-100">They fail because they lack command.</p>
            </div>

            <p className="body-text mb-8 opacity-70">
              The ALP Handbook is a practical, field-tested operating system for contractors who want to scale revenue, protect margin, and regain control — without chaos, burnout, or constant firefighting.
            </p>

            <div className="space-y-2 mb-10">
              <p className="body-text opacity-60">This is not motivation.</p>
              <p className="body-text opacity-60">This is not theory.</p>
              <p className="body-text-emphasis">This is how top-tier operators actually run their businesses.</p>
            </div>

            <p className="text-sm uppercase tracking-widest opacity-50 mb-8">By Marshall Wilkinson</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handlePurchase}
                disabled={checkoutLoading || loading}
                size="lg"
                className="font-sans uppercase tracking-widest"
              >
                {checkoutLoading ? 'Loading...' : 'Get the Handbook — $47'}
              </Button>
              
              <Link to="/preview">
                <Button variant="outline" size="lg" className="font-sans uppercase tracking-widest w-full sm:w-auto">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Experience
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <img 
              src={bookCover} 
              alt="The ALP Handbook by Marshall Wilkinson" 
              className="max-w-xs md:max-w-sm lg:max-w-md w-full h-auto shadow-2xl rounded-sm"
            />
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-4">
            If This Feels Familiar, This Handbook Was Written for You
          </h2>
          
          <div className="body-text space-y-2 mb-10 opacity-70">
            <p>You're busy — but not in control.</p>
            <p>Revenue is growing — but margin isn't.</p>
            <p>Projects move — but always with friction.</p>
          </div>

          <p className="body-text mb-6 opacity-80">You deal with:</p>
          
          <ul className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              'Constant schedule pressure',
              'Start–stop work killing productivity',
              'Margin erosion you can\'t fully explain',
              'Owners dictating terms',
              'Documentation that never quite "adds up"',
              'Decisions made reactively, under stress'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 body-text opacity-70">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>

          <div className="body-text space-y-2">
            <p className="opacity-70">You don't need more hustle.</p>
            <p className="opacity-70">You don't need another tactic.</p>
            <p className="body-text-emphasis text-xl">You need a system.</p>
          </div>
        </div>
      </section>

      {/* Why ALP Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-6">
            Why ALP Is Different
          </h2>
          
          <p className="body-text opacity-70 mb-4">Most business books are written by observers.</p>
          <p className="body-text-emphasis text-xl mb-8">The ALP Handbook is written by an operator.</p>

          <p className="body-text opacity-70 mb-8">
            Marshall Wilkinson has executed and advised on billions of dollars in construction, navigated high-stakes disputes, protected margin under pressure, and built companies that scale without losing control.
          </p>

          <p className="body-text opacity-80 mb-6">
            ALP — <span className="body-text-emphasis">Altitude, Logic, Pressure</span> — is the decision framework used to:
          </p>

          <ul className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              { icon: Clock, text: 'Control time' },
              { icon: Shield, text: 'Protect margin' },
              { icon: Target, text: 'Enforce standards' },
              { icon: TrendingUp, text: 'Monetize disruption' },
              { icon: Zap, text: 'Scale without chaos' }
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-center gap-3 body-text">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                {text}
              </li>
            ))}
          </ul>

          <p className="body-text-emphasis">This handbook is the codified version of that system.</p>
        </div>
      </section>

      {/* Operating System Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-6">
            This Is an Operating System — Not a Collection of Tips
          </h2>
          
          <p className="body-text opacity-80 mb-8">The ALP Handbook gives you:</p>

          <ul className="space-y-4 mb-10">
            {[
              'A decision framework for operating under pressure',
              'A time-control system using schedules and sequencing',
              'A margin-protection model built around General Conditions',
              'A documentation and entitlement framework that converts disruption into money',
              'A leadership lens that enforces standards without micromanagement'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 body-text">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>

          <div className="body-text space-y-2">
            <p className="opacity-70">Every chapter connects.</p>
            <p className="opacity-70">Nothing is isolated.</p>
            <p className="body-text-emphasis text-xl">This is how order replaces chaos.</p>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-8">
            Inside the ALP Handbook, You'll Learn How To:
          </h2>
          
          <ul className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              'Turn marketing into infrastructure, not desperation',
              'Position yourself upstream so you\'re invited, not bid',
              'Apply pressure correctly in sales and operations',
              'Stop losing profit to General Conditions you don\'t control',
              'Use schedules as financial weapons, not paperwork',
              'Eliminate productivity loss from start–stop work',
              'Document in real time so entitlement becomes provable',
              'Make clean decisions under pressure using the ALP Decision Matrix',
              'Scale revenue without losing standards, margin, or identity'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 body-text">
                <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                {item}
              </li>
            ))}
          </ul>

          <div className="body-text space-y-2">
            <p className="opacity-70">This is not about working harder.</p>
            <p className="body-text-emphasis text-xl">It's about operating at a higher level.</p>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-8">
            Who This Handbook Is For
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="body-text opacity-80 mb-4">This handbook is for:</p>
              <ul className="space-y-3">
                {[
                  'Owners and principals of contracting companies',
                  'Operators responsible for margin, time, and decisions',
                  'Contractors scaling past small-company chaos',
                  'Leaders who want command — not just growth'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 body-text">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="body-text opacity-80 mb-4">This is not for:</p>
              <ul className="space-y-3">
                {[
                  'Hobbyists',
                  '"Try it and see" entrepreneurs',
                  'People looking for shortcuts',
                  'Anyone uncomfortable with responsibility'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 body-text opacity-60">
                    <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="body-text-emphasis mt-10">
            ALP rewards operators who are willing to think clearly — and act decisively.
          </p>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-10 text-center">
            From Chaos to Control
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-background border border-border rounded-sm">
              <p className="text-sm uppercase tracking-widest opacity-50 mb-6">Before ALP</p>
              <ul className="space-y-3">
                {[
                  'Decisions are reactive',
                  'Time drifts',
                  'Margin leaks',
                  'Documentation is weak',
                  'Pressure controls you'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 body-text opacity-60">
                    <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-background border-2 border-primary rounded-sm">
              <p className="text-sm uppercase tracking-widest opacity-50 mb-6">After ALP</p>
              <ul className="space-y-3">
                {[
                  'Decisions are structured',
                  'Time is enforced',
                  'Margin is protected',
                  'Proof is built in real time',
                  'You control pressure'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 body-text">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="body-text-emphasis text-xl text-center mt-10">
            This handbook is the bridge.
          </p>
        </div>
      </section>

      {/* Not Best Practices Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-heading text-2xl md:text-3xl mb-6">
            This Handbook Doesn't Teach "Best Practices"
          </h2>
          
          <p className="body-text-emphasis text-xl mb-8">It teaches operating principles.</p>
          
          <p className="body-text opacity-80 mb-6">The kind that:</p>
          
          <ul className="inline-block text-left space-y-3 mb-10">
            {[
              'Hold up under dispute',
              'Work when things go wrong',
              'Protect you when pressure rises'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 body-text">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="body-text space-y-4 mt-12 p-8 bg-muted/50 rounded-sm">
            <p className="opacity-70">If you've ever thought:</p>
            <p className="body-text-emphasis text-xl italic">
              "I know we're better than how this business feels…"
            </p>
            <p className="opacity-70">You're right.</p>
            <p className="body-text-emphasis">You just needed the right operating system.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="handbook-title text-3xl md:text-4xl lg:text-5xl mb-8">
            Get the ALP Handbook
          </h2>
          
          <div className="space-y-4 mb-10 opacity-90">
            <p className="text-lg">This is not a book you read once.</p>
            <p className="text-lg font-medium">
              It's a reference you return to — in real time, while decisions are being made.
            </p>
          </div>

          <p className="opacity-90 mb-6">If you're ready to:</p>
          
          <ul className="inline-block text-left space-y-2 mb-10">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Stop reacting
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Stop leaking margin
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Stop operating from stress
            </li>
          </ul>

          <p className="text-xl font-medium mb-10">Then it's time to operate with ALP.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handlePurchase}
              disabled={checkoutLoading || loading}
              size="lg"
              variant="secondary"
              className="font-sans uppercase tracking-widest text-lg px-10 py-6"
            >
              {checkoutLoading ? 'Loading...' : 'Get Immediate Access — $47'}
            </Button>
          </div>

          {!user && (
            <p className="mt-6 text-sm opacity-70">
              Already purchased?{' '}
              <Link to="/auth" className="underline hover:opacity-80">
                Sign in to access
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-border">
        <p className="text-sm uppercase tracking-[0.2em] opacity-40 mb-4">
          The ALP Handbook
        </p>
        <p className="text-sm opacity-30">
          © Marshall Wilkinson
        </p>
      </footer>
    </div>
  );
};

export default SalesPage;
