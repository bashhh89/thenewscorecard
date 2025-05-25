'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sg-dark-teal to-[#135e69] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Measure Your AI Readiness with Our <span className="text-sg-bright-green">Free</span> AI Efficiency Scorecard
              </h1>
              <p className="text-xl mb-8">
                Get a personalized assessment of your organization's AI maturity and actionable recommendations in just 8-10 minutes.
              </p>
              <Link href="/scorecard" className="btn-primary-divine inline-flex items-center text-center justify-center">
                Take the Free Assessment
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white p-6 rounded-divine shadow-divine-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-sg-bright-green/10 rounded-full">
                      <svg className="w-5 h-5 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-sg-dark-teal font-medium">AI Efficiency Scorecard</h3>
                  </div>
                  <span className="bg-sg-bright-green/20 text-sg-dark-teal text-sm font-medium px-3 py-1 rounded-full">
                    100% Free
                  </span>
                </div>
                <div className="space-y-4 text-sg-dark-teal">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-sg-bright-green/10 rounded-full mt-1">
                      <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm">Get your personalized AI maturity tier (Dabbler, Enabler, or Leader)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-sg-bright-green/10 rounded-full mt-1">
                      <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm">Receive a detailed report with strengths and weaknesses analysis</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-sg-bright-green/10 rounded-full mt-1">
                      <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm">Get a strategic action plan with specific, prioritized recommendations</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-sg-bright-green/10 rounded-full mt-1">
                      <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm">Compare your organization against industry benchmarks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-sg-light-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sg-dark-teal mb-4">Why Use Our AI Efficiency Scorecard?</h2>
            <p className="text-lg text-sg-dark-teal/80 max-w-3xl mx-auto">
              Our assessment provides valuable insights that would typically require expensive consulting engagements, making AI transformation accessible to organizations of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="divine-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sg-orange/10 rounded-full">
                  <svg className="w-6 h-6 text-sg-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-sg-dark-teal">Assess</h3>
              </div>
              <p className="text-sg-dark-teal/80">
                Evaluate your current AI maturity across key dimensions including strategy, data readiness, technology, team skills, and governance.
              </p>
            </div>

            <div className="divine-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sg-light-blue/10 rounded-full">
                  <svg className="w-6 h-6 text-sg-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-sg-dark-teal">Analyze</h3>
              </div>
              <p className="text-sg-dark-teal/80">
                Receive detailed insights about your AI strengths and gaps with a comprehensive analysis tailored to your industry and specific situation.
              </p>
            </div>

            <div className="divine-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-sg-bright-green/10 rounded-full">
                  <svg className="w-6 h-6 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-sg-dark-teal">Act</h3>
              </div>
              <p className="text-sg-dark-teal/80">
                Get a customized action plan with practical, prioritized recommendations to improve your AI capabilities and drive business results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-sg-dark-teal mb-6">How It Works</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sg-bright-green text-white font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sg-dark-teal text-lg mb-1">Select Your Industry</h3>
                    <p className="text-sg-dark-teal/80">
                      Choose your industry to receive recommendations relevant to your specific sector.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sg-bright-green text-white font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sg-dark-teal text-lg mb-1">Complete the Assessment</h3>
                    <p className="text-sg-dark-teal/80">
                      Answer approximately 20 questions across different phases of AI implementation. Questions adapt based on your previous answers.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sg-bright-green text-white font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sg-dark-teal text-lg mb-1">Get Your Personalized Report</h3>
                    <p className="text-sg-dark-teal/80">
                      Receive your AI maturity tier and a comprehensive report with actionable insights and recommendations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/scorecard" className="btn-primary-divine inline-flex items-center">
                  Start Free Assessment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-sg-light-mint p-6 rounded-divine shadow-divine-card">
                <h3 className="text-xl font-semibold text-sg-dark-teal mb-4">What You'll Discover</h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-sg-bright-green/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 bg-sg-bright-green/10 rounded-full">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-sg-dark-teal">Your AI Maturity Tier</h4>
                    </div>
                    <p className="text-sm text-sg-dark-teal/80">
                      Find out if you're a Dabbler, Enabler, or Leader in AI adoption and what it means for your business.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-sg-bright-green/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 bg-sg-bright-green/10 rounded-full">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-sg-dark-teal">Key Findings</h4>
                    </div>
                    <p className="text-sm text-sg-dark-teal/80">
                      A detailed analysis of your strengths and weaknesses across multiple dimensions of AI implementation.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-sg-bright-green/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 bg-sg-bright-green/10 rounded-full">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-sg-dark-teal">Strategic Action Plan</h4>
                    </div>
                    <p className="text-sm text-sg-dark-teal/80">
                      Specific, prioritized recommendations to help you advance to the next level of AI maturity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-header-bg-animated bg-size-400 animate-divine-bg-shift text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Organization with AI?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step toward AI excellence with our free AI Efficiency Scorecard. In just 8-10 minutes, you'll receive valuable insights and a personalized action plan.
          </p>
          <Link href="/scorecard" className="btn-primary-divine inline-flex items-center text-center justify-center">
            Start Your Free Assessment
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <p className="text-sm mt-4 opacity-80">
            No credit card required. 100% free assessment.
          </p>
        </div>
      </section>
    </div>
  );
} 