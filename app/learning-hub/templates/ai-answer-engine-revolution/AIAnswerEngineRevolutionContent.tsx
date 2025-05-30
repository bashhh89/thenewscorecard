'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/Card';
import Link from 'next/link';

export default function AIAnswerEngineRevolutionContent() {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-plus-jakarta prose-headings:font-bold prose-headings:text-sg-dark-teal prose-p:text-sg-dark-teal/90 prose-a:text-sg-bright-green prose-a:no-underline hover:prose-a:underline prose-strong:text-sg-dark-teal prose-li:text-sg-dark-teal/90">
      {/* Insight Brief Header Banner */}
      <div className="relative mb-10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-sg-dark-teal/90 to-sg-bright-green/80 z-10"></div>
        <div className="relative z-20 px-10 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-lg">
              <span className="text-white font-semibold tracking-wider text-sm">INSIGHT BRIEF</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-lg">
              <span className="text-white font-semibold tracking-wider text-sm">EARLY 2025 TRENDS</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 max-w-4xl">
            Beyond Google: Are You Ready for the AI Answer Engine Revolution?
          </h1>
          <p className="text-white/90 text-xl max-w-3xl">
            The rise of AI-powered answer engines is redefining search as we know it. Is your marketing strategy prepared?
          </p>
        </div>
      </div>

      <p className="text-xl">
        For decades, Search Engine Optimization (SEO) has been the holy grail for marketers: rank high on Google, get seen, get clicks. But the ground is shifting beneath our feet. <strong>As of early 2025, the rise of powerful AI Chat Interfaces and Answer Engines (like ChatGPT, Perplexity, and an evolving Google Search Generative Experience) is creating a new paradigm: AI Engine Optimization (AEO).</strong>
      </p>

      <p className="text-xl font-semibold text-sg-dark-teal">
        If your marketing strategy is still solely focused on traditional SEO, you might be preparing for yesterday's battle.
      </p>

      {/* Why This Matters NOW Section */}
      <Card className="my-10 border-l-4 border-sg-bright-green shadow-xl">
        <CardHeader className="bg-sg-light-mint/30">
          <CardTitle className="text-2xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sg-bright-green">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Why This Matters NOW More Than Ever
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sg-bright-green/20 flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-sg-bright-green">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <strong className="text-sg-dark-teal block">Shifting User Behavior:</strong> 
                <span>Increasingly, users (including your potential customers) are turning to AI chat interfaces for direct answers, summaries, and recommendations, bypassing traditional search result pages.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sg-bright-green/20 flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-sg-bright-green">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <strong className="text-sg-dark-teal block">Visibility in AI Responses:</strong> 
                <span>If your brand, products, and expertise aren't being surfaced accurately and favorably by these AI engines, you're becoming invisible to a growing segment of your audience.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sg-bright-green/20 flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-sg-bright-green">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <strong className="text-sg-dark-teal block">Brand Reputation & Accuracy:</strong> 
                <span>AI models synthesize information from the web. Ensuring they have access to accurate, well-structured data about your business is crucial for how your brand is represented.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sg-bright-green/20 flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-sg-bright-green">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <strong className="text-sg-dark-teal block">The New "Zero-Click" Challenge:</strong> 
                <span>Just as "zero-click searches" impacted website traffic from Google, AI answer engines often provide direct answers, meaning users may not need to click through to your site unless the AI explicitly references and links to you as a source.</span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <p className="text-xl italic text-center border-l-4 border-r-4 border-sg-bright-green/30 mx-auto py-3 px-6 max-w-3xl">
        <strong>This isn't about SEO being dead; it's about SEO <em>evolving</em>.</strong> You now need to think about how your information is understood, processed, and presented by AI models.
      </p>

      {/* Strategic Considerations Section */}
      <Card className="my-10">
        <CardHeader className="bg-gradient-to-r from-sg-dark-teal/10 to-sg-bright-green/10">
          <CardTitle className="text-2xl flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sg-bright-green">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            Initial Strategic Considerations for the AEO Shift (Early 2025)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-sg-light-mint flex items-center justify-center sm:mt-1 mx-auto sm:mx-0">
                <span className="text-3xl font-bold text-sg-dark-teal">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-sg-dark-teal mb-2">High-Quality, Authoritative Content is King (Still!)</h3>
                <p className="text-sg-dark-teal/90 mb-2">
                  AI models value clear, well-structured, accurate, and comprehensive content on your website and other owned platforms. Ensure your expertise is evident.
                </p>
                <div className="bg-sg-light-mint/30 p-3 rounded-lg">
                  <strong className="text-sg-bright-green block">Actionable Insight:</strong>
                  <span>Audit your core website content. Is it clear, factual, and does it thoroughly answer the key questions your audience has?</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-sg-light-mint flex items-center justify-center sm:mt-1 mx-auto sm:mx-0">
                <span className="text-3xl font-bold text-sg-dark-teal">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-sg-dark-teal mb-2">Structured Data & Semantic SEO</h3>
                <p className="text-sg-dark-teal/90 mb-2">
                  Implementing structured data (Schema.org markup) on your website helps AI models (and search engines) better understand the context and meaning of your content.
                </p>
                <div className="bg-sg-light-mint/30 p-3 rounded-lg">
                  <strong className="text-sg-bright-green block">Actionable Insight:</strong>
                  <span>Explore adding structured data for your products, services, articles, FAQs, and company information.</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-sg-light-mint flex items-center justify-center sm:mt-1 mx-auto sm:mx-0">
                <span className="text-3xl font-bold text-sg-dark-teal">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-sg-dark-teal mb-2">Knowledge Base & FAQ Optimization</h3>
                <p className="text-sg-dark-teal/90 mb-2">
                  AI models often pull from well-organized FAQs and knowledge bases. Ensure yours is comprehensive, up-to-date, and uses clear question-and-answer formats.
                </p>
                <div className="bg-sg-light-mint/30 p-3 rounded-lg">
                  <strong className="text-sg-bright-green block">Actionable Insight:</strong>
                  <span>Develop a robust FAQ section that directly addresses common customer queries about your offerings and industry.</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-sg-light-mint flex items-center justify-center sm:mt-1 mx-auto sm:mx-0">
                <span className="text-3xl font-bold text-sg-dark-teal">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-sg-dark-teal mb-2">Brand Mentions & Online Presence</h3>
                <p className="text-sg-dark-teal/90 mb-2">
                  AI models learn from the broader web. Consistent brand mentions, positive reviews, and authoritative links across reputable sites can influence how your brand is perceived and represented.
                </p>
                <div className="bg-sg-light-mint/30 p-3 rounded-lg">
                  <strong className="text-sg-bright-green block">Actionable Insight:</strong>
                  <span>Monitor your online brand presence and ensure information about your company is accurate across different platforms.</span>
                </div>
              </div>
            </div>

            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-sg-light-mint flex items-center justify-center sm:mt-1 mx-auto sm:mx-0">
                <span className="text-3xl font-bold text-sg-dark-teal">5</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-sg-dark-teal mb-2">Direct Engagement with AI Platforms (Where Possible)</h3>
                <p className="text-sg-dark-teal/90 mb-2">
                  Some AI platforms may offer ways for businesses to provide or verify information (this is an evolving space). Stay updated on such opportunities.
                </p>
                <div className="bg-sg-light-mint/30 p-3 rounded-lg">
                  <strong className="text-sg-bright-green block">Actionable Insight:</strong>
                  <span>Keep an eye on announcements from major AI developers regarding business data submission or verification programs.</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Bottom Line Section */}
      <h2 className="text-2xl font-bold text-sg-dark-teal mt-12 mb-4">The Bottom Line</h2>
      <p className="text-xl">
        The way customers find and interact with information is undergoing a seismic shift. While traditional SEO remains a piece of the puzzle, forward-thinking marketers must now actively strategize for visibility and accurate representation within AI-driven answer engines.
      </p>

      {/* Coming Soon Teaser */}
      <div className="my-10 relative">
        <Card className="bg-gradient-to-r from-sg-dark-teal to-sg-bright-green text-white overflow-hidden border-0">
          <CardContent className="p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Stay Ahead of the Curve!</h3>
              <p className="text-white/90 mb-6">
                This is a rapidly developing field. We're preparing a full Mini-Course on <strong>"Mastering AI Engine Optimization (AEO): Your Blueprint for Visibility in the Age of AI Answers."</strong> Look for it soon in the Learning Hub!
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full py-2 px-4 text-white font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>FULL COURSE COMING SOON!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Resources */}
      <h2 className="text-2xl font-bold text-sg-dark-teal mt-12 mb-4">Related Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-bold text-sg-dark-teal mb-2">Advanced Prompting Techniques</h3>
            <p className="text-sm text-sg-dark-teal/80 mb-4">
              Master the art of crafting effective AI prompts. Learn frameworks and strategies to get consistently useful outputs.
            </p>
            <Link href="/learning-hub/advanced-prompting-techniques" className="text-sg-bright-green font-semibold hover:underline inline-flex items-center gap-1">
              <span>Explore course</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-bold text-sg-dark-teal mb-2">AI Content Strategy Blueprint</h3>
            <p className="text-sm text-sg-dark-teal/80 mb-4">
              Develop a comprehensive content strategy powered by AI. Create, optimize, and scale your content production.
            </p>
            <Link href="/learning-hub/ai-content-strategy" className="text-sg-bright-green font-semibold hover:underline inline-flex items-center gap-1">
              <span>Explore course</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 