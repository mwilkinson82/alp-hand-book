import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/AnimatedSection';
import StickyPreviewButton from '@/components/handbook/StickyPreviewButton';
import bookCover from '@/assets/book-cover-v2.png';
import bulldozer from '@/assets/bulldozer.png';
import marshallPhoto from '@/assets/marshall-wilkinson.png';
import { Eye, CheckCircle2, XCircle, ArrowRight, Target, Shield, Clock, TrendingUp, FileText, Zap, Moon, Sun, Quote, Lock, CreditCard, Monitor, Headphones, BookOpen, Infinity, Palette, Navigation, Link2, ListOrdered, Play, ShoppingBag, Menu } from 'lucide-react';
const testimonials = [{
  quote: "I'm ALP for life. Marshall has changed my life. From $600k to $12.5M in 11 months. There is nobody like him on earth. You just have to get around him to understand.",
  name: "Bryan Bettencourt",
  company: "Bettencourt Construction, St Petersburg FL"
}, {
  quote: "I followed Marshall for about a year, and have been involved in other groups. There is NOTHING like Marshall. This is real world stuff here. My 2nd month as a Contractor and I'm at a quarter million in revenue and have a real scalable business. It's unreal. ALP all day, everyday.",
  name: "Ronnie Silva",
  company: "Sage Construction"
}, {
  quote: "I have been enrolled in ALP premium for three months and in closer school for six months and it has fundamentally changed how I conduct business. This program is transformative in nature. Life changing.",
  name: "Eric Jacobs",
  company: "HVAC Executive"
}, {
  quote: "ALP is Super Impactful! I have tried many other coaching programs and Coaches, and none compare to what I've learned in the past 2 months. So if you are really serious about winning in Business and life. Join ALP! It will change your life.",
  name: "Julius Davis",
  company: "Davis Contracting"
}];
const SalesPage: React.FC = () => {
  const {
    user,
    hasPurchased,
    loading
  } = useAuth();
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
    setCheckoutLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // If user has purchased, show access message
  if (!loading && user && hasPurchased) {
    return <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 text-center">
        <h1 className="chapter-heading text-3xl md:text-4xl mb-6">You Own This Handbook</h1>
        <p className="body-text mb-8 opacity-70">Thank you for your purchase. Access the complete operating system.</p>
        <Link to="/read">
          <Button className="font-sans uppercase tracking-widest">
            Read the Handbook
          </Button>
        </Link>
      </div>;
  }
  return <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <span className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium opacity-70">
            The ALP Handbook
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors" aria-label="Toggle theme">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? <Link to="/read">
                <Button variant="outline" size="sm" className="font-sans uppercase tracking-wider text-[10px] sm:text-xs px-2 sm:px-3">
                  <span className="hidden sm:inline">My Handbook</span>
                  <span className="sm:hidden">Read</span>
                </Button>
              </Link> : <Link to="/auth">
                <Button variant="ghost" size="sm" className="font-sans uppercase tracking-wider text-[10px] sm:text-xs px-2 sm:px-3">
                  Sign In
                </Button>
              </Link>}
          </div>
        </div>
      </header>

      {/* ============================================================
          MOBILE / TABLET HERO — campaign-first, editorial opening
          ============================================================ */}
      <section className="lg:hidden relative pt-10 sm:pt-12 pb-12 px-5 sm:px-6 overflow-hidden">
        <div className="max-w-[640px] mx-auto">
          {/* Brand line */}
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-foreground/40" />
            <span className="uppercase tracking-[0.28em] text-[10px] font-mono text-foreground/70">
              The ALP Handbook
            </span>
          </div>

          <p className="uppercase tracking-[0.28em] text-[10px] font-mono text-foreground/55 mb-4">
            ALP Contractor Circle
          </p>

          {/* Big headline — owns the screen */}
          <h1
            className="font-serif text-foreground"
            style={{
              fontWeight: 400,
              fontSize: 'clamp(44px, 11vw, 58px)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
            }}
          >
            A field manual for building the company behind the projects.
          </h1>

          <p className="font-sans text-[15px] text-foreground/75 leading-snug max-w-[34ch] mt-4 mb-5">
            An interactive web handbook for contractors who want to run the
            company, not just the projects.
          </p>

          {/* Primary CTA + light secondary link */}
          <div className="flex flex-col items-start gap-3 mb-6">
            <button
              onClick={handlePurchase}
              disabled={checkoutLoading || loading}
              className="pill-cta w-full text-[12px]"
              style={{ height: 52, paddingTop: 0, paddingBottom: 0 }}
            >
              {checkoutLoading ? 'Loading…' : 'Get the Handbook — $47'}
            </button>

            <Link
              to="/preview"
              className="self-center inline-flex items-center gap-1.5 text-[13px] font-sans text-foreground/70 hover:text-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview the experience →
            </Link>
          </div>

          {/* Proof object — compact handbook card (top peeks into first viewport) */}
          <div className="mt-4 mb-8">
            <p className="uppercase tracking-[0.24em] text-[9px] font-mono text-foreground/50 mb-2.5">
              The Digital Handbook
            </p>

            <div
              className="relative rounded-[20px] bg-[hsl(35_18%_93%)] p-2.5"
              style={{
                boxShadow:
                  '0 30px 60px -25px hsl(30 10% 10% / 0.25), 0 8px 20px -10px hsl(30 10% 10% / 0.15), inset 0 0 0 1px hsl(30 10% 10% / 0.06)',
              }}
            >
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground/25" />

              <div className="rounded-[14px] bg-background overflow-hidden">
                {/* Top: tiny TOC strip + cover side by side */}
                <div className="flex">
                  {/* TOC mini strip */}
                  <aside className="w-[34%] border-r border-border/70 px-3 py-3 text-[8px] font-sans">
                    <div className="flex items-center justify-between mb-3">
                      <span className="uppercase tracking-[0.2em] text-foreground/70">Contents</span>
                      <Menu className="w-2 h-2 text-foreground/40" />
                    </div>
                    <ul className="space-y-2">
                      {[
                        { n: '01', t: 'The Company\nBehind the Projects', active: true },
                        { n: '02', t: 'The Operating System' },
                        { n: '03', t: 'Vision' },
                        { n: '04', t: 'Data' },
                        { n: '05', t: 'Issues' },
                      ].map(({ n, t, active }, i) => (
                        <li key={i} className="relative">
                          <p className="text-foreground/40">{n}</p>
                          <p className={`whitespace-pre-line leading-tight ${active ? 'text-foreground' : 'text-foreground/70'}`}>
                            {t}
                          </p>
                          {active && (
                            <span className="absolute -right-1.5 top-1.5 w-1 h-1 rounded-full bg-[hsl(var(--brand-accent))]" />
                          )}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 rounded border border-border/70 px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        <Link2 className="w-2 h-2 text-foreground/60" />
                        <span className="uppercase tracking-[0.16em] text-foreground/80 text-[7px]">Magic Link</span>
                      </div>
                    </div>
                  </aside>

                  {/* Cover */}
                  <div className="flex-1 bg-[hsl(40_30%_96%)] flex items-center justify-center p-3 min-h-[230px]">
                    <img
                      src={bookCover}
                      alt="The ALP Handbook — AOS Edition cover"
                      className="max-h-[210px] w-auto object-contain"
                      style={{ filter: 'drop-shadow(0 10px 18px hsl(30 10% 10% / 0.18))' }}
                    />
                  </div>
                </div>

                {/* Audio bar across full width */}
                <div className="border-t border-border/60 px-3 py-2.5 bg-[hsl(40_30%_96%)]">
                  <p className="uppercase tracking-[0.2em] text-[7.5px] font-mono text-foreground/55 mb-1.5">
                    Audio Chapter Available
                  </p>
                  <div className="rounded bg-background border border-border/60 px-2.5 py-2 flex items-center gap-2.5">
                    <button className="w-6 h-6 rounded-full bg-background border border-border/70 flex items-center justify-center shrink-0">
                      <Play className="w-2.5 h-2.5 text-foreground/80 ml-0.5" fill="currentColor" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[9px] font-sans">
                        <span className="text-foreground/50">01</span>
                        <span className="text-foreground truncate">The Company Behind the Projects</span>
                      </div>
                      <div className="mt-1 flex items-center gap-[1px] h-2">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <span
                            key={i}
                            className="flex-1"
                            style={{
                              height: `${20 + Math.abs(Math.sin(i * 0.7)) * 80}%`,
                              background: i < 6 ? 'hsl(var(--brand-accent))' : 'hsl(30 10% 10% / 0.35)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature chips — secondary, below the mockup */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              'Magic link access',
              'Interactive TOC',
              'Audio chapters',
              'Lifetime access',
            ].map((label, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-foreground/20 bg-background uppercase tracking-[0.16em] text-[10px] font-mono text-foreground/75"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================
          DESKTOP HERO — DDB/Ogilvy editorial lockup (unchanged)
          ============================================================ */}
      <section className="hidden lg:block relative pt-20 lg:pt-24 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">

          {/* LEFT — Tablet device mock */}
          <div className="relative order-2 lg:order-1 lg:pb-16">
            <div
              className="relative mx-auto w-full max-w-[600px] aspect-[4/3] rounded-[28px] bg-[hsl(35_18%_93%)] p-3 sm:p-4"
              style={{
                boxShadow:
                  '0 40px 80px -30px hsl(30 10% 10% / 0.25), 0 12px 30px -12px hsl(30 10% 10% / 0.18), inset 0 0 0 1px hsl(30 10% 10% / 0.06)',
              }}
            >
              <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground/25" />

              <div className="relative w-full h-full rounded-[18px] bg-background overflow-hidden flex">
                {/* Left contents pane */}
                <aside className="hidden sm:flex flex-col w-[34%] border-r border-border/70 px-4 py-4 text-[8px] sm:text-[9px] font-sans">
                  <div className="flex items-center justify-between mb-5">
                    <span className="uppercase tracking-[0.22em] text-foreground/70">Contents</span>
                    <Menu className="w-2.5 h-2.5 text-foreground/40" />
                  </div>

                  <div className="mb-4">
                    <p className="uppercase tracking-[0.22em] text-foreground/70">Welcome</p>
                    <p className="text-foreground/40 mt-0.5">Start here</p>
                  </div>

                  <ul className="space-y-2.5">
                    {[
                      { n: '01', t: 'The Company\nBehind the Projects', active: true },
                      { n: '02', t: 'The Operating System' },
                      { n: '03', t: 'Vision' },
                      { n: '00', t: 'People' },
                      { n: '04', t: 'Data' },
                      { n: '05', t: 'Issues' },
                      { n: '07', t: 'Process' },
                      { n: '08', t: 'Traction' },
                    ].map(({ n, t, active }, i) => (
                      <li key={i} className="relative">
                        <p className="text-foreground/40">{n}</p>
                        <p className={`whitespace-pre-line leading-tight ${active ? 'text-foreground' : 'text-foreground/70'}`}>{t}</p>
                        {active && (
                          <span className="absolute -right-2 top-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--brand-accent))]" />
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5">
                    <p className="uppercase tracking-[0.22em] text-foreground/70">Resources</p>
                    <p className="text-foreground/40 mt-0.5">Tools & Downloads</p>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="rounded-md border border-border/70 px-2.5 py-2">
                      <div className="flex items-center gap-1.5">
                        <Link2 className="w-2.5 h-2.5 text-foreground/60" />
                        <span className="uppercase tracking-[0.18em] text-foreground/80 text-[7.5px] sm:text-[8.5px]">Magic Link Access</span>
                      </div>
                      <p className="text-foreground/45 mt-1 text-[7.5px] sm:text-[8.5px]">Secure. Private. Yours.</p>
                    </div>
                  </div>
                </aside>

                {/* Right page — actual book cover as the hero focal point */}
                <div className="relative flex-1 flex flex-col bg-[hsl(40_30%_96%)]">
                  <div className="flex-1 min-h-0 flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={bookCover}
                      alt="The ALP Handbook — AOS Edition cover"
                      className="h-full w-auto max-w-full object-contain"
                      style={{ filter: 'drop-shadow(0 14px 24px hsl(30 10% 10% / 0.18))' }}
                    />
                  </div>

                  {/* Audio player card */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <p className="uppercase tracking-[0.2em] text-[7.5px] sm:text-[9px] text-foreground/60">Audio Chapter Available</p>
                    <div className="mt-2 rounded-md bg-background border border-border/60 px-3 py-2.5 flex items-center gap-3">
                      <button className="w-7 h-7 rounded-full bg-background border border-border/70 flex items-center justify-center shrink-0">
                        <Play className="w-3 h-3 text-foreground/80 ml-0.5" fill="currentColor" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-sans">
                          <span className="text-foreground/50">01</span>
                          <span className="text-foreground truncate">The Company Behind the Projects</span>
                        </div>
                        <div className="mt-1 flex items-center gap-[1px] h-3">
                          {Array.from({ length: 70 }).map((_, i) => (
                            <span
                              key={i}
                              className="flex-1"
                              style={{
                                height: `${20 + Math.abs(Math.sin(i * 0.7)) * 80}%`,
                                background: i < 9 ? 'hsl(var(--brand-accent))' : 'hsl(30 10% 10% / 0.35)',
                              }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[7px] sm:text-[8.5px] text-foreground/40 mt-1 font-sans">
                          <span>00:00</span>
                          <span>18:42</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Editorial lockup */}
          <div className="order-1 lg:order-2 lg:pl-4">
            <div className="flex items-center gap-3 mb-7">
              <span className="w-10 h-px bg-foreground/40" />
              <span className="uppercase tracking-[0.28em] text-[11px] font-sans text-foreground/70">
                ALP Contractor Circle
              </span>
            </div>

            <h1
              className="font-serif text-[42px] sm:text-[52px] lg:text-[62px] xl:text-[70px] leading-[1.02] text-foreground"
              style={{
                fontWeight: 400,
                letterSpacing: '-0.02em',
              }}
            >
              A field manual<br />
              for building<br />
              the company<br />
              behind the projects.
            </h1>

            <div className="w-14 h-px bg-foreground/30 mt-7 mb-6" />

            <p className="font-sans text-[15px] md:text-base text-foreground/75 leading-relaxed max-w-[46ch] mb-8">
              The ALP Handbook is an interactive web experience for
              contractors who want to run the company, not just the
              projects. Read the doctrine, follow the chapters, and
              listen to selected audio sections as you work.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12">
              <button
                onClick={handlePurchase}
                disabled={checkoutLoading || loading}
                className="pill-cta"
              >
                {checkoutLoading ? 'Loading…' : 'Get the Handbook — $47'}
              </button>

              <Link to="/preview">
                <button className="pill-cta pill-cta--ghost w-full">
                  <Eye className="w-4 h-4" />
                  Preview the Experience
                </button>
              </Link>
            </div>

            <div className="w-full h-px bg-foreground/15 mb-7" />

            {/* Feature row — 4 icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6">
              {[
                { Icon: Link2, label: 'Magic Link\nAccess', sub: 'Delivered instantly.\nYours to keep.' },
                { Icon: ListOrdered, label: 'Interactive\nTable of Contents', sub: 'Navigate the system.\nStay on track.' },
                { Icon: Headphones, label: 'Audio Chapters\nIncluded', sub: 'Listen while you work.\nBuilt for real life.' },
                { Icon: Infinity, label: 'Lifetime\nAccess', sub: 'One-time payment.\nLifetime updates.' },
              ].map(({ Icon, label, sub }, i) => (
                <div key={i}>
                  <Icon className="w-5 h-5 text-foreground/80 mb-3" strokeWidth={1.5} />
                  <p className="uppercase tracking-[0.18em] text-[10.5px] font-sans font-medium text-foreground whitespace-pre-line leading-snug">
                    {label}
                  </p>
                  <p className="font-sans text-[12px] text-foreground/60 mt-2 whitespace-pre-line leading-snug">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>




      {/* Pain Points Section */}
      <AnimatedSection className="py-24 px-6 border-t border-border">
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
            {['Constant schedule pressure', 'Start–stop work killing productivity', 'Margin erosion you can\'t fully explain', 'Owners dictating terms', 'Documentation that never quite "adds up"', 'Decisions made reactively, under stress'].map((item, i) => <li key={i} className="flex items-start gap-3 body-text opacity-70">
                <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                {item}
              </li>)}
          </ul>

          <div className="body-text space-y-2">
            <p className="opacity-70">You don't need more hustle.</p>
            <p className="opacity-70">You don't need another tactic.</p>
            <p className="body-text-emphasis text-xl">You need a system.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Why ALP Section */}
      <AnimatedSection className="py-24 px-6 bg-muted/30">
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
            {[{
            icon: Clock,
            text: 'Control time'
          }, {
            icon: Shield,
            text: 'Protect margin'
          }, {
            icon: Target,
            text: 'Enforce standards'
          }, {
            icon: TrendingUp,
            text: 'Monetize disruption'
          }, {
            icon: Zap,
            text: 'Scale without chaos'
          }].map(({
            icon: Icon,
            text
          }, i) => <li key={i} className="flex items-center gap-3 body-text">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                {text}
              </li>)}
          </ul>

          <p className="body-text-emphasis">This handbook is the codified version of that system.</p>
        </div>
      </AnimatedSection>

      {/* Operating System Section */}
      <AnimatedSection className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-6">
            This Is an Operating System — Not a Collection of Tips
          </h2>
          
          <p className="body-text opacity-80 mb-8">The ALP Handbook gives you:</p>

          <ul className="space-y-4 mb-10">
            {['A decision framework for operating under pressure', 'A time-control system using schedules and sequencing', 'A margin-protection model built around General Conditions', 'A documentation and entitlement framework that converts disruption into money', 'A leadership lens that enforces standards without micromanagement'].map((item, i) => <li key={i} className="flex items-start gap-3 body-text">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                {item}
              </li>)}
          </ul>

          <div className="body-text space-y-2">
            <p className="opacity-70">Every chapter connects.</p>
            <p className="opacity-70">Nothing is isolated.</p>
            <p className="body-text-emphasis text-xl">This is how order replaces chaos.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* What You Get Section */}
      <AnimatedSection className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] opacity-50 mb-4 font-sans text-center">
            What You're Getting
          </p>
          <h2 className="section-heading text-2xl md:text-3xl mb-4 text-center">
            A Premium Interactive Reading Experience
          </h2>
          <p className="body-text opacity-70 text-center mb-12 max-w-2xl mx-auto">
            This is not a PDF. Not a physical book. The ALP Handbook is a web-based digital experience you access instantly from any browser, on any device.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: '27 Chapters', desc: '26 chapters plus a final commitment chapter — a complete operating doctrine' },
              { icon: Monitor, title: 'Web-Based Experience', desc: 'Read in your browser on desktop, tablet, or phone — no downloads needed' },
              { icon: Palette, title: 'Dark & Light Mode', desc: 'Toggle between dark and light reading modes for comfortable reading' },
              { icon: Navigation, title: 'Chapter Navigation', desc: 'Floating table of contents and progress tracking for easy navigation' },
              { icon: Headphones, title: 'Audio Commentary', desc: 'Listen to audio commentary from Marshall Wilkinson on key chapters' },
              { icon: Infinity, title: 'Lifetime Access', desc: 'Purchase once, access forever — from any device with a browser' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="p-6 bg-muted/30 border border-border rounded-sm">
                <Icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="body-text-emphasis text-sm mb-2">{title}</h3>
                <p className="text-sm opacity-60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* What You'll Learn Section */}
      <AnimatedSection className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-8">
            Inside the ALP Handbook, You'll Learn How To:
          </h2>
          
          <ul className="grid md:grid-cols-2 gap-4 mb-10">
            {['Turn marketing into infrastructure, not desperation', 'Position yourself upstream so you\'re invited, not bid', 'Apply pressure correctly in sales and operations', 'Stop losing profit to General Conditions you don\'t control', 'Use schedules as financial weapons, not paperwork', 'Eliminate productivity loss from start–stop work', 'Document in real time so entitlement becomes provable', 'Make clean decisions under pressure using the ALP Decision Matrix', 'Scale revenue without losing standards, margin, or identity'].map((item, i) => <li key={i} className="flex items-start gap-3 body-text">
                <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                {item}
              </li>)}
          </ul>

          <div className="body-text space-y-2">
            <p className="opacity-70">This is not about working harder.</p>
            <p className="body-text-emphasis text-xl">It's about operating at a higher level.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Who This Is For Section */}
      <AnimatedSection className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-8">
            Who This Handbook Is For
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="body-text opacity-80 mb-4">This handbook is for:</p>
              <ul className="space-y-3">
                {['Owners and principals of contracting companies', 'Operators responsible for margin, time, and decisions', 'Contractors scaling past small-company chaos', 'Leaders who want command — not just growth'].map((item, i) => <li key={i} className="flex items-start gap-3 body-text">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>)}
              </ul>
            </div>

            <div>
              <p className="body-text opacity-80 mb-4">This is not for:</p>
              <ul className="space-y-3">
                {['Hobbyists', '"Try it and see" entrepreneurs', 'People looking for shortcuts', 'Anyone uncomfortable with responsibility'].map((item, i) => <li key={i} className="flex items-start gap-3 body-text opacity-60">
                    <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    {item}
                  </li>)}
              </ul>
            </div>
          </div>

          <p className="body-text-emphasis mt-10">
            ALP rewards operators who are willing to think clearly — and act decisively.
          </p>
        </div>
      </AnimatedSection>

      {/* Before/After Section */}
      <AnimatedSection className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-10 text-center">
            From Chaos to Control
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-background border border-border rounded-sm">
              <p className="text-sm uppercase tracking-widest opacity-50 mb-6">Before ALP</p>
              <ul className="space-y-3">
                {['Decisions are reactive', 'Time drifts', 'Margin leaks', 'Documentation is weak', 'Pressure controls you'].map((item, i) => <li key={i} className="flex items-center gap-3 body-text opacity-60">
                    <XCircle className="w-4 h-4 text-destructive shrink-0" />
                    {item}
                  </li>)}
              </ul>
            </div>

            <div className="p-8 bg-background border-2 border-primary rounded-sm">
              <p className="text-sm uppercase tracking-widest opacity-50 mb-6">After ALP</p>
              <ul className="space-y-3">
                {['Decisions are structured', 'Time is enforced', 'Margin is protected', 'Proof is built in real time', 'You control pressure'].map((item, i) => <li key={i} className="flex items-center gap-3 body-text">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </li>)}
              </ul>
            </div>
          </div>

          <p className="body-text-emphasis text-xl text-center mt-10">
            This handbook is the bridge.
          </p>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="section-heading text-2xl md:text-3xl mb-4 text-center">
            What Operators Are Saying
          </h2>
          <p className="body-text opacity-60 text-center mb-12">
            The Handbook is the foundation of everything these operators learned through ALP.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => <div key={i} className="relative p-8 bg-muted/30 border border-border rounded-sm">
                <Quote className="w-8 h-8 text-primary/20 absolute top-6 left-6" />
                <blockquote className="body-text opacity-80 mb-6 pt-6 relative z-10">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border pt-4">
                  <p className="body-text-emphasis text-sm">{testimonial.name}</p>
                  <p className="text-sm opacity-50">{testimonial.company}</p>
                </div>
              </div>)}
          </div>
        </div>
      </AnimatedSection>

      {/* Author Bio Section */}
      <AnimatedSection className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <img src={marshallPhoto} alt="Marshall Wilkinson" className="w-64 lg:w-full max-w-xs rounded-sm shadow-xl" />
            </div>
            
            <div className="lg:col-span-2">
              <h2 className="section-heading text-2xl md:text-3xl mb-6">
                About the Author
              </h2>
              
              <div className="body-text space-y-5 opacity-80">
                <p>
                  Marshall Wilkinson is a second-generation contractor, construction executive, and entrepreneur with over two decades of experience operating at the highest levels of the construction industry.
                </p>
                
                <p>
                  Over the course of his career, Marshall has executed and advised on more than <span className="body-text-emphasis">$2.5 billion in New York City public works construction</span>, spanning complex infrastructure, municipal projects, and large-scale commercial work. His experience extends beyond execution into the legal, contractual, and strategic dimensions of construction — where real leverage is created or lost.
                </p>
                
                <p>
                  Marshall is also responsible for the <span className="body-text-emphasis">largest construction delay claim settlement in the City of New York</span>, a distinction earned not through litigation theatrics, but through disciplined documentation, schedule control, entitlement strategy, and relentless command of facts. That outcome was the product of systems — not luck.
                </p>
                
                <p>
                  Raised inside the construction business, Marshall was immersed in estimating, operations, scheduling, contracts, and negotiation from an early age. As his career progressed, he recognized a consistent pattern: contractors rarely fail because they lack effort or technical skill — they fail because they lack an operating system that holds under pressure.
                </p>
                
                <p>
                  That realization led to the creation of <span className="body-text-emphasis">ALP (Altitude, Logic, Pressure)</span> — an entrepreneurial operating framework designed to help contractors think clearly, decide decisively, and scale without losing control. ALP is not theory. It is a codified system built from real jobs, real disputes, real negotiations, and real consequences.
                </p>
                
                <p>
                  Today, Marshall mentors contractors, founders, and operators who want more than growth — they want control, leverage, and durability. His work focuses on turning chaos into structure, disruption into entitlement, and pressure into clarity.
                </p>
                
                <p className="body-text-emphasis text-lg pt-2">
                  The ALP Handbook is the culmination of that experience — a practical operating system for contractors who intend to play at the highest level and stay there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Not Best Practices Section */}
      <AnimatedSection className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-heading text-2xl md:text-3xl mb-6">
            This Handbook Doesn't Teach "Best Practices"
          </h2>
          
          <p className="body-text-emphasis text-xl mb-8">It teaches operating principles.</p>
          
          <p className="body-text opacity-80 mb-6">The kind that:</p>
          
          <ul className="inline-block text-left space-y-3 mb-10">
            {['Hold up under dispute', 'Work when things go wrong', 'Protect you when pressure rises'].map((item, i) => <li key={i} className="flex items-center gap-3 body-text">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                {item}
              </li>)}
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
      </AnimatedSection>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="handbook-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8">
            Get the ALP Handbook
          </h2>
          
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 opacity-90">
            <p className="text-base sm:text-lg">This is not a book you read once.</p>
            <p className="text-base sm:text-lg font-medium">
              It's a reference you return to — in real time, while decisions are being made.
            </p>
          </div>

          <p className="opacity-90 mb-4 sm:mb-6 text-sm sm:text-base">If you're ready to:</p>
          
          <ul className="inline-block text-left space-y-2 mb-8 sm:mb-10 text-sm sm:text-base">
            <li className="flex items-center gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              Stop reacting
            </li>
            <li className="flex items-center gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              Stop leaking margin
            </li>
            <li className="flex items-center gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              Stop operating from stress
            </li>
          </ul>

          <p className="text-lg sm:text-xl font-medium mb-8 sm:mb-10">Then it's time to operate with ALP.</p>

          <div className="flex flex-col gap-4 justify-center items-center px-4 sm:px-0">
            <Button onClick={handlePurchase} disabled={checkoutLoading || loading} size="lg" variant="secondary" className="font-sans uppercase tracking-widest text-sm sm:text-base lg:text-lg px-6 sm:px-10 py-5 sm:py-6 w-full sm:w-auto">
              {checkoutLoading ? 'Loading...' : 'Get Immediate Access — $47'}
            </Button>
            
            <Link to="/preview">
              <Button variant="ghost" size="sm" className="font-sans uppercase tracking-widest text-xs text-[hsl(var(--brand-accent))] hover:text-[hsl(var(--brand-accent))] hover:opacity-80">
                <Eye className="w-4 h-4 mr-2" />
                Preview First
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm opacity-70">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Interactive Web Experience</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Infinity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Lifetime Access</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>One-Time Payment</span>
            </div>
          </div>

          {!user && <p className="mt-6 text-sm opacity-70">
              Already purchased?{' '}
              <Link to="/auth" className="underline hover:opacity-80">
                Sign in to access
              </Link>
            </p>}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-border">
        <p className="text-sm uppercase tracking-[0.2em] opacity-40 mb-4">
          The ALP Handbook
        </p>
        <p className="text-sm opacity-30 mb-6">
          © Marshall Wilkinson
        </p>
        <div className="flex justify-center gap-6 text-xs opacity-40">
          <Link to="/refund-policy" className="hover:opacity-70 underline">Refund Policy</Link>
          <Link to="/privacy-policy" className="hover:opacity-70 underline">Privacy Policy</Link>
        </div>
      </footer>

      <StickyPreviewButton />
    </div>;
};
export default SalesPage;