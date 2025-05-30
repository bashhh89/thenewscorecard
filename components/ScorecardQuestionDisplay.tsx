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
  
  // Use typing effect for analysis text
  const { displayedText, isComplete } = useTypingEffect(reasoningText || '', 30);
  
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
              className="w-full p-6 border-2 border-sg-gray-200 rounded-xl mt-6 min-h-[120px] 
                         focus:ring-3 focus:ring-sg-bright-green/20 focus:border-sg-bright-green 
                         text-sg-dark-teal font-plus-jakarta transition-all duration-300
                         placeholder:text-sg-gray-400 resize-none text-lg leading-relaxed
                         bg-white shadow-lg hover:shadow-xl font-medium"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Share your thoughts in detail..."
              disabled={isLoading}
              rows={5}
            />
            <div className="mt-4 p-4 bg-gradient-to-r from-sg-dark-teal/10 to-sg-dark-teal/10 rounded-xl border-2 border-sg-dark-teal/30">
              <div className="text-base text-sg-gray-600 flex justify-between items-center">
                <span className="font-bold font-plus-jakarta">Be as specific as possible for better insights</span>
                <span className={`font-black text-lg ${currentAnswer?.length > 20 ? 'text-sg-dark-teal' : 'text-sg-gray-400'}`}>
                  {currentAnswer?.length || 0} characters
                </span>
              </div>
            </div>
          </div>
        );
      case 'radio':
        return (
          <div className="w-full">
            {/* Smart Grid Layout Based on Option Count */}
            <div className={`
              gap-4 mt-6
              ${options && options.length <= 4 
                ? 'grid grid-cols-1 sm:grid-cols-1' 
                : options && options.length <= 6
                  ? 'grid grid-cols-1 sm:grid-cols-2' 
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }
            `}>
              {options?.map((option, index) => {
                const selected = currentAnswer === option;
                return (
                  <div 
                    key={option}
                    className={`group relative cursor-pointer transition-all duration-300 
                               ${selected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                    onClick={() => !isLoading && setCurrentAnswer(option)}
                  >
                    <div className={`
                      p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 bg-white min-h-[70px] shadow-lg hover:shadow-xl
                      ${selected 
                        ? 'border-sg-bright-green bg-gradient-to-r from-sg-light-mint to-sg-cream-1 shadow-xl ring-3 ring-sg-bright-green/20' 
                        : 'border-sg-gray-200 hover:border-sg-bright-green/70 hover:bg-gradient-to-r hover:from-sg-light-mint/30 hover:to-sg-cream-1/30'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}>
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-6 h-6 rounded-full border-3 flex items-center justify-center 
                          transition-all duration-300 flex-shrink-0
                          ${selected 
                            ? 'border-sg-bright-green bg-white ring-3 ring-sg-bright-green/20 shadow-md' 
                            : 'border-sg-gray-300 group-hover:border-sg-bright-green/70 bg-white group-hover:shadow-sm'
                          }
                        `}>
                          {selected && (
                            <div className="w-3 h-3 rounded-full bg-sg-bright-green animate-pulse shadow-sm"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`
                            text-base sm:text-lg leading-relaxed font-plus-jakarta font-semibold
                            ${selected ? 'text-sg-dark-teal font-bold' : 'text-sg-dark-teal/90'}
                          `}>
                            {option}
                          </span>
                        </div>
                        {selected && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-sg-dark-teal rounded-full flex items-center justify-center shadow-md">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-sg-dark-teal/10 to-sg-dark-teal/10 rounded-xl border-2 border-sg-dark-teal/30 text-center">
              <div className="text-lg text-sg-dark-teal font-bold font-plus-jakarta">
                Select the option that best describes your situation
              </div>
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="w-full">
            {/* Smart Grid Layout Based on Option Count */}
            <div className={`
              gap-4 mt-6
              ${options && options.length <= 4 
                ? 'grid grid-cols-1 sm:grid-cols-1' 
                : options && options.length <= 6
                  ? 'grid grid-cols-1 sm:grid-cols-2' 
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }
            `}>
              {options?.map((option, index) => {
                const checked = (currentAnswer as string[]).includes(option);
                return (
                  <div 
                    key={option}
                    className={`group relative cursor-pointer transition-all duration-300 
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
                      p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 bg-white min-h-[70px] shadow-lg hover:shadow-xl
                      ${checked 
                        ? 'border-sg-bright-green bg-gradient-to-r from-sg-light-mint to-sg-cream-1 shadow-xl ring-3 ring-sg-bright-green/20' 
                        : 'border-sg-gray-200 hover:border-sg-bright-green/70 hover:bg-gradient-to-r hover:from-sg-light-mint/30 hover:to-sg-cream-1/30'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}>
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-7 h-7 rounded border-3 flex items-center justify-center 
                          transition-all duration-300 flex-shrink-0 shadow-sm
                          ${checked 
                            ? 'border-sg-bright-green bg-sg-bright-green ring-2 ring-sg-bright-green/20 shadow-md' 
                            : 'border-sg-gray-400 group-hover:border-sg-bright-green/70 bg-white group-hover:shadow-md border-2'
                          }
                        `}>
                          {checked && (
                            <svg className="w-3 h-3 text-sg-dark-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`
                            text-base sm:text-lg leading-relaxed font-plus-jakarta font-semibold
                            ${checked ? 'text-sg-dark-teal font-bold' : 'text-sg-dark-teal/90'}
                          `}>
                            {option}
                          </span>
                        </div>
                        {checked && (
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 rounded-full bg-sg-bright-green animate-pulse border-2 border-white shadow-md"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-5 bg-gradient-to-r from-sg-dark-teal/10 to-sg-dark-teal/10 rounded-xl border-2 border-sg-dark-teal/30">
              <div className="text-center">
                <div className="text-lg text-sg-dark-teal font-bold font-plus-jakarta">
                  Select all that apply
                </div>
              </div>
            </div>
          </div>
        );
      case 'scale':
        return (
          <div className="w-full my-6">
            <div className="flex justify-between mb-4 text-sm text-sg-dark-teal/70 px-1 font-medium font-plus-jakarta">
              <span className="text-sg-dark-teal font-semibold">Not at all</span>
              <span className="text-sg-dark-teal font-semibold">Very much</span>
            </div>
            
            {/* All devices: Responsive horizontal buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {options?.map((option, index) => {
                const selected = currentAnswer === option;
                // Extract ONLY the number from the option, remove any text
                const numberOnly = option.match(/\d+/)?.[0] || (index + 1).toString();
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setCurrentAnswer(option)}
                    disabled={isLoading}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 font-plus-jakarta font-semibold text-base sm:text-lg
                      ${selected 
                        ? 'bg-sg-dark-teal text-white shadow-md' 
                        : 'bg-white border-2 border-gray-300 text-sg-dark-teal hover:border-sg-dark-teal'
                      }
                      ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    {numberOnly}
                  </button>
                );
              })}
            </div>
            
            <div className="text-center mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-600 font-plus-jakarta">
                Rate from <span className="font-semibold text-sg-dark-teal">1 (lowest)</span> to <span className="font-semibold text-sg-dark-teal">{options?.length || 5} (highest)</span>
              </div>
              {currentAnswer && (
                <div className="mt-1 sm:mt-2 text-sg-dark-teal font-semibold text-sm">
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
  
  // Add state for the new analysis flow
  const [showAnalysisOverlay, setShowAnalysisOverlay] = useState(false);
  const [submittedAnswerForAnalysis, setSubmittedAnswerForAnalysis] = useState<any>(null);
  
  // Handle the new submit flow - show full screen analysis first
  const handleSubmitWithAnalysis = (answer: any, answerSource?: AnswerSourceType) => {
    // Skip analysis overlay during auto-complete - go straight to submission
    if (isAutoCompleting) {
      onSubmitAnswer(answer, answerSource);
      return;
    }
    
    if (!submittedAnswerForAnalysis) {
      // First time - store answer and show overlay
      setSubmittedAnswerForAnalysis(answer);
      setShowAnalysisOverlay(true);
    } else if (!showAnalysisOverlay) {
      // Answer submitted but analysis not shown - show overlay
      setShowAnalysisOverlay(true);
    } else {
      // Continue clicked from overlay - actually submit and move to next question
      setShowAnalysisOverlay(false);
      setSubmittedAnswerForAnalysis(null);
      onSubmitAnswer(answer, answerSource);
    }
  };
  
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
      const systemPrompt = `You are simulating the responses of a ${testPersonaTier} tier organization in the ${industry} industry taking an AI maturity assessment. 
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
      
      // Use Pollinations API directly (since /api/groq doesn't exist)
      try {
          const pollinationsResponse = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: "openai-large",
              messages: [
              { role: "system", content: systemPrompt },
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
        console.error('Pollinations API failed:', pollinationsError);
        // Generate fallback answer based on question type and persona
        simulatedPersonaAnswer = generateFallbackAnswer();
        currentAnswerSource = 'Fallback Failed';
      }
      
      if (simulatedPersonaAnswer) {
        console.log(`Auto-complete answer: "${simulatedPersonaAnswer.substring(0, 50)}..."`);
        
      setCurrentAnswer(simulatedPersonaAnswer);
          setAutoCompleteCount(prev => prev + 1);
        
        // Auto-submit the answer after a brief delay to show the change
        setTimeout(() => {
          if (isAutoCompleting) {
            handleSubmitWithAnalysis(simulatedPersonaAnswer, currentAnswerSource);
          }
          setIsLoadingLocally(false);
        }, 1500);
      } else {
        console.error('No valid answer generated for auto-complete');
          setIsAutoCompleting(false);
        setAutoCompleteError('Failed to generate a valid answer');
          setIsLoadingLocally(false);
        }
    } catch (error) {
      console.error('Auto-complete error:', error);
      setAutoCompleteError('AI answer generation failed.');
      setIsAutoCompleting(false);
      setIsLoadingLocally(false);
    }
  };
  
  // Generate fallback answer when APIs fail
  const generateFallbackAnswer = (): string => {
    if (normalizedAnswerType === 'scale' && options) {
      // Return appropriate scale number based on persona
      if (testPersonaTier === 'Dabbler') return '1';
      if (testPersonaTier === 'Enabler') return '3';
      return '5';
    } else if (normalizedAnswerType === 'radio' && options) {
      // Return first option for simplicity
      return options[0];
    } else if (normalizedAnswerType === 'checkbox' && options) {
      // Return appropriate number of options based on persona
      const numToSelect = testPersonaTier === 'Dabbler' ? 1 : testPersonaTier === 'Enabler' ? 2 : 3;
      return JSON.stringify(options.slice(0, Math.min(numToSelect, options.length)));
    } else {
      // Text answer based on persona
      if (testPersonaTier === 'Dabbler') return 'We are just beginning to explore this area.';
      if (testPersonaTier === 'Enabler') return 'We have some processes in place but are still developing.';
      return 'We have comprehensive strategies and advanced processes in place.';
    }
  };
  
  // Test Persona Tier Selector
  const renderTestPersonaTierSelector = () => {
    // Only render this if auto-complete feature is enabled
    if (!autoCompleteFeatureEnabled || forceDisabled) return null;
    
    return (
      <div className="relative flex-1">
        <select
          value={testPersonaTier}
          onChange={(e) => setTestPersonaTier(e.target.value as 'Dabbler' | 'Enabler' | 'Leader')}
          disabled={isAutoCompleting || isLoading}
          className="appearance-none bg-white border border-sg-bright-green/40 text-sg-dark-teal 
                     rounded-md px-2 py-1.5 pr-6 font-medium text-xs w-full font-plus-jakarta
                     focus:ring-1 focus:ring-sg-bright-green/20 focus:border-sg-bright-green 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-sg-bright-green/60 transition-all duration-200"
        >
          <option value="Dabbler">🔰 Dabbler</option>
          <option value="Enabler">⚡ Enabler</option>
          <option value="Leader">🚀 Leader</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none">
          <svg className="w-3 h-3 text-sg-dark-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-sg-bright-green to-sg-light-blue rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm sm:text-lg font-bold text-sg-dark-teal font-plus-jakarta">AI Maturity Assessment</h1>
                <div className="inline-flex items-center px-3 py-1.5 bg-sg-dark-teal/10 text-sg-dark-teal rounded-full text-sm font-medium font-plus-jakarta mb-3 sm:mb-4">
                  <span className="w-2 h-2 bg-sg-dark-teal rounded-full mr-2 animate-pulse"></span>
                  {currentPhaseName}
                </div>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-sg-dark-teal/80 font-plus-jakarta font-medium">Question {currentQuestionNumber} of {maxQuestions}</div>
                <div className="text-xs text-sg-dark-teal/60 font-plus-jakarta">{Math.round((currentQuestionNumber / maxQuestions) * 100)}% Complete</div>
              </div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90" viewBox="0 0 100 100">
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
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Question Section - Now Full Width */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center px-3 py-1.5 bg-sg-dark-teal/10 text-sg-dark-teal rounded-full text-sm font-medium font-plus-jakarta mb-3 sm:mb-4">
            <span className="w-2 h-2 bg-sg-dark-teal rounded-full mr-2 animate-pulse"></span>
                Step {currentQuestionNumber} of {maxQuestions}
              </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-sg-dark-teal leading-snug font-plus-jakarta font-bold mb-4 sm:mb-6">
                {question}
              </h2>
          <p className="text-base sm:text-lg text-sg-dark-teal/70 leading-relaxed font-plus-jakarta max-w-4xl">
                Select your response to continue building your AI maturity profile.
              </p>
            </div>

        {/* Answer Options - Now with Smart Grid Layout */}
        <div className="mb-8">
              {renderAnswerInput()}
          </div>

        {/* Submit Button - Now Below Options */}
        <div className="flex flex-col items-center gap-4">
              <button
                type="button"
            onClick={() => handleSubmitWithAnalysis(currentAnswer)}
                disabled={isSubmitDisabled}
                className={`
              w-full max-w-md px-6 py-4 rounded-xl font-semibold text-lg font-plus-jakarta
              transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sg-dark-teal/30 border-2
              transform active:scale-[0.98] hover:scale-[1.01]
                  ${isSubmitDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 shadow-sm'
                : submittedAnswerForAnalysis && !showAnalysisOverlay
                  ? 'bg-gradient-to-r from-sg-dark-teal to-sg-dark-teal text-white border-sg-dark-teal hover:from-sg-dark-teal/90 hover:to-sg-dark-teal/90 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-sg-dark-teal to-sg-dark-teal text-white border-sg-dark-teal hover:from-sg-dark-teal/90 hover:to-sg-dark-teal/90 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-3">
              <span>
                {submittedAnswerForAnalysis && !showAnalysisOverlay ? 'View Analysis' : 'Submit Answer'}
              </span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>

          {/* Auto-Complete Controls - Compact Under Button */}
              {autoCompleteFeatureEnabled && !forceDisabled && !isAutoCompleting && !isLoading && (
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-sg-dark-teal/20 shadow-sm">
              <div className="flex items-center gap-2">
                    {renderTestPersonaTierSelector()}
                    <button
                      onClick={handleStartAutoComplete}
                  className="px-4 py-2 bg-white border-2 border-sg-dark-teal/30 text-sg-dark-teal rounded-lg font-medium text-sm font-plus-jakarta
                             hover:bg-sg-dark-teal hover:text-white hover:border-sg-dark-teal transition-all duration-200 
                             focus:outline-none focus:ring-1 focus:ring-sg-dark-teal/30 flex items-center gap-2
                                 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                  <span>Auto-Complete</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Auto-Complete Status */}
              {isAutoCompleting && (
            <div className="w-full max-w-md p-4 bg-gradient-to-r from-sg-dark-teal/5 to-sg-dark-teal/5 rounded-xl border-2 border-sg-dark-teal/20">
              <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                    <svg className="animate-spin h-5 w-5 text-sg-dark-teal" fill="none" viewBox="0 0 24 24">
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
                  className="px-3 py-2 bg-white border border-sg-dark-teal/30 text-sg-dark-teal rounded-lg text-xs font-plus-jakarta hover:bg-sg-dark-teal hover:text-white transition-all duration-200 flex items-center gap-1"
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
            </div>

      {/* Full-Screen Analysis Overlay */}
      {showAnalysisOverlay && reasoningText && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-sg-dark-teal/10 to-sg-dark-teal/10 p-6 border-b border-sg-dark-teal/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sg-dark-teal to-sg-dark-teal rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                  <h2 className="text-2xl font-bold text-sg-dark-teal font-plus-jakarta">AI Analysis</h2>
                  <p className="text-sg-dark-teal/70 font-plus-jakarta">Analyzing your response...</p>
                    </div>
                  </div>
                </div>
                
            {/* Analysis Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-lg max-w-none text-sg-dark-teal/90 leading-relaxed font-plus-jakarta">
                    {displayedText}
                    {!isComplete && (
                  <span className="inline-block w-3 h-5 bg-gradient-to-r from-sg-dark-teal to-sg-dark-teal animate-pulse ml-2 rounded-sm"></span>
                    )}
                  </div>
                  
                  {isComplete && (
                <div className="mt-6 pt-4 border-t border-sg-dark-teal/10">
                  <div className="flex items-center justify-center gap-3 text-sm text-sg-dark-teal/60 font-plus-jakarta font-medium">
                    <svg className="w-5 h-5 text-sg-dark-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Analysis complete</span>
                      </div>
                    </div>
                  )}
                </div>

            {/* Action Footer */}
            <div className="p-6 bg-gradient-to-r from-sg-light-mint/30 to-white border-t border-sg-dark-teal/10">
              <button
                type="button"
                onClick={() => handleSubmitWithAnalysis(submittedAnswerForAnalysis)}
                disabled={!isComplete}
                className={`
                  w-full px-6 py-4 rounded-xl font-semibold text-lg font-plus-jakarta
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sg-dark-teal/30
                  transform active:scale-[0.98] hover:scale-[1.01]
                  ${!isComplete
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sg-dark-teal to-sg-dark-teal text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  {!isComplete ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>AI is analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Next Question</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
            )}
          </div>
              </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ScorecardQuestionDisplay);
