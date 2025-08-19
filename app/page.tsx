'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ScorecardQuestionDisplay from '@/components/ScorecardQuestionDisplay';
import ScorecardResultsDisplay from '@/components/ScorecardResultsDisplay';
import LeadCaptureForm from '@/components/scorecard/LeadCaptureForm';
import NoSidebarLayout from '@/components/NoSidebarLayout';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase'; // Fixed path to firebase.ts
import { collection, addDoc, serverTimestamp, doc, writeBatch } from 'firebase/firestore';
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
  reportId: string | null; // Added to store the Firestore document ID
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
            AI Efficiency Assessment
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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

  // Log currentStep for debugging
  useEffect(() => {
    console.log(`[DEBUG] Current Step: ${currentStep}`);
  }, [currentStep]);

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

      // Normalize possible server response shapes (support camelCase and snake_case and alternate keys)
      const normalized = {
        questionText: (data && (data.questionText ?? data.question_text ?? data.question)) ?? null,
        answerType: (data && (data.answerType ?? data.answer_type)) ?? null,
        options: (data && (data.options ?? data.opts ?? data.choices)) ?? null,
        currentPhaseName: (data && (data.currentPhaseName ?? data.current_phase_name)) ?? initialScorecardState.currentPhaseName,
        overall_status: (data && (data.overall_status ?? data.overallStatus)) ?? (data && data.overall_status) ?? 'assessment-in-progress',
        reasoningText: (data && (data.reasoningText ?? data.reasoning_text ?? data.explanation)) ?? null
      };

      // Debug log normalized values to help diagnose mismatched keys
      console.log('Frontend: Normalized first question payload:', normalized);

      // Only update state and change step when we have a valid question
      if (normalized.questionText && String(normalized.questionText).trim() !== '') {
        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          currentQuestion: String(normalized.questionText),
          answerType: normalized.answerType,
          options: normalized.options,
          currentPhaseName: normalized.currentPhaseName,
          overall_status: normalized.overall_status,
          reasoningText: normalized.reasoningText,
          currentQuestionNumber: 1
        }));
        
        // NOW change the step to assessment since we have a valid question
        setCurrentStep('assessment');
      } else {
        // If no valid question, show error and include full server response in logs for debugging
        console.error('Frontend: No valid question received from server. Full response:', data, 'Normalized:', normalized);
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
      const button = document.getElementById('begin-assessment-button');
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

      // Send report to server-side API which uses Firebase Admin SDK
      try {
        console.log(`FRONTEND: Sending report to server API /api/save-report at: ${new Date().toISOString()}`);

        const saveStart = Date.now();
        const saveResp = await fetch('/api/save-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData),
          cache: 'no-store'
        });

        const saveDuration = (Date.now() - saveStart) / 1000;
        console.log(`FRONTEND: /api/save-report responded in ${saveDuration}s status=${saveResp.status}`);

        if (!saveResp.ok) {
          const text = await saveResp.text();
          throw new Error(`Server save failed: ${saveResp.status} ${text}`);
        }

        const saveJson = await saveResp.json();
        const reportID = saveJson.id;
        if (!reportID) throw new Error('Server did not return report ID');

        // Update client state once with the returned ID
        setScorecardState(prev => ({
          ...prev,
          reportMarkdown: data.reportMarkdown,
          reportId: reportID,
          overall_status: 'completed'
        }));

        // Persist to storage
        try {
          sessionStorage.setItem('reportMarkdown', data.reportMarkdown);
          sessionStorage.setItem('questionAnswerHistory', JSON.stringify(finalHistory.slice(0, MAX_QUESTIONS)));
          sessionStorage.setItem('reportId', reportID);
          sessionStorage.setItem('currentReportID', reportID);
          localStorage.setItem('reportMarkdown', data.reportMarkdown);
          localStorage.setItem('questionAnswerHistory', JSON.stringify(finalHistory.slice(0, MAX_QUESTIONS)));
          localStorage.setItem('reportId', reportID);
          localStorage.setItem('currentReportID', reportID);
        } catch (storageErr) {
          console.warn('FRONTEND: Warning saving to storage:', storageErr);
        }

        // Clear timeout and loading
        clearTimeout(safetyTimeout);
        setIsGeneratingFinalReport(false);

        // Navigate to results using authoritative server id
        console.log(`FRONTEND: Navigating to /scorecard/results?reportId=${reportID}`);
        window.location.replace(`/scorecard/results?reportId=${reportID}`);

      } catch (saveError: any) {
        console.error('FRONTEND: Error saving report via server API:', saveError);

        // Persist backup locally for recovery
        try {
          localStorage.setItem('lastReportBackup', JSON.stringify({
            data: reportData,
            error: saveError?.message || String(saveError),
            ts: new Date().toISOString()
          }));
        } catch (bkErr) {
          console.error('FRONTEND: Failed to write backup data:', bkErr);
        }

        // Clear loading and timeout
        clearTimeout(safetyTimeout);
        setIsGeneratingFinalReport(false);

        // Prompt user with actionable message
        alert('We were unable to save your report to the server. Please retry. If the problem persists, copy any error messages and contact support.');

        // Keep user on results step so they can retry or view saved session data
        setScorecardState(prev => ({ ...prev, isLoading: false, overall_status: 'completed' }));
        // Try to navigate to results page without id so user can see session-based content
        const fallbackId = sessionStorage.getItem('reportId') || sessionStorage.getItem('currentReportID');
        const fallbackUrl = fallbackId ? `/scorecard/results?reportId=${fallbackId}&fallback=true` : `/scorecard/results?fallback=true`;
        window.location.replace(fallbackUrl);
      }
    } catch (error) {
      console.error('FRONTEND: Unexpected error in report generation:', error);
      setIsGeneratingFinalReport(false);
      alert('An unexpected error occurred while generating the report. Please try again later.');
    }
  }, [selectedIndustry, leadName, scorecardState.isLoading]);

  // --- Add missing handlers: handleAnswerSubmit and handleStartAutoComplete ---
  const handleAnswerSubmit = useCallback(async (answer: any, answerSource: AnswerSourceType = 'Manual') => {
    try {
      const questionText = scorecardState.currentQuestion || '';
      const entry: ScorecardHistoryEntry = {
        question: questionText,
        answer,
        phaseName: scorecardState.currentPhaseName,
        answerType: scorecardState.answerType || undefined,
        options: scorecardState.options || null,
        answerSource
      };

      // Build the new history (limit to MAX_QUESTIONS)
      const newHistory = [...(scorecardState.history || []), entry].slice(0, MAX_QUESTIONS);

      // Optimistically set history and a temporary reasoning placeholder
      setScorecardState(prev => ({
        ...prev,
        history: newHistory,
        reasoningText: 'Generating reasoning...'
      }));

      // Ask the server to generate an explanation / reasoning for the answer
      try {
        const explainResp = await fetch('/api/scorecard-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'explainAnswer',
            question: questionText,
            answer,
            history: newHistory.slice(0, MAX_QUESTIONS),
            industry: selectedIndustry
          }),
          cache: 'no-store'
        });

        if (explainResp.ok) {
          const explainData = await explainResp.json();
          const reasoning = explainData.reasoningText || explainData.explanation || null;

          // Attach reasoning to the last history entry and update state.reasoningText
          setScorecardState(prev => ({
            ...prev,
            history: prev.history ? prev.history.map((h, i) => i === prev.history.length - 1 ? { ...h, reasoningText: reasoning } : h) : newHistory,
            reasoningText: reasoning
          }));
        } else {
          const txt = await explainResp.text();
          console.warn('Explain API responded with non-OK status:', explainResp.status, txt);
          setScorecardState(prev => ({ ...prev, reasoningText: null }));
        }
      } catch (explainErr) {
        console.error('Error calling explain API:', explainErr);
        setScorecardState(prev => ({ ...prev, reasoningText: null }));
      }

      // Compute next question number based on current state (use latest from state to avoid off-by-one)
      const nextQuestionNumber = (scorecardState.currentQuestionNumber || 1) + 1;

      // If we've reached the end, generate the final report
      if (nextQuestionNumber > MAX_QUESTIONS) {
        setScorecardState(prev => ({ ...prev, isLoading: true, overall_status: 'generating-report' }));
        await generateReport(newHistory);
        // Move to results step after generation
        setCurrentStep('results');
        return;
      }

      // Otherwise request the next question from the API
      setScorecardState(prev => ({ ...prev, isLoading: true, currentQuestion: null }));

      try {
        const resp = await fetch('/api/scorecard-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'nextQuestion',
            history: newHistory,
            industry: selectedIndustry,
            currentPhaseName: scorecardState.currentPhaseName,
            currentQuestionNumber: nextQuestionNumber
          }),
          cache: 'no-store'
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`Failed to fetch next question: ${resp.status} ${txt}`);
        }

        const data = await resp.json();

        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          currentQuestion: data.questionText || null,
          answerType: data.answerType,
          options: data.options,
          currentPhaseName: data.currentPhaseName || prev.currentPhaseName,
          currentQuestionNumber: nextQuestionNumber
        }));
      } catch (err) {
        console.error('Error fetching next question:', err);
        setScorecardState(prev => ({ ...prev, isLoading: false, error: String(err) }));
      }
    } catch (err) {
      console.error('handleAnswerSubmit unexpected error:', err);
      setScorecardState(prev => ({ ...prev, isLoading: false, error: String(err) }));
    }
  }, [scorecardState, selectedIndustry, generateReport]);

  const handleStartAutoComplete = useCallback(async () => {
    setIsAutoCompleting(true);
    setAutoCompleteError(null);
    setAutoCompleteCount(c => c + 1);

    try {
      let done = false;
      let localHistory = [...(scorecardState.history || [])];
      let currentQuestion = scorecardState.currentQuestion;
      let currentPhaseName = scorecardState.currentPhaseName;
      let currentQuestionNumber = scorecardState.currentQuestionNumber;

      while (!done && currentQuestion && localHistory.length < MAX_QUESTIONS) {
        // 1. Get suggested answer and reasoning
        const resp = await fetch('/api/scorecard-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'autoComplete',
            history: localHistory,
            industry: selectedIndustry
          }),
          cache: 'no-store'
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`Auto-complete API failed: ${resp.status} ${txt}`);
        }

        const data = await resp.json();
        const reasoning = data.reasoningText || data.explanation || null;
        const suggestedAnswer = data.suggestedAnswer || null;

        // 2. Add answer to history
        const entry = {
          question: currentQuestion,
          answer: suggestedAnswer,
          phaseName: currentPhaseName,
          answerType: scorecardState.answerType || undefined,
          options: scorecardState.options || null,
          answerSource: 'Manual',
          reasoningText: reasoning
        };
        localHistory = [...localHistory, entry].slice(0, MAX_QUESTIONS);

        // 3. Show reasoning for this answer
        setScorecardState(prev => ({
          ...prev,
          reasoningText: reasoning,
          history: localHistory
        }));

        // 4. If last question, finish
        if (localHistory.length >= MAX_QUESTIONS) {
          setScorecardState(prev => ({ ...prev, isLoading: true, overall_status: 'generating-report' }));
          await generateReport(localHistory);
          done = true;
          break;
        }

        // 5. Get next question
        setScorecardState(prev => ({ ...prev, isLoading: true, currentQuestion: null }));
        const nextResp = await fetch('/api/scorecard-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'nextQuestion',
            history: localHistory,
            industry: selectedIndustry,
            currentPhaseName: currentPhaseName,
            currentQuestionNumber: localHistory.length + 1
          }),
          cache: 'no-store'
        });

        if (!nextResp.ok) {
          const txt = await nextResp.text();
          throw new Error(`Failed to fetch next question: ${nextResp.status} ${txt}`);
        }

        const nextData = await nextResp.json();
        currentQuestion = nextData.questionText || nextData.question || null;
        currentPhaseName = nextData.currentPhaseName || currentPhaseName;
        currentQuestionNumber = localHistory.length + 1;

        setScorecardState(prev => ({
          ...prev,
          isLoading: false,
          currentQuestion,
          answerType: nextData.answerType,
          options: nextData.options,
          currentPhaseName,
          currentQuestionNumber
        }));

        // Small delay for UI update (optional, can be removed)
        await new Promise(res => setTimeout(res, 100));
      }
    } catch (err: any) {
      console.error('handleStartAutoComplete error:', err);
      setAutoCompleteError(String(err.message || err));
    } finally {
      setIsAutoCompleting(false);
    }
  }, [scorecardState, selectedIndustry, generateReport]);

  // --- Stabilize lead capture (Dependency: scorecardState.overall_status) ---
  const handleLeadCapture = useCallback(async (leadData: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  }) => {
    // Ignore if already captured
    if (leadCaptured) return;

    // Basic validation
    if (!leadData.email || !leadData.name) {
      alert('Name and email are required to access the report.');
      return;
    }

    // Proceed with lead capture
    setLeadCaptured(true);
    setLeadName(leadData.name); // Set lead name for personalization

    try {
      // Save lead data to Firestore
      const docRef = await addDoc(collection(db, 'leads'), {
        ...leadData,
        createdAt: serverTimestamp(),
        reportId: scorecardState.reportId // Associate with report
      });

      console.log('Lead captured with ID:', docRef.id);

      // Optionally, navigate or show a success message
      alert('Thank you for providing your details. Your report is being generated and will be sent to your email shortly.');

      // Navigate to results page after a short delay
      setTimeout(() => {
        // Use the stored report ID if available
        const reportId = sessionStorage.getItem('reportId') || sessionStorage.getItem('currentReportID');
        if (reportId) {
          window.location.replace(`/scorecard/results?reportId=${reportId}`);
        } else {
          window.location.replace('/scorecard/results');
        }
      }, 3000);
    } catch (error) {
      console.error('Error capturing lead:', error);
      alert('An error occurred while capturing your details. Please try again.');
    }
  }, [leadCaptured, scorecardState.reportId]);

  // --- TEMPORARY FOR TESTING RESULTS PAGE ---
  // Auto-fill lead capture form for testing
  useEffect(() => {
    if (currentStep === 'results' && !leadCaptured) {
      setLeadCaptured(true);
      setLeadName('John Doe'); // Test name
      setTimeout(() => {
        const reportId = sessionStorage.getItem('reportId') || sessionStorage.getItem('currentReportID');
        if (reportId) {
          window.location.replace(`/scorecard/results?reportId=${reportId}`);
        } else {
          window.location.replace('/scorecard/results');
        }
      }, 3000);
    }
  }, [currentStep, leadCaptured]);
  // --- END TEMPORARY CHANGES ---

  return (
    <NoSidebarLayout>
      {/* --- STEP 1: Industry Selection --- */}
      {currentStep === 'industrySelection' && (
        <IndustrySelection
          industries={industries}
          selectedIndustry={selectedIndustry}
          handleIndustryChange={setSelectedIndustry}
          startAssessment={startActualAssessment}
          leadCaptured={leadCaptured}
          scorecardState={scorecardState}
        />
      )}

      {/* --- STEP 2: Assessment Questions --- */}
      {currentStep === 'assessment' && (
        <div className="min-h-screen bg-gradient-to-br from-sg-light-mint via-white to-sg-cream-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            
            {/* Simple Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sg-dark-teal font-plus-jakarta mb-6">
                AI Efficiency Assessment
              </h1>
              <p className="text-xl text-sg-dark-teal/70 font-plus-jakarta max-w-2xl mx-auto">
                {scorecardState.isLoading ? 'Preparing your personalized assessment...' : 'Answer the following questions'}
              </p>
            </div>
            
            {/* Loading Overlay - For questions */}
            {/* Show progress loader if auto-completing, else show default loader */}
            {isAutoCompleting ? (
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
                      Auto-Completing Assessment
                    </h3>
                    <p className="text-sg-dark-teal/70 font-plus-jakarta">
                      Auto-completing: {scorecardState.history.length + 1} / {scorecardState.maxQuestions}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-sg-bright-green h-2.5 rounded-full transition-all duration-300" style={{width: `${Math.min(100, Math.round(((scorecardState.history.length + 1) / scorecardState.maxQuestions) * 100))}%`}}></div>
                  </div>
                </div>
              </div>
            ) : scorecardState.isLoading && (
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

            {/* Assessment Question - Enhanced */}
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
              autoCompleteError={autoCompleteError}
            />
          </div>
        </div>
      )}

      {/* --- STEP 3: Results & Lead Capture --- */}
      {currentStep === 'results' && (
        <div className="min-h-screen bg-gradient-to-br from-sg-light-mint via-white to-sg-cream-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            {/* Simple Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sg-dark-teal font-plus-jakarta mb-6">
                Your AI Efficiency Report
              </h1>
              <p className="text-xl text-sg-dark-teal/70 font-plus-jakarta max-w-2xl mx-auto">
                {scorecardState.isLoading ? 'Generating your report...' : 'Review your personalized report'}
              </p>
            </div>

            {/* Green percentage loader during report generation */}
            {scorecardState.isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 mx-4 text-center border border-sg-bright-green/30">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sg-bright-green to-sg-dark-teal rounded-full mb-4">
                      <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-sg-dark-teal font-plus-jakarta mb-2">
                      Generating Your Personalized Report
                    </h3>
                    <p className="text-sg-dark-teal/70 font-plus-jakarta mb-2">
                      Please wait while we analyze your answers and create your custom AI Efficiency Report.
                    </p>
                    {/* Progress bar and percentage (simulate 95% until done) */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-sg-bright-green h-3 rounded-full transition-all duration-300" style={{width: '95%'}}></div>
                    </div>
                    <div className="text-sg-bright-green font-bold text-lg font-plus-jakarta">95%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Lead Capture Form - Show when not loading, no reportMarkdown, and not leadCaptured */}
            {!scorecardState.isLoading && !scorecardState.reportMarkdown && !leadCaptured && (
              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
                <p className="text-center text-sg-dark-teal font-medium font-plus-jakarta mb-4">
                  Almost there! We just need your details to generate the report.
                </p>
                <LeadCaptureForm
                  aiTier={null}
                  onSubmitSuccess={(capturedName: string) => {
                    setLeadCaptured(true);
                    setLeadName(capturedName || '');
                    const reportId = sessionStorage.getItem('reportId') || sessionStorage.getItem('currentReportID') || scorecardState.reportId;
                    setTimeout(() => {
                      if (reportId) {
                        window.location.replace(`/scorecard/results?reportId=${reportId}`);
                      } else {
                        window.location.replace('/scorecard/results');
                      }
                    }, 1000);
                  }}
                  reportMarkdown={scorecardState.reportMarkdown}
                  questionAnswerHistory={scorecardState.history || []}
                  industry={selectedIndustry}
                  reportId={scorecardState.reportId}
                />
              </div>
            )}

            {/* Results Display - Show on successful report generation and after lead captured (or not required) */}
            {!scorecardState.isLoading && scorecardState.reportMarkdown && (
              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 mb-8">
                <div className="prose max-w-none mb-6">
                  {/* Render the Markdown content as HTML */}
                  <div dangerouslySetInnerHTML={{ __html: scorecardState.reportMarkdown }} />
                </div>
                <details className="mb-6">
                  <summary className="font-medium text-sg-dark-teal cursor-pointer">
                    Debug: Show raw report Markdown
                  </summary>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    {scorecardState.reportMarkdown}
                  </pre>
                </details>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Button
                    onClick={async () => {
                      if (!scorecardState.reportMarkdown) return;
                      const blob = new Blob([scorecardState.reportMarkdown], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `AI_Efficiency_Report_${new Date().toISOString().slice(0, 10)}.md`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v4a2 2 0 002 2h10a2 2 0 002-2v-4m-6-4l6 6m-6-6l-6 6" />
                    </svg>
                    Download Report
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!scorecardState.reportMarkdown) return;
                      alert('Email report feature is not yet implemented.');
                    }}
                    variant="default"
                    size="lg"
                    className="flex-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l4-4m0 0l-4-4m4 4H4" />
                    </svg>
                    Email Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </NoSidebarLayout>
  );
}
