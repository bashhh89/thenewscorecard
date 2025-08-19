'use client';

import React from 'react';

interface AssessmentLandingProps {
  onStartAssessment: () => void;
}

const AssessmentLanding: React.FC<AssessmentLandingProps> = ({
  onStartAssessment
}) => {
  // Features list to highlight
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-sg-mint-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      title: "Personalized Analysis",
      description: "Receive a tailored assessment of your organization's AI maturity level."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-sg-mint-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      title: "Strategic Insights",
      description: "Uncover actionable recommendations to enhance your AI implementation."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-sg-mint-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
      title: "Benchmark Comparison",
      description: "See how your organization compares to industry standards and peers."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-sg-mint-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      ),
      title: "Learning Resources",
      description: "Get access to curated resources based on your assessment results."
    }
  ];

  // Steps to complete the assessment
  const steps = [
    {
      number: "01",
      title: "Answer Assessment Questions",
      description: "Respond to questions about your organization's AI adoption and implementation."
    },
    {
      number: "02",
      title: "Receive AI Analysis",
      description: "Our AI evaluates your responses to determine your organization's maturity level."
    },
    {
      number: "03",
      title: "Review Your Results",
      description: "Get your detailed scorecard with actionable insights and recommendations."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
        {/* Left Content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-sg-dark-teal mb-4 leading-tight">
            Assess Your Organization's 
            <span className="text-sg-mint-green"> AI Efficiency Assessment</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Take our comprehensive assessment to understand where your organization stands in its AI journey and discover actionable insights to advance your capabilities.
          </p>
          <button
            onClick={onStartAssessment}
            className="bg-gradient-to-r from-sg-mint-green to-[#00C4B8] hover:from-sg-mint-green hover:to-[#00A89F] text-sg-dark-teal font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-lg"
          >
            Start Your Assessment
          </button>
          <p className="text-gray-500 text-sm mt-3">
            Takes approximately 10-15 minutes to complete
          </p>
        </div>
        
        {/* Right Image/Illustration */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-sg-mint-green/10 rounded-full blur-xl z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-sg-dark-teal/5 rounded-full blur-lg z-0"></div>
            
            {/* Main image container */}
            <div className="relative z-10 bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-sg-light-mint rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-sg-dark-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-sg-dark-teal">AI Efficiency Scorecard</h3>
                  <p className="text-gray-500">Get your personalized assessment</p>
                </div>
              </div>
              
              {/* Sample tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                        You're just starting to explore AI tools. The scorecard will help you identify your current level and provide resources to get started.
                      </p>
                      
                      <div className="mb-6">
                        <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                          <div className="h-full bg-sg-orange rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Curious</span>
                          <span>Experimenting</span>
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
              
              {/* Sample score indicator */}
                  <div className="bg-sg-light-mint p-4 rounded-xl border border-[#E0F7F0]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sg-dark-teal">Your AI Efficiency Score</span>
                      <span className="text-sg-dark-teal font-bold">?</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-sg-mint-green to-[#00C4B8] h-2.5 rounded-full w-0"></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>Beginner</span>
                      <span>Leader</span>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-sg-dark-teal mb-8 text-center">
          What You'll Get From This Assessment
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-sg-light-mint flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-sg-dark-teal mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-sg-dark-teal mb-8 text-center">
          How It Works
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 bg-white rounded-xl p-6 shadow-md border border-gray-100 relative">
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-sg-mint-green text-sg-dark-teal font-bold flex items-center justify-center">
                {step.number}
              </div>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-0.5 bg-sg-mint-green z-10"></div>
              )}
              
              <h3 className="text-xl font-bold text-sg-dark-teal mb-2 mt-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Start Assessment CTA */}
      <div className="text-center">
        <button
          onClick={onStartAssessment}
          className="bg-gradient-to-r from-sg-mint-green to-[#00C4B8] hover:from-sg-mint-green hover:to-[#00A89F] text-sg-dark-teal font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-lg"
        >
          Begin Assessment Now
        </button>
        <p className="text-gray-500 mt-4">
          Your insights are just a few questions away.
        </p>
      </div>
    </div>
  );
};

export default AssessmentLanding;
