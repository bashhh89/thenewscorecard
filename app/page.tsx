'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ScorecardQuestionDisplay from '@/components/ScorecardQuestionDisplay';
import ScorecardResultsDisplay from '@/components/ScorecardResultsDisplay';
import LeadCaptureForm from '@/components/scorecard/LeadCaptureForm';
import NoSidebarLayout from '@/components/NoSidebarLayout';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase'; // Fixed path to firebase.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation'; // For navigating to results page with reportId
import ReportLoadingIndicator from '@/components/scorecard/ReportLoadingIndicator'; // Add import for loading indicator

// Temporary function until we implement proper utils
const isAutoCompleteEnabled = () => true;

// Professional Header Component
const AssessmentHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-sg-dark-teal/95 backdrop-blur-sm border-b border-sg-bright-green/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="w-36 sm:w-40 flex-shrink-0">
              <img 
                src="/footer-logo.svg" 
                alt="Social Garden Logo" 
                className="h-9 sm:h-10 w-auto"
              />
            </div>
          </div>
          
          {/* Desktop Navigation & CTA */}
          <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <a href="https://socialgarden.com.au/" className="text-white/80 hover:text-sg-bright-green transition-all duration-200 font-medium font-plus-jakarta text-sm">
                Home
              </a>
              <div className="relative">
                <div className="text-sg-bright-green font-bold font-plus-jakarta text-sm">
                  Assessment
                </div>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sg-bright-green to-sg-light-blue rounded-full"></div>
              </div>
              <a href="https://socialgarden.com.au/contact/" className="text-white/80 hover:text-sg-bright-green transition-all duration-200 font-medium font-plus-jakarta text-sm">
                Contact
              </a>
            </div>
            
            {/* Enhanced Trust Badge - Hide on small mobile */}
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-sg-bright-green/10 to-sg-light-blue/10 px-3 py-2 rounded-full border border-sg-bright-green/30 shadow-sm">
              <svg className="w-4 h-4 text-sg-bright-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs sm:text-sm font-bold text-white font-plus-jakarta whitespace-nowrap">100% Free Assessment</span>
            </div>

            {/* Mobile menu button - Always visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 relative flex flex-col justify-center">
                <span className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pt-4 pb-6 space-y-3 bg-sg-dark-teal border-t border-sg-bright-green/20">
            {/* Mobile Trust Badge */}
            <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-sg-bright-green/10 to-sg-light-blue/10 px-4 py-3 rounded-lg border border-sg-bright-green/30 shadow-sm mb-4">
              <svg className="w-4 h-4 text-sg-bright-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-bold text-white font-plus-jakarta">100% Free Assessment</span>
            </div>
            
            {/* Navigation Links */}
            <a 
              href="https://socialgarden.com.au/" 
              className="block px-4 py-3 text-white/80 hover:text-sg-bright-green hover:bg-white/5 transition-colors font-medium font-plus-jakarta text-lg rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </a>
            <div className="block px-4 py-3 rounded-lg bg-sg-bright-green/10">
              <div className="text-sg-bright-green font-bold font-plus-jakarta text-lg">
                Assessment
              </div>
            </div>
            <a 
              href="https://socialgarden.com.au/contact/" 
              className="block px-4 py-3 text-white/80 hover:text-sg-bright-green hover:bg-white/5 transition-colors font-medium font-plus-jakarta text-lg rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

// Professional Footer Component
const AssessmentFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-sg-dark-teal to-[#135e69] text-white mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
          <div className="w-32 sm:w-36 flex-shrink-0">
            <img 
              src="/footer-logo.svg" 
              alt="Social Garden Logo" 
              className="h-8 sm:h-9 w-auto"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="https://socialgarden.com.au/" className="text-white hover:text-sg-bright-green transition-colors font-plus-jakarta text-sm sm:text-base">Home</a>
            <a href="/" className="text-white hover:text-sg-bright-green transition-colors font-plus-jakarta text-sm sm:text-base">AI Scorecard</a>
            <a href="https://socialgarden.com.au/contact/" className="text-white hover:text-sg-bright-green transition-colors font-plus-jakarta text-sm sm:text-base">Contact</a>
          </div>
        </div>

        {/* Address Section - Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300 border-t border-white/20 pt-6 mb-6">
          <div>
            <p className="text-white font-semibold mb-1 font-plus-jakarta">Melbourne</p>
            <p>1800 771 396</p>
            <p>Level 8, The Hive</p>
            <p>Abbotsford</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1 font-plus-jakarta">Auckland</p>
            <p>268 Karangahape Rd</p>
            <p>Auckland CBD</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1 font-plus-jakarta">Sydney</p>
            <p>Level 3, 100 Harris St</p>
            <p>Pyrmont, NSW</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1 font-plus-jakarta">Brisbane</p>
            <p>310 Edward St</p>
            <p>Brisbane City, QLD</p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-sm text-gray-400 border-t border-white/20 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="font-plus-jakarta">© 2024 Social Garden. All rights reserved.</p>
            <p className="font-plus-jakarta mt-2 sm:mt-0">Your trusted partner for AI-powered marketing solutions.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Define the ScorecardState interface
type AnswerSourceType = 'Groq Llama 3 8B' | 'Pollinations Fallback' | 'Groq API Failed' | 'Fallback Failed' | 'Manual';
interface ScorecardHistoryEntry {
  question: string;
  answer: any;
  phaseName?: string;
  answerType?: string;
  options?: string[] | null;
  reasoningText?: string | null;
  answerSource?: AnswerSourceType;
}
interface ScorecardState {
  currentPhaseName: string;
  currentQuestion: string | null;
  answerType: string | null;
  options: string[] | null;
  history: ScorecardHistoryEntry[];
  isLoading: boolean;
  error: string | null;
  overall_status: string; // 'assessment-in-progress' | 'assessment-completed' | 'results-generated' etc.
  reportMarkdown: string | null;
  reasoningText: string | null; // Added for AI thinking display
  industry: string;
  currentQuestionNumber: number;
  maxQuestions: number;
  assessmentPhases: string[];
}

// Define the industry selection UI component with clean, horizontal design
const IndustrySelection = ({
  industries,
  selectedIndustry,
  handleIndustryChange,
  startAssessment,
  leadCaptured,
  scorecardState
}: {
  industries: string[],
  selectedIndustry: string,
  handleIndustryChange: (industry: string) => void,
  startAssessment: () => void,
  leadCaptured: boolean,
  scorecardState: ScorecardState
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sg-light-mint via-white to-sg-cream-1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sg-dark-teal font-plus-jakarta mb-6">
            AI Maturity Assessment
          </h1>
          <p className="text-xl text-sg-dark-teal/70 font-plus-jakarta max-w-2xl mx-auto">
            {scorecardState.isLoading ? 'Preparing your personalized assessment...' : 'Select your industry to begin'}
          </p>
        </div>
        
        {/* Loading Overlay */}
        {scorecardState.isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sg-bright-green to-sg-dark-teal rounded-full mb-4">
                  <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-sg-dark-teal font-plus-jakarta mb-2">
                  Preparing Your Assessment
                </h3>
                <p className="text-sg-dark-teal/70 font-plus-jakarta">
                  We're generating personalized questions for the {selectedIndustry} industry...
                </p>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-sg-bright-green rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-sg-bright-green rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-sg-bright-green rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Industry Selection Grid - Horizontal Layout */}
        <div className={`bg-white rounded-2xl shadow-xl border border-sg-bright-green/10 p-8 sm:p-12 transition-opacity duration-300 ${scorecardState.isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Industry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {industries.map((industry) => {
              const isSelected = selectedIndustry === industry;
              
              return (
                <button
                  key={industry}
                  onClick={() => handleIndustryChange(industry)}
                  disabled={scorecardState.isLoading}
                  className={`
                    text-left px-6 py-5 rounded-xl border-2 transition-all duration-300 
                    focus:outline-none focus:ring-3 focus:ring-sg-dark-teal/20 group
                    ${scorecardState.isLoading ? 'cursor-not-allowed opacity-50' : ''}
                    ${isSelected 
                      ? 'border-sg-dark-teal bg-sg-dark-teal text-white shadow-lg scale-[1.02]' 
                      : 'border-gray-200 bg-white hover:border-sg-dark-teal/50 hover:bg-sg-dark-teal/10 hover:scale-[1.01] shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center flex-shrink-0
                      ${isSelected 
                        ? 'border-white bg-white shadow-md' 
                        : 'border-gray-300 group-hover:border-sg-dark-teal/60'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-sg-dark-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`
                      font-plus-jakarta text-lg transition-all duration-300
                      ${isSelected ? 'text-white font-bold' : 'text-sg-dark-teal/90 group-hover:text-sg-dark-teal'}
                    `}>
                      {industry}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              id="begin-assessment-button"
              onClick={startAssessment}
              disabled={!selectedIndustry || scorecardState.isLoading}
              variant="default"
              size="lg"
              className={`
                px-12 py-6 rounded-xl font-bold font-plus-jakarta text-xl shadow-xl 
                transition-all duration-300 transform
                ${selectedIndustry && !scorecardState.isLoading
                  ? 'bg-sg-dark-teal hover:bg-sg-dark-teal/90 hover:scale-[1.02] hover:shadow-2xl text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-center gap-3">
                {scorecardState.isLoading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Starting Assessment...</span>
                  </>
                ) : (
                  <>
                    <span>Begin Assessment</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </div>
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// Create an enhanced Question Card component
interface AssessmentQuestionProps {
  scorecardState: ScorecardState;
  memoizedOptions: string[] | null;
  memoizedReasoningText: string | null;
  handleAnswerSubmit: (answer: any, answerSource?: AnswerSourceType) => void;
  isAutoCompleting: boolean;
  memoizedSetIsAutoCompleting: (val: boolean) => void;
  memoizedSetAutoCompleteError: (msg: string | null) => void; // Corrected prop name
  handleStartAutoComplete: () => void;
  autoCompleteCount: number;
  memoizedHistory: ScorecardHistoryEntry[];
  selectedIndustry: string;
  autoCompleteError: string | null; // Add autoCompleteError to props
}

const AssessmentQuestion: React.FC<AssessmentQuestionProps> = ({
  scorecardState,
  memoizedOptions,
  memoizedReasoningText,
  handleAnswerSubmit,
  isAutoCompleting,
  memoizedSetIsAutoCompleting,
  memoizedSetAutoCompleteError,
  handleStartAutoComplete,
  autoCompleteCount,
  memoizedHistory,
  selectedIndustry,
  autoCompleteError, // Destructure autoCompleteError from props
}) => {
  // Add notification when approaching lead form threshold
  const LEAD_FORM_THRESHOLD = 20; // Show lead form after 20 questions (with 0 remaining)
  const isApproachingLeadForm = scorecardState.currentQuestionNumber >= LEAD_FORM_THRESHOLD - 2 &&
                                scorecardState.currentQuestionNumber < LEAD_FORM_THRESHOLD && 
                                !isAutoCompleting;

  return (
    <div className="px-2 sm:px-4 lg:px-8">
      {/* Notification about upcoming lead form - Mobile optimized */}
      {isApproachingLeadForm && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-sg-light-mint border-l-4 border-sg-bright-green rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-sg-dark-teal font-medium font-plus-jakarta">
                You're almost done with the assessment!
              </p>
              <p className="text-xs sm:text-sm text-sg-dark-teal/80 mt-1 font-plus-jakarta">
                After a few more questions, we'll ask for your details to complete your personalized AI efficiency report.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auto-complete error message - Mobile optimized */}
      {autoCompleteError && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-medium font-plus-jakarta text-sm">Auto-Complete Error</p>
          <p className="font-plus-jakarta text-sm">{autoCompleteError}</p>
        </div>
      )}

      {/* Assessment Question */}
      {scorecardState.currentQuestion ? (
        <ScorecardQuestionDisplay
          question={scorecardState.currentQuestion}
          answerType={scorecardState.answerType || 'text'}
          options={memoizedOptions}
          onSubmitAnswer={handleAnswerSubmit}
          isLoading={scorecardState.isLoading}
          currentPhaseName={scorecardState.currentPhaseName}
          currentQuestionNumber={scorecardState.currentQuestionNumber}
          maxQuestions={scorecardState.maxQuestions}
          assessmentPhases={scorecardState.assessmentPhases}
          reasoningText={memoizedReasoningText || undefined}
          isAutoCompleting={isAutoCompleting}
          setIsAutoCompleting={memoizedSetIsAutoCompleting}
          setAutoCompleteError={memoizedSetAutoCompleteError}
          handleStartAutoComplete={handleStartAutoComplete}
          overallStatus={scorecardState.overall_status}
          questionAnswerHistory={memoizedHistory}
          industry={selectedIndustry}
        />
      ) : (
        <div className="text-center p-6 sm:p-12 border border-gray-200 rounded-lg mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-gray-600 font-plus-jakarta">Loading your assessment questions...</p>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  // Router for navigation
  const router = useRouter();

  // --- TEMPORARY FOR TESTING RESULTS PAGE ---
  const [currentStep, setCurrentStep] = useState<string>('industrySelection'); // Start at industry selection
  // --- END TEMPORARY CHANGES ---

  // Define state for selected industry
  const [selectedIndustry, setSelectedIndustry] = useState<string>("Property/Real Estate");

  // Define the initial state for the scorecard
  const initialScorecardState: ScorecardState = {
    currentPhaseName: "Strategy", // Default to first phase
    currentQuestion: null,
    answerType: null,
    options: null,
    history: [],
    isLoading: false,
    error: null,
    reportMarkdown: null, // No pre-populated report
    overall_status: 'assessment-in-progress', // Start in progress
    reasoningText: null, // Initialize as null
    industry: "Property/Real Estate",
    currentQuestionNumber: 1,
    maxQuestions: 20,
    assessmentPhases: ["Strategy", "Data", "Tech", "Team/Process", "Governance"],
  };

  // Define state for scorecard
  const [scorecardState, setScorecardState] = useState<ScorecardState>(initialScorecardState);

  // Define state for lead capture
  const [leadCaptured, setLeadCaptured] = useState<boolean>(false);
  // Add state for storing lead name for personalization
  const [leadName, setLeadName] = useState<string>('');

  // Define the list of industries
  const industries = [
    "Property/Real Estate", "Higher Education", "B2B Tech/SaaS",
    "Financial Services", "Automotive", "E-commerce", "B2B",
    "Not for Profit", "Aged Care", "Retired Living", "Other"
  ];

  // Define constants
  const MAX_QUESTIONS = 20; // Match the value in the API route
  const ASSESSMENT_PHASES = ["Strategy", "Data", "Tech", "Team/Process", "Governance"]; // Match API phases
  // Define when to show the lead form - after completing this many questions
  const LEAD_FORM_THRESHOLD = 20; // Show lead form after 20 questions (with 0 remaining)

  // Define isAutoCompleting state
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  // Add autoCompleteError state
  const [autoCompleteError, setAutoCompleteError] = useState<string | null>(null);

  // Memoize reasoningText to prevent unnecessary re-renders of ScorecardQuestionDisplay
  const memoizedReasoningText = useMemo(() => scorecardState.reasoningText, [scorecardState.reasoningText]);

  // Memoize options array
  const memoizedOptions = useMemo(
    () => scorecardState.options ? [...scorecardState.options] : [],
    [scorecardState.options]
  );

  // Memoize history array
  const memoizedHistory = useMemo(
    () => scorecardState.history ? [...scorecardState.history] : [],
    [scorecardState.history]
  );

  // Memoize question object (if you want to pass as a single object)
  const memoizedQuestion = useMemo(
    () => scorecardState.currentQuestion
      ? {
          questionText: scorecardState.currentQuestion,
          answerType: scorecardState.answerType,
          options: scorecardState.options,
        }
      : null,
    [scorecardState.currentQuestion, scorecardState.answerType, scorecardState.options]
  );

  // Memoize setIsAutoCompleting
  const memoizedSetIsAutoCompleting = useCallback(setIsAutoCompleting, []);
  // Memoize setAutoCompleteError
  const memoizedSetAutoCompleteError = useCallback(setAutoCompleteError, []);

  // Add new state for final report generation loading indicator
  const [isGeneratingFinalReport, setIsGeneratingFinalReport] = useState(false);
  const [autoCompleteCount, setAutoCompleteCount] = useState(0);

  // In the Home function, add this variable to track feature availability
  const autoCompleteFeatureEnabled = isAutoCompleteEnabled();

  // Moved function definitions earlier to avoid linter errors
  const startActualAssessment = useCallback(async () => {
    // Prevent multiple clicks by checking if already loading
    if (scorecardState.isLoading) {
      console.log('Frontend: Already loading, ignoring duplicate click');
      return;
    }

    console.log('Frontend: Starting assessment with industry:', selectedIndustry);

    // Add a timestamp for debugging
    const startTime = new Date().getTime();

    // Set loading state FIRST to prevent multiple clicks
    setScorecardState(prev => ({
      ...initialScorecardState,
      industry: selectedIndustry,
      isLoading: true,
      error: null,
      currentQuestion: null // Keep null until we have the actual question
    }));

    // Force UI update to reflect loading state immediately before making the API call
    // This will guarantee the loading state is visibly set before API call begins
    await new Promise(resolve => setTimeout(resolve, 10));

    // DON'T change step yet - keep showing the loading overlay until question is ready

    // Immediately disable auto-complete and clear errors
    setIsAutoCompleting(false);
    setAutoCompleteError(null);

    // Add references to track UI button state
    const button = document.getElementById('begin-assessment-button');
    if (button) {
      button.setAttribute('disabled', 'true');
      button.classList.add('opacity-50', 'cursor-not-allowed');
    }

    try {
      console.log('Frontend: Initiating API call for first question at', new Date().toISOString());
      const response = await fetch('/api/scorecard-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          currentPhaseName: initialScorecardState.currentPhaseName,
          history: initialScorecardState.history,
          industry: selectedIndustry,
          // Add timestamp to prevent caching
          timestamp: startTime
        }),
        // Add cache: 'no-store' to prevent caching issues
        cache: 'no-store',
      });
      console.log('Frontend: Initial API call sent for industry:', selectedIndustry);
      console.log('Frontend: API response received in', new Date().getTime() - startTime, 'ms');

      // Check response content type before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse.substring(0, 200));
        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          error: `Server returned non-JSON response: ${contentType || 'unknown'}`
        }));
        return;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        const detailedErrorMessage = `Failed to start assessment. Status: ${response.status}. Body: ${errorBody}`;
        console.error('API error:', detailedErrorMessage);
        setScorecardState(prev => ({ ...prev, isLoading: false, error: detailedErrorMessage }));
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError: any) {
        console.error('JSON parse error:', jsonError);
        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          error: `Failed to parse server response as JSON. Error: ${jsonError.message}`
        }));
        return;
      }

      console.log('Frontend: Received first question data, updating state:', data);
      
      // Only update state and change step when we have a valid question
      if (data.questionText && data.questionText.trim() !== '') {
        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          currentQuestion: data.questionText,
          answerType: data.answerType,
          options: data.options,
          currentPhaseName: data.currentPhaseName,
          overall_status: data.overall_status,
          reasoningText: data.reasoning_text,
          currentQuestionNumber: 1
        }));
        
        // NOW change the step to assessment since we have a valid question
        setCurrentStep('assessment');
      } else {
        // If no valid question, show error
        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No question received from the server. Please try again.'
        }));
      }
    } catch (error: any) {
      console.error('Frontend: Error in startActualAssessment:', error);
      setScorecardState(prev => ({
        ...prev,
        isLoading: false,
        error: `An unexpected error occurred in startAssessment: ${error.message || 'Unknown error'}`
      }));

      // Re-enable the button in case of error
      if (button) {
        button.removeAttribute('disabled');
        button.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }
  }, [
    selectedIndustry,
    initialScorecardState,
    setIsAutoCompleting,
    setAutoCompleteError,
    setCurrentStep,
    scorecardState.isLoading
  ]);

  // --- Stabilize generateReport (Dependency: selectedIndustry) ---
  const generateReport = useCallback(async (finalHistory: ScorecardHistoryEntry[]) => {
    console.log(`FRONTEND: generateReport started at: ${new Date().toISOString()}`);
    const startTime = Date.now(); // For overall duration
    
    console.log('>>> FRONTEND: Generating report for industry:', selectedIndustry);
    console.log('>>> FRONTEND: History length:', finalHistory.length);

    // Set loading state
    setIsGeneratingFinalReport(true);

    // Safety timeout to prevent infinite loading - INCREASED FROM 60 TO 120 SECONDS
    const safetyTimeout = setTimeout(() => {
      console.error(`FRONTEND: Report generation timed out at: ${new Date().toISOString()}. Started at: ${new Date(startTime).toISOString()}`);
      setIsGeneratingFinalReport(false);
      // Show a user-friendly error message when this happens
      alert('We apologize, but generating your report is taking longer than expected. Please try again.');
    }, 120000); // 120 second timeout (increased from 60 seconds)

    try {
      // Generate report data
      console.log(`FRONTEND: Calling /api/scorecard-ai for full report at: ${new Date().toISOString()}`);
      const apiCallStartTime = Date.now();
      
      const response = await fetch('/api/scorecard-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateReport',
          history: finalHistory.slice(0, MAX_QUESTIONS),
          industry: selectedIndustry,
          userName: leadName
        }),
      });
      
      console.log(`FRONTEND: Received response from /api/scorecard-ai at: ${new Date().toISOString()}. Duration: ${(Date.now() - apiCallStartTime) / 1000}s`);

      if (!response.ok) {
        throw new Error(`Failed to generate report. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`FRONTEND: Parsed response JSON at: ${new Date().toISOString()}`);
      console.log(`FRONTEND: Response has reportMarkdown: ${!!data.reportMarkdown}, length: ${data.reportMarkdown?.length || 0}`);

      // CRITICAL DEBUG - Log the entire report content
      console.log('>>> FRONTEND: Report data received from API:');
      console.log('userAITier:', data.userAITier);
      console.log('reportMarkdown length:', data.reportMarkdown?.length);
      console.log('reportMarkdown snippet:', data.reportMarkdown?.substring(0, 200) + '...');

      // Check if the reportMarkdown is empty or missing
      if (!data.reportMarkdown || data.reportMarkdown.trim() === '') {
        console.error('>>> FRONTEND: CRITICAL ERROR - Empty reportMarkdown received from API');
        throw new Error('Empty report content received from API');
      }

      // Verify tier is present
      if (!data.userAITier || data.userAITier === 'Unknown') {
        console.warn('>>> FRONTEND: WARNING - User tier is missing or Unknown in API response');
        // Extract tier from markdown if possible
        const tierMatch = data.reportMarkdown.match(/## Overall Tier:?\s*(.+?)($|\n)/i);
        if (tierMatch && tierMatch[1]) {
          data.userAITier = tierMatch[1].trim();
          console.log('>>> FRONTEND: Extracted tier from markdown:', data.userAITier);
        }
      }

      // Prepare report data for Firestore
      const reportData = {
        leadName: leadName || null,
        leadEmail: sessionStorage.getItem('scorecardLeadEmail') || null,
        leadCompany: sessionStorage.getItem('scorecardLeadCompany') || null,
        leadPhone: sessionStorage.getItem('scorecardLeadPhone') || null,
        industry: selectedIndustry,
        userAITier: data.userAITier || 'Unknown',
        aiTier: data.userAITier || 'Unknown',
        tier: data.userAITier || 'Unknown', // Add explicit tier field
        reportMarkdown: data.reportMarkdown,
        questionAnswerHistory: finalHistory.slice(0, MAX_QUESTIONS),
        systemPromptUsed: data.systemPromptUsed,
        createdAt: serverTimestamp(),
        overallStatus: 'completed'
      };

      // Log the full reportData object before saving to Firestore
      console.log('>>> FRONTEND: FULL REPORT DATA OBJECT BEING SAVED TO FIRESTORE:');
      console.log('reportData:', JSON.stringify({
        ...reportData,
        reportMarkdown: reportData.reportMarkdown?.substring(0, 100) + '... [truncated]',
        questionAnswerHistory: `[${reportData.questionAnswerHistory.length} entries]`,
        systemPromptUsed: reportData.systemPromptUsed?.substring(0, 100) + '... [truncated]'
      }, null, 2));

      // Save to Firestore
      try {
        console.log(`FRONTEND: Calling saveScorecardReport at: ${new Date().toISOString()}`);
        const firestoreSaveStartTime = Date.now();

        const docRef = await addDoc(collection(db, "scorecardReports"), reportData);
        const reportID = docRef.id;
        
        console.log(`FRONTEND: saveScorecardReport completed at: ${new Date().toISOString()}. Duration: ${(Date.now() - firestoreSaveStartTime) / 1000}s`);
        console.log(">>> FRONTEND: Report saved to Firestore with ID: ", reportID);

        // Store data in sessionStorage
        sessionStorage.setItem('reportMarkdown', data.reportMarkdown);
        sessionStorage.setItem('questionAnswerHistory', JSON.stringify(finalHistory.slice(0, MAX_QUESTIONS)));
        sessionStorage.setItem('systemPromptUsed', data.systemPromptUsed);
        sessionStorage.setItem('reportId', reportID);
        sessionStorage.setItem('currentReportID', reportID);
        sessionStorage.setItem('userAITier', data.userAITier || 'Unknown');
        sessionStorage.setItem('aiTier', data.userAITier || 'Unknown');
        sessionStorage.setItem('tier', data.userAITier || 'Unknown');
        sessionStorage.setItem('userTier', data.userAITier || 'Unknown');
        sessionStorage.setItem('finalScore', data.finalScore || '');
        sessionStorage.setItem('industry', selectedIndustry || '');

        // Create and store consolidated userData object for debug session
        const userData = {
          leadName: leadName || '',
          name: leadName || '',
          companyName: sessionStorage.getItem('scorecardLeadCompany') || '',
          email: sessionStorage.getItem('scorecardLeadEmail') || '',
          phone: sessionStorage.getItem('scorecardLeadPhone') || '',
          industry: selectedIndustry || '',
          tier: data.userAITier || 'Unknown',
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('>>> FRONTEND: Stored user data in sessionStorage:', userData);

        // Also store in localStorage as backup with identical keys
        localStorage.setItem('reportMarkdown', data.reportMarkdown);
        localStorage.setItem('questionAnswerHistory', JSON.stringify(finalHistory.slice(0, MAX_QUESTIONS)));
        localStorage.setItem('systemPromptUsed', data.systemPromptUsed);
        localStorage.setItem('reportId', reportID);
        localStorage.setItem('currentReportID', reportID);
        localStorage.setItem('userAITier', data.userAITier || 'Unknown');
        localStorage.setItem('aiTier', data.userAITier || 'Unknown');
        localStorage.setItem('tier', data.userAITier || 'Unknown');
        localStorage.setItem('userTier', data.userAITier || 'Unknown');
        localStorage.setItem('finalScore', data.finalScore || '');
        localStorage.setItem('industry', selectedIndustry || '');
        localStorage.setItem('userData', JSON.stringify(userData));

        console.log('>>> FRONTEND: Successfully saved report data to storage.');

        // Clear the safety timeout since we're proceeding normally
        clearTimeout(safetyTimeout);

        // Hide the loading modal FIRST before navigation
        setIsGeneratingFinalReport(false);

        // CRITICAL FIX: Force immediate navigation to results page with reportId
        console.log(`FRONTEND: Attempting navigation to results page at: ${new Date().toISOString()}`);
        console.log(`>>> FRONTEND: 🔴 Forcing navigation to /scorecard/results?reportId=${reportID}`);

        // Add delay before navigation to ensure all state is properly saved
        setTimeout(() => {
          console.log(`>>> FRONTEND: Executing delayed navigation to /scorecard/results?reportId=${reportID}`);
          // Use Next.js router if available, fallback to direct location change
          try {
            window.location.href = `/scorecard/results?reportId=${reportID}`;
          } catch (navError) {
            console.error('Navigation failed, trying alternate method:', navError);
            window.open(`/scorecard/results?reportId=${reportID}`, '_self');
          }
        }, 1000); // 1 second delay to ensure storage operations complete
      } catch (firestoreError) {
        console.error(`FRONTEND: Error saving report to Firestore at: ${new Date().toISOString()}`, firestoreError);
        // Even if Firestore save fails, we should attempt to navigate with session data
        setIsGeneratingFinalReport(false);
        clearTimeout(safetyTimeout);

        // Try to navigate to results without a reportId, relying on session data
        console.log('>>> FRONTEND: Attempting fallback navigation without reportId at:', new Date().toISOString());

        // Immediate fallback navigation
        console.log('>>> FRONTEND: Executing immediate fallback navigation to /scorecard/results');
        try {
          window.location.href = `/scorecard/results`;
        } catch (navError) {
          console.error('Fallback navigation failed, trying alternate method:', navError);
          window.location.replace(`/scorecard/results`);
        }
      }
    } catch (error) {
      console.error(`FRONTEND: Error in generateReport at: ${new Date().toISOString()}`, error);
      setIsGeneratingFinalReport(false);
      clearTimeout(safetyTimeout);
    }
    
    // At the very end of generateReport (even if error or success)
    console.log(`FRONTEND: generateReport function ended at: ${new Date().toISOString()}. Total duration: ${(Date.now() - startTime) / 1000}s`);
  }, [selectedIndustry, leadName, MAX_QUESTIONS]);

  // Modified lead capture success handler
  const handleLeadCaptureSuccess = useCallback((capturedName: string) => {
    console.log("Frontend: Lead capture successful. Captured name:", capturedName);
    
    // Set loading state for report generation first
    setIsGeneratingFinalReport(true);
    
    // Update lead capture state
    setLeadCaptured(true);
    setLeadName(capturedName);

    // Store the name in sessionStorage for use in results page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scorecardUserName', capturedName);
    }

    console.log("Frontend: Lead capture successful. Generating report immediately.");
    
    // Use the current history to generate the report
    const currentHistory = scorecardState.history;
    
    // Generate the report with exactly MAX_QUESTIONS answers or current answers if fewer
    generateReport(currentHistory.slice(0, MAX_QUESTIONS));
    
    // Set the current step to results to ensure proper navigation
    setCurrentStep('results');
  }, [setLeadCaptured, setLeadName, scorecardState.history, MAX_QUESTIONS, setIsGeneratingFinalReport, generateReport, setCurrentStep]);

  const handlePostAssessmentLeadCaptureSuccess = useCallback(() => {
    console.log("Post-assessment lead capture successful. Moving to results.");
    setCurrentStep('results');
  }, [setCurrentStep]);
  
  // Extract tier from report markdown if available
  const extractedTier = useMemo(() => {
    if (!scorecardState.reportMarkdown) return null;

    const tierMatch = scorecardState.reportMarkdown.match(/## Overall Tier:?\s*(.+?)($|\n)/i);
    if (tierMatch && tierMatch[1]) {
      return tierMatch[1].trim();
    }

    // Fallback to searching for Leader, Enabler, or Dabbler in the markdown   
    const tierKeywords = ["Leader", "Enabler", "Dabbler"];
    for (const keyword of tierKeywords) {
      if (scorecardState.reportMarkdown.includes(keyword)) {
        return keyword;
      }
    }

    return null;
  }, [scorecardState.reportMarkdown]);

  // NEW: Add a failsafe effect to ensure currentStep is set to results when a report is completed
  useEffect(() => {
    // Synchronize current step with overall status - this is a critical backup to ensure UI flow proceeds
    if (scorecardState.overall_status === 'completed' && scorecardState.reportMarkdown && currentStep === 'assessment') {
      console.log('>>> FRONTEND: BACKUP STATE SYNC - Forcing currentStep to "results" because report is completed');
      setCurrentStep('results');
    }
  }, [scorecardState.overall_status, scorecardState.reportMarkdown, currentStep, setCurrentStep]);

  // --- Stabilize handleAnswerSubmit using Functional Updates ---
  const handleAnswerSubmit = useCallback(async (answer: any, answerSource?: AnswerSourceType) => {
    let submittedQuestion = '';
    let currentPhase = '';
    let currentAnswerType: string | null = null;
    let currentOptions: string[] | null = null;
    let currentReasoning: string | null = null;

    // Capture current history length to check if we need to proceed after adding this answer
    let currentHistoryLength = 0;

    setScorecardState(prev => {
      if (!prev.currentQuestion) {
        console.error('Submit attempted with no current question (inside functional update)');
        return prev;
      }
      submittedQuestion = prev.currentQuestion;
      currentPhase = prev.currentPhaseName;
      currentAnswerType = prev.answerType ?? '';
      currentOptions = prev.options;
      currentReasoning = prev.reasoningText;
      currentHistoryLength = prev.history.length;

      const newHistory = [...prev.history, {
        question: submittedQuestion,
        answer: answer,
        phaseName: currentPhase,
        answerType: currentAnswerType,
        options: currentOptions,
        reasoningText: currentReasoning,
        answerSource: answerSource || 'Manual',
      }];
      return { ...prev, isLoading: true, error: null, history: newHistory };
    });

    try {
      const updatedHistory = (await new Promise<ScorecardState>(resolve => setScorecardState(prev => { resolve(prev); return prev; }))).history;

      // After adding this answer, check if we've reached MAX_QUESTIONS
      // currentHistoryLength + 1 should be the new length after adding one answer
      const newHistoryLength = currentHistoryLength + 1;
      console.log(`>>> FRONTEND: Question ${newHistoryLength}/${MAX_QUESTIONS} completed. Auto-completing: ${isAutoCompleting}`);

      // MODIFIED: Check if we need to show lead capture form
      // Show lead form exactly after 20 questions are answered
      if (!leadCaptured && newHistoryLength === LEAD_FORM_THRESHOLD) {
        console.log(`>>> FRONTEND: Reached lead form threshold (${LEAD_FORM_THRESHOLD}). Showing lead capture form.`);
        
        // Stop auto-complete if it's running
        if (isAutoCompleting) {
          console.log('[Parent] Pausing for lead capture, disabling auto-complete.');
          setIsAutoCompleting(false);
        }
        
        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          overall_status: 'lead-capture-required', // Add status to indicate lead capture is required
          currentQuestionNumber: MAX_QUESTIONS // Set to max questions to prevent showing more
        }));
        
        // Show lead capture form
        setCurrentStep('leadCapture');
        return;
      }

      if (newHistoryLength >= MAX_QUESTIONS) {
        console.log(`>>> FRONTEND: Reached maximum questions (${MAX_QUESTIONS}). Completing assessment.`);

        // CRITICAL FIX: Immediately set currentStep to 'results' to prevent showing question screens
        setCurrentStep('results');

        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          overall_status: 'completed',
          currentQuestionNumber: MAX_QUESTIONS
        }));

        // CRITICAL FIX: EXPLICIT additional check to ensure we change step when hitting MAX_QUESTIONS
        console.log(`>>> FRONTEND: MAX_QUESTIONS REACHED: Direct transition enforcement in handleAnswerSubmit`);

        // Generate the report with exactly MAX_QUESTIONS answers
        generateReport(updatedHistory.slice(0, MAX_QUESTIONS));

        // The generateReport function now handles navigation directly with window.location.href
        return;
      }

      // Only fetch the next question if we haven't reached MAX_QUESTIONS
      try {
        const response = await fetch('/api/scorecard-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            currentPhaseName: currentPhase,
            history: updatedHistory,
            industry: selectedIndustry
          }),
        });

        // Check response content type before trying to parse JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('Non-JSON response received:', textResponse.substring(0, 200));
          const errorMessage = `Server returned non-JSON response: ${contentType || 'unknown'}`;

          setScorecardState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage
          }));

          if (isAutoCompleting) {
            console.log('Stopping auto-complete due to content type error');
            setIsAutoCompleting(false);
            setAutoCompleteError(`Auto-complete failed: ${errorMessage}`);
          }
          return;
        }

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('>>> FRONTEND: Raw API Error Response Body:', errorBody);
          const detailedErrorMessage = `Failed to submit answer. Status: ${response.status}. Body: ${errorBody}`;
          console.error(detailedErrorMessage);
          setScorecardState(prev => ({
            ...prev,
            isLoading: false,
            error: detailedErrorMessage + ". Please try restarting the assessment."
          }));
          if (isAutoCompleting) {
            console.log('Stopping auto-complete due to API error');
            setIsAutoCompleting(false);
            setAutoCompleteError(`Auto-complete failed: ${detailedErrorMessage}`);
          }
          return;
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError: any) {
          console.error('JSON parse error:', jsonError);
          const errorMessage = `Failed to parse server response as JSON. Error: ${jsonError.message}`;

          setScorecardState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage
          }));

          if (isAutoCompleting) {
            console.log('Stopping auto-complete due to JSON parse error');
            setIsAutoCompleting(false);
            setAutoCompleteError(`Auto-complete failed: ${errorMessage}`);
          }
          return;
        }

        if (data.overall_status) {
          console.log('API response overall_status:', data.overall_status);

          // Check if we should generate the report based on API response or if MAX_QUESTIONS is reached during auto-complete
          if (
            (data.overall_status === 'assessment-completed' ||
            data.overall_status === 'completed' ||
            data.overall_status.includes('complet')) ||
            (isAutoCompleting && updatedHistory.length >= MAX_QUESTIONS) // Explicitly check history length for auto-complete
          ) {
            if (isAutoCompleting) {
              console.log('[Parent] Assessment completed detected or MAX_QUESTIONS reached, disabling auto-complete.');
              setIsAutoCompleting(false);
            }
            setScorecardState(prev => ({
              ...prev,
              isLoading: false,
              overall_status: data.overall_status // Use API status or force 'completed' if MAX_QUESTIONS reached? Let's stick to API status for now.
            }));

            // Ensure we use exactly MAX_QUESTIONS answers for the report
            generateReport(updatedHistory.slice(0, MAX_QUESTIONS));
          }
          // Otherwise, update state with the next question
          else {
            if (!data.questionText) {
              throw new Error("API returned success but no question was provided");
            }

            // Normalize the answer type to ensure consistency
            const normalizedAnswerType = normalizeAnswerType(data.answerType);
            
            setScorecardState(prev => ({
              ...prev,
              isLoading: false,
              currentQuestion: data.questionText,
              answerType: normalizedAnswerType, // Use normalized answer type
              options: data.options,
              currentPhaseName: data.currentPhaseName,
              overall_status: data.overall_status,
              reasoningText: data.reasoning_text,
              currentQuestionNumber: Math.min(updatedHistory.length + 1, MAX_QUESTIONS)
            }));
          }
        }
      } catch (apiError: any) {
        console.error('API error in handleAnswerSubmit:', apiError);
        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          error: `An API error occurred: ${apiError.message || 'Unknown error'}`
        }));
      }
    } catch (error: any) {
      console.error('Error in handleAnswerSubmit:', error);
      setScorecardState(prev => ({
        ...prev,
        isLoading: false,
        error: `An unexpected error occurred in handleAnswerSubmit: ${error.message || 'Unknown error'}`
      }));
    }
  }, [selectedIndustry, MAX_QUESTIONS, isAutoCompleting, setIsAutoCompleting, setAutoCompleteError, generateReport, leadName, leadCaptured, LEAD_FORM_THRESHOLD]);

  // --- Stabilize handleStartAutoComplete using Functional Updates ---
  const handleStartAutoComplete = useCallback(() => {
    // Enhanced check for auto-complete feature
    const isProd = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
    const forceDisabled = isProd && process.env.NEXT_PUBLIC_ENABLE_AUTO_COMPLETE !== 'true';
    
    // Log environment details
    console.log(`[DEBUG] handleStartAutoComplete: NODE_ENV=${process.env.NODE_ENV}, ENABLE=${process.env.NEXT_PUBLIC_ENABLE_AUTO_COMPLETE}`);
    
    // Don't allow auto-complete if feature is disabled
    if (!autoCompleteFeatureEnabled || forceDisabled) {
      console.log('>>> FRONTEND: Auto-complete feature is disabled in this environment');
      return;
    }
    
    // Prevent starting auto-complete if already in progress or app is loading
    if (isAutoCompleting || scorecardState.isLoading) {
      console.log('>>> FRONTEND: Already auto-completing or loading, ignoring duplicate click');
      return;
    }

    console.log('>>> FRONTEND: Starting auto-complete from question', scorecardState.currentQuestionNumber);
    setIsAutoCompleting(true);
    setAutoCompleteError(null);
  }, [autoCompleteFeatureEnabled, isAutoCompleting, scorecardState.isLoading, scorecardState.currentQuestionNumber]);

  // --- Stabilize autoCompleteCount using Functional Updates ---
  const handleAutoCompleteCount = useCallback((count: number) => {
    setAutoCompleteCount(count);
  }, []);

  // Create a function to normalize answer types for consistency
  const normalizeAnswerType = (apiAnswerType: string): string => {
    if (!apiAnswerType) return 'text';
    
    const type = apiAnswerType.toLowerCase().trim();
    
    if (type === 'radio') return 'radio';
    if (type === 'checkbox') return 'checkbox';
    if (type === 'scale') return 'scale';
    if (type === 'text') return 'text';
    
    if (type === 'single-choice' || type === 'single' || type === 'choice' || type === 'select') return 'radio';
    if (type === 'multiple-choice' || type === 'multiple' || type === 'multi') return 'checkbox';
    if (type === 'rating' || type === 'number' || type === 'numeric') return 'scale';
    if (type === 'textarea' || type === 'longtext' || type === 'freetext' || type === 'free-text' || type === 'input') return 'text';
    
    console.warn(`Unexpected answer type: ${apiAnswerType}, defaulting to text input`);
    return 'text';
  };

  // Add the renderContent function which was missing
  const renderContent = () => {
    console.log(`RENDER_CONTENT: currentStep=${currentStep}, overall_status=${scorecardState.overall_status}`);

    // Show loading overlay for report generation
    if (isGeneratingFinalReport) {
      return <ReportLoadingIndicator isLoading={true} />;
    }

    // Industry Selection
    if (currentStep === 'industrySelection') {
      return (
        <IndustrySelection
          industries={industries}
          selectedIndustry={selectedIndustry}
          handleIndustryChange={setSelectedIndustry}
          startAssessment={startActualAssessment}
          leadCaptured={leadCaptured}
          scorecardState={scorecardState}
        />
      );
    }

    // Lead Capture
    if (currentStep === 'leadCapture') {
      return (
        <div className="mt-12">
          <LeadCaptureForm
            aiTier={null} // Pass null for now, tier is determined after assessment
            onSubmitSuccess={handleLeadCaptureSuccess} // This will now generate report and navigate
            reportMarkdown={null} // Not available at this stage
            questionAnswerHistory={scorecardState.history} // Pass history for context
            industry={selectedIndustry} // Pass the selected industry to the form
          />
        </div>
      );
    }

    // Assessment Questions - Only show if not reached max questions and lead form not required
    if (currentStep === 'assessment' && 
        scorecardState.currentQuestionNumber <= MAX_QUESTIONS && 
        scorecardState.overall_status !== 'lead-capture-required' &&
        scorecardState.overall_status !== 'completed') {
      return (
        <AssessmentQuestion
          scorecardState={scorecardState}
          memoizedOptions={memoizedOptions}
          memoizedReasoningText={memoizedReasoningText}
          handleAnswerSubmit={handleAnswerSubmit}
          isAutoCompleting={isAutoCompleting}
          memoizedSetIsAutoCompleting={memoizedSetIsAutoCompleting}
          memoizedSetAutoCompleteError={memoizedSetAutoCompleteError}
          handleStartAutoComplete={handleStartAutoComplete}
          autoCompleteCount={autoCompleteCount}
          memoizedHistory={memoizedHistory}
          selectedIndustry={selectedIndustry}
          autoCompleteError={autoCompleteError} // Pass autoCompleteError from parent state
        />
      );
    }

    // Results (fallback if not already redirected)
    if (currentStep === 'results' || scorecardState.overall_status === 'completed') {
      return <ReportLoadingIndicator isLoading={true} />;
    }

    // Default: Show industry selection
    return (
      <IndustrySelection
        industries={industries}
        selectedIndustry={selectedIndustry}
        handleIndustryChange={setSelectedIndustry}
        startAssessment={startActualAssessment}
        leadCaptured={leadCaptured}
        scorecardState={scorecardState}
      />
    );
  };

  // Main application render
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Professional Header */}
      <AssessmentHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        <NoSidebarLayout>
          {/* Existing content rendering logic */}
          {renderContent()}
        </NoSidebarLayout>
      </main>
      
      {/* Professional Footer */}
      <AssessmentFooter />
    </div>
  );
}
