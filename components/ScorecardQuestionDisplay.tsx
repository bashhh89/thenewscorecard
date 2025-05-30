import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';

// Temporary function until we implement proper utils
const isAutoCompleteEnabled = () => true;

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
              className="w-full p-4 border-2 border-sg-gray-200 rounded-lg mt-4 min-h-[100px] 
                         focus:ring-2 focus:ring-sg-bright-green/20 focus:border-sg-bright-green 
                         text-sg-dark-teal font-plus-jakarta transition-all duration-200
                         placeholder:text-sg-gray-400 resize-none text-base leading-relaxed
                         bg-white shadow-sm hover:shadow-md font-medium"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Share your thoughts in detail..."
              disabled={isLoading}
              rows={4}
            />
            <div className="mt-2 text-sm text-sg-gray-500 flex justify-between items-center">
              <span className="font-medium">Be as specific as possible for better insights</span>
              <span className={`font-medium ${currentAnswer?.length > 20 ? 'text-sg-bright-green' : 'text-sg-gray-400'}`}>
                {currentAnswer?.length || 0} characters
              </span>
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="w-full">
            <div className="space-y-3 mt-4">
              {options?.map((option, index) => {
                const selected = currentAnswer === option;
                return (
                  <div 
                    key={option}
                    className={`group relative cursor-pointer transition-all duration-200 
                               ${selected ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
                    onClick={() => !isLoading && setCurrentAnswer(option)}
                  >
                    <div className={`
                      p-4 rounded-lg border-2 transition-all duration-200 bg-white min-h-[60px] shadow-sm hover:shadow-md
                      ${selected 
                        ? 'border-sg-bright-green bg-sg-light-mint shadow-md ring-2 ring-sg-bright-green/20' 
                        : 'border-sg-gray-200 hover:border-sg-bright-green/50 hover:bg-sg-light-mint/30'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}>
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center 
                          transition-all duration-200 flex-shrink-0
                          ${selected 
                            ? 'border-sg-bright-green bg-white ring-2 ring-sg-bright-green/20' 
                            : 'border-sg-gray-300 group-hover:border-sg-bright-green/70 bg-white'
                          }
                        `}>
                          {selected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-sg-bright-green animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`
                            text-lg leading-relaxed font-plus-jakarta font-medium
                            ${selected ? 'text-sg-dark-teal font-semibold' : 'text-sg-dark-teal/80'}
                          `}>
                            {option}
                          </span>
                        </div>
                        {selected && (
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="mt-4 p-3 bg-gradient-to-r from-sg-bright-green/5 to-sg-light-blue/5 rounded-lg border border-sg-bright-green/20">
              <div className="text-base text-sg-dark-teal/70 font-medium text-center font-plus-jakarta">
                Select the option that best describes your situation
              </div>
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="w-full">
            <div className="space-y-3 mt-4">
              {options?.map((option, index) => {
                const checked = (currentAnswer as string[]).includes(option);
                return (
                  <div 
                    key={option}
                    className={`group relative cursor-pointer transition-all duration-200 
                               ${checked ? 'scale-[1.01]' : 'hover:scale-[1.005]'}`}
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
                      p-4 rounded-lg border-2 transition-all duration-200 bg-white min-h-[60px] shadow-sm hover:shadow-md
                      ${checked 
                        ? 'border-sg-bright-green bg-sg-light-mint shadow-md ring-2 ring-sg-bright-green/20' 
                        : 'border-sg-gray-200 hover:border-sg-bright-green/50 hover:bg-sg-light-mint/30'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}>
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center 
                          transition-all duration-200 flex-shrink-0
                          ${checked 
                            ? 'border-sg-bright-green bg-sg-bright-green ring-2 ring-sg-bright-green/20' 
                            : 'border-sg-gray-300 group-hover:border-sg-bright-green/70 bg-white'
                          }
                        `}>
                          {checked && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`
                            text-lg leading-relaxed font-plus-jakarta font-medium
                            ${checked ? 'text-sg-dark-teal font-semibold' : 'text-sg-dark-teal/80'}
                          `}>
                            {option}
                          </span>
                        </div>
                        {checked && (
                          <div className="flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-sg-bright-green animate-pulse border border-white"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-sg-bright-green/5 to-sg-light-blue/5 rounded-lg border border-sg-bright-green/20">
              <div className="text-center">
                <div className="text-base text-sg-dark-teal/70 font-medium font-plus-jakarta mb-1">
                  Select all that apply
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-semibold text-sg-bright-green">{(currentAnswer as string[]).length}</span>
                  <span className="text-base text-sg-dark-teal/60 font-medium">
                    {(currentAnswer as string[]).length === 1 ? 'option selected' : 'options selected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'scale':
        return (
          <div className="w-full my-6">
            <div className="flex justify-between mb-4 text-base text-sg-dark-teal/80 px-1 font-medium">
              <span className="text-sg-dark-teal font-semibold">Not at all</span>
              <span className="text-sg-dark-teal font-semibold">Very much</span>
            </div>
            
            {/* Mobile: Vertical Stack */}
            <div className="block sm:hidden space-y-3">
              {options?.map((option, index) => {
                const selected = currentAnswer === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setCurrentAnswer(option)}
                    disabled={isLoading}
                    className={`
                      w-full min-h-[60px] py-4 px-6 rounded-lg transition-all duration-200 font-plus-jakarta
                      transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sg-bright-green/30 
                      shadow-sm hover:shadow-md border-2 font-medium
                      ${selected 
                        ? 'bg-sg-bright-green text-white shadow-lg border-sg-bright-green ring-2 ring-sg-bright-green/20' 
                        : 'bg-white border-sg-gray-200 text-sg-dark-teal hover:bg-sg-light-mint/50 hover:border-sg-bright-green/50'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl font-bold">{option}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium">
                          {index === 0 ? 'Lowest' : index === (options.length - 1) ? 'Highest' : `Level ${option}`}
                        </span>
                        {selected && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desktop: Horizontal Grid */}
            <div className="hidden sm:grid grid-cols-5 gap-3">
              {options?.map((option, index) => {
                const selected = currentAnswer === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setCurrentAnswer(option)}
                    disabled={isLoading}
                    className={`
                      relative min-h-[64px] py-4 px-3 rounded-lg transition-all duration-200 text-center flex flex-col items-center justify-center
                      transform active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sg-bright-green/30 font-plus-jakarta font-medium
                      shadow-sm hover:shadow-md border-2
                      ${selected 
                        ? 'bg-sg-bright-green text-white shadow-lg scale-110 border-sg-bright-green ring-2 ring-sg-bright-green/20' 
                        : 'bg-white border-sg-gray-200 text-sg-dark-teal hover:bg-sg-light-mint/50 hover:border-sg-bright-green/50'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    <span className="font-bold text-xl mb-1">{option}</span>
                    <span className="text-sm font-medium">
                      {index === 0 ? 'Lowest' : index === (options.length - 1) ? 'Highest' : `Level ${option}`}
                    </span>
                    {selected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="text-center mt-6 p-4 bg-gradient-to-r from-sg-bright-green/5 to-sg-light-blue/5 rounded-lg border border-sg-bright-green/20">
              <div className="text-base text-sg-dark-teal/70 font-medium font-plus-jakarta">
                Rate from <span className="font-semibold text-sg-bright-green">1 (lowest)</span> to <span className="font-semibold text-sg-bright-green">{options?.length || 5} (highest)</span>
              </div>
              {currentAnswer && (
                <div className="mt-2 text-lg font-bold text-sg-bright-green">
                  Selected: {currentAnswer}
                </div>
              )}
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
    <div className="min-h-screen bg-gradient-to-br from-sg-light-mint via-white to-sg-cream-1">
      {/* Professional Progress Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-sg-bright-green/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-sg-bright-green to-sg-light-blue rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-sg-dark-teal font-plus-jakarta">AI Maturity Assessment</h1>
                <p className="text-sm text-sg-dark-teal/70 font-plus-jakarta">{currentPhaseName}</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-sg-dark-teal/80 font-plus-jakarta font-medium">Question {currentQuestionNumber} of {maxQuestions}</div>
                <div className="text-xs text-sg-dark-teal/60 font-plus-jakarta">{Math.round((currentQuestionNumber / maxQuestions) * 100)}% Complete</div>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-sg-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - (currentQuestionNumber / maxQuestions))}`}
                    className="text-sg-bright-green transition-all duration-500 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-sg-bright-green">{Math.round((currentQuestionNumber / maxQuestions) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1.5 bg-sg-bright-green/10 text-sg-bright-green rounded-full text-sm font-medium font-plus-jakarta mb-4">
                <span className="w-2 h-2 bg-sg-bright-green rounded-full mr-2 animate-pulse"></span>
                Step {currentQuestionNumber} of {maxQuestions}
              </div>
              <h2 className="text-xl sm:text-2xl text-sg-dark-teal leading-snug font-plus-jakarta font-bold mb-4">
                {question}
              </h2>
              <p className="text-base text-sg-dark-teal/70 leading-relaxed font-plus-jakarta">
                Select your response to continue building your AI maturity profile.
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {renderAnswerInput()}
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-sg-bright-green/20 shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-sg-bright-green to-sg-light-blue rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-sg-dark-teal font-plus-jakarta mb-2">Ready to Continue?</h3>
                <p className="text-sm text-sg-dark-teal/70 font-plus-jakarta">Your response will be analyzed instantly</p>
              </div>

              <button
                type="button"
                onClick={() => onSubmitAnswer(currentAnswer)}
                disabled={isSubmitDisabled}
                className={`
                  w-full group relative overflow-hidden px-6 py-3 rounded-lg font-medium text-base font-plus-jakarta
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sg-bright-green/30 border-2 mb-4
                  ${isSubmitDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-sg-dark-teal text-white border-sg-dark-teal hover:bg-sg-dark-teal/90 shadow-md hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Continue Assessment</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>

              {autoCompleteFeatureEnabled && !forceDisabled && !isAutoCompleting && !isLoading && (
                <div className="border-t border-sg-bright-green/20 pt-4">
                  <div className="flex flex-col gap-3">
                    {renderTestPersonaTierSelector()}
                    <button
                      onClick={handleStartAutoComplete}
                      className="w-full px-4 py-3 bg-white border-2 border-sg-bright-green/30 text-sg-bright-green rounded-lg font-medium text-sm font-plus-jakarta
                                 hover:bg-sg-bright-green hover:text-white hover:border-sg-bright-green transition-all duration-200 
                                 focus:outline-none focus:ring-2 focus:ring-sg-bright-green/30 flex items-center justify-center gap-2
                                 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Auto-Complete All</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Auto-Complete Status */}
              {isAutoCompleting && (
                <div className="border-t border-sg-bright-green/20 pt-4">
                  <div className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-sg-bright-green/5 to-sg-light-blue/5 rounded-lg border-2 border-sg-bright-green/20">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <svg className="animate-spin h-5 w-5 text-sg-bright-green" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sg-dark-teal text-sm font-plus-jakarta">Auto-completing...</div>
                        <div className="text-xs text-sg-dark-teal/70 font-plus-jakarta">
                          {autoCompleteCount}/{maxQuestions - questionAnswerHistory.length} remaining
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAutoCompleting(false)}
                      className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-all text-xs font-medium font-plus-jakarta flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Stop</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Analysis Card */}
            {reasoningText && (
              <div className="bg-white rounded-xl border border-sg-bright-green/20 shadow-lg overflow-hidden mt-6">
                <div className="bg-gradient-to-r from-sg-bright-green/10 to-sg-light-blue/10 p-4 border-b border-sg-bright-green/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-sg-bright-green to-sg-light-blue rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-sg-dark-teal font-plus-jakarta">AI Insights</h3>
                      <p className="text-sm text-sg-dark-teal/70 font-plus-jakarta">Contextual analysis for this question</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 max-h-64 overflow-y-auto">
                  <div className="text-sm text-sg-dark-teal/90 leading-relaxed whitespace-pre-wrap font-plus-jakarta">
                    {displayedText}
                    {!isComplete && (
                      <span className="inline-block w-2 h-4 bg-gradient-to-r from-sg-bright-green to-sg-light-blue animate-pulse ml-1 rounded-sm"></span>
                    )}
                  </div>
                  
                  {isComplete && (
                    <div className="mt-4 pt-4 border-t border-sg-bright-green/10">
                      <div className="flex items-center gap-2 text-xs text-sg-dark-teal/60 font-plus-jakarta font-medium">
                        <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Analysis complete</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScorecardQuestionDisplay);
