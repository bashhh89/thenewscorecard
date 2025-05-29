import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { isAutoCompleteEnabled } from '@/lib/utils';

// Add interface for history entries needed for AI-driven answers
interface HistoryEntry {
  question: string;
  answer: any;
  phaseName?: string;
  answerType?: string;
  options?: string[] | null;
}

// Update prop type for onSubmitAnswer
type AnswerSourceType = 'Groq Llama 3 8B' | 'Pollinations Fallback' | 'Groq API Failed' | 'Fallback Failed' | 'Manual';
interface ScorecardQuestionDisplayProps {
  question: string;
  answerType: string; // 'text', 'single-choice', 'multiple-choice', 'scale'
  options: string[] | null;
  onSubmitAnswer: (answer: any, answerSource?: AnswerSourceType) => void; // Callback to submit the answer
  isLoading: boolean; // To disable inputs/button during API calls
  currentPhaseName: string; // To display phase info later
  currentQuestionNumber: number; // e.g., 1, 2, 3...
  maxQuestions: number; // The total expected questions (~20)
  assessmentPhases: string[]; // Array of phase names for timeline display
  reasoningText?: string; // Added reasoning text prop
  isAutoCompleting: boolean;
  setIsAutoCompleting: (val: boolean) => void;
  setAutoCompleteError: (msg: string | null) => void;
  handleStartAutoComplete: () => void;
  overallStatus: string;
  questionAnswerHistory?: HistoryEntry[]; // History for AI context
  industry: string;
}

const ScorecardQuestionDisplay: React.FC<ScorecardQuestionDisplayProps> = ({
  question,
  answerType,
  options,
  onSubmitAnswer,
  isLoading,
  currentPhaseName,
  currentQuestionNumber,
  maxQuestions,
  assessmentPhases,
  reasoningText,
  isAutoCompleting,
  setIsAutoCompleting,
  setAutoCompleteError,
  handleStartAutoComplete,
  overallStatus,
  questionAnswerHistory = [], // Default to empty array
  industry
}) => {
  // Add state for test persona tier
  const [testPersonaTier, setTestPersonaTier] = useState<'Dabbler' | 'Enabler' | 'Leader'>('Enabler');
  
  // Add a function to map between API answerType and component answerType
  const normalizeAnswerType = (apiAnswerType: string): string => {
    // Handle null or undefined
    if (!apiAnswerType) return 'text';
    
    // Convert to lowercase and trim for consistent comparison
    const type = apiAnswerType.toLowerCase().trim();
    
    // Direct mappings
    if (type === 'radio') return 'radio';
    if (type === 'checkbox') return 'checkbox';
    if (type === 'scale') return 'scale';
    if (type === 'text') return 'text';
    
    // Handle common variations to ensure consistency across devices
    if (type === 'single-choice' || type === 'single' || type === 'choice' || type === 'select') return 'radio';
    if (type === 'multiple-choice' || type === 'multiple' || type === 'multi') return 'checkbox';
    if (type === 'rating' || type === 'number' || type === 'numeric') return 'scale';
    if (type === 'textarea' || type === 'longtext' || type === 'freetext' || type === 'free-text' || type === 'input') return 'text';
    
    // Log unexpected type for debugging
    console.warn(`Unexpected answer type: ${apiAnswerType}, defaulting to text input`);
    
    // Default to text input if type is unrecognized
    return 'text';
  };

  // Normalize the answerType for component use
  const normalizedAnswerType = normalizeAnswerType(answerType);
  
  // State to hold the user's current answer before submission
  const [currentAnswer, setCurrentAnswer] = useState<any>(normalizedAnswerType === 'checkbox' ? [] : '');
  
  // Use the typing effect for reasoning text
  const { displayedText, isComplete } = useTypingEffect(reasoningText, 30);
  
  // Add debug information for question input type
  useEffect(() => {
    // Log question type information for debugging
    console.log(`Question Input Type - Original: "${answerType}", Normalized: "${normalizedAnswerType}", Options: ${options?.length || 0}`);
    // Add enhanced debug logging
    console.log(`QUESTION TYPE DEBUG - Question: "${question.substring(0, 50)}..."`)
    console.log(`QUESTION TYPE DEBUG - Answer Type (Original): "${answerType}"`);
    console.log(`QUESTION TYPE DEBUG - Answer Type (Normalized): "${normalizedAnswerType}"`);
    console.log(`QUESTION TYPE DEBUG - Options: ${options ? JSON.stringify(options) : 'null'}`);
    console.log(`QUESTION TYPE DEBUG - Industry: "${industry}"`);
    console.log(`QUESTION TYPE DEBUG - Is text area visible: ${normalizedAnswerType === 'text'}`);
    
    // Extended text area rendering debug
    if (normalizedAnswerType === 'text') {
      console.log('TEXT AREA DEBUG: Text area question detected - should render textarea');
    } else {
      console.log(`TEXT AREA DEBUG: Non-text question detected (${normalizedAnswerType}) - should render ${normalizedAnswerType} inputs`);
    }
  }, [question, answerType, normalizedAnswerType, options, industry]);
  
  // Reset the answer when the question or answer type changes
  useEffect(() => {
    if (normalizedAnswerType === 'checkbox') {
      setCurrentAnswer([]); // Reset to empty array for checkboxes
    } else {
      setCurrentAnswer(''); // Reset to empty string for text, radio, scale
    }
  }, [question, normalizedAnswerType]);
  
  // Handle checkbox answers (multiple-choice)
  const handleMultiChoiceChange = (option: string, checked: boolean) => {
    setCurrentAnswer((prev: string[]) => {
      if (checked) {
        return [...prev, option]; // Add option
      } else {
        return prev.filter(item => item !== option); // Remove option
      }
    });
  };
  
  // Enhanced answer input rendering with proper brand typography
  const renderAnswerInput = () => {
    switch (normalizedAnswerType) {
      case 'text':
        return (
          <div className="w-full">
            <textarea
              className="w-full p-4 border border-gray-200 rounded-lg mt-4 min-h-[120px] 
                         focus:ring-2 focus:ring-sg-bright-green focus:border-sg-bright-green 
                         text-sg-dark-teal font-plus-jakarta transition-all duration-200
                         placeholder:text-gray-400 resize-none text-sm leading-relaxed
                         bg-white shadow-sm"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Share your thoughts in detail..."
              disabled={isLoading}
              rows={5}
            />
            <div className="mt-2 text-sm text-gray-500 flex justify-between items-center">
              <span>Be as specific as possible for better insights</span>
              <span className={`${currentAnswer?.length > 20 ? 'text-sg-bright-green' : 'text-gray-400'}`}>
                {currentAnswer?.length || 0} characters
              </span>
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {options?.map((option, index) => {
                const selected = currentAnswer === option;
                return (
                  <div 
                    key={option}
                    className={`group relative cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 
                               ${selected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                    onClick={() => !isLoading && setCurrentAnswer(option)}
                  >
                    <div className={`
                      p-4 rounded-lg border-2 transition-all duration-200 bg-white
                      ${selected 
                        ? 'border-sg-bright-green bg-sg-bright-green/5 shadow-md' 
                        : 'border-gray-200 hover:border-sg-bright-green/40 hover:bg-gray-50'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}>
                      <div className="flex items-start space-x-3">
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center 
                          transition-all duration-200 flex-shrink-0 mt-0.5
                          ${selected 
                            ? 'border-sg-bright-green bg-white' 
                            : 'border-gray-300 group-hover:border-sg-bright-green/60'
                          }
                        `}>
                          {selected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-sg-bright-green"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`
                            text-xs leading-normal text-sg-dark-teal font-plus-jakarta
                            ${selected ? 'text-sg-dark-teal' : 'text-gray-700'}
                          `}>
                            {option}
                          </span>
                        </div>
                        {selected && (
                          <div className="flex-shrink-0">
                            <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-sm text-gray-500 text-center">
              Select the option that best describes your situation
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {options?.map((option, index) => {
                const checked = (currentAnswer as string[]).includes(option);
                return (
                  <div 
                    key={option}
                    className={`group relative cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 
                               ${checked ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                    onClick={() => {
                      if (!isLoading) {
                        if (checked) {
                          setCurrentAnswer((prev: string[]) => prev.filter(item => item !== option));
                        } else {
                          setCurrentAnswer((prev: string[]) => [...prev, option]);
                        }
                      }
                    }}
                  >
                    <div className={`
                      p-4 rounded-lg border-2 transition-all duration-200 bg-white
                      ${checked 
                        ? 'border-sg-bright-green bg-sg-bright-green/5 shadow-md' 
                        : 'border-gray-200 hover:border-sg-bright-green/40 hover:bg-gray-50'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}>
                      <div className="flex items-start space-x-3">
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center 
                          transition-all duration-200 flex-shrink-0 mt-0.5
                          ${checked 
                            ? 'border-sg-bright-green bg-white' 
                            : 'border-gray-300 group-hover:border-sg-bright-green/60'
                          }
                        `}>
                          {checked && (
                            <svg className="w-3 h-3 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`
                            text-xs leading-normal text-sg-dark-teal font-plus-jakarta
                            ${checked ? 'text-sg-dark-teal' : 'text-gray-700'}
                          `}>
                            {option}
                          </span>
                        </div>
                        {checked && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-sg-bright-green"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-sm text-gray-500 text-center">
              Select all that apply • {(currentAnswer as string[]).length} selected
            </div>
          </div>
        );
      case 'scale':
        return (
          <div className="w-full my-4">
            <div className="flex justify-between mb-3 text-sm text-sg-dark-teal/70 px-2">
              <span className="text-sg-dark-teal">Not at all</span>
              <span className="text-sg-dark-teal">Very much</span>
            </div>
            <div className="flex justify-between gap-2 mb-3">
              {options?.map((option, index) => {
                const selected = currentAnswer === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setCurrentAnswer(option)}
                    disabled={isLoading}
                    className={`
                      relative flex-1 min-h-[3rem] py-3 px-2 rounded-lg transition-all duration-300 text-sm text-center flex flex-col items-center justify-center
                      transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sg-bright-green/30
                      ${selected 
                        ? 'bg-sg-bright-green text-white shadow-lg -translate-y-1 scale-105' 
                        : 'bg-white border-2 border-gray-200 text-sg-dark-teal hover:bg-sg-light-mint hover:border-sg-bright-green/50'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    {option}
                    {selected && (
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                        <div className="bg-sg-bright-green text-white text-xs px-2 py-1 rounded-full">
                          Selected
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-center mt-6 text-sm text-gray-500">
              Rate from 1 (lowest) to {options?.length || 5} (highest)
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Unsupported Question Type</p>
                <p className="text-xs">Type '{normalizedAnswerType}' is not supported yet.</p>
              </div>
            </div>
          </div>
        );
    }
  };
  
  // Determine if the submit button should be disabled
  const isAnswerValid = () => {
    // Handle different answer types
    if (normalizedAnswerType === 'checkbox') {
      // Check if it's an array and has items
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    } else if (normalizedAnswerType === 'radio') {
      // For radio, just check if it's not an empty string
      return typeof currentAnswer === 'string' && currentAnswer !== '';
    } else if (normalizedAnswerType === 'scale') {
      // For scale, just check if it's not an empty string
      return typeof currentAnswer === 'string' && currentAnswer !== '';
    } else if (normalizedAnswerType === 'text') {
      // For text, check if it's a string and not empty after trimming
      return typeof currentAnswer === 'string' && currentAnswer.trim() !== '';
    }
    // Default to invalid if type is unexpected
    return false;
  };
  
  // Only disable if loading or answer is invalid, NOT if overallStatus is completed but question is present
  const isSubmitDisabled = isLoading || !isAnswerValid() || !question;
  
  // Add local state for visual cue
  const [isAutoAnswering, setIsAutoAnswering] = useState(false);
  const [autoCompleteCount, setAutoCompleteCount] = useState(0);
  
  // Add local loading state for auto-complete
  const [isLoadingLocally, setIsLoadingLocally] = useState(false);
  
  // Robust auto-complete useEffect pattern
  useEffect(() => {
    if (isAutoCompleting && question && answerType && !isLoadingLocally && !isLoading) {
      // Check if we've reached or are about to reach the maximum number of questions
      // We check against maxQuestions. If history length equals maxQuestions, all questions are answered.
      if (questionAnswerHistory.length >= maxQuestions) {
        console.log(`Auto-complete stopped: Reached ${questionAnswerHistory.length} questions (max: ${maxQuestions}). All questions answered.`);
        setIsAutoCompleting(false);
        return;
      }
      
      if (autoCompleteCount >= 30) {
        setIsAutoCompleting(false);
        setAutoCompleteError('Auto-complete reached maximum question limit (30)');
        return;
      }
      handleSingleAutoAnswerAndSubmit();
    }
  }, [isAutoCompleting, question, answerType]);
  
  // Single-step auto-answer and submit using Groq API
  const handleSingleAutoAnswerAndSubmit = async () => {
    if (!isAutoCompleting || isLoadingLocally) return;
    
    // Special logging for last question
    if (currentQuestionNumber === maxQuestions) {
      console.log(`>>> FRONTEND: Auto-completing final question (${currentQuestionNumber}/${maxQuestions})`);
    } else {
      console.log(`>>> FRONTEND: Auto-completing question ${currentQuestionNumber}/${maxQuestions}`);
    }
    
    setIsLoadingLocally(true);
    
    let simulatedPersonaAnswer = '';
    let currentAnswerSource: AnswerSourceType = 'Manual';
    
    try {
      // Construct system prompt for the AI
      const groqSystemPrompt = `You are simulating the responses of a ${testPersonaTier} tier organization in the ${industry} industry taking an AI maturity assessment. 
Based on the question type and content, provide a realistic answer that reflects the typical AI adoption level, tools, processes, and challenges of a ${testPersonaTier.toLowerCase()} organization.

${testPersonaTier === 'Dabbler' ? 
  'RESPONSE STYLE GUIDE: Your answers should reflect minimal AI adoption, basic tools usage, limited strategy, and early exploration phases. Use phrases like "exploring", "beginning to", "limited", "basic", "minimal", "occasional", "ad hoc", or "no formal process". Keep answers brief but realistic.' :
  testPersonaTier === 'Enabler' ? 
  'RESPONSE STYLE GUIDE: Your answers should reflect moderate AI adoption, regular tool usage, developing strategies, and established processes that are still being optimized. Use phrases like "developing", "established", "regular", "multiple tools", "organized", "some", or "moderate". Provide balanced, realistic responses.' :
  'RESPONSE STYLE GUIDE: Your answers should reflect sophisticated AI adoption, extensive tools integration, comprehensive strategies, and advanced processes. Use phrases like "comprehensive", "integrated", "enterprise-wide", "sophisticated", "extensive", "strategic", "automated", or "advanced". Show depth and maturity in your responses.'}

For scale questions (1-5), return only the number: ${testPersonaTier === 'Dabbler' ? '1 or 2' : testPersonaTier === 'Enabler' ? '3 or 4' : '4 or 5'}.
For radio/single choice questions, select the option that best matches a ${testPersonaTier.toLowerCase()} organization.
For checkbox/multiple choice questions, select ${testPersonaTier === 'Dabbler' ? '1-2' : testPersonaTier === 'Enabler' ? '2-4' : '4-5+' } relevant options.
For text questions, write a concise response (30-100 words) that reflects the perspective of a ${testPersonaTier.toLowerCase()} organization.`;

      // Construct user prompt with the question
      const userPrompt = `Question: ${question}
Question type: ${answerType}
${options && options.length > 0 ? `Options: ${options.join(' | ')}` : ''}

Provide a realistic answer for a ${testPersonaTier} tier organization in the ${industry} industry. ${currentQuestionNumber === maxQuestions ? "This is the final question of the assessment." : ""}`;

      console.log("Auto-answer persona:", testPersonaTier);
      
      // First try Groq API
      try {
        const groqResponse = await fetch('/api/groq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: groqSystemPrompt,
            prompt: userPrompt,
          }),
        });

        if (!groqResponse.ok) {
          throw new Error(`Groq API error: ${groqResponse.status}`);
        }

        const groqData = await groqResponse.json();
        if (groqData && groqData.content) {
          simulatedPersonaAnswer = groqData.content.trim();
          currentAnswerSource = 'Groq Llama 3 8B';
        } else {
          throw new Error('No content in Groq response');
        }
      } catch (groqError) {
        console.warn('Groq API error, falling back to Pollinations:', groqError);

        try {
          // Fallback to Pollinations API
          const pollinationsResponse = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: "openai-large",
              messages: [
                { role: "system", content: groqSystemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.7,
              max_tokens: 200,
            }),
          });

          if (!pollinationsResponse.ok) {
            throw new Error(`Pollinations API error: ${pollinationsResponse.status}`);
          }

          const pollinationsData = await pollinationsResponse.json();
          if (pollinationsData && pollinationsData.choices && pollinationsData.choices[0]?.message?.content) {
            simulatedPersonaAnswer = pollinationsData.choices[0].message.content.trim();
            currentAnswerSource = 'Pollinations Fallback';
          } else {
            throw new Error('No content in Pollinations response');
          }
        } catch (pollinationsError) {
          console.error('Both Groq and Pollinations APIs failed:', pollinationsError);
          // Fall back to hardcoded answers
          throw pollinationsError; // This will trigger the catch block below
        }
      }
      
      // Set the answer and submit it
      setCurrentAnswer(simulatedPersonaAnswer);
      setTimeout(async () => {
        try {
          await onSubmitAnswer(simulatedPersonaAnswer, currentAnswerSource);
          setAutoCompleteCount(prev => prev + 1);
        } catch (submitErr) {
          setAutoCompleteError('Error during answer submission.');
          setIsAutoCompleting(false);
        } finally {
          setIsLoadingLocally(false);
        }
      }, 500);
    } catch (error) {
      setAutoCompleteError('AI answer generation failed.');
      setIsAutoCompleting(false);
      setIsLoadingLocally(false);
    }
  };
  
  // Test Persona Tier Selector
  const renderTestPersonaTierSelector = () => {
    // Only render this if auto-complete feature is enabled
    if (!autoCompleteFeatureEnabled || forceDisabled) return null;
    
    return (
      <div className="relative">
        <select
          value={testPersonaTier}
          onChange={(e) => setTestPersonaTier(e.target.value as 'Dabbler' | 'Enabler' | 'Leader')}
          disabled={isAutoCompleting || isLoading}
          className="appearance-none bg-white border border-sg-bright-green/40 text-sg-dark-teal 
                     rounded-lg px-3 py-2 pr-8 font-medium text-sm min-w-[120px] font-plus-jakarta
                     focus:ring-2 focus:ring-sg-bright-green/20 focus:border-sg-bright-green 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-sg-bright-green/60 transition-all duration-200"
        >
          <option value="Dabbler">🔰 Dabbler</option>
          <option value="Enabler">⚡ Enabler</option>
          <option value="Leader">🚀 Leader</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-3 h-3 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };
  
  // Inside the component, add this variable to track feature availability
  const autoCompleteFeatureEnabled = isAutoCompleteEnabled();
  console.log(`[DEBUG] ScorecardQuestionDisplay - Auto-complete feature ${autoCompleteFeatureEnabled ? 'ENABLED' : 'DISABLED'}`);
  
  // Force disable in production unless explicitly enabled
  const isProd = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
  const forceDisabled = isProd && process.env.NEXT_PUBLIC_ENABLE_AUTO_COMPLETE !== 'true';
  
  if (forceDisabled) {
    console.log('[DEBUG] Auto-complete FORCE DISABLED in production');
  }
  
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row xl:space-x-8 space-y-8 xl:space-y-0 mt-12">
      {/* NEW Left Vertical Sidebar for Phases */}
      <div className="xl:w-64 bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col space-y-4 flex-shrink-0 xl:sticky xl:top-12 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto">
        <h3 className="text-lg font-semibold text-sg-dark-teal font-plus-jakarta">Assessment Progress</h3>
        <div className="text-sm text-sg-dark-teal/60 font-plus-jakarta">
          Question {currentQuestionNumber} of {maxQuestions}
        </div>
        <div className="space-y-1 pt-2">
          {assessmentPhases.map((phase, index) => {
            const isActive = phase === currentPhaseName;
            const isCompleted = assessmentPhases.indexOf(currentPhaseName) > index;

            return (
              <div 
                key={phase} 
                className={`
                  flex items-center space-x-3 py-3 
                  border-b border-gray-200
                  ${index === assessmentPhases.length - 1 ? 'border-b-0 mb-0' : ''} 
                  ${isActive ? 'bg-sg-bright-green rounded-md px-3 -mx-3' : 'px-0.5'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0
                  ${isActive ? 'bg-sg-bright-green border-sg-bright-green text-white scale-105' : 
                    isCompleted ? 'bg-sg-bright-green border-sg-bright-green text-white' : 
                    'bg-white border-gray-300 text-gray-400'}
                `}>
                  {isCompleted ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400">{index + 1}</span>
                  )}
                </div>
                <span className={`
                  text-sm font-medium font-plus-jakarta
                  ${isActive ? 'text-white font-semibold' : 
                    isCompleted ? 'text-sg-dark-teal' : 'text-gray-500'}
                `}>
                  {phase}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress Bar */}
        <div className="mt-auto pt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{Math.round((currentQuestionNumber / maxQuestions) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sg-bright-green to-sg-light-blue rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${(currentQuestionNumber / maxQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Center Content Area (Question Display) */}
      <div className="flex-1 min-w-0">
        {/* Question Display Card */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-12">
          <div className="mb-10">
            <div className="flex items-start space-x-8 mb-10">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl lg:text-2xl text-sg-dark-teal leading-tight mb-4 font-plus-jakarta">
                  {question}
                </h2>
                <p className="text-base text-sg-dark-teal/70 leading-normal font-plus-jakarta">
                  Choose the response that best reflects your organization's current state and practices.
                </p>
              </div>
            </div>
          </div>
          
          {/* Answer Input Section */}
          <div className="relative">
            {renderAnswerInput()}
          </div>
        </div>
      </div>

      {/* Right Sidebar (AI Analysis & Submit) */}
      {reasoningText && (
        <div className="xl:w-80 flex-shrink-0 xl:sticky xl:top-12"> {/* Make this sticky too */}
          <div className="space-y-4"> {/* Added a wrapper for consistent spacing like the left sidebar might have */}
            {/* AI Analysis Card */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mt-6">
              {/* Header */}
              <div className="bg-sg-bright-green/5 p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sg-bright-green/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-sg-dark-teal font-plus-jakarta">AI Analysis</h3>
                    <p className="text-xs text-sg-dark-teal/60 font-plus-jakarta">Real-time insights</p>
                  </div>
                </div>
              </div>
              
              {/* Content - This div will now be scrollable and have a max height */}
              <div className="p-4 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-sg-bright-green/20 scrollbar-track-gray-100">
                <div className="prose prose-sm max-w-none">
                  {/* Text container - max-h and overflow removed from here */}
                  <div className="text-sg-dark-teal/80 leading-relaxed whitespace-pre-wrap text-sm font-plus-jakarta">
                    {displayedText}
                    {!isComplete && (
                      <span className="inline-block w-1.5 h-4 bg-sg-bright-green animate-pulse ml-1"></span>
                    )}
                  </div>
                </div>
                
                {isComplete && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-xs text-sg-dark-teal/50 font-plus-jakarta">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Analysis complete</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit and Auto-Complete Section */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
              <div className="flex flex-col space-y-3">
                {/* Submit Button */}
                <button
                  type="button"
                  onClick={() => onSubmitAnswer(currentAnswer)}
                  disabled={isSubmitDisabled}
                  className={`
                    group relative overflow-hidden px-5 py-3 rounded-lg font-semibold text-sm font-plus-jakarta
                    transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-sg-bright-green/30
                    ${isSubmitDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-sg-bright-green text-white hover:bg-sg-bright-green/90 hover:-translate-y-0.5 hover:shadow-lg active:transform active:scale-95'
                    }
                  `}
                >
                  <div className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Answer</span>
                        <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
                
                {/* Auto-Complete Section */}
                {autoCompleteFeatureEnabled && !forceDisabled && !isAutoCompleting && !isLoading && (
                  <div className="flex flex-col space-y-2">
                    {renderTestPersonaTierSelector()}
                    <button
                      onClick={handleStartAutoComplete}
                      className="px-3 py-2 bg-white border border-sg-bright-green/40 text-sg-bright-green rounded-lg font-medium text-sm font-plus-jakarta
                                 hover:bg-sg-bright-green hover:text-white transition-all duration-200 
                                 focus:outline-none focus:ring-2 focus:ring-sg-bright-green/30 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Auto-Complete</span>
                    </button>
                  </div>
                )}
                
                {/* Auto-Complete in Progress UI */}
                {isAutoCompleting && (
                  <div className="flex items-center justify-between w-full p-3 bg-sg-bright-green/5 rounded-lg border border-sg-bright-green/20">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <svg className="animate-spin h-4 w-4 text-sg-bright-green" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sg-dark-teal text-sm font-plus-jakarta">Auto-completing...</div>
                        <div className="text-xs text-sg-dark-teal/70 font-plus-jakarta">
                          Progress: {autoCompleteCount}/{maxQuestions - questionAnswerHistory.length} remaining
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAutoCompleting(false)}
                      className="px-2 py-1 bg-red-100 text-red-700 border border-red-300 rounded-md hover:bg-red-200 transition-all text-xs font-medium font-plus-jakarta flex items-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Stop</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ScorecardQuestionDisplay);
