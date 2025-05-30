'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Add props interface
type AnswerHistoryEntry = {
  question: string;
  answer: any;
  phaseName?: string;
  answerType?: string;
  options?: string[] | null;
  reasoningText?: string | null;
  index?: number;
};

interface ScorecardResultsDisplayProps {
  reportMarkdown: string;
  questionAnswerHistory: AnswerHistoryEntry[];
}

const ScorecardResultsDisplay: React.FC<ScorecardResultsDisplayProps> = ({ reportMarkdown, questionAnswerHistory }) => {
  const [showQAHistory, setShowQAHistory] = useState(false);
  const [currentTab, setCurrentTab] = useState<'overview' | 'details' | 'actions'>('overview');
  const [activeSection, setActiveSection] = useState('Key Findings');
  const [sections, setSections] = useState<Record<string, string>>({});
  
  // Function to generate PDF (could be implemented in the future)
  const handleGeneratePDF = () => {
    // Get report ID from storage
    const reportId = typeof window !== 'undefined' ? 
      sessionStorage.getItem('currentReportID') || 
      sessionStorage.getItem('reportId') || 
      localStorage.getItem('currentReportID') || 
      localStorage.getItem('reportId') : null;
    
    if (!reportId) {
      alert("Report ID not found. Unable to generate report.");
      return;
    }
    
    // Open the report in a new tab
    window.open(`/api/generate-pdf?reportId=${reportId}`, '_blank');
  };

  // Function to show Q&A breakdown
  const toggleQAHistory = () => {
    setShowQAHistory(!showQAHistory);
  };
  
  // Build tier distribution from history
  const tierDistribution = useMemo(() => {
    const distribution: Record<string, number> = {
      'Beginner': 0,
      'Intermediate': 0,
      'Advanced': 0
    };
    
    questionAnswerHistory.forEach((item, index) => {
      const answer = typeof item.answer === 'string' ? item.answer : '';
      if (answer.toLowerCase().includes('beginner')) {
        distribution.Beginner++;
      } else if (answer.toLowerCase().includes('intermediate')) {
        distribution.Intermediate++;
      } else if (answer.toLowerCase().includes('advanced')) {
        distribution.Advanced++;
      }
    });
    
    return distribution;
  }, [questionAnswerHistory]);

  // Parse markdown into sections
  const reportSections = useMemo(() => {
    if (!reportMarkdown) return {};
    
    const sections: Record<string, string> = {};
    
    // Extract overall tier
    const tierMatch = reportMarkdown.match(/## Overall Tier: (.+?)($|\n)/);
    if (tierMatch) {
      sections.overallTier = tierMatch[1].trim();
    }
    
    // Extract key findings
    const keyFindingsMatch = reportMarkdown.match(/## Key Findings\s+([\s\S]*?)(?=##|$)/);
    if (keyFindingsMatch) {
      sections.keyFindings = keyFindingsMatch[1].trim();
    }
    
    // Extract strategic action plan
    const actionPlanMatch = reportMarkdown.match(/## Strategic Action Plan\s+([\s\S]*?)(?=##|$)/);
    if (actionPlanMatch) {
      sections.actionPlan = actionPlanMatch[1].trim();
    }
    
    // Extract resources
    const resourcesMatch = reportMarkdown.match(/## Getting Started & Resources\s+([\s\S]*?)(?=##|$)/);
    if (resourcesMatch) {
      sections.resources = resourcesMatch[1].trim();
    }
    
    // Extract benchmarks
    const benchmarksMatch = reportMarkdown.match(/## Illustrative Benchmarks\s+([\s\S]*?)(?=##|$)/);
    if (benchmarksMatch) {
      sections.benchmarks = benchmarksMatch[1].trim();
    }
    
    return sections;
  }, [reportMarkdown]);

  // Group Q&A history by phase using actual phase data when available
  const groupedHistory = useMemo(() => {
    const grouped: Record<string, Array<{ question: string; answer: any; index: number; answerType?: string; options?: string[] | null; reasoningText?: string | null }>> = {};
    
    questionAnswerHistory.forEach((item, index) => {
      // Use provided phase name or fallback to placeholder
      const phase = item.phaseName || 'Assessment';
      
      if (!grouped[phase]) {
        grouped[phase] = [];
      }
      
      grouped[phase].push({
        ...item, 
        index
      });
    });
    
    return grouped;
  }, [questionAnswerHistory]);

  // Parse the markdown into sections
  useEffect(() => {
    const extractedSections: Record<string, string> = {};
    
    // Function to extract sections from markdown
    const extractSections = () => {
      const sectionRegex = /##\s+([^#\n]+)/g;
      let match;
      let lastIndex = 0;
      const sectionStarts: number[] = [];
      
      // Find all section headers
      questionAnswerHistory.forEach((item, index) => {
        const sectionName = `Question ${index + 1}`;
        extractedSections[sectionName] = `## ${sectionName}\n\n**Q:** ${item.question}\n\n**A:** ${item.answer}`;
      });
      
      // Add the reportMarkdown sections
      while ((match = sectionRegex.exec(reportMarkdown)) !== null) {
        sectionStarts.push(match.index);
      }
      
      // Extract content for each section
      for (let i = 0; i < sectionStarts.length; i++) {
        const start = sectionStarts[i];
        const end = i < sectionStarts.length - 1 ? sectionStarts[i + 1] : reportMarkdown.length;
        const sectionContent = reportMarkdown.substring(start, end);
        const titleMatch = sectionContent.match(/##\s+([^#\n]+)/);
        
        if (titleMatch && titleMatch[1]) {
          const title = titleMatch[1].trim();
          extractedSections[title] = sectionContent;
        }
      }
    };
    
    if (reportMarkdown) {
      extractSections();
    }
    
    setSections(extractedSections);
  }, [reportMarkdown, questionAnswerHistory]);

  // Extract tier color based on tier text
  const getTierColor = (tier?: string) => {
    if (!tier) return 'bg-gray-200 text-gray-700';
    if (tier.includes('Leader')) return 'bg-sg-bright-green text-sg-dark-teal';
    if (tier.includes('Enabler')) return 'bg-sg-orange text-white';
    if (tier.includes('Dabbler')) return 'bg-sg-light-blue text-white';
    return 'bg-gray-200 text-gray-700';
  };

  const getTierEmoji = (tier?: string) => {
    if (!tier) return '🔍';
    if (tier.includes('Leader')) return '🏆';
    if (tier.includes('Enabler')) return '📈';
    if (tier.includes('Dabbler')) return '🌱';
    return '🔍';
  };

  // Parse markdown content
  const parseMarkdown = (content: string) => {
    try {
      return { __html: marked(content) };
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return { __html: '<p>Error parsing content</p>' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* Header with tabs */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sg-dark-teal mb-2">
              AI Efficiency Scorecard Report
            </h1>
            <p className="text-base sm:text-lg text-sg-dark-teal/70">
              Insights and recommendations for your organization
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 md:mt-0">
            <button 
              onClick={toggleQAHistory}
              className="sg-button-secondary flex items-center justify-center text-xs sm:text-sm px-3 py-2"
            >
              {showQAHistory ? 'Hide Q&A History' : 'Show Q&A History'}
            </button>
            
            <button 
              onClick={handleGeneratePDF}
              className="sg-button-primary flex items-center justify-center text-xs sm:text-sm px-3 py-2"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H16M8 12H16M8 17H12M4 4.5V19.5C4 19.9644 4 20.1966 4.02567 20.391C4.2029 21.8381 5.16192 22.7971 6.60896 22.9743C6.80336 23 7.03558 23 7.5 23H16.5C16.9644 23 17.1966 23 17.391 22.9743C18.8381 22.7971 19.7971 21.8381 19.9743 20.391C20 20.1966 20 19.9644 20 19.5V4.5C20 4.03558 20 3.80336 19.9743 3.60896C19.7971 2.16192 18.8381 1.2029 17.391 1.02567C17.1966 1 16.9644 1 16.5 1H7.5C7.03558 1 6.80336 1 6.60896 1.02567C5.16192 1.2029 4.2029 2.16192 4.02567 3.60896C4 3.80336 4 4.03558 4 4.5Z" />
              </svg>
              View Report
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs - Mobile responsive */}
        <div className="flex flex-wrap border-b border-gray-200 -mb-px">
          <button
            className={`py-2 sm:py-3 px-3 sm:px-5 border-b-2 font-medium text-xs sm:text-sm ${
              currentTab === 'overview'
                ? 'border-sg-bright-green text-sg-dark-teal'
                : 'border-transparent text-gray-500 hover:text-sg-dark-teal/70'
            }`}
            onClick={() => setCurrentTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 sm:py-3 px-3 sm:px-5 border-b-2 font-medium text-xs sm:text-sm ${
              currentTab === 'details'
                ? 'border-sg-bright-green text-sg-dark-teal'
                : 'border-transparent text-gray-500 hover:text-sg-dark-teal/70'
            }`}
            onClick={() => setCurrentTab('details')}
          >
            Detailed Analysis
          </button>
          <button
            className={`py-2 sm:py-3 px-3 sm:px-5 border-b-2 font-medium text-xs sm:text-sm ${
              currentTab === 'actions'
                ? 'border-sg-bright-green text-sg-dark-teal'
                : 'border-transparent text-gray-500 hover:text-sg-dark-teal/70'
            }`}
            onClick={() => setCurrentTab('actions')}
          >
            Action Plan
          </button>
        </div>
      </div>

      {/* Main Content Area - Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
        {/* Section Navigation Sidebar - Mobile responsive */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4">
            <h3 className="font-semibold text-sg-dark-teal mb-3 sm:mb-4 text-sm sm:text-base">Sections</h3>
            <nav className="space-y-1 sm:space-y-2">
              {Object.keys(sections).map((section) => (
                <button
                  key={section}
                  className={`block w-full text-left px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                    activeSection === section
                      ? 'bg-sg-bright-green text-sg-dark-teal font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </button>
              ))}
              <button
                className={`block w-full text-left px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                  showQAHistory
                    ? 'bg-sg-bright-green text-sg-dark-teal font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={toggleQAHistory}
              >
                Q&A Breakdown
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area - Mobile responsive */}
        <div className="lg:col-span-3">
          {showQAHistory ? (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-sg-dark-teal mb-3 sm:mb-4">Assessment Q&A Breakdown</h2>
              {Object.entries(groupedHistory).map(([phase, items]) => (
                <div key={phase} className="mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-sg-dark-teal mb-3 sm:mb-4">{phase}</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                        <p className="font-semibold text-sg-dark-teal mb-2 text-sm sm:text-base">Q{item.index! + 1}: {item.question}</p>
                        <p className="text-gray-700 text-sm sm:text-base">{item.answer}</p>
                        {item.reasoningText && (
                          <p className="mt-2 text-xs sm:text-sm text-gray-500">
                            <span className="font-semibold">Reasoning:</span> {item.reasoningText}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="prose prose-sm sm:prose-lg max-w-none prose-headings:text-sg-dark-teal prose-headings:font-bold prose-p:text-gray-700"
              dangerouslySetInnerHTML={parseMarkdown(sections[activeSection] || '')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScorecardResultsDisplay; 