'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Enhanced with AI vibes */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sg-dark-teal via-[#0d2c33] to-[#0a1f24] text-white pb-20">
        {/* AI-themed background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#20E28F30_1px,transparent_1px)] bg-[size:20px_20px]">
            {/* Static background pattern instead of random dots */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
          {/* Logo */}
          <div className="flex justify-start mb-12">
            <div className="w-48">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 269 33" fill="none">
                <path d="M247.93 31.7382V9.61388H254.031V12.6867C255.261 10.5357 257.719 9.2627 260.792 9.2627C265.752 9.2627 269.001 12.8623 269.001 17.9544V31.7382H262.855V19.3152C262.855 16.6375 261.143 14.706 258.597 14.706C255.919 14.706 254.031 16.7692 254.031 19.6225V31.7382H247.93Z" fill="white"></path>
                <path d="M234.073 32.0894C226.522 32.0894 222.703 26.2072 222.703 20.6322C222.703 15.0572 226.127 9.2627 233.634 9.2627C241.447 9.2627 244.52 15.0572 244.52 20.0615C244.52 20.8955 244.476 21.554 244.432 22.0369H228.541C229.024 25.1536 230.956 27.0851 234.073 27.0851C236.531 27.0851 238.155 26.1194 238.638 24.2318H244.608C243.73 29.0166 239.516 32.0894 234.073 32.0894ZM228.673 18.13H238.462C238.243 15.6717 236.575 13.7402 233.634 13.7402C231 13.7402 229.288 15.2767 228.673 18.13Z" fill="white"></path>
                <path d="M206.884 32.0891C200.782 32.0891 196.875 27.5238 196.875 20.6758C196.875 13.8716 200.782 9.26238 207.015 9.26238C209.605 9.26238 211.976 10.272 213.38 11.9401V0H219.482V31.7379H213.38V29.3236C212.064 31.0356 209.605 32.0891 206.884 32.0891ZM208.288 26.8214C211.537 26.8214 213.688 24.3631 213.688 20.6758C213.688 16.9445 211.537 14.4862 208.288 14.4862C205.084 14.4862 202.889 16.9445 202.889 20.6758C202.889 24.3631 205.084 26.8214 208.288 26.8214Z" fill="white"></path>
                <path d="M182.164 31.7376V9.61328H188.266V13.3007C189.451 10.5351 191.119 9.61328 193.841 9.61328H196.299V14.7054H192.656C189.627 14.7054 188.266 17.2076 188.266 20.9827V31.7376H182.164Z" fill="white"></path>
                <path d="M165.146 32.0894C159.001 32.0894 155.094 27.5241 155.094 20.6761C155.094 13.8719 159.001 9.2627 165.234 9.2627C167.78 9.2627 170.151 10.2284 171.599 11.8088V9.61388H177.701V31.7382H171.599V29.4117C170.282 31.0798 167.868 32.0894 165.146 32.0894ZM166.507 26.8217C169.756 26.8217 171.907 24.3635 171.907 20.6761C171.907 16.9448 169.756 14.4865 166.507 14.4865C163.303 14.4865 161.108 16.9448 161.108 20.6761C161.108 24.3635 163.303 26.8217 166.507 26.8217Z" fill="white"></path>
                <path d="M137.363 32.0889C129.945 32.0889 123.141 26.7333 123.141 16.3735C123.141 6.0137 130.076 0.658203 138.68 0.658203C146.538 0.658203 152.025 5.09185 152.552 11.7204H145.572C145.089 8.42807 142.499 6.32098 138.549 6.32098C133.325 6.32098 129.769 10.0962 129.769 16.3296C129.769 23.0021 133.676 26.3822 138.724 26.3822C143.114 26.3822 146.143 23.7922 146.143 21.2462C146.143 20.3682 145.748 19.8853 144.826 19.8853H138.988V14.9249H147.46C150.401 14.9249 152.289 16.8125 152.289 19.7975V31.7377H146.45V28.0503C145.353 29.9379 142.017 32.0889 137.363 32.0889Z" fill="white"></path>
                <path d="M119.336 31.7379C115.43 31.7379 112.664 29.2797 112.664 24.9777V0H118.81V24.1437C118.81 25.6801 119.644 26.6019 121.136 26.6019H122.541V31.7379H119.336Z" fill="#20E28F"></path>
                <path d="M95.865 32.0894C89.7194 32.0894 85.8125 27.5241 85.8125 20.6761C85.8125 13.8719 89.7194 9.2627 95.9528 9.2627C98.4989 9.2627 100.869 10.2284 102.318 11.8088V9.61388H108.42V31.7382H102.318V29.4117C101.001 31.0798 98.5867 32.0894 95.865 32.0894ZM97.2259 26.8217C100.474 26.8217 102.625 24.3635 102.625 20.6761C102.625 16.9448 100.474 14.4865 97.2259 14.4865C94.0213 14.4865 91.8265 16.9448 91.8265 20.6761C91.8265 24.3635 94.0213 26.8217 97.2259 26.8217Z" fill="#20E28F"></path>
                <path d="M76.3787 31.7379V9.61357H82.4805V31.7379H76.3787ZM76.2031 0H82.7V6.45294H76.2031V0Z" fill="#20E28F"></path>
                <path d="M62.3587 32.0894C55.4668 32.0894 50.9453 27.129 50.9453 20.6761C50.9453 14.2231 55.4668 9.2627 62.3587 9.2627C68.1532 9.2627 72.7624 12.7745 73.1575 17.9105H67.0118C66.6606 15.9351 64.773 14.4865 62.5343 14.4865C59.1981 14.4865 57.3105 17.0765 57.3105 20.6761C57.3105 24.2757 59.242 26.8217 62.6221 26.8217C64.8608 26.8217 66.6167 25.4609 67.0996 23.4855H73.2892C72.6746 28.402 68.0654 32.0894 62.3587 32.0894Z" fill="#20E28F"></path>
                <path d="M37.208 32.0894C30.4039 32.0894 25.5312 27.2607 25.5312 20.6761C25.5312 14.0914 30.4039 9.2627 37.208 9.2627C44.0121 9.2627 48.8848 14.0914 48.8848 20.6761C48.8848 27.2607 44.0121 32.0894 37.208 32.0894ZM37.208 26.8217C40.5003 26.8217 42.7391 24.3196 42.7391 20.6761C42.7391 16.9887 40.5003 14.4865 37.208 14.4865C33.9157 14.4865 31.6769 16.9887 31.6769 20.6761C31.6769 24.3196 33.9157 26.8217 37.208 26.8217Z" fill="#20E28F"></path>
                <path d="M11.9401 32.0889C4.78483 32.0889 0.263385 27.8308 0 21.2901H6.32125C6.58463 24.4068 8.56002 26.3822 11.9401 26.3822C14.8813 26.3822 16.8128 25.153 16.8128 22.8265C16.8128 16.7247 0.790156 21.5534 0.790156 9.48161C0.790156 4.2578 5.26771 0.658203 11.5451 0.658203C18.1736 0.658203 22.6072 4.47729 22.7828 10.3157H16.5494C16.286 7.9013 14.4423 6.32098 11.5451 6.32098C8.9112 6.32098 7.28699 7.55012 7.28699 9.48161C7.28699 15.8468 23.4413 10.4474 23.4413 22.7387C23.4413 28.4893 18.8321 32.0889 11.9401 32.0889Z" fill="#20E28F"></path>
              </svg>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-sg-bright-green/20 text-sg-bright-green text-sm font-medium mb-6">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sg-bright-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sg-bright-green"></span>
                </span>
                AI-Powered Marketing Insights
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Skyrocket Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-sg-bright-green to-sg-light-blue">AI Marketing Potential</span> with Our Free Scorecard
              </h1>
              
              <p className="text-xl mb-8 text-gray-300">
                Our AI Efficiency Scorecard delivers personalised insights and actionable recommendations to give you the keys to a better marketing strategy, all in under 10 minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="btn-primary-divine inline-flex items-center text-center justify-center">
                  Take the Free Assessment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                
                <a href="#benefits" className="inline-flex items-center justify-center px-6 py-3 border border-sg-bright-green/30 text-sg-bright-green rounded-divine hover:bg-sg-bright-green/10 transition-all">
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
              
              <div className="mt-8 flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  <span className="text-white font-semibold">300+</span> marketers have improved their AI strategy
                </div>
              </div>
            </div>

            {/* AI Efficiency Scorecard section - moved higher and removed neon glow */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <span className="bg-sg-bright-green/20 text-sg-bright-green text-sm font-medium px-3 py-1 rounded-full mb-4 inline-block">
                  100% Free
                </span>
                <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-divine border border-white/20 shadow-divine-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-sg-bright-green/10 rounded-full">
                        <svg className="w-6 h-6 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">AI Efficiency Scorecard</h3>
                        <p className="text-xs text-gray-300">Powered by advanced AI analytics</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-white mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-sg-bright-green/10 rounded-full mt-1">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">AI Maturity Assessment</p>
                        <p className="text-xs text-gray-300">Discover if you're a Dabbler, Enabler, or Leader</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-sg-bright-green/10 rounded-full mt-1">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Custom AI Strategy Blueprint</p>
                        <p className="text-xs text-gray-300">Tailored to your specific marketing challenges</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-sg-bright-green/10 rounded-full mt-1">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Implementation Roadmap</p>
                        <p className="text-xs text-gray-300">Prioritized action items with timelines</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white">Your AI Maturity Score</h4>
                      <span className="text-xs text-gray-300">Example</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-sg-bright-green to-sg-light-blue w-[65%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Dabbler</span>
                      <span>Enabler</span>
                      <span>Leader</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated scrolling companies */}
          <div className="mt-16 relative">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sg-dark-teal to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-sg-dark-teal to-transparent z-10"></div>
            
            <div className="text-center mb-4 text-sm text-gray-400">
              Trusted by forward-thinking companies in various industries
            </div>
            
            <div className="overflow-hidden">
              <div className="flex space-x-8 animate-marquee">
                {/* Logo placeholders for industries */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-16 bg-gray-300/20 border border-gray-400/30 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">Property/Real Estate Logo</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-16 bg-gray-300/20 border border-gray-400/30 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">Higher Education Logo</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-16 bg-gray-300/20 border border-gray-400/30 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">B2B Tech/SaaS Logo</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-16 bg-gray-300/20 border border-gray-400/30 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">Financial Services Logo</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-16 bg-gray-300/20 border border-gray-400/30 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">Automotive Logo</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-16 bg-gray-300/20 border border-gray-400/30 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">E-commerce Logo</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-16 bg-gray-300/20 border border-gray-400/30 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">Not for Profit Logo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Benefits Section */}
      <section id="benefits" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sg-dark-teal mb-4">
              Want to transform your marketing capability with AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI Efficiency Scorecard helps you identify opportunities, overcome challenges, and implement cutting-edge AI strategies that drive real business results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - AI Strategy */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sg-bright-green/20 to-sg-light-blue/20 rounded-divine blur-md transform -rotate-3 scale-[0.97] opacity-70"></div>
              <div className="relative bg-white p-8 rounded-divine shadow-divine-card border border-gray-100 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-sg-bright-green/10 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-sg-dark-teal">AI Strategy Assessment</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-bright-green mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Evaluate your current AI readiness across key dimensions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-bright-green mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Identify gaps in your AI marketing implementation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-bright-green mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Benchmark against industry leaders and competitors</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 - AI Insights */}
            <div className="relative mt-10 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-sg-light-blue/20 to-sg-orange/20 rounded-divine blur-md transform rotate-3 scale-[0.97] opacity-70"></div>
              <div className="relative bg-white p-8 rounded-divine shadow-divine-card border border-gray-100 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-sg-light-blue/10 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-sg-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-sg-dark-teal">AI-Powered Insights</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-light-blue mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Receive detailed analysis of your AI maturity level</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-light-blue mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Discover untapped AI opportunities specific to your industry</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-light-blue mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Get data-driven recommendations to improve your AI capabilities</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 - AI Action Plan */}
            <div className="relative mt-10 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-sg-orange/20 to-sg-bright-green/20 rounded-divine blur-md transform -rotate-3 scale-[0.97] opacity-70"></div>
              <div className="relative bg-white p-8 rounded-divine shadow-divine-card border border-gray-100 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-sg-orange/10 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-sg-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-sg-dark-teal">Strategic Action Plan</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-orange mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Get a customized roadmap for AI implementation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-orange mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Prioritized action items with implementation timelines</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-sg-orange mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Resource allocation guidance and ROI projections</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Maturity Tiers Section - Moved higher */}
      <section className="py-20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#20E28F05_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sg-dark-teal mb-4">
              Discover Your AI Maturity Level
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI Efficiency Scorecard identifies your organization's current AI maturity tier and provides a personalized roadmap tailored to your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Dabbler Tier */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-sg-orange/20 to-sg-orange/5 rounded-divine blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 bg-white rounded-divine shadow-divine-card border border-gray-100 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-sg-orange/10 rounded-full"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <span className="flex items-center justify-center w-10 h-10 bg-sg-orange/20 text-sg-orange rounded-full mr-4 font-semibold">1</span>
                    <h3 className="text-2xl font-bold text-sg-dark-teal">Dabbler</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    You're beginning your AI journey with limited implementation. The scorecard will help you build a solid foundation and identify quick wins.
                  </p>
                  
                  <div className="mb-6">
                    <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                      <div className="h-full bg-sg-orange rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Getting Started</span>
                      <span>Foundation Building</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-sg-dark-teal mb-3">Personalized Resources Include:</h4>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-orange mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>AI Implementation Fundamentals Course</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-orange mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Basic AI Tool Selection Guide</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-orange mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Prompting 101 Templates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Enabler Tier */}
            <div className="relative group mt-10 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-sg-light-blue/20 to-sg-light-blue/5 rounded-divine blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 bg-white rounded-divine shadow-divine-card border border-gray-100 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-sg-light-blue/10 rounded-full"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <span className="flex items-center justify-center w-10 h-10 bg-sg-light-blue/20 text-sg-light-blue rounded-full mr-4 font-semibold">2</span>
                    <h3 className="text-2xl font-bold text-sg-dark-teal">Enabler</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    You have some AI solutions in place but need to optimize and expand. The scorecard will help you scale your AI initiatives strategically.
                  </p>
                  
                  <div className="mb-6">
                    <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                      <div className="h-full bg-sg-light-blue rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Scaling</span>
                      <span>Optimizing</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-sg-dark-teal mb-3">Personalized Resources Include:</h4>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-light-blue mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Advanced Prompting Techniques Course</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-light-blue mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>AI Strategy Integration Playbook</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-light-blue mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>AI Workflow Automation Templates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Leader Tier */}
            <div className="relative group mt-10 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-sg-bright-green/20 to-sg-bright-green/5 rounded-divine blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 bg-white rounded-divine shadow-divine-card border border-gray-100 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-sg-bright-green/10 rounded-full"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <span className="flex items-center justify-center w-10 h-10 bg-sg-bright-green/20 text-sg-bright-green rounded-full mr-4 font-semibold">3</span>
                    <h3 className="text-2xl font-bold text-sg-dark-teal">Leader</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    You've established sophisticated AI capabilities. The scorecard will help you maintain your competitive edge and discover cutting-edge opportunities.
                  </p>
                  
                  <div className="mb-6">
                    <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                      <div className="h-full bg-sg-bright-green rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Innovating</span>
                      <span>Market Leading</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-sg-dark-teal mb-3">Personalized Resources Include:</h4>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-bright-green mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>AI Model Fine-Tuning Masterclass</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-bright-green mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Enterprise AI Governance Framework</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-sg-bright-green mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Advanced AI Integration Architecture</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 rounded-full text-sg-dark-teal mb-8">
              <svg className="w-5 h-5 text-sg-bright-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Every assessment includes a comprehensive report with your exact maturity score</span>
            </div>
            
            <Link href="/" className="btn-primary-divine inline-flex items-center text-center justify-center">
              Discover Your AI Maturity Tier
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Transformation Section */}
      <section className="py-20 bg-gradient-to-br from-sg-dark-teal to-[#135e69] text-white relative overflow-hidden">
        {/* AI-themed background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#20E28F30_1px,transparent_1px)] bg-[size:20px_20px]">
            {/* Static background pattern instead of random dots */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                {/* Static binary pattern (replacing animated one to fix hydration errors) */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
                  <div className="text-xs font-mono w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(32,226,143,0.1)_25%,rgba(32,226,143,0.1)_50%,transparent_50%,transparent_75%,rgba(32,226,143,0.1)_75%)] bg-[size:20px_20px]">
                  </div>
                </div>
                <div className="relative p-2 bg-white/10 backdrop-blur-sm rounded-divine border border-white/20">
                  <div className="aspect-video bg-gradient-to-br from-sg-dark-teal via-[#0f3e48] to-[#135e69] rounded-lg flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-sg-bright-green to-sg-light-blue rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">AI Efficiency Report</h3>
                      <p className="text-gray-300 mb-6">Your personalized AI strategy blueprint delivered in minutes</p>
                      <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-sg-bright-green to-sg-light-blue w-[85%] animate-pulse"></div>
                      </div>
                      <p className="text-sm text-gray-300">Generating insights from your assessment...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Business with AI-Driven Marketing
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Our AI Efficiency Scorecard provides the clarity and direction you need to harness the power of artificial intelligence for unprecedented marketing results.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 bg-white/10 rounded-full mr-4 mt-1">
                    <svg className="w-6 h-6 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Increase Marketing ROI</h3>
                    <p className="text-gray-300">Boost efficiency and effectiveness by strategically implementing AI in your marketing processes.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 bg-white/10 rounded-full mr-4 mt-1">
                    <svg className="w-6 h-6 text-sg-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Gain Competitive Advantage</h3>
                    <p className="text-gray-300">Stay ahead of the curve by implementing cutting-edge AI technologies tailored to your industry.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 bg-white/10 rounded-full mr-4 mt-1">
                    <svg className="w-6 h-6 text-sg-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Eliminate AI Uncertainty</h3>
                    <p className="text-gray-300">Replace guesswork with a clear, actionable roadmap for AI adoption and implementation.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/" className="btn-primary-divine inline-flex items-center text-center justify-center">
                  Start Your AI Assessment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Hub Section - Simplified Layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-sg-bright-green/10 text-sg-bright-green text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Personalized Learning Path
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-sg-dark-teal mb-4">
              Get tailored resources for your <span className="text-sg-bright-green">AI maturity</span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Based on your AI Scorecard results, our Learning Hub automatically curates the perfect collection of courses, guides, and templates to accelerate your AI journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dabbler Level */}
            <div className="bg-white p-6 rounded-divine shadow-divine-card border border-gray-100">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-10 h-10 bg-sg-orange/20 text-sg-orange rounded-full mr-4 font-semibold">1</span>
                <h3 className="text-xl font-bold text-sg-dark-teal">Dabbler</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Getting started with AI:</span> Focus on foundational knowledge and quick-win implementation strategies.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-sg-orange mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="text-sm text-gray-700">Beginner-friendly AI prompting tutorials</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-sg-orange mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">Step-by-step implementation guides</span>
                </div>
              </div>
            </div>
            
            {/* Enabler Level */}
            <div className="bg-white p-6 rounded-divine shadow-divine-card border border-gray-100">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-10 h-10 bg-sg-light-blue/20 text-sg-light-blue rounded-full mr-4 font-semibold">2</span>
                <h3 className="text-xl font-bold text-sg-dark-teal">Enabler</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Scaling your AI initiatives:</span> Optimization strategies and advanced implementation techniques.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-sg-light-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm text-gray-700">Advanced AI workflow templates</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-sg-light-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  <span className="text-sm text-gray-700">Integration strategies for your tech stack</span>
                </div>
              </div>
            </div>
            
            {/* Leader Level */}
            <div className="bg-white p-6 rounded-divine shadow-divine-card border border-gray-100">
              <div className="flex items-center mb-4">
                <span className="flex items-center justify-center w-10 h-10 bg-sg-bright-green/20 text-sg-bright-green rounded-full mr-4 font-semibold">3</span>
                <h3 className="text-xl font-bold text-sg-dark-teal">Leader</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Pioneering AI excellence:</span> Cutting-edge resources and enterprise-level implementation frameworks.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-sg-bright-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="text-sm text-gray-700">Enterprise AI governance frameworks</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-sg-bright-green mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">Advanced AI integration architecture</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="btn-primary-divine inline-flex items-center text-center justify-center">
              Start Your Assessment
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-header-bg-animated bg-size-400 animate-divine-bg-shift text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to level up your marketing with AI?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step towards AI excellence with our FREE AI Efficiency Scorecard. In under 10 minutes, you'll get valuable, actionable insights and a personalised plan.
          </p>
          <Link href="/" className="btn-primary-divine inline-flex items-center text-center justify-center">
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

      {/* Footer */}
      <footer className="bg-sg-dark-teal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row: Logo and Navigation */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="w-40 mb-4 md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 269 33" fill="none">
                <path d="M247.93 31.7382V9.61388H254.031V12.6867C255.261 10.5357 257.719 9.2627 260.792 9.2627C265.752 9.2627 269.001 12.8623 269.001 17.9544V31.7382H262.855V19.3152C262.855 16.6375 261.143 14.706 258.597 14.706C255.919 14.706 254.031 16.7692 254.031 19.6225V31.7382H247.93Z" fill="white"></path>
                <path d="M234.073 32.0894C226.522 32.0894 222.703 26.2072 222.703 20.6322C222.703 15.0572 226.127 9.2627 233.634 9.2627C241.447 9.2627 244.52 15.0572 244.52 20.0615C244.52 20.8955 244.476 21.554 244.432 22.0369H228.541C229.024 25.1536 230.956 27.0851 234.073 27.0851C236.531 27.0851 238.155 26.1194 238.638 24.2318H244.608C243.73 29.0166 239.516 32.0894 234.073 32.0894ZM228.673 18.13H238.462C238.243 15.6717 236.575 13.7402 233.634 13.7402C231 13.7402 229.288 15.2767 228.673 18.13Z" fill="white"></path>
                <path d="M206.884 32.0891C200.782 32.0891 196.875 27.5238 196.875 20.6758C196.875 13.8716 200.782 9.26238 207.015 9.26238C209.605 9.26238 211.976 10.272 213.38 11.9401V0H219.482V31.7379H213.38V29.3236C212.064 31.0356 209.605 32.0891 206.884 32.0891ZM208.288 26.8214C211.537 26.8214 213.688 24.3631 213.688 20.6758C213.688 16.9445 211.537 14.4862 208.288 14.4862C205.084 14.4862 202.889 16.9445 202.889 20.6758C202.889 24.3631 205.084 26.8214 208.288 26.8214Z" fill="white"></path>
                <path d="M182.164 31.7376V9.61328H188.266V13.3007C189.451 10.5351 191.119 9.61328 193.841 9.61328H196.299V14.7054H192.656C189.627 14.7054 188.266 17.2076 188.266 20.9827V31.7376H182.164Z" fill="white"></path>
                <path d="M165.146 32.0894C159.001 32.0894 155.094 27.5241 155.094 20.6761C155.094 13.8719 159.001 9.2627 165.234 9.2627C167.78 9.2627 170.151 10.2284 171.599 11.8088V9.61388H177.701V31.7382H171.599V29.4117C170.282 31.0798 167.868 32.0894 165.146 32.0894ZM166.507 26.8217C169.756 26.8217 171.907 24.3635 171.907 20.6761C171.907 16.9448 169.756 14.4865 166.507 14.4865C163.303 14.4865 161.108 16.9448 161.108 20.6761C161.108 24.3635 163.303 26.8217 166.507 26.8217Z" fill="white"></path>
                <path d="M137.363 32.0889C129.945 32.0889 123.141 26.7333 123.141 16.3735C123.141 6.0137 130.076 0.658203 138.68 0.658203C146.538 0.658203 152.025 5.09185 152.552 11.7204H145.572C145.089 8.42807 142.499 6.32098 138.549 6.32098C133.325 6.32098 129.769 10.0962 129.769 16.3296C129.769 23.0021 133.676 26.3822 138.724 26.3822C143.114 26.3822 146.143 23.7922 146.143 21.2462C146.143 20.3682 145.748 19.8853 144.826 19.8853H138.988V14.9249H147.46C150.401 14.9249 152.289 16.8125 152.289 19.7975V31.7377H146.45V28.0503C145.353 29.9379 142.017 32.0889 137.363 32.0889Z" fill="white"></path>
                <path d="M119.336 31.7379C115.43 31.7379 112.664 29.2797 112.664 24.9777V0H118.81V24.1437C118.81 25.6801 119.644 26.6019 121.136 26.6019H122.541V31.7379H119.336Z" fill="#20E28F"></path>
                <path d="M95.865 32.0894C89.7194 32.0894 85.8125 27.5241 85.8125 20.6761C85.8125 13.8719 89.7194 9.2627 95.9528 9.2627C98.4989 9.2627 100.869 10.2284 102.318 11.8088V9.61388H108.42V31.7382H102.318V29.4117C101.001 31.0798 98.5867 32.0894 95.865 32.0894ZM97.2259 26.8217C100.474 26.8217 102.625 24.3635 102.625 20.6761C102.625 16.9448 100.474 14.4865 97.2259 14.4865C94.0213 14.4865 91.8265 16.9448 91.8265 20.6761C91.8265 24.3635 94.0213 26.8217 97.2259 26.8217Z" fill="#20E28F"></path>
                <path d="M76.3787 31.7379V9.61357H82.4805V31.7379H76.3787ZM76.2031 0H82.7V6.45294H76.2031V0Z" fill="#20E28F"></path>
                <path d="M62.3587 32.0894C55.4668 32.0894 50.9453 27.129 50.9453 20.6761C50.9453 14.2231 55.4668 9.2627 62.3587 9.2627C68.1532 9.2627 72.7624 12.7745 73.1575 17.9105H67.0118C66.6606 15.9351 64.773 14.4865 62.5343 14.4865C59.1981 14.4865 57.3105 17.0765 57.3105 20.6761C57.3105 24.2757 59.242 26.8217 62.6221 26.8217C64.8608 26.8217 66.6167 25.4609 67.0996 23.4855H73.2892C72.6746 28.402 68.0654 32.0894 62.3587 32.0894Z" fill="#20E28F"></path>
                <path d="M37.208 32.0894C30.4039 32.0894 25.5312 27.2607 25.5312 20.6761C25.5312 14.0914 30.4039 9.2627 37.208 9.2627C44.0121 9.2627 48.8848 14.0914 48.8848 20.6761C48.8848 27.2607 44.0121 32.0894 37.208 32.0894ZM37.208 26.8217C40.5003 26.8217 42.7391 24.3196 42.7391 20.6761C42.7391 16.9887 40.5003 14.4865 37.208 14.4865C33.9157 14.4865 31.6769 16.9887 31.6769 20.6761C31.6769 24.3196 33.9157 26.8217 37.208 26.8217Z" fill="#20E28F"></path>
                <path d="M11.9401 32.0889C4.78483 32.0889 0.263385 27.8308 0 21.2901H6.32125C6.58463 24.4068 8.56002 26.3822 11.9401 26.3822C14.8813 26.3822 16.8128 25.153 16.8128 22.8265C16.8128 16.7247 0.790156 21.5534 0.790156 9.48161C0.790156 4.2578 5.26771 0.658203 11.5451 0.658203C18.1736 0.658203 22.6072 4.47729 22.7828 10.3157H16.5494C16.286 7.9013 14.4423 6.32098 11.5451 6.32098C8.9112 6.32098 7.28699 7.55012 7.28699 9.48161C7.28699 15.8468 23.4413 10.4474 23.4413 22.7387C23.4413 28.4893 18.8321 32.0889 11.9401 32.0889Z" fill="#20E28F"></path>
              </svg>
            </div>
            
            <div className="flex space-x-8">
              <a href="https://socialgarden.com.au/" className="text-white hover:text-sg-bright-green transition-colors">Home</a>
              <a href="/" className="text-white hover:text-sg-bright-green transition-colors">AI Scorecard</a>
              <a href="https://socialgarden.com.au/contact/" className="text-white hover:text-sg-bright-green transition-colors">Contact</a>
            </div>
          </div>
          
          {/* Middle row: Address blocks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-400 mb-8">
            <div>
              <p className="text-white font-semibold mb-2">Melbourne</p>
              <p className="mb-1">1800 771 396</p>
              <p className="mb-1">Level 8, The Hive Abbotsford,</p>
              <p className="mb-1">222 Hoddle</p>
              <p className="mb-1">St. Collingwood 3067</p>
            </div>
            
            <div>
              <p className="text-white font-semibold mb-2">Auckland</p>
              <p className="mb-1">268 Karangahape Road,</p>
              <p className="mb-1">Auckland CBD,</p>
              <p className="mb-1">Auckland</p>
            </div>
            
            <div>
              <p className="text-white font-semibold mb-2">Sydney</p>
              <p className="mb-1">Level 3, 100 Harris Street</p>
              <p className="mb-1">Pyrmont, NSW.</p>
              <p className="mb-1">Australia 2009</p>
            </div>
            
            <div>
              <p className="text-white font-semibold mb-2">Brisbane</p>
              <p className="mb-1">310 Edward St,</p>
              <p className="mb-1">Brisbane City, QLD.</p>
              <p className="mb-1">Australia 4000</p>
            </div>
          </div>
          
          {/* Bottom row: Copyright and tagline - left aligned */}
          <div className="text-sm text-gray-400">
            <p>© 2024 Social Garden. All rights reserved.</p>
            <p className="mt-2">Your trusted partner for AI-powered marketing solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 