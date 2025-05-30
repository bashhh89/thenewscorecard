'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface KeyFindingsSectionProps {
  markdownContent: string;
  userTier?: string;
}

const KeyFindingsSection: React.FC<KeyFindingsSectionProps> = ({ markdownContent, userTier = '' }) => {
  // Split markdown into strengths and weaknesses/improvement areas
  // The weakness section could be labeled as either "**Weaknesses:**" or "### Areas for Improvement:"
  const extractStrengthsAndWeaknesses = (markdown: string) => {
    // First, try to find the strengths section - more robust pattern with multiple formats
    const strengthsRegex = /(?:###\s*Strengths:?|\*\*Strengths:?\*\*|^Strengths:?|\n[Ss]trengths:?)([\s\S]*?)(?:###\s*(?:Weaknesses|Areas for Improvement|Improvement Opportunities):?|\*\*(?:Weaknesses|Areas for Improvement|Improvement Opportunities):?\*\*|^(?:Weaknesses|Areas for Improvement|Improvement Opportunities):?|\n## |\n[Ww]eaknesses:?|\n[Aa]reas for [Ii]mprovement:?|\n[Ii]mprovement [Oo]pportunities:?|$)/i;
    const strengthsMatch = markdown.match(strengthsRegex);
    const strengthsMarkdown = strengthsMatch ? strengthsMatch[1].trim() : '';
    
    // Then try to find the weaknesses/improvement areas section with a more robust pattern
    // Look for both "Weaknesses" and "Areas for Improvement" patterns with various formatting
    const weaknessesRegex = /(?:###\s*(?:Weaknesses|Areas for Improvement|Improvement Opportunities):?|\*\*(?:Weaknesses|Areas for Improvement|Improvement Opportunities):?\*\*|^(?:Weaknesses|Areas for Improvement|Improvement Opportunities):?|\n[Ww]eaknesses:?|\n[Aa]reas for [Ii]mprovement:?|\n[Ii]mprovement [Oo]pportunities:?)([\s\S]*?)(?:\n## |$)/i;
    const weaknessesMatch = markdown.match(weaknessesRegex);
    const weaknessesMarkdown = weaknessesMatch ? weaknessesMatch[1].trim() : '';
    
    console.log('FRONTEND: Extracted strengths:', strengthsMarkdown.substring(0, 50));
    console.log('FRONTEND: Extracted weaknesses:', weaknessesMarkdown.substring(0, 50));
    
    return { strengthsMarkdown, weaknessesMarkdown };
  };

  const { strengthsMarkdown, weaknessesMarkdown } = extractStrengthsAndWeaknesses(markdownContent);

  // Extract bullet points for better display
  const extractBulletPoints = (markdown: string): string[] => {
    // First try to extract markdown bullet points
    const bulletPoints = markdown
      .split('\n')
      .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
      .map(line => line.trim());
    
    // If no bullet points found, try to extract paragraphs as points
    if (bulletPoints.length === 0) {
      return markdown
        .split('\n\n')
        .filter(para => para.trim().length > 0)
        .map(para => para.trim());
    }
    
    return bulletPoints;
  };

  const strengthPoints = extractBulletPoints(strengthsMarkdown);
  const weaknessPoints = extractBulletPoints(weaknessesMarkdown);

  // This function now preserves the markdown formatting instead of stripping it
  const cleanMarkdownText = (text: string): string => {
    // Only clean up bullet points but preserve markdown formatting
    return text
      .replace(/^- /gm, '')
      .replace(/^• /gm, '')
      .trim();
  };

  // Get strength icon based on keyword matching
  const getStrengthIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('strategic') || lowerText.includes('vision') || lowerText.includes('strategy')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3a6 6 0 0 1 6 6M12.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0M3 16v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M3 16a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2M10 8.5A6.5 6.5 0 0 1 3.5 2M3 7V3m4 0H3"></path>
        </svg>
      );
    } else if (lowerText.includes('executive') || lowerText.includes('leadership') || lowerText.includes('sponsor')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    } else if (lowerText.includes('data') || lowerText.includes('infrastructure')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      );
    } else if (lowerText.includes('ethics') || lowerText.includes('governance')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      );
    } else if (lowerText.includes('teams') || lowerText.includes('team') || lowerText.includes('expertise') || lowerText.includes('champion')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    } else if (lowerText.includes('measure') || lowerText.includes('metrics') || lowerText.includes('impact')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
          <line x1="2" y1="20" x2="2" y2="20"></line>
        </svg>
      );
    } else if (lowerText.includes('interest') || lowerText.includes('aware') || lowerText.includes('potential') || lowerText.includes('learn')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
      );
    } else if (lowerText.includes('experiment') || lowerText.includes('initiative') || lowerText.includes('open')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4"></path>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#20E28F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    }
  };

  // Get opportunity icon based on keyword matching
  const getOpportunityIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('scale') || lowerText.includes('scaling')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 3v7h-7M21 3l-11 11M10 4H3v7M3 4l11 11"></path>
        </svg>
      );
    } else if (lowerText.includes('knowledge') || lowerText.includes('sharing') || lowerText.includes('commun')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          <path d="M15 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          <path d="M8 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>
          <path d="M15 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>
          <path d="M10 12h4"></path>
          <path d="M7.5 10.5l5-5"></path>
          <path d="M7.5 13.5l5 5"></path>
        </svg>
      );
    } else if (lowerText.includes('risk') || lowerText.includes('assessment')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      );
    } else if (lowerText.includes('partner') || lowerText.includes('collaboration')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 12V6.5a2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 0 5H15"></path>
          <path d="M9 12V6.5a2.5 2.5 0 0 0-2.5-2.5 2.5 2.5 0 0 0 0 5H9"></path>
          <path d="M9 14h6"></path>
          <path d="M15 17.5V20"></path>
          <path d="M9 17.5V20"></path>
        </svg>
      );
    } else if (lowerText.includes('diversity') || lowerText.includes('bias')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      );
    } else if (lowerText.includes('data') || lowerText.includes('silos')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 5c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1z"></path>
          <path d="M21 13c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1z"></path>
          <path d="M21 21c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1z"></path>
        </svg>
      );
    } else if (lowerText.includes('strategy') || lowerText.includes('formal') || lowerText.includes('plan')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#103138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
      );
    }
  };

  // Default strengths for Dabbler tier if none are extracted
  const dabblerDefaultStrengths = [
    "Initiative in exploring AI potential for your business",
    "Awareness of AI's transformative capabilities",
    "Willingness to learn and adapt to new technologies"
  ];

  // Check if we need to use default strengths
  const shouldUseDefaultStrengths = userTier === 'Dabbler' && strengthPoints.length === 0;
  const displayedStrengthPoints = shouldUseDefaultStrengths ? dabblerDefaultStrengths : strengthPoints;

  // Generate titles for each strength and weakness from the text
  const generateTitle = (text: string): string => {
    // Extract the first sentence or a portion of the text
    const firstSentence = text.split(/\.\s+/)[0] + '.';
    if (firstSentence.length < 50) return firstSentence;
    
    // If the first sentence is too long, get the first phrase
    const firstPhrase = text.split(/,|\.|;/)[0];
    if (firstPhrase.length < 60) return firstPhrase + '.';
    
    // Otherwise truncate to reasonable length for a title
    return firstPhrase.substring(0, 50) + '...';
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="icon-wrapper-sg-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 10.5L11 12.5L15.5 8M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" 
                  stroke="#20E28F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Key Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none text-sg-dark-teal/80">
            <p>
              Based on your assessment responses, we've identified these key strengths and areas for improvement in your organization's AI maturity.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strengths Column */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 border-l-4 border-l-sg-bright-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-sg-dark-teal">
              <span className="p-1.5 rounded-full bg-sg-light-mint">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sg-bright-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedStrengthPoints.length > 0 ? (
                displayedStrengthPoints.map((point, idx) => (
                  <div key={`strength-${idx}`} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getStrengthIcon(point)}
                    </div>
                    <div className="prose prose-sm max-w-none text-sg-dark-teal/90">
                      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                        {point}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sg-dark-teal/80 italic">No specific strengths were identified. This could indicate an early stage in your AI journey.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weaknesses/Improvement Areas Column */}
        <Card className="p-6 border-l-4 border-l-sg-dark-teal">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-sg-dark-teal">
              <span className="p-1.5 rounded-full bg-sg-light-mint">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#103138" className="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </span>
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weaknessPoints.length > 0 ? (
                weaknessPoints.map((point, idx) => (
                  <div key={`weakness-${idx}`} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getOpportunityIcon(point)}
                    </div>
                    <div className="prose prose-sm max-w-none text-sg-dark-teal/90">
                      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                        {point}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sg-dark-teal/80 italic">No specific improvement areas were identified. This could indicate excellent AI maturity across all dimensions.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KeyFindingsSection;
