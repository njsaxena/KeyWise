'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                Pricing
              </button>
              <button className="text-sm transition kw-link">Sign In</button>
              <Button className="kw-primary text-sm py-2 px-6">
                Get Started
              </Button>
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
                Pricing
              </button>
              <button className="block w-full text-left py-2 text-sm kw-link">
                Sign In
              </button>
              <Button className="w-full kw-primary">Get Started</Button>
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
                <Button className="px-8 py-3 text-base font-semibold kw-primary rounded-lg transition">
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-3 text-base font-semibold kw-text border-2 kw-border hover:kw-border rounded-lg transition"
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
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 kw-bg">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold kw-text">
                How It Works
              </h2>
            </div>

            {/* Three Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {/* Step 1 */}
              <div className="relative">
                <Card className="p-8 rounded-xl border kw-border kw-card h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full kw-primary text-white flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold kw-text mb-4">
                    Upload Your Home
                  </h3>
                  <ul className="space-y-2 kw-muted text-sm">
                    <li className="flex items-start gap-2">
                      <span className="kw-muted-2 mt-0.5">•</span>
                      <span>Photos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Square footage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Bedrooms &amp; bathrooms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Property details</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <Card className="p-8 rounded-xl border kw-border kw-card h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full kw-primary text-white flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold kw-text mb-4">
                    AI Analyzes Your Property
                  </h3>
                  <ul className="space-y-2 kw-muted text-sm">
                    <li className="flex items-start gap-2">
                      <span className="kw-muted-2 mt-0.5">•</span>
                      <span>Generate descriptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Marketing content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Staging recommendations</span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Step 3 */}
              <div>
                <Card className="p-8 rounded-xl border kw-border kw-card h-full">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full kw-primary text-white flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold kw-text mb-4">
                    Review &amp; Publish
                  </h3>
                  <ul className="space-y-2 kw-muted text-sm">
                    <li className="flex items-start gap-2">
                      <span className="kw-muted-2 mt-0.5">•</span>
                      <span>Edit everything</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>Stay in control</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

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
        <section className="py-20 px-4 sm:px-6 lg:px-8 kw-bg">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold kw-text">
                See It In Action
              </h2>
            </div>

            {/* Example card moved from hero */}
            <Card className="p-8 md:p-12 rounded-2xl border kw-border kw-card">
              <div className="space-y-6">
                {/* Example Property */}
                <div>
                  <p className="text-xs font-semibold kw-muted-2 uppercase tracking-wide mb-4">
                    Example
                  </p>
                  <h3 className="text-2xl font-semibold kw-text mb-4 leading-tight">
                    Charming Tudor Revival in a Tree-Lined Neighborhood
                  </h3>
                  <p className="kw-muted leading-relaxed mb-4">
                    This beautifully maintained 4-bedroom home features classic
                    architectural details, recently updated systems, and mature
                    landscaping. The open kitchen flows naturally into the
                    living spaces, making it ideal for modern family living.
                  </p>
                  <p className="text-sm kw-muted">
                    Perfect for buyers seeking character and quality in an
                    established community.
                  </p>
                </div>

                {/* Property Details */}
                <div className="border-t kw-border pt-6">
                  <p className="text-xs font-semibold kw-muted-2 uppercase tracking-wide mb-4">
                    Generated for
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="kw-text font-semibold">
                        4 Beds • 3 Baths • 2,600 Sq Ft
                      </p>
                      <p className="kw-muted-2 text-xs mt-1">
                        Created in seconds
                      </p>
                    </div>
                    <span className="kw-primary-text font-semibold">
                      Ready to use
                    </span>
                  </div>
                </div>
              </div>
            </Card>
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

            {/* FAQ Items */}
            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-md transition">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Is KeyWise a real estate agent?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  No. KeyWise is a marketing and education tool for homeowners.
                  We help you create professional materials and understand the
                  selling process. For legal or financial decisions, you should
                  consult licensed professionals.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-md transition">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Does KeyWise provide legal or financial advice?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  No. KeyWise is designed to help with content creation and
                  learning about the home selling process. For legal, tax, or
                  financial guidance, please consult appropriate professionals.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-md transition">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Can I edit and customize the content?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely. Everything KeyWise generates is a starting point.
                  You have full control to edit, refine, and customize all
                  content to match your home and preferences perfectly.
                </p>
              </div>
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
            <Button className="px-8 py-3 text-base font-semibold kw-primary rounded-lg transition">
              Get Started Free
            </Button>
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
                    Pricing
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
