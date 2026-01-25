import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/AnimatedSection';
import StickyPreviewButton from '@/components/handbook/StickyPreviewButton';
import bookCover from '@/assets/book-cover.png';
import marshallPhoto from '@/assets/marshall-wilkinson.png';
import { Eye, CheckCircle2, XCircle, ArrowRight, Target, Shield, Clock, TrendingUp, FileText, Zap, Moon, Sun, Quote, Lock, CreditCard } from 'lucide-react';
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

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-60px)] lg:min-h-screen flex items-center justify-center pt-16 lg:pt-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-8">
          <div className="order-2 lg:order-1">
            <p className="text-sm uppercase tracking-[0.3em] opacity-50 mb-6 font-sans">
              The Operating Doctrine
            </p>
            <h1 className="handbook-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">
              THE ALP HANDBOOK
            </h1>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed font-medium md:text-3xl text-[hsl(var(--brand-accent))]">
              To Operating a Top-Tier Contracting Company     
            </p>
            
            <div className="body-text space-y-3 sm:space-y-4 mb-8 sm:mb-10 opacity-70">
              <p>Most contractors don't fail because they lack skill.</p>
              <p className="body-text-emphasis text-foreground opacity-100">They fail because they lack command.</p>
            </div>

            <p className="body-text mb-6 sm:mb-8 opacity-70 text-sm sm:text-base">
              The ALP Handbook is a practical, field-tested operating system for contractors who want to scale revenue, protect margin, and regain control — without chaos, burnout, or constant firefighting.
            </p>

            <div className="space-y-1 sm:space-y-2 mb-8 sm:mb-10">
              <p className="body-text opacity-60 text-sm sm:text-base">This is not motivation.</p>
              <p className="body-text opacity-60 text-sm sm:text-base">This is not theory.</p>
              <p className="body-text-emphasis text-sm sm:text-base">This is how top-tier operators actually run their businesses.</p>
            </div>

            <p className="text-xs sm:text-sm uppercase tracking-widest opacity-50 mb-6 sm:mb-8">By Marshall Wilkinson</p>

            <div className="flex flex-col gap-3 sm:gap-4">
              <Button onClick={handlePurchase} disabled={checkoutLoading || loading} size="lg" className="font-sans uppercase tracking-widest text-sm sm:text-base w-full sm:w-auto">
                {checkoutLoading ? 'Loading...' : 'Get the Handbook — $47'}
              </Button>
              
              
              <Link to="/preview" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="font-sans uppercase tracking-widest w-full animate-pulse border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm sm:text-base">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Experience
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 sm:mt-6 text-xs sm:text-sm opacity-60">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>One-Time Payment</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <img src={bookCover} alt="The ALP Handbook by Marshall Wilkinson" className="max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md w-full h-auto shadow-2xl rounded-sm" />
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
            Real results from contractors who operate with ALP
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
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Secure Checkout</span>
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
        <p className="text-sm opacity-30">
          © Marshall Wilkinson
        </p>
      </footer>

      <StickyPreviewButton />
    </div>;
};
export default SalesPage;