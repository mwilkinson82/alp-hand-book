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
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
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
      <section className="lg:hidden relative pt-16 sm:pt-20 pb-12 px-5 sm:px-6 overflow-hidden">
        <div className="max-w-[640px] mx-auto">




          {/* Campaign headline — short and memorable, editorial breathing */}
          <h1
            className="font-serif text-foreground"
            style={{
              fontWeight: 400,
              fontSize: 'clamp(50px, 12vw, 64px)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              maxWidth: '10.5ch',
            }}
          >
            Build the company<br />behind the projects.
          </h1>

          <p className="font-sans text-[15px] text-foreground/75 leading-snug max-w-[34ch] mt-4 mb-5">
            A field manual for contractors who want to stop running the business
            from memory, pressure, and reaction.
          </p>

          {/* Primary CTA + light secondary link */}
          <div className="flex flex-col items-start gap-1.5 mb-4">
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
              className="self-center inline-flex items-center gap-1.5 text-[12px] font-sans text-foreground/60 hover:text-foreground transition-colors mt-1"
            >
              <Eye className="w-3 h-3" />
              Preview the experience →
            </Link>
          </div>


          {/* Proof object — compact handbook card (top peeks into first viewport) */}
          <div className="mt-1 mb-8">
            <p className="uppercase tracking-[0.24em] text-[9px] font-mono text-foreground/50 mb-2">
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

          {/* Secondary copy — moved below mockup */}
          <p className="font-sans text-[14px] text-foreground/65 leading-snug max-w-[38ch] mt-6">
            Read the doctrine. Follow the chapters. Listen to selected audio
            sections while you work.
          </p>

          {/* Feature chips — hidden on first viewport, appear below the mockup */}
          <div className="hidden sm:flex flex-wrap gap-2 mt-5">
            {[
              'Field Manual Format',
              'AOS Edition',
              'Audio Chapters',
              'Lifetime Access',
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
              A field manual for contractors who want to stop running the
              business from memory, pressure, and reaction. It shows you how to
              think, decide, document, lead, and operate with control.
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
              { Icon: BookOpen, label: 'Field Manual\nFormat', sub: 'Built to use during\nreal decisions.' },
              { Icon: ListOrdered, label: 'AOS\nEdition', sub: 'Includes the operating-\nsystem section.' },
              { Icon: Headphones, label: 'Audio\nChapters', sub: 'Listen while\nyou work.' },
              { Icon: Infinity, label: 'Lifetime\nAccess', sub: 'One payment.\nKeep the system.' },
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




      {/* ============================================================
          2 — THE PROBLEM
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-8">The Problem</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-10 max-w-[18ch]">
            The project is not the business.
          </h2>
          <div className="body-text space-y-5 text-foreground/80">
            <p>Most contractors are good at the work.</p>
            <p>That is not the problem.</p>
            <p>The problem is the company behind the work.</p>
            <p>
              The owner carries the standards. The owner remembers the details.
              The owner catches the mistakes. The owner solves the people
              problems. The owner protects the margin. The owner keeps the
              pressure moving.
            </p>
            <p>That may feel like leadership.</p>
            <p>Eventually, it becomes the ceiling.</p>
            <p className="body-text-emphasis pt-2">
              If everything still flows back to you, you do not have a scalable
              company yet. You have owner dependency.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          3 — THE PAIN
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-8">The Pain</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-10 max-w-[18ch]">
            Growth does not fix disorder.
          </h2>
          <p className="body-text text-foreground/80 mb-8">
            More revenue will not save a weak operating model. It usually
            exposes it.
          </p>
          <ul className="space-y-3 mb-10">
            {[
              'More jobs create more friction.',
              'More people create more handoffs.',
              'More revenue creates more cash pressure.',
              'More clients create more disruption.',
              'More complexity creates more owner dependency.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 body-text text-foreground/80">
                <span className="text-foreground/40 font-mono text-sm pt-1.5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="body-text space-y-3 text-foreground/80">
            <p>
              If the company has no operating system, growth only gives the
              chaos more room to spread.
            </p>
            <p>You do not need more hustle.</p>
            <p className="body-text-emphasis">You need control.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          4 — THE SHIFT
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-8">The Shift</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-10 max-w-[18ch]">
            From hierarchy to accountability.
          </h2>
          <div className="body-text space-y-5 text-foreground/80">
            <p>Contracting needs chain of command.</p>
            <p>But hierarchy alone does not create accountability.</p>
            <p>
              Hierarchy says who reports to who.
              <br />
              Accountability says who owns the result.
            </p>
            <p>
              The ALP Handbook shows you how to move the company from
              personality pressure into system pressure: roles, scorecards,
              priorities, issue solving, documentation, standards, and weekly
              execution.
            </p>
            <p className="body-text-emphasis pt-2">
              That is how the business starts policing itself. Not through
              speeches. Through structure.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          5 — WHAT THE HANDBOOK IS
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-8">What The Handbook Is</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-10 max-w-[18ch]">
            Operating doctrine for contractors.
          </h2>
          <div className="body-text space-y-5 text-foreground/80 mb-12">
            <p>This is not a book of tips.</p>
            <p>
              It is a field manual for running a contracting company under
              pressure.
            </p>
            <p>Inside, you get the ALP framework:</p>
          </div>

          <div className="space-y-6 mb-12">
            {[
              { k: 'Altitude', v: 'Get above the chaos and see the real business problem.' },
              { k: 'Logic', v: 'Decide from facts, math, contracts, sequence, and consequence.' },
              { k: 'Pressure', v: 'Apply force in the right place at the right time.' },
            ].map(({ k, v }, i) => (
              <div key={i} className="border-l-2 border-foreground/30 pl-5">
                <p className="font-serif text-2xl md:text-3xl text-foreground mb-1">{k}</p>
                <p className="body-text text-foreground/75">{v}</p>
              </div>
            ))}
          </div>

          <p className="body-text text-foreground/80 mb-6">
            And in the second edition, you get the operating-system doctrine:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mb-12">
            {['Vision', 'People', 'Data', 'Issues', 'Process', 'Traction'].map((label, i) => (
              <p key={i} className="font-serif text-xl text-foreground/85">
                {label}
              </p>
            ))}
          </div>

          <p className="body-text-emphasis text-xl">
            Build a company that can execute without everything depending on
            the owner.
          </p>
        </div>
      </AnimatedSection>

      {/* ============================================================
          6 — USE CASE
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-8">Use Case</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-10 max-w-[18ch]">
            Use it when pressure shows up.
          </h2>
          <p className="body-text text-foreground/80 mb-8">Use the handbook when:</p>
          <ul className="space-y-3 mb-10">
            {[
              'A project is slipping.',
              'Margin is disappearing.',
              'Change orders are stacking up.',
              'Documentation is weak.',
              'Cash is tight.',
              'The team is waiting on the owner.',
              'A client is dictating the terms.',
              'The company is growing but getting harder to control.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 body-text text-foreground/80">
                <span className="text-foreground/30 pt-1.5 shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="body-text space-y-3 text-foreground/80">
            <p>This is not a book you read once.</p>
            <p className="body-text-emphasis">
              It is a reference you return to while decisions are being made.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          7 — WHAT CHANGES
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-8">What Changes</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-14 max-w-[20ch]">
            What changes when you operate with ALP.
          </h2>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 mb-12">
            {[
              {
                title: 'Run the Company',
                items: [
                  'Stop running the company from the owner\u2019s memory.',
                  'Build scorecards, roles, Rocks, issues, process, and weekly execution.',
                  'Turn recurring friction into systems.',
                ],
              },
              {
                title: 'Protect the Money',
                items: [
                  'Protect margin before the job starts leaking.',
                  'Use documentation as proof, not paperwork.',
                  'Monetize disruption instead of absorbing it.',
                ],
              },
              {
                title: 'Control the Work',
                items: [
                  'Control time through schedules, notices, and sequence.',
                  'Position upstream so you are invited, not just bid.',
                  'Sell with pressure, clarity, and qualification.',
                ],
              },
              {
                title: 'Lead Under Pressure',
                items: [
                  'Build systems that remove the owner from every decision.',
                  'Scale without losing standards, margin, or identity.',
                ],
              },
            ].map(({ title, items }, i) => (
              <div key={i}>
                <p className="font-serif text-2xl md:text-3xl mb-5 text-foreground">{title}</p>
                <ul className="space-y-3">
                  {items.map((it, j) => (
                    <li key={j} className="flex items-start gap-3 body-text text-foreground/80">
                      <span className="text-foreground/30 pt-1.5 shrink-0">—</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="body-text space-y-2 text-foreground/80 pt-4 border-t border-border">
            <p className="pt-6">The point is not to work harder.</p>
            <p className="body-text-emphasis">The point is to operate better.</p>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          8 — AOS EDITION
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow eyebrow--accent mb-8">AOS Edition</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-10 max-w-[20ch]">
            The missing piece: the operating system.
          </h2>
          <div className="body-text space-y-5 text-foreground/80 mb-14 max-w-3xl">
            <p>The first edition gave contractors the doctrine.</p>
            <p>The second edition adds the operating system.</p>
            <p>
              A contracting company cannot scale on the owner&rsquo;s memory,
              urgency, and personal judgment forever. It needs a formal way to
              define the mission, assign ownership, measure execution, solve
              issues, document processes, and enforce weekly accountability.
            </p>
            <p className="body-text-emphasis">That is AOS.</p>
            <p>
              The ALP Handbook explains why the operating system matters. The
              AOS application gives the company a place to run it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {[
              { k: 'Vision', q: 'Where are we going?' },
              { k: 'People', q: 'Who owns what?' },
              { k: 'Data', q: 'What numbers tell the truth?' },
              { k: 'Issues', q: 'What problems need to be solved permanently?' },
              { k: 'Process', q: 'How do we do things here?' },
              { k: 'Traction', q: 'What must be executed this week?' },
            ].map(({ k, q }, i) => (
              <div key={i} className="bg-background p-7">
                <p className="uppercase tracking-[0.22em] text-[10px] font-mono text-foreground/50 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="font-serif text-2xl text-foreground mb-2">{k}</p>
                <p className="body-text text-foreground/70 text-base">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          9 — WHO IT IS FOR
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow mb-8">Who It Is For</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-12 max-w-[18ch]">
            For operators, not spectators.
          </h2>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <p className="uppercase tracking-[0.22em] text-[11px] font-mono text-foreground/60 mb-5">
                This handbook is for
              </p>
              <ul className="space-y-3">
                {[
                  'Contractor owners',
                  'Principals',
                  'Operators',
                  'Project executives',
                  'Estimators moving into leadership',
                  'Builders scaling past small-company chaos',
                  'Anyone responsible for time, margin, people, standards, and decisions',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 body-text text-foreground/85">
                    <CheckCircle2 className="w-4 h-4 text-foreground shrink-0 mt-2" strokeWidth={1.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="uppercase tracking-[0.22em] text-[11px] font-mono text-foreground/60 mb-5">
                This is not for
              </p>
              <ul className="space-y-3">
                {[
                  'People looking for shortcuts',
                  'Owners who want sympathy more than truth',
                  'Teams that refuse accountability',
                  'Contractors who want growth without discipline',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 body-text text-foreground/55">
                    <XCircle className="w-4 h-4 text-foreground/40 shrink-0 mt-2" strokeWidth={1.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="body-text-emphasis mt-12 pt-8 border-t border-border">
            ALP rewards clear thinking and decisive action.
          </p>
        </div>
      </AnimatedSection>

      {/* ============================================================
          10 — ABOUT / PROOF
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-8">About / Proof</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-12 max-w-[22ch]">
            Written by someone who has lived the pressure.
          </h2>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <img
                src={marshallPhoto}
                alt="Marshall Wilkinson"
                className="w-64 lg:w-full max-w-xs rounded-sm shadow-xl"
              />
            </div>
            <div className="lg:col-span-2 body-text space-y-5 text-foreground/80">
              <p>
                Marshall Wilkinson is a second-generation contractor,
                construction executive, and entrepreneur with more than two
                decades of experience inside high-stakes construction.
              </p>
              <p>
                He has executed and advised on more than{' '}
                <span className="body-text-emphasis">
                  $2.5 billion in New York City public works construction
                </span>
                , spanning infrastructure, municipal, and large-scale
                commercial work.
              </p>
              <p>
                His work sits at the intersection of operations, contracts,
                scheduling, entitlement, documentation, negotiation, and
                company-building.
              </p>
              <p>
                ALP was built from real jobs, real disputes, real pressure, and
                real consequences.
              </p>
              <p className="body-text-emphasis pt-2">
                Not theory. Not classroom advice. Field-tested operating
                doctrine.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          11 — TESTIMONIALS (top 2 only)
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-8">Testimonials</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-4 max-w-[18ch]">
            Operators recognize operators.
          </h2>
          <p className="font-serif italic text-xl md:text-2xl text-foreground/70 mb-14 max-w-[40ch]">
            &ldquo;The language is direct because the results are real.&rdquo;
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.slice(0, 2).map((t, i) => (
              <div key={i} className="relative p-8 bg-background border border-border rounded-sm">
                <Quote className="w-8 h-8 text-primary/20 absolute top-6 left-6" />
                <blockquote className="body-text text-foreground/85 mb-6 pt-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="border-t border-border pt-4">
                  <p className="body-text-emphasis text-sm">{t.name}</p>
                  <p className="text-sm opacity-50">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          12 — PRODUCT / ACCESS
          ============================================================ */}
      <AnimatedSection className="py-24 sm:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-8">Product / Access</p>
          <h2 className="section-heading text-3xl md:text-5xl mb-12 max-w-[14ch]">
            What you get.
          </h2>

          <ul className="divide-y divide-border border-y border-border">
            {[
              '26 chapters plus final commitment section',
              'AOS second-edition operating-system section',
              'Interactive web reading experience',
              'Mobile, tablet, and desktop access',
              'Floating table of contents',
              'Progress tracking',
              'Light and dark reading modes',
              'Selected audio chapters',
              'Lifetime access',
            ].map((item, i) => (
              <li key={i} className="flex items-baseline gap-6 py-4">
                <span className="font-mono text-xs text-foreground/40 w-8 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="body-text text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>

          <div className="body-text space-y-2 text-foreground/80 mt-10">
            <p>This is not a PDF download.</p>
            <p className="body-text-emphasis">
              It is a digital handbook built to be used in real time.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* ============================================================
          13 — FINAL CTA
          ============================================================ */}
      <section className="py-20 sm:py-28 lg:py-32 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <p className="uppercase tracking-[0.28em] text-[11px] font-mono text-primary-foreground/60 mb-8">
            Final
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.02em] mb-10">
            Get the ALP Handbook.
          </h2>

          <div className="space-y-4 mb-12 text-primary-foreground/85 max-w-[42ch] mx-auto">
            <p className="text-lg sm:text-xl">Build the company behind the projects.</p>
            <p className="text-base sm:text-lg">
              Use the handbook when pressure rises, decisions matter, and the
              business needs to operate with more control.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handlePurchase}
              disabled={checkoutLoading || loading}
              className="pill-cta"
              style={{
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
              }}
            >
              {checkoutLoading ? 'Loading…' : 'Get Immediate Access — $47'}
            </button>

            <Link
              to="/preview"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] font-sans text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview First
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-primary-foreground/15">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-mono text-primary-foreground/55">
              Interactive handbook · AOS edition · Audio chapters · Lifetime access
            </p>
          </div>

          {!user && (
            <p className="mt-8 text-sm text-primary-foreground/60">
              Already purchased?{' '}
              <Link to="/auth" className="underline hover:text-primary-foreground">
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