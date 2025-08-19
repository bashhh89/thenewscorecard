'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';

interface StrategicActionPlanSectionProps {
  reportMarkdown: string | null;
}

// Parse the strategic action plan content into structured data
const parseActionPlan = (content: string) => {
  // Remove the main heading
  const cleanContent = content.replace(/^##\s*Strategic Action Plan\s*\n+/i, '');
  
  // First, try to extract an action plan that's formatted with numbered steps (1., 2., etc.)
  const sectionRegex = /(\d+\.?\s+[^\n]+)/g;
  const sections = cleanContent.split(sectionRegex).filter(Boolean);
  
  const actionItems = [];
  for (let i = 0; i < sections.length; i += 2) {
    if (i + 1 < sections.length) {
      const title = sections[i].trim();
      const content = sections[i + 1].trim();
      
      // Extract any potential sub-sections (e.g., bullet points)
      const subPoints = content
        .split(/[-•*]\s+/g)  // Improved to catch more bullet point formats
        .filter(text => text.trim().length > 0)
        .map(text => text.trim());
      
      actionItems.push({ 
        title, 
        content,
        subPoints: subPoints.length > 1 ? subPoints : [], // Only use sub-points if there are multiple
      });
    }
  }
  
  // If no numbered sections were found, look for bullet points that might be action items
  if (actionItems.length === 0) {
    const bulletPoints = cleanContent
      .split(/[-•*]\s+/g)
      .filter(text => text.trim().length > 0)
      .map(text => text.trim());
    
    if (bulletPoints.length > 0) {
      // Remove the first item if it appears to be a header/introduction
      if (bulletPoints[0].length < 50 && !bulletPoints[0].includes('.')) {
        bulletPoints.shift();
      }
      
      bulletPoints.forEach((point, index) => {
        actionItems.push({
          title: `Action ${index + 1}: ${point.split('.')[0]}`,
          content: point,
          subPoints: []
        });
      });
    }
  }
  
  return actionItems;
};

export const StrategicActionPlanSection: React.FC<StrategicActionPlanSectionProps> = ({ 
  reportMarkdown 
}) => {
  // Extract the Strategic Action Plan section from the markdown and combine with Recommendations if present
  const extractStrategicActionPlan = (markdown: string): string => {
    let actionPlanContent = "";
    let recommendationsContent = "";
    
    // Extract Strategic Action Plan content
    const planMatch = markdown.match(/##\s*(Strategic Action Plan|Action Plan)[:\s]*([\s\S]*?)(?=##|$)/i);
    if (planMatch && planMatch[2]) {
      actionPlanContent = planMatch[2].trim();
    }
    
    // Extract Recommendations content if it exists as a separate section
    const recommendationsMatch = markdown.match(/##\s*(Recommendations|Strategic Recommendations)[:\s]*([\s\S]*?)(?=##|$)/i);
    if (recommendationsMatch && recommendationsMatch[2]) {
      recommendationsContent = recommendationsMatch[2].trim();
    }
    
    // Combine both sections if they exist
    if (actionPlanContent && recommendationsContent) {
      return actionPlanContent + "\n\n**Additional Strategic Actions:**\n\n" + recommendationsContent;
    } else if (actionPlanContent) {
      return actionPlanContent;
    } else if (recommendationsContent) {
      return recommendationsContent;
    }
    
    // If still not found, try other common action-related headings
    const altMatch = markdown.match(/##\s*(Action Items|Next Steps)[:\s]*([\s\S]*?)(?=##|$)/i);
    if (altMatch && altMatch[2]) {
      return altMatch[2].trim();
    }
    
    // Fallback: Look for numbered lists that might indicate actions
    const numberedListMatch = markdown.match(/(?:\d+\.?\s+[^\n]+\n*){3,}/);
    if (numberedListMatch) {
      return numberedListMatch[0].trim();
    }
    
    // Last resort: Return a default message
    return "No strategic action plan found in the report. Please contact support for assistance.";
  };

  const actionPlanContent = reportMarkdown ? extractStrategicActionPlan(reportMarkdown) : "";
  
  console.log('FRONTEND: Extracted action plan content:', actionPlanContent.substring(0, 100) + '...');
  
  const actionItems = parseActionPlan(actionPlanContent);
  console.log('FRONTEND: Parsed action items:', actionItems.length);

  // Helper function to get an icon based on action item title/content
  const getActionIcon = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('strategy') || lowercaseTitle.includes('plan')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>
      );
    } else if (lowercaseTitle.includes('team') || lowercaseTitle.includes('train')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
      );
    } else if (lowercaseTitle.includes('tool') || lowercaseTitle.includes('software') || lowercaseTitle.includes('tech')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
        </div>
      );
    } else if (lowercaseTitle.includes('process') || lowercaseTitle.includes('workflow')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
          </svg>
        </div>
      );
    } else if (lowercaseTitle.includes('data') || lowercaseTitle.includes('insight')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
        </div>
      );
    } else if (lowercaseTitle.includes('governance') || lowercaseTitle.includes('compliance')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
      );
    } else {
      // Default icon
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
      );
    }
  };

  // State for managing the currently open accordion item
  const [openItem, setOpenItem] = useState<string | null>('action-0');

  // Function to toggle open/close state of accordion items
  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Introduction/Header */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="icon-wrapper-sg-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6H9C7.34315 6 6 7.34315 6 9V15C6 16.6569 7.34315 18 9 18H15C16.6569 18 18 16.6569 18 15V9C18 7.34315 16.6569 6 15 6Z" stroke="#20E28F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 15V16C4 18.2091 5.79086 20 8 20H16M20 9V8C20 5.79086 18.2091 4 16 4H8" stroke="#20E28F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10L10 12L12 14M12 10L14 12L12 14M12 10V14" stroke="#20E28F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Strategic Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none text-sg-dark-teal/80">
            <p>
              Based on your assessment, we've developed this prioritized action plan to help you advance your organization's AI efficiency. Each recommendation is designed to build on your strengths and address key improvement areas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Items List */}
      <div className="space-y-4">
        {actionItems.length > 0 ? (
          actionItems.map((action, index) => (
            <Card 
              key={`action-${index}`} 
              className={`overflow-hidden border-l-4 border-l-sg-bright-green ${openItem === `action-${index}` ? 'shadow-lg' : 'shadow'} transition-all`}
            >
              {/* Card Header - Always visible */}
              <div 
                className={`flex items-center p-6 cursor-pointer transition-colors ${openItem === `action-${index}` ? 'bg-gradient-to-r from-sg-light-mint/50 to-white' : 'hover:bg-sg-light-mint/20'}`}
                onClick={() => toggleItem(`action-${index}`)}
              >
                <div className="flex-shrink-0 mr-4">
                  {getActionIcon(action.title)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-sg-dark-teal">
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {action.title}
                    </ReactMarkdown>
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openItem === `action-${index}` ? 
                    <ChevronUpIcon className="h-5 w-5 text-sg-bright-green" /> : 
                    <ChevronDownIcon className="h-5 w-5 text-sg-dark-teal" />
                  }
                </div>
              </div>
              
              {/* Expandable Content */}
              {openItem === `action-${index}` && (
                <div className="p-6 pt-0 border-t border-sg-light-mint/30">
                  <div className="prose prose-lg max-w-none text-sg-dark-teal/90">
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {action.content}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Sub-points if any */}
                  {action.subPoints.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-sm uppercase text-sg-dark-teal/60 tracking-wider">Implementation Steps</h4>
                      <div className="space-y-3">
                        {action.subPoints.map((subPoint, subIdx) => (
                          <div key={`subpoint-${index}-${subIdx}`} className="flex items-start">
                            <div className="h-5 w-5 rounded-full bg-sg-light-mint flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              <span className="text-sg-bright-green text-xs font-bold">{subIdx + 1}</span>
                            </div>
                            <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
                              <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                                {subPoint}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-6">
            <CardContent className="text-center text-sg-dark-teal/70 italic">
              <p>No specific action items have been identified for your assessment. This could indicate an error in report generation. Please contact support for assistance.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Supporting Resources Card */}
      <Card className="p-6 bg-gradient-to-r from-white to-sg-light-mint/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-sg-bright-green">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Supporting Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
            <p>
              To help you implement this action plan, we recommend exploring the following resources from our Learning Hub:
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="/learning-hub/recommended-tools" className="flex items-center p-3 bg-white rounded-lg border border-sg-light-mint hover:bg-sg-light-mint/10 transition-colors">
              <div className="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-sg-light-mint">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sg-bright-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sg-dark-teal">Recommended AI Tools</h4>
                <p className="text-xs text-sg-dark-teal/70">Discover AI tools that align with your action plan</p>
              </div>
            </a>
            <a href="/learning-hub/ai-project-management" className="flex items-center p-3 bg-white rounded-lg border border-sg-light-mint hover:bg-sg-light-mint/10 transition-colors">
              <div className="mr-3 h-8 w-8 flex items-center justify-center rounded-full bg-sg-light-mint">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sg-bright-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sg-dark-teal">AI Project Management</h4>
                <p className="text-xs text-sg-dark-teal/70">Learn how to implement AI initiatives effectively</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicActionPlanSection;
