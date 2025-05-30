'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface DetailedAnalysisSectionProps {
  markdownContent: string;
  questionAnswerHistory?: any[];
}

const DetailedAnalysisSection: React.FC<DetailedAnalysisSectionProps> = ({ 
  markdownContent,
  questionAnswerHistory = [] 
}) => {
  // Extract the detailed analysis section from markdown
  const extractDetailedAnalysisContent = (content: string): string => {
    // Look for section titles that might contain detailed analysis
    const sectionMatches = content.match(/## (Detailed Analysis|Assessment Breakdown|Category Analysis|Analysis|Breakdown|Detailed Findings)[:\s]*([\s\S]*?)(?=##|$)/i);
    
    if (sectionMatches && sectionMatches[2]) {
      return sectionMatches[2].trim();
    }
    
    // If no specific section found, return empty string
    return '';
  };

  const analysisContent = extractDetailedAnalysisContent(markdownContent);
  
  // Predefined phases to ensure all 5 key phases are shown
  const predefinedPhases = [
    {
      id: 'strategy',
      title: 'AI Strategy & Vision',
      description: 'How your organization approaches AI strategy and aligns it with business goals.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      id: 'data',
      title: 'Data Infrastructure & Management',
      description: 'Your data collection, storage, quality, and governance practices.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      id: 'technology',
      title: 'AI Technology & Tools',
      description: 'The AI applications, tools, and technologies currently used in your organization.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      bgColor: "from-purple-50 to-indigo-50"
    },
    {
      id: 'team',
      title: 'Team & Process',
      description: 'Your team structure, skills, training, and AI implementation processes.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      bgColor: "from-amber-50 to-yellow-50"
    },
    {
      id: 'governance',
      title: 'AI Governance & Ethics',
      description: 'Your approach to AI ethics, safety, responsibility, and regulatory compliance.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      bgColor: "from-red-50 to-orange-50"
    }
  ];

  // Clean and format content to prevent markdown rendering issues
  const cleanMarkdownContent = (content: string) => {
    // Don't replace markdown symbols with HTML - let ReactMarkdown handle it properly
    return content;
  };

  // Enhanced phase content extraction
  const extractPhaseContent = (phaseId: string): string => {
    // Expanded keywords for better content matching
    const phaseKeywords: Record<string, string[]> = {
      'strategy': ['strategy', 'vision', 'goals', 'planning', 'roadmap', 'leadership', 'mission', 'objective', 'alignment', 'executive', 'sponsor', 'plan', 'strategic', 'business alignment', 'direction'],
      'data': ['data', 'collection', 'management', 'storage', 'quality', 'analytics', 'database', 'source', 'warehouse', 'lake', 'information', 'ingestion', 'processing', 'pipeline', 'architecture'],
      'technology': ['technology', 'tools', 'platform', 'infrastructure', 'models', 'solutions', 'applications', 'software', 'hardware', 'algorithm', 'machine learning', 'ai', 'automation', 'tech stack', 'capability'],
      'team': ['team', 'skills', 'training', 'process', 'culture', 'adoption', 'collaboration', 'staff', 'talent', 'hiring', 'capability', 'competency', 'education', 'workforce', 'expertise', 'knowledge'],
      'governance': ['governance', 'ethics', 'compliance', 'risk', 'policy', 'regulation', 'responsible', 'accountability', 'oversight', 'principles', 'guidelines', 'standards', 'privacy', 'framework', 'security']
    };

    // 1. First, try to find dedicated sections with headers
    const keywordList = phaseKeywords[phaseId];
    for (const keyword of keywordList) {
      // Look for headers that include the keyword
      const headerRegex = new RegExp(`###\\s*([^\\n]*${keyword}[^\\n]*)\\s*([\\s\\S]*?)(?=###|$)`, 'i');
      const headerMatch = analysisContent.match(headerRegex);
      if (headerMatch && headerMatch[2]) {
        return headerMatch[2].trim();
      }
    }

    // 2. Look for paragraphs that might be dedicated to this phase topic
    const combinedKeywords = phaseKeywords[phaseId].join('|');
    const paragraphRegex = new RegExp(`((?:[^\\n]+(?:${combinedKeywords})[^\\n]*\\n(?:[^\\n#][^\\n]*\\n){0,5})+)`, 'gi');
    const paragraphMatches = [...analysisContent.matchAll(paragraphRegex)];
    
    if (paragraphMatches.length > 0) {
      // Take the longest match as it's likely the most comprehensive
      let bestMatch = '';
      for (const match of paragraphMatches) {
        if (match[1].length > bestMatch.length) {
          bestMatch = match[1];
        }
      }
      return bestMatch.trim();
    }

    // 3. Fallback: Extract sentences that mention keywords
    const sentences = analysisContent
      .replace(/\n+/g, ' ')
      .split(/(?<=[.!?])\s+/);
    
    const relevantSentences = sentences.filter(sentence => {
      return phaseKeywords[phaseId].some(keyword => 
        sentence.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    if (relevantSentences.length > 0) {
      return relevantSentences.join(' ').trim();
    }

    // If we still don't have content, return a helpful default message
    return `No specific insights about ${predefinedPhases.find(p => p.id === phaseId)?.title} were identified in your assessment. This may indicate an opportunity to focus on this area in your AI strategy.`;
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <Card className="p-6 bg-gradient-to-br from-white to-sg-light-mint/30 border-l-4 border-l-sg-bright-green">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-sg-dark-teal">
            <span className="icon-wrapper-sg-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 10.5L11 12.5L15.5 8M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" 
                  stroke="#20E28F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none text-sg-dark-teal/80">
            <p>
              This detailed breakdown shows your performance across key dimensions of AI maturity. 
              For each category, we analyze your strengths, challenges, and provide specific insights to help guide your improvement efforts.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Phase-based Analysis Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {predefinedPhases.map((phase) => {
          // Extract phase-specific content
          const phaseContent = extractPhaseContent(phase.id);
          
          return (
            <Card 
              key={phase.id} 
              className={`p-6 shadow-lg bg-gradient-to-br ${phase.bgColor} hover:shadow-xl transition-all`}
            >
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-sg-dark-teal">
                  <span className="icon-wrapper-sg-primary text-sg-bright-green p-1 rounded-full bg-white/80 shadow-sm">
                    {phase.icon}
                  </span>
                  {phase.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-sg-dark-teal/70 mb-3 border-l-2 border-sg-bright-green/30 pl-3">{phase.description}</p>
                <div className="prose prose-lg max-w-none text-sg-dark-teal/90 prose-headings:text-sg-dark-teal prose-headings:font-bold prose-p:text-sg-dark-teal/90 prose-a:text-sg-bright-green prose-a:no-underline hover:prose-a:underline prose-strong:text-sg-dark-teal prose-strong:font-semibold prose-li:text-sg-dark-teal/90">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {phaseContent}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Include the category Q&A breakdown if there are questions */}
      {questionAnswerHistory.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-white to-sg-light-mint/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-sg-dark-teal">
              <span className="icon-wrapper-sg-primary text-sg-bright-green">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </span>
              Assessment Question Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questionAnswerHistory.slice(0, 5).map((qa, idx) => (
                <div key={idx} className="border-b border-sg-light-mint/30 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-semibold text-sg-dark-teal mb-2 flex items-center gap-2">
                    <span className="h-5 w-5 bg-sg-bright-green/10 rounded-full flex items-center justify-center text-xs text-sg-bright-green font-bold">{idx + 1}</span>
                    {qa.question}
                  </h4>
                  <p className="text-sg-dark-teal/80 pl-7">
                    {typeof qa.answer === 'string' 
                      ? qa.answer 
                      : Array.isArray(qa.answer) 
                        ? qa.answer.join(', ') 
                        : JSON.stringify(qa.answer)}
                  </p>
                </div>
              ))}
              {questionAnswerHistory.length > 5 && (
                <div className="flex justify-center">
                  <div className="text-center py-2 px-4 bg-sg-light-mint/30 rounded-full text-sm text-sg-dark-teal/60 shadow-inner">
                    Showing 5 of {questionAnswerHistory.length} assessment questions
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedAnalysisSection;