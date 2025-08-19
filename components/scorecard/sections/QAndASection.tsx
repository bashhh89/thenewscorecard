'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface QAndASectionProps {
  questionAnswerHistory: Array<{
    question: string;
    answer: string | string[] | Record<string, any>;
  }>;
}

export const QAndASection: React.FC<QAndASectionProps> = ({ 
  questionAnswerHistory 
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };
  
  // Group Q&A by categories if possible
  const getCategoryFromQuestion = (question: string): { category: string, icon: JSX.Element } => {
    if (question.toLowerCase().includes('strategy') || question.toLowerCase().includes('vision') || question.toLowerCase().includes('plan')) {
      return { 
        category: 'Strategy & Vision', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        ) 
      };
    } else if (question.toLowerCase().includes('data') || question.toLowerCase().includes('information')) {
      return { 
        category: 'Data & Analytics', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
        ) 
      };
    } else if (question.toLowerCase().includes('technology') || question.toLowerCase().includes('infrastructure') || question.toLowerCase().includes('tools')) {
      return { 
        category: 'Technology & Infrastructure', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
        ) 
      };
    } else if (question.toLowerCase().includes('talent') || question.toLowerCase().includes('skill') || question.toLowerCase().includes('team')) {
      return { 
        category: 'Talent & Skills', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        ) 
      };
    } else if (question.toLowerCase().includes('governance') || question.toLowerCase().includes('ethics') || question.toLowerCase().includes('policy')) {
      return { 
        category: 'Governance & Ethics', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        )
      };
    } else {
      return { 
        category: 'General Assessment', 
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        ) 
      };
    }
  };
  
  const groupedQA: Record<string, { 
    icon: JSX.Element, 
    items: Array<{
      question: string, 
      answer: string | string[] | Record<string, any>, 
      index: number
    }>
  }> = {};
  
  questionAnswerHistory.forEach((qa, index) => {
    const { category, icon } = getCategoryFromQuestion(qa.question);
    
    if (!groupedQA[category]) {
      groupedQA[category] = { icon, items: [] };
    }
    
    groupedQA[category].items.push({...qa, index});
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#103138] mb-4 flex items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-[#20E28F]">
          <path d="M7.9 8.08 C 8.2 8.08 8.44 8.32 8.44 8.62 8.44 8.92 8.2 9.16 7.9 9.16 7.6 9.16 7.36 8.92 7.36 8.62 7.36 8.32 7.6 8.08 7.9 8.08 Z" 
            fill="currentColor"/>
          <path d="M12.1 8.08 C 12.4 8.08 12.64 8.32 12.64 8.62 12.64 8.92 12.4 9.16 12.1 9.16 11.8 9.16 11.56 8.92 11.56 8.62 11.56 8.32 11.8 8.08 12.1 8.08 Z" 
            fill="currentColor"/>
          <path d="M16.3 8.08 C 16.6 8.08 16.84 8.32 16.84 8.62 16.84 8.92 16.6 9.16 16.3 9.16 16 9.16 15.76 8.92 15.76 8.62 15.76 8.32 16 8.08 16.3 8.08 Z" 
            fill="currentColor"/>
          <path d="M20 6.77V15.5C20 16.6 19.1 17.5 18 17.5H13.44L9.31 19.7C9.13 19.8 8.92 19.84 8.73 19.82C8.36 19.79 8.09 19.5 8.09 19.14V17.5H6C4.9 17.5 4 16.6 4 15.5V6.77C4 5.67 4.9 4.77 6 4.77H18C19.1 4.77 20 5.67 20 6.77Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Assessment Q&A Breakdown
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#103138]">Your Assessment Responses</h3>
        <p className="text-[#103138]/80 leading-relaxed">
          This section displays the questions asked during your AI efficiency assessment and the answers you provided.
          These responses formed the basis for your tier classification and recommendations.
        </p>
      </div>
      
      {Object.keys(groupedQA).length > 0 ? (
        <div className="space-y-5">
          {Object.entries(groupedQA).map(([category, { icon, items }], categoryIndex) => (
            <div key={`category-${categoryIndex}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-[#F3FDF5]/30 border-b border-gray-100">
                <h3 className="font-semibold text-[#103138] flex items-center">
                  <span className="mr-2 text-[#20E28F]">{icon}</span>
                  {category}
                  <span className="ml-auto text-xs font-normal text-[#103138]/60 bg-white px-2 py-1 rounded-full">
                    {items.length} {items.length === 1 ? 'Question' : 'Questions'}
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={`qa-${item.index}`} className="qa-item">
                    <button 
                      className={`w-full p-4 flex justify-between items-start text-left transition-all ${
                        expandedIndex === item.index ? 'bg-[#F3FDF5]/10' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleExpand(item.index)}
                      aria-expanded={expandedIndex === item.index}
                    >
                      <div className="flex items-start flex-1">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#20E28F]/10 flex items-center justify-center mr-3 mt-0.5 text-[#20E28F]">
                          <span className="text-sm font-medium">Q</span>
                        </div>
                        <span className="font-medium text-[#103138] pr-4">
                          <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                            {item.question}
                          </ReactMarkdown>
                        </span>
                      </div>
                      <div className={`text-[#20E28F] flex-shrink-0 transition-transform duration-200 ${expandedIndex === item.index ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </button>
                    
                    {expandedIndex === item.index && (
                      <div className="p-4 pt-0 bg-white border-t border-dashed border-gray-100">
                        <div className="ml-9 pl-3 py-3 border-l-2 border-[#20E28F]/20">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#20E28F]/10 flex items-center justify-center mr-3 text-[#20E28F]">
                              <span className="text-sm font-medium">A</span>
                            </div>
                            <div>
                              <div className="text-[#103138]/90 leading-relaxed">
                                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                                  {typeof item.answer === 'string' 
                                    ? item.answer 
                                    : Array.isArray(item.answer) 
                                      ? item.answer.join(', ') 
                                      : JSON.stringify(item.answer)}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-[#103138]/60 text-lg">
            No assessment question and answer data is available.
          </div>
          <p className="text-[#103138]/40 mt-2 text-sm max-w-md mx-auto">
            This could be because you haven't completed the assessment or the data wasn't properly recorded.
          </p>
        </div>
      )}
      
      <div className="bg-[#F3FDF5]/50 rounded-xl p-5 border border-[#20E28F]/20">
        <h4 className="font-semibold text-[#103138] mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#20E28F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          About Your Assessment
        </h4>
        <p className="text-sm text-[#103138]/80 mb-3">
          Your answers were analyzed using our proprietary AI efficiency model to determine your organization's current tier and provide tailored recommendations.
        </p>
        <p className="text-sm text-[#103138]/80">
          If you'd like to retake the assessment or provide updated answers, you can start a new assessment from your dashboard.
        </p>
      </div>
    </div>
  );
}; 