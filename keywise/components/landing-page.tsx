'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { HowItWorksTimeline } from './ui/HowItWorksTimeline';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [prompt, setPrompt] = useState(
    "Create a polished real estate listing for a charming 4-bedroom Tudor Revival home with updated kitchen, mature landscaping, and spacious family spaces."
  );
  const [listingGenerated, setListingGenerated] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState<
    'description' | 'social' | 'openHouse'
  >('description');

  const outputContent = {
    description:
      'This beautifully maintained 4-bedroom Tudor Revival home blends classic craftsmanship with modern comfort. Updated systems, a remodeled kitchen, and mature landscaping create an inviting retreat for today\'s buyer. Spacious living areas and elegant details make this property ideal for families who want effortless style and move-in readiness.',
    social:
      'Sell your home with confidence: polished listing copy for a charming 4-bed Tudor Revival with an updated kitchen, lush landscaping, and room for family memories. Ready to use in social posts, email campaigns, and online listings.',
    openHouse:
      'Open house preview: Explore this beautiful Tudor Revival with timeless character, modern updates, and a welcoming yard. Perfect for buyers seeking charm, quality, and a family-friendly layout.',
  };

  const handleGenerateListing = () => {
    setListingGenerated(true);
    setActiveOutputTab('description');
  };

  const faqItems = [
    {
      id: 1,
      question: 'Is KeyWise a real estate agent?',
      answer:
        'No. KeyWise is a marketing and education tool for homeowners. We help you create professional materials and understand the selling process. For legal or financial decisions, you should consult licensed professionals.',
    },
    {
      id: 2,
      question: 'Does KeyWise provide legal or financial advice?',
      answer:
        'No. KeyWise is designed to help with content creation and learning about the home selling process. For legal, tax, or financial guidance, please consult appropriate professionals.',
    },
    {
      id: 3,
      question: 'Can I edit and customize the content?',
      answer:
        'Absolutely. Everything KeyWise generates is a starting point. You have full control to edit, refine, and customize all content to match your home and preferences perfectly.',
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full">
      {/* ========== HEADER / NAVBAR ========== */}
      <header className="fixed top-0 w-full kw-bg backdrop-blur-sm border-b kw-border z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 kw-primary-text" />
              <span className="font-bold text-lg kw-text">KeyWise</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm transition kw-link"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm transition kw-link"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm transition kw-link"
              >
                FAQs
              </button>
              <a href="/sign-in?redirect_url=/dashboard" className="text-sm transition kw-link">
                Sign In
              </a>
              <a href="/sign-in?redirect_url=/dashboard">
                <Button className="kw-primary text-sm py-2 px-6">Get Started</Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 kw-text" />
              ) : (
                <Menu className="w-6 h-6 kw-text" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t kw-border space-y-3">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left py-2 text-sm kw-link"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left py-2 text-sm kw-link"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left py-2 text-sm kw-link"
              >
                FAQs
              </button>
              <a href="/sign-in?redirect_url=/dashboard" className="block w-full text-left py-2 text-sm kw-link">
                Sign In
              </a>
              <a href="/sign-in?redirect_url=/dashboard" className="w-full">
                <Button className="w-full kw-primary">Get Started</Button>
              </a>
            </div>
          )}
        </nav>
      </header>

      {/* ========== HERO SECTION ========== */}
      <main>
        <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 kw-bg">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold leading-tight kw-text">
                  Sell your home.
                  <br />
                  Keep more of what's yours.
                </h1>
                <p className="text-lg sm:text-xl kw-muted leading-relaxed">
                  KeyWise creates polished listings and marketing for your
                  home, using AI behind the scenes. No complexity. Just
                  results.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <a href="/sign-in?redirect_url=/dashboard">
                  <Button className="px-8 py-3 text-base font-semibold kw-primary rounded-lg transition">Get Started</Button>
                </a>
                <Button
                  variant="outline"
                  className="px-8 py-3 text-base font-semibold kw-text border-2 kw-border hover:kw-border rounded-lg transition"
                  onClick={() => scrollToSection('see-it-in-action')}
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>



        {/* ========== WHY IT'S HARD SECTION ========== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 kw-bg">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold kw-text mb-4">
                Selling well takes time and skill.
              </h2>
              <p className="text-lg kw-muted max-w-2xl mx-auto">
                Most homeowners struggle to present their property
                professionally. Marketing materials often feel rushed or
                generic, leaving money on the table.
              </p>
            </div>

            {/* Problem Points Grid - No Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x kw-border">
              {/* Point 1: High Costs */}
              <div className="p-8 md:px-12">
                <h3 className="text-lg font-semibold kw-text mb-3">
                  High Costs
                </h3>
                <p className="kw-muted leading-relaxed">
                  Traditional commissions can cost tens of thousands in lost
                  equity.
                </p>
              </div>

              {/* Point 2: Time Investment */}
              <div className="p-8 md:px-12">
                <h3 className="text-lg font-semibold kw-text mb-3">
                  Time Investment
                </h3>
                <p className="kw-muted leading-relaxed">
                  Creating professional descriptions and marketing materials
                  takes hours of work.
                </p>
              </div>

              {/* Point 3: Uncertainty */}
              <div className="p-8 md:px-12">
                <h3 className="text-lg font-semibold kw-text mb-3">
                  Uncertainty
                </h3>
                <p className="kw-muted leading-relaxed">
                  Without professional guidance, it's hard to know if you're
                  presenting your home effectively.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== HOW IT WORKS SECTION ========== */}
        <HowItWorksTimeline/>

        {/* ========== FEATURES SECTION ========== */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 kw-bg">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold kw-text mb-4">
                How KeyWise Helps
              </h2>
              <p className="text-lg kw-muted max-w-2xl mx-auto">
                We handle the heavy lifting, so you can focus on selling.
              </p>
            </div>

            {/* 2x2 Feature Grid - Simplified */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Feature 1: Listing Generator */}
              <div>
                <h3 className="text-lg font-semibold kw-text mb-3">
                  Professional Listings
                </h3>
                <p className="kw-muted leading-relaxed">
                  Generate MLS-ready descriptions in seconds. Highlight your
                  home's best features with polished copy that attracts serious
                  buyers.
                </p>
              </div>

              {/* Feature 2: Marketing Content */}
              <div>
                <h3 className="text-lg font-semibold kw-text mb-3">
                  Social Marketing
                </h3>
                <p className="kw-muted leading-relaxed">
                  Create polished posts for Facebook, Instagram, and open
                  houses. Expand your audience beyond traditional MLS listings.
                </p>
              </div>

              {/* Feature 3: Staging Recommendations */}
              <div>
                <h3 className="text-lg font-semibold kw-text mb-3">
                  Staging Guidance
                </h3>
                <p className="kw-muted leading-relaxed">
                  Get personalized suggestions based on your home's photos.
                  Improve presentation without guesswork or expensive
                  consultation.
                </p>
              </div>

              {/* Feature 4: Educational Assistant */}
              <div>
                <h3 className="text-lg font-semibold kw-text mb-3">
                  Learning Resource
                </h3>
                <p className="kw-muted leading-relaxed">
                  Ask questions about the selling process and gain confidence.
                  We provide guidance to help you make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== DEMO / EXAMPLE SECTION ========== */}
        <section id="see-it-in-action" className="py-20 px-4 sm:px-6 lg:px-8 kw-bg">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold kw-text">
                See It In Action
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg kw-muted">
                Enter a real seller-style prompt and watch KeyWise transform it
                into polished listing copy instantly.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Left: Prompt */}
              <div className="space-y-6">
                <div className="rounded-3xl border kw-border kw-card p-6 shadow-sm">
                  <p className="text-xs font-semibold kw-muted-2 uppercase tracking-wide mb-4">
                    What you might type
                  </p>
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={8}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-900 shadow-sm focus:border-kw-primary focus:outline-none focus:ring-2 focus:ring-kw-primary/20"
                  />
                </div>

                <Button
                  onClick={handleGenerateListing}
                  className="kw-primary w-full text-base py-4 font-semibold"
                >
                  Generate Listing
                </Button>
              </div>

              {/* Right: Output */}
              <div>
                <Card className="rounded-3xl border kw-border kw-card p-6 shadow-sm min-h-[320px]">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold kw-muted-2 uppercase tracking-wide">
                        What KeyWise generates
                      </p>
                      <h3 className="text-xl font-semibold kw-text mt-2">
                        Live demo output
                      </h3>
                    </div>
                    <span className="rounded-full border border-kw-border bg-slate-50 px-3 py-1 text-xs font-semibold text-gray-700">
                      4 Beds • 3 Baths • 2,600 Sq Ft
                    </span>
                  </div>

                  {/* Tabs – ALWAYS visible */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {['description', 'social', 'openHouse'].map((tab) => {
                      const label =
                        tab === 'description'
                          ? 'Listing description'
                          : tab === 'social'
                          ? 'Social post'
                          : 'Open house blurb';
                      const isActive = activeOutputTab === tab;

                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveOutputTab(tab as typeof activeOutputTab)}
                          className={
                            'rounded-full border px-4 py-2 text-sm font-medium transition-transform duration-200 ' +
                            (isActive
                              ? 'shadow-md scale-105'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300')
                          }
                          style={
                            isActive
                              ? {
                                  backgroundColor: 'var(--primary)',
                                  borderColor: 'var(--primary)',
                                  color: '#ffffff',
                                }
                              : undefined
                          }
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>


                  {/* Content – swaps between placeholder and generated output */}
                  {!listingGenerated ? (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500 transition">
                      <p className="text-base font-medium">
                        Click “Generate Listing” to see the listing output.
                      </p>
                      <p className="mt-3 text-sm">
                        We’ll show the listing copy, social post, and open house
                        blurb right here.
                      </p>
                    </div>
                  ) : (
                    <div className="transition duration-500 ease-out">
                      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                              {activeOutputTab === "description"
                                ? "Listing description"
                                : activeOutputTab === "social"
                                ? "Social post"
                                : "Open house blurb"}
                            </h4>
                            <p className="mt-2 text-xs text-gray-500">
                              {activeOutputTab === "description"
                                ? "A polished listing description pulled from your prompt."
                                : activeOutputTab === "social"
                                ? "A short post you can use for social media."
                                : "A quick open house teaser for interested buyers."}
                            </p>
                          </div>
                          <span className="rounded-full bg-kw-primary px-3 py-1 text-xs font-semibold text-white">
                            Selected
                          </span>
                        </div>
                        <p className="mt-5 text-sm text-gray-700 leading-relaxed">
                          {outputContent[activeOutputTab]}
                        </p>
                      </div>
                      <div className="mt-2 border-t border-gray-200 pt-5 text-xs text-gray-500">
                        Generated from your prompt in seconds.
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ========== FAQ SECTION ========== */}
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 kw-bag">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold kw-text">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setOpenFaqId((current) => (current === item.id ? null : item.id))
                    }
                    className="w-full text-left rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between p-6">
                      <span className="text-base font-semibold text-gray-900">
                        {item.question}
                      </span>
                      <span className="text-xl font-bold text-gray-500">
                        {isOpen ? '−' : '+'}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========== FINAL CTA SECTION ========== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 kw-bg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold kw-text mb-6">
              Ready to sell smarter?
            </h2>
            <p className="text-xl sm:text-2xl mb-10 kw-muted max-w-2xl mx-auto leading-relaxed">
              Generate professional real estate marketing materials in minutes.
            </p>
            <a href="/sign-in?redirect_url=/dashboard">
              <Button className="px-8 py-3 text-base font-semibold kw-primary rounded-lg transition">Get Started</Button>
            </a>
          </div>
        </section>
        </main>


      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-950 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 kw-primary-text" />
                <span className="font-semibold text-white text-sm">KeyWise</span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered real estate marketing for homeowners.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Sign In
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-xs text-gray-500">
              KeyWise is an educational tool and does not provide legal or financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
