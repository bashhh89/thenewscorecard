'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface RecommendationsSectionProps {
  markdownContent: string;
}

// Parse the recommendations from markdown content
const parseRecommendations = (content: string) => {
  // Try to find the recommendations section
  const recommendationsMatch = content.match(/## (Recommendations|Action Plan|Action Items|Next Steps|Recommendations & Next Steps)[:\s]*([\s\S]*?)(?=##|$)/i);
  
  if (!recommendationsMatch || !recommendationsMatch[2]) {
    return [];
  }

  const recommendationsContent = recommendationsMatch[2].trim();
  console.log('FRONTEND: Found recommendations content:', recommendationsContent.substring(0, 100) + '...');
  
  // Split content into recommendation objects
  // Look for patterns like "**Recommendation:** Text" or numbered items
  const recommendations = [];
  
  // First try to match JSON-like structures (seen in the manually added selection)
  const jsonMatch = recommendationsContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (jsonMatch) {
    try {
      // Try to safely extract and parse JSON-like structures
      const jsonString = jsonMatch[0]
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure proper JSON property quotes
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          return {
            title: item.Recommendation || item.title || "Recommendation",
            steps: item["Sub-steps"] || item.steps || []
          };
        });
      }
    } catch (e) {
      console.error("Failed to parse JSON-like structure:", e);
    }
  }
  
  // Try to extract numbered recommendations (e.g., "1. Recommendation")
  const numberedRecommendations = recommendationsContent.match(/\d+\.\s+([^\n]+)(\n[\s\S]*?)(?=\d+\.\s+|$)/g);
  if (numberedRecommendations && numberedRecommendations.length > 0) {
    for (const rec of numberedRecommendations) {
      const titleMatch = rec.match(/\d+\.\s+([^\n]+)/);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        const content = rec.replace(/\d+\.\s+[^\n]+\n/, '').trim();
        
        // Extract bullet points as steps
        const steps = content
          .split(/\n[-•*]\s+/)
          .filter(step => step.trim().length > 0)
          .map(step => step.trim());
        
        recommendations.push({
          title,
          steps: steps.length > 0 ? steps : [content]
        });
      }
    }
    
    if (recommendations.length > 0) {
      console.log('FRONTEND: Extracted numbered recommendations:', recommendations.length);
      return recommendations;
    }
  }
  
  // Fallback to parsing markdown list format
  const sections = recommendationsContent.split(/(?=\*\*[^*]+\*\*:)/);
  
  for (const section of sections) {
    // Skip empty sections
    if (!section.trim()) continue;
    
    // Extract recommendation title and content
    const titleMatch = section.match(/\*\*([^*]+)\*\*:\s*([\s\S]*)/);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      const content = titleMatch[2].trim();
      
      // Extract bullet points as steps
      const steps = content
        .split(/\n[-•*]\s+/)
        .filter(step => step.trim().length > 0)
        .map(step => step.trim());
      
      recommendations.push({
        title,
        steps: steps.length > 0 ? steps : [content]
      });
    } else {
      // Try to extract just from a bullet list if no title pattern is found
      const steps = section
        .split(/\n[-•*]\s+/)
        .filter(step => step.trim().length > 0)
        .map(step => step.trim());
      
      if (steps.length > 0) {
        recommendations.push({
          title: "Recommendation",
          steps
        });
      }
    }
  }
  
  // If we still don't have recommendations, try a more aggressive approach
  if (recommendations.length === 0) {
    // Look for any bullet points in the content
    const allBulletPoints = recommendationsContent
      .split(/\n[-•*]\s+/)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim());
    
    if (allBulletPoints.length > 0) {
      recommendations.push({
        title: "Recommendations",
        steps: allBulletPoints
      });
    } else {
      // Last resort: Split by paragraphs and use each as a recommendation
      const paragraphs = recommendationsContent
        .split(/\n\n+/)
        .filter(para => para.trim().length > 0)
        .map(para => para.trim());
      
      if (paragraphs.length > 0) {
        recommendations.push({
          title: "Recommendations",
          steps: paragraphs
        });
      }
    }
  }
  
  console.log('FRONTEND: Extracted recommendations count:', recommendations.length);
  return recommendations;
};

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ markdownContent }) => {
  const recommendations = parseRecommendations(markdownContent);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0); // Open first by default

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Get an appropriate icon for the recommendation based on its title
  const getRecommendationIcon = (title: string) => {
    const lowercaseTitle = title.toLowerCase();
    
    // Strategy-related icon
    if (lowercaseTitle.includes('strategy') || lowercaseTitle.includes('plan')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
      );
    } 
    // Data or insights related icon
    else if (lowercaseTitle.includes('data') || lowercaseTitle.includes('insight') || lowercaseTitle.includes('refresh')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
      );
    } 
    // Training or team related icon
    else if (lowercaseTitle.includes('train') || lowercaseTitle.includes('team') || lowercaseTitle.includes('skill') || lowercaseTitle.includes('culture')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      );
    } 
    // Governance or process related icon
    else if (lowercaseTitle.includes('governance') || lowercaseTitle.includes('process') || lowercaseTitle.includes('framework') || lowercaseTitle.includes('measurement')) {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      );
    } 
    // Default icon for other types
    else {
      return (
        <div className="p-2 rounded-full bg-[#F3FDF5] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#103138" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6 text-[#103138]">
      {/* Introduction Section */}
      <div className="bg-gradient-to-br from-[#F3FDF5] to-white p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-[#103138] mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#20E28F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Your AI Enhancement Recommendations
        </h3>
        <p className="text-[#103138]">
          Based on your assessment results, we've identified the following key recommendations 
          to help you enhance your organization's AI capabilities and efficiency.
        </p>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div 
                onClick={() => toggleAccordion(index)}
                className={`flex justify-between items-center p-5 cursor-pointer ${openAccordion === index ? 'bg-[#F3FDF5] border-b border-gray-200' : 'bg-white'}`}
              >
                <div className="flex items-center space-x-4">
                  {getRecommendationIcon(recommendation.title)}
                  <h3 className="text-lg font-medium text-[#103138]">
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {recommendation.title}
                    </ReactMarkdown>
                  </h3>
                </div>
                <div>
                  {openAccordion === index ? (
                    <ChevronUpIcon className="h-6 w-6 text-[#20E28F]" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6 text-[#103138]" />
                  )}
                </div>
              </div>
              
              {/* Accordion Content */}
              {openAccordion === index && (
                <div className="p-5 bg-white">
                  <ul className="space-y-3">
                    {recommendation.steps.map((step: string, stepIndex: number) => (
                      <li key={stepIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 pt-1 text-[#20E28F]">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                            {step}
                          </ReactMarkdown>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">No specific recommendations were found in your report. This section may require an updated assessment.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection; 