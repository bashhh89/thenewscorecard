import { NextResponse, NextRequest } from 'next/server';
import { AIProviderManager } from '@/lib/ai-providers';
import { logger } from '@/lib/logger';

// Define ScorecardHistoryEntry interface for type safety
type AnswerSourceType = 'Groq Llama 3 8B' | 'Pollinations Fallback' | 'Groq API Failed' | 'Fallback Failed' | 'Manual' | 'OpenAI';
interface ScorecardHistoryEntry {
  question: string;
  answer: any;
  phaseName?: string;
  answerType?: string;
  options?: string[] | null;
  reasoningText?: string | null;
  answerSource?: AnswerSourceType;
}

// Define assessment phases and maximum questions
const ASSESSMENT_PHASES = ['Strategy & Goals', 'Data Readiness', 'Technology & Tools', 'Team Skills & Process', 'Governance & Measurement'];
const MAX_QUESTIONS = 20; // Set back to 20 questions

// Pollinations API base URL
const POLLINATIONS_API_URL = "https://text.pollinations.ai/openai";

// Basic scoring logic (needs refinement based on actual questions)
function calculateTierScore(history: ScorecardHistoryEntry[]): number {
  let totalScore = 0;
  const MAX_POSSIBLE_SCORE = 100; // Maximum possible score (20 questions × max 5 points each)
  
  for (const entry of history) {
    let questionScore = 0;
    let scoringReason = '';
    
    // Assign points based on answer type and value
    if (entry.answerType === 'scale' && typeof entry.answer === 'string') {
      const scaleValue = parseInt(entry.answer, 10);
      if (!isNaN(scaleValue)) {
        // Scale values (typically 1-5) are now weighted more heavily
        // 1 = 1pt, 2 = 2pts, 3 = 3pts, 4 = 4pts, 5 = 5pts
        questionScore = scaleValue;
        scoringReason = `Scale value ${scaleValue}`;
      }
    } else if (entry.answerType === 'radio' && typeof entry.answer === 'string') {
      // Enhanced scoring for radio buttons with more sophisticated pattern matching
      const answerLower = entry.answer.toLowerCase();
      
      // Leader-level keywords
      if (
        answerLower.includes('advanced') || 
        answerLower.includes('extensive') || 
        answerLower.includes('strategic') || 
        answerLower.includes('comprehensive') ||
        answerLower.includes('integrated') ||
        answerLower.includes('sophisticated') ||
        answerLower.includes('enterprise') ||
        answerLower.includes('mature') ||
        answerLower.includes('automated') ||
        answerLower.includes('ai-driven') ||
        answerLower.includes('predictive')
      ) {
        questionScore = 5; // Maximum points for Leader-level answers
        scoringReason = 'Contains Leader-level keywords';
      }
      // Enabler-level keywords
      else if (
        answerLower.includes('some') || 
        answerLower.includes('moderate') ||
        answerLower.includes('developing') ||
        answerLower.includes('improving') ||
        answerLower.includes('established') ||
        answerLower.includes('regular') ||
        answerLower.includes('multiple') ||
        answerLower.includes('organized') ||
        answerLower.includes('consistent')
      ) {
        questionScore = 3; // Medium points for Enabler-level answers
        scoringReason = 'Contains Enabler-level keywords';
      }
      // Dabbler-level keywords - EXPANDED LIST
      else if (
        answerLower.includes('basic') || 
        answerLower.includes('limited') ||
        answerLower.includes('minimal') ||
        answerLower.includes('occasional') ||
        answerLower.includes('beginning') ||
        answerLower.includes('early') ||
        answerLower.includes('exploring') ||
        answerLower.includes('ad hoc') ||
        answerLower.includes('manual') ||
        answerLower.includes('no ') ||
        answerLower.includes('not ') ||
        answerLower.includes('don\'t') ||
        // Additional Dabbler keywords
        answerLower.includes('experimenting') ||
        answerLower.includes('testing') ||
        answerLower.includes('rarely') ||
        answerLower.includes('initial') ||
        answerLower.includes('starting') ||
        answerLower.includes('considering') ||
        answerLower.includes('planning') ||
        answerLower.includes('yet to') ||
        answerLower.includes('haven\'t') ||
        answerLower.includes('unsure') ||
        answerLower.includes('uncertain') ||
        answerLower.includes('beginner') ||
        answerLower.includes('introduction') ||
        answerLower.includes('introductory') ||
        answerLower.includes('foundation') ||
        answerLower.includes('preliminary')
      ) {
        questionScore = 1; // Minimum points for Dabbler-level answers
        scoringReason = 'Contains Dabbler-level keywords';
      }
      else {
        // Default for other radio answers that don't match specific patterns
        questionScore = 2; // Lowered default score to better differentiate
        scoringReason = 'Default radio answer (no specific keywords matched)';
      }
    } else if (entry.answerType === 'checkbox' && Array.isArray(entry.answer)) {
      // More sophisticated checkbox scoring
      // Base score on number of selected options, but with diminishing returns
      const numOptions = entry.answer.length;
      
      // More options generally indicates more comprehensive implementation
      if (numOptions === 0) {
        questionScore = 0;
        scoringReason = 'No options selected';
      } else if (numOptions === 1) {
        questionScore = 1; // Single option = basic/minimal (Dabbler)
        scoringReason = 'Single option selected (Dabbler-level)';
      } else if (numOptions === 2) {
        questionScore = 2; // Two options = developing (Dabbler-Enabler)
        scoringReason = 'Two options selected (Dabbler-Enabler level)';
      } else if (numOptions === 3) {
        questionScore = 3; // Three options = established (Enabler)
        scoringReason = 'Three options selected (Enabler-level)';
      } else if (numOptions === 4) {
        questionScore = 4; // Four options = comprehensive (Enabler-Leader)
        scoringReason = 'Four options selected (Enabler-Leader level)';
      } else {
        questionScore = 5; // Five+ options = extensive (Leader)
        scoringReason = 'Five or more options selected (Leader-level)';
      }
      
      // Also analyze the content of selected options
      let leaderKeywordCount = 0;
      let dabblerKeywordCount = 0;
      
      for (const option of entry.answer) {
        const optionLower = option.toLowerCase();
        
        // Count Leader-level keywords in options
        if (
          optionLower.includes('advanced') || 
          optionLower.includes('extensive') ||
          optionLower.includes('strategic') ||
          optionLower.includes('ai-driven') ||
          optionLower.includes('predictive') ||
          optionLower.includes('automated') ||
          // Add more Leader-specific option keywords
          optionLower.includes('enterprise') ||
          optionLower.includes('integrated') ||
          optionLower.includes('sophisticated') ||
          optionLower.includes('comprehensive') ||
          optionLower.includes('machine learning') ||
          optionLower.includes('neural') ||
          optionLower.includes('optimize') ||
          optionLower.includes('transform')
        ) {
          leaderKeywordCount++;
        }
        
        // Count Dabbler-level keywords in options
        if (
          optionLower.includes('basic') || 
          optionLower.includes('limited') ||
          optionLower.includes('minimal') ||
          optionLower.includes('manual') ||
          // Add more Dabbler-specific option keywords
          optionLower.includes('simple') ||
          optionLower.includes('occasional') ||
          optionLower.includes('beginning') ||
          optionLower.includes('introduction') ||
          optionLower.includes('initial') ||
          optionLower.includes('trial') ||
          optionLower.includes('testing') ||
          optionLower.includes('single') ||
          optionLower.includes('rarely')
        ) {
          dabblerKeywordCount++;
        }
      }
      
      // Adjust score based on the content of selected options - MORE AGGRESSIVE ADJUSTMENT
      if (leaderKeywordCount > 0) {
        const leaderBoost = Math.min(2, leaderKeywordCount); // More aggressive boost for Leader options
        questionScore = Math.min(5, questionScore + leaderBoost);
        scoringReason += `, boosted for ${leaderKeywordCount} Leader-level keywords (+${leaderBoost})`;
      }
      if (dabblerKeywordCount > 0 && questionScore > 1) {
        const dabblerReduction = Math.min(2, dabblerKeywordCount); // More aggressive reduction for Dabbler options
        questionScore = Math.max(1, questionScore - dabblerReduction);
        scoringReason += `, reduced for ${dabblerKeywordCount} Dabbler-level keywords (-${dabblerReduction})`;
      }
    } else if (entry.answerType === 'text' && typeof entry.answer === 'string') {
      // Text answers are harder to score automatically, but we can look for key patterns
      const textLower = entry.answer.toLowerCase();
      const textLength = entry.answer.length;
      
      // Very short answers typically indicate less sophistication
      if (textLength < 30) {
        questionScore = 1; // Very short = basic (Dabbler)
        scoringReason = 'Very short text response (<30 chars, Dabbler-level)';
      } else if (textLength < 80) {
        questionScore = 2; // Short = developing (Dabbler-Enabler)
        scoringReason = 'Short text response (30-80 chars, Dabbler-Enabler level)';
      } else if (textLength < 150) {
        questionScore = 3; // Medium = established (Enabler)
        scoringReason = 'Medium text response (80-150 chars, Enabler-level)';
      } else {
        questionScore = 4; // Long = comprehensive (Leader)
        scoringReason = 'Long text response (>150 chars, Leader-level)';
      }
      
      // Look for Leader-level keywords in text answers
      if (
        textLower.includes('strategy') || 
        textLower.includes('strategic') ||
        textLower.includes('comprehensive') ||
        textLower.includes('integrated') ||
        textLower.includes('enterprise') ||
        textLower.includes('advanced') ||
        textLower.includes('automated') ||
        textLower.includes('ai-driven') ||
        textLower.includes('predictive') ||
        textLower.includes('machine learning') ||
        textLower.includes('deep learning') ||
        textLower.includes('neural') ||
        textLower.includes('transform')
      ) {
        questionScore = Math.min(5, questionScore + 1); // Boost for Leader-level keywords
        scoringReason += ', boosted for Leader-level keywords';
      }
      
      // Look for Dabbler-level indicators in text answers - EXPANDED LIST
      if (
        textLower.includes('basic') || 
        textLower.includes('limited') ||
        textLower.includes('minimal') ||
        textLower.includes('beginning') ||
        textLower.includes('starting') ||
        textLower.includes('not sure') ||
        textLower.includes('don\'t know') ||
        textLower.includes('haven\'t') ||
        textLower.includes('no ') ||
        textLower.includes('not ') ||
        // Additional Dabbler text indicators
        textLower.includes('i\'m new') ||
        textLower.includes('we\'re new') ||
        textLower.includes('just started') ||
        textLower.includes('initial stages') ||
        textLower.includes('exploring') ||
        textLower.includes('considering') ||
        textLower.includes('experimenting') ||
        textLower.includes('testing') ||
        textLower.includes('trial') ||
        textLower.includes('simple') ||
        textLower.includes('occasional') ||
        textLower.includes('ad hoc') ||
        textLower.includes('rarely') ||
        textLower.includes('manual') ||
        textLower.includes('unsure') ||
        textLower.includes('uncertain') ||
        textLower.includes('unfamiliar') ||
        textLower.includes('learning about') ||
        textLower.includes('not adopted') ||
        textLower.includes('not implemented') ||
        textLower.includes('not utilizing')
      ) {
        // More aggressive reduction for Dabbler text
        const negativeMatches = textLower.match(/(no |not |haven't|don't)/g);
        if (negativeMatches && negativeMatches.length > 1) {
          // Multiple negative indicators mean very low score
          questionScore = 1;
          scoringReason += ', reduced to minimum for multiple negative Dabbler indicators';
        } else {
          questionScore = Math.max(1, questionScore - 2); // Stronger reduction for Dabbler-level indicators
          scoringReason += ', reduced for Dabbler-level keywords (-2)';
        }
      }
    }
    
    // Add the question score to the total
    totalScore += questionScore;
  }

  // Normalize the score if we have fewer than MAX_QUESTIONS
  // This ensures fair comparison regardless of how many questions were answered
  if (history.length > 0 && history.length < MAX_QUESTIONS) {
    const normalizationFactor = MAX_QUESTIONS / history.length;
    const normalizedScore = Math.round(totalScore * normalizationFactor);
    return normalizedScore;
  }
  
  // Final safety check: If a high percentage of answers contain Dabbler keywords but score is above threshold,
  // adjust score to ensure it's classified as Dabbler
  const dabblerKeywordPattern = /(basic|limited|minimal|occasional|beginning|early|exploring|ad hoc|manual|no |not |don't|haven't|unsure|just started|considering|testing|trial)/i;
  let dabblerKeywordCount = 0;
  
  for (const entry of history) {
    const answerStr = typeof entry.answer === 'string' 
      ? entry.answer 
      : Array.isArray(entry.answer) 
        ? entry.answer.join(' ') 
        : JSON.stringify(entry.answer);
    
    if (dabblerKeywordPattern.test(answerStr)) {
      dabblerKeywordCount++;
    }
  }
  
  const dabblerKeywordPercentage = history.length > 0 ? (dabblerKeywordCount / history.length) * 100 : 0;
  
  // If more than 60% of answers contain Dabbler keywords but score is above Dabbler threshold,
  // apply a correction to ensure it's classified as Dabbler
  if (dabblerKeywordPercentage >= 60 && totalScore > DABBLER_MAX_SCORE && totalScore <= DABBLER_MAX_SCORE + 10) {
    const adjustedScore = DABBLER_MAX_SCORE;
    totalScore = adjustedScore;
  }
  
  return totalScore;
}

// Recalibrated score thresholds based on 20 questions with max 5 points each
// These thresholds are now percentages of the max possible score (100)
const DABBLER_MAX_SCORE = 50; // 50% - Previously 40%, increased to account for Dabbler answers scoring higher
const ENABLER_MAX_SCORE = 75; // 75% - Previously 70%, increased to maintain separation between tiers
// Leader is anything above ENABLER_MAX_SCORE (>75%)

function determineTier(score: number): 'Dabbler' | 'Enabler' | 'Leader' {
  if (score <= DABBLER_MAX_SCORE) {
    return 'Dabbler';
  } else if (score <= ENABLER_MAX_SCORE) {
    return 'Enabler';
  } else {
    return 'Leader';
  }
}


// Add a helper for fetch with retry
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delayMs = 2000) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      lastError = new Error(`Pollinations API responded with status ${res.status}: ${await res.text()}`);
    } catch (e) {
      lastError = e;
    }
    if (i < retries - 1) await new Promise(res => setTimeout(res, delayMs));
  }
  throw lastError || new Error('fetch failed');
}

// Debug function to verify tier calculation with sample answers
function debugTierCalculation() {
  logger.backend('Running tier calculation debug tests');
  
  // Sample answers for each tier
  const dabblerAnswers: ScorecardHistoryEntry[] = [
    { question: 'How would you describe your organization\'s current AI strategy?', answer: 'We have a basic understanding but no formal strategy', answerType: 'radio' },
    { question: 'How frequently does your team use AI tools?', answer: '1', answerType: 'scale' },
    { question: 'Which AI tools does your team currently use?', answer: ['Basic content generation'], answerType: 'checkbox' },
    { question: 'Describe your data collection process', answer: 'We collect some data but it\'s not organized.', answerType: 'text' },
  ];
  
  const enablerAnswers: ScorecardHistoryEntry[] = [
    { question: 'How would you describe your organization\'s current AI strategy?', answer: 'We have some strategic elements but are still developing', answerType: 'radio' },
    { question: 'How frequently does your team use AI tools?', answer: '3', answerType: 'scale' },
    { question: 'Which AI tools does your team currently use?', answer: ['Content generation', 'Email optimization', 'Basic analytics'], answerType: 'checkbox' },
    { question: 'Describe your data collection process', answer: 'We have established processes for collecting and organizing our marketing data with regular reviews.', answerType: 'text' },
  ];
  
  const leaderAnswers: ScorecardHistoryEntry[] = [
    { question: 'How would you describe your organization\'s current AI strategy?', answer: 'We have an advanced, comprehensive AI strategy integrated with business goals', answerType: 'radio' },
    { question: 'How frequently does your team use AI tools?', answer: '5', answerType: 'scale' },
    { question: 'Which AI tools does your team currently use?', answer: ['Advanced content generation', 'Predictive analytics', 'Automated personalization', 'AI-driven campaign orchestration', 'Customer journey optimization'], answerType: 'checkbox' },
    { question: 'Describe your data collection process', answer: 'We have a sophisticated, enterprise-wide data strategy with integrated AI-driven analytics and predictive modeling capabilities that inform all marketing decisions.', answerType: 'text' },
  ];
  
  // Test each set of answers
  const dabblerScore = calculateTierScore(dabblerAnswers);
  const dabblerTier = determineTier(dabblerScore);
  logger.backend(`DEBUG: Dabbler test - Score: ${dabblerScore}, Tier: ${dabblerTier}`);
  
  const enablerScore = calculateTierScore(enablerAnswers);
  const enablerTier = determineTier(enablerScore);
  logger.backend(`DEBUG: Enabler test - Score: ${enablerScore}, Tier: ${enablerTier}`);
  
  const leaderScore = calculateTierScore(leaderAnswers);
  const leaderTier = determineTier(leaderScore);
  logger.backend(`DEBUG: Leader test - Score: ${leaderScore}, Tier: ${leaderTier}`);
  
  return {
    dabblerTest: { score: dabblerScore, tier: dabblerTier },
    enablerTest: { score: enablerScore, tier: enablerTier },
    leaderTest: { score: leaderScore, tier: leaderTier }
  };
}

export async function POST(request: Request) {
  const localAiManager = new AIProviderManager();
  try {
    // Parse and validate the request body with more robust error handling
    let requestData;
    try {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid content type:', contentType);
        return NextResponse.json(
          { error: 'Invalid content type', message: 'Request must be application/json' },
          { status: 400 }
        );
      }
      
      const text = await request.text();
      try {
        requestData = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw request body:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
        return NextResponse.json(
          { error: 'Invalid JSON', message: 'Request body is not valid JSON' },
          { status: 400 }
        );
      }
    } catch (bodyError) {
      console.error('Error reading request body:', bodyError);
      return NextResponse.json(
        { error: 'Request body error', message: 'Failed to read request body' },
        { status: 400 }
      );
    }
    
    // CRITICAL FIX: Ensure history defaults to an empty array if it is not provided or undefined
    const { action, currentPhaseName, industry, userName } = requestData;
    const history = Array.isArray(requestData.history) ? requestData.history : [];

    // Check if this is a report generation request
    if (action === 'generateReport') {
      return handleReportGeneration(history as ScorecardHistoryEntry[], industry, userName, localAiManager);
    } else {
      // For phased Q&A logic
      if (!currentPhaseName && history.length === 0) {  // Now safe to check history.length
        // For the initial call with no phase specified, default to first phase
        const firstPhase = ASSESSMENT_PHASES[0];
        return handleAssessmentRequest(firstPhase, [], industry, localAiManager);
      }
      
      return handleAssessmentRequest(currentPhaseName, history as ScorecardHistoryEntry[], industry, localAiManager);
    }
  } catch (error) {
    console.error('Error in scorecard-ai API route:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function handleReportGeneration(history: ScorecardHistoryEntry[], industry: string, userName: string | undefined, aiManagerInstance: AIProviderManager) {
  try {
    // Calculate the tier based on the weighted scoring logic
    const score = calculateTierScore(history);
    const userAITier = determineTier(score);

    // Define rich persona descriptions and specific instructions based on the calculated tier (Part 2.1 & 2.2)
    let personaDescription = "";
    let personaInstructions = "";
    let keyFindingsInstructions = "";
    let actionPlanInstructions = "";
    let benchmarksInstructions = "";
    let learningPathInstructions = "";

    if (userAITier === 'Dabbler') {
      personaDescription = "a Marketing Manager with basic AI understanding and limited practical application. They are aware of AI but have limited practical application, using basic tools for simple tasks like content ideas or grammar checks. They have no formal AI strategy and focus on immediate, tactical challenges. Their language reflects uncertainty or a basic understanding.";
      personaInstructions = "Tailor the report for a Dabbler Marketing Manager. Use simple language, avoid overly technical jargon, and focus on foundational concepts and quick wins.";
      keyFindingsInstructions = "IMPORTANT: ALWAYS identify at least 3 specific strengths, even for beginners (e.g., 'initiative in exploring AI', 'awareness of potential', 'willingness to learn'). NEVER return 'no strengths identified'. Then highlight fundamental weaknesses. Explain the impact of weaknesses in simple terms.";
      actionPlanInstructions = "Provide foundational, easy-to-implement steps. Focus on getting started with basic tools and understanding core concepts. Include 2-4 concrete sub-steps per recommendation.";
      benchmarksInstructions = "Describe typical Dabbler practices in the ${industry} industry with specific, quantifiable examples. Include illustrative percentage ranges or concrete metrics where appropriate (e.g., '10-15% of ${industry} companies at Dabbler tier typically allocate 1-2% of their IT budget to AI initiatives'). Clearly explain what separates Dabblers from Enablers in the ${industry} sector and outline the specific first steps to move forward. Make every benchmark highly relevant to the ${industry} industry.";
      learningPathInstructions = "Recommend introductory resources and explain their relevance for building basic AI literacy and identifying simple use cases.";
    } else if (userAITier === 'Enabler') {
      personaDescription = "a Marketing Manager who actively uses several AI tools and is trying to integrate AI more strategically. They actively use multiple tools, seeking workflow integration. They are aware of AI's potential for personalization and efficiency. Their language reflects practical application and a desire for optimization.";
      personaInstructions = "Tailor the report for an Enabler Marketing Manager. Use practical, results-oriented language and focus on optimizing existing workflows and exploring integration.";
      keyFindingsInstructions = "Highlight practical strengths and areas for optimization. Explain the impact of weaknesses on efficiency and scalability.";
      actionPlanInstructions = "Provide actionable steps to optimize existing AI use and integrate tools. Focus on campaign optimization, better segmentation, and proving ROI. Include 2-4 concrete sub-steps per recommendation.";
      benchmarksInstructions = "Describe typical Enabler practices in the ${industry} industry with specific, quantifiable examples. Include illustrative percentage ranges or concrete metrics where appropriate (e.g., '${industry} Enablers typically achieve 20-30% faster time-to-market compared to the industry average'). Clearly explain what separates Enablers from Leaders in the ${industry} sector and outline the specific steps needed to reach the next level. Make every benchmark highly relevant to the ${industry} industry.";
      learningPathInstructions = "Recommend resources for intermediate users, focusing on workflow integration, specific tool applications, and measuring ROI.";
    } else { // Leader
      personaDescription = "a Marketing Manager driving AI strategy for a department, overseeing integrated AI solutions for hyper-personalization, predictive analytics, and AI-driven campaign orchestration. They focus on ROI, scalability, and competitive advantage. Their language is strategic, data-driven, and demonstrates a sophisticated understanding.";
      personaInstructions = "Tailor the report for a Leader Marketing Manager. Use strategic, visionary, and data-driven language. Focus on advanced strategies, scaling innovation, and maintaining competitive advantage.";
      keyFindingsInstructions = "Highlight strategic strengths and areas for market disruption or competitive advantage. Explain the impact of weaknesses on innovation and scalability at an enterprise level.";
      actionPlanInstructions = "Provide advanced, strategic steps for scaling AI, driving innovation, and building AI-first teams. Focus on hyper-personalization at scale, predictive analytics, and market disruption. Include 2-4 concrete sub-steps per recommendation.";
      benchmarksInstructions = "Describe cutting-edge Leader practices in the ${industry} industry with specific, quantifiable examples. Include illustrative percentage ranges or concrete metrics where appropriate (e.g., 'Leading ${industry} organizations typically invest 3-4x more in AI initiatives than industry average, resulting in 35-45% higher customer retention rates'). Highlight forward-looking initiatives and strategic approaches that define excellence in the ${industry} sector. Make every benchmark highly relevant to the ${industry} industry.";
      learningPathInstructions = "Recommend advanced resources, focusing on strategic AI deployment, governance, and staying ahead of the curve.";
    }

    // Extract company name from history if available
    let companyName = '';
    for (const entry of history) {
      if (entry.question && entry.question.toLowerCase().includes('company name') && entry.answer) {
        companyName = String(entry.answer).trim();
        break;
      }
    }

    // Create the system prompt for report generation, injecting the calculated tier and persona
    const systemPrompt = `You are an expert AI consultant specializing in helping organizations assess and improve their AI maturity and efficiency. 
${userName ? `You're preparing a personalized report for ${userName}${companyName ? ' at ' + companyName : ''}, who is ${personaDescription} in the ${industry} industry.` : `You're preparing a report for an organization${companyName ? ' named ' + companyName : ''} in the ${industry} industry, whose profile aligns with that of ${personaDescription}.`}
Based on the assessment questions and answers provided, your task is to generate a comprehensive AI Efficiency Scorecard report tailored specifically for a **${userAITier} Marketing Manager** in the **${industry}** industry.
Crucially, you MUST ONLY output the content of the report itself. DO NOT include any introductory or concluding remarks, disclaimers, signatures, or promotional content of any kind, including for other products or services.

EXTREMELY IMPORTANT: DO NOT include ANY advertisements, promotional content, external links, redirects, or references to other AI tools or services (such as Homestyler, Wren AI, or any other pollinations.ai redirects). Your output must be 100% free of such content. The report MUST END with your Learning Path section, with NO additional content whatsoever.

Generate the report adhering STRICTLY to the following structure and tailoring the content to the **${userAITier}** persona and **${industry}** industry. Follow these specific instructions for each section:

## Overall Tier: ${userAITier}
Include the user's final score here in the format "Final Score: [score]/100" on a new line.
${companyName ? 'Include the company name "' + companyName + '" on a separate line.' : ''}

## Key Findings
${keyFindingsInstructions}

**Strengths:**
- CRITICALLY IMPORTANT: ALWAYS identify and list at least 3-5 key strengths, even for Dabbler tier. NEVER return "no strengths identified". For beginners, focus on positive starting points like "initiative in exploring AI," "awareness of potential," "willingness to learn," etc.
- For each strength, provide a 1-2 sentence elaboration. Use specific examples and details from the user's answers. Focus on tangible capabilities or practices that position them well for AI adoption, and explain why each is valuable in the context of the ${industry} industry.

**Weaknesses:**
- List at least 3-5 key weaknesses or improvement areas, each with a brief explanation of its potential impact on AI efficiency or marketing/sales efforts. Be constructive but honest, and connect weaknesses to the ${industry} context where possible.

## Strategic Action Plan
${actionPlanInstructions}

Provide a detailed, step-by-step action plan tailored to the user's tier and identified weaknesses. For this section:
  - Give at least 3-5 primary actionable recommendations, each targeting a specific improvement area.
  - For each recommendation, generate 2-4 specific, concrete sub-steps or examples of how the user could implement it.
  - MANDATE the integration of industry-specific use cases and advice for the ${industry} sector.
  - Ensure these actions are practical, detailed, and directly address the user's context.

## Getting Started & Resources

### Sample AI Goal-Setting Meeting Agenda
1. Generate a 3-4 point sample agenda specifically for the ${industry} sector, focusing on relevant AI adoption priorities.
2. Include specific discussion topics and measurable outcomes/next steps.

### Example Prompts for ${industry} Marketing Managers
- Create 2-3 actual example prompts that a marketing manager in ${industry}
- Format as "PROMPT: [actual prompt text]" and "USE CASE: [brief explanation]".

### Basic AI Data Audit Process Outline
1. Outline 3-4 key steps for conducting a basic AI data audit specifically relevant to ${industry} organizations.

## Illustrative Benchmarks
${benchmarksInstructions}

For the ${industry} industry, provide detailed, industry-specific benchmarks for ALL three tiers. Make sure each benchmark is HIGHLY RELEVANT to the ${industry} sector, with specific examples of tools, practices, or use cases that would be meaningful to organizations in this industry. Each benchmark MUST include at least 2-3 specific percentage ranges, quantifiable metrics, or concrete examples that illustrate performance in the ${industry} sector:

### Dabbler Tier Organizations in ${industry}
- Describe 2-3 concrete, realistic examples of how "Dabbler" tier organizations in ${industry} typically approach AI integration.
- Include specific tools, practices, or initial AI applications common at this tier in ${industry} firms.
- Highlight clear "first steps" or "low-hanging fruit" that ${industry} organizations at this tier typically focus on.
- Provide specific metrics where possible, such as: "Dabbler tier ${industry} firms typically allocate only X-Y% of IT budget to AI initiatives" or "Only Z% of ${industry} Dabblers have formalized AI governance structures"

### Enabler Tier Organizations in ${industry}
- Describe 2-3 concrete examples of how "Enabler" tier organizations in ${industry} deploy more sophisticated AI capabilities.
- Include specific processes, tools, or metrics that differentiate them from Dabblers in the ${industry} sector.
- Focus on organizational structures, data integration practices, or automation that empowers scalable AI use in ${industry}.
- Provide specific metrics where possible, such as: "${industry} Enablers typically see X-Y% improvement in operational efficiency" or "Z% of ${industry} Enablers have integrated AI into core business processes"

### Leader Tier Organizations in ${industry}
- Describe 2-3 distinctive examples of how "Leader" tier organizations in ${industry} leverage advanced AI capabilities.
- Include specific initiatives, technologies, or strategic approaches that define excellence in ${industry}-specific AI adoption.
- Emphasize innovative practices that create significant competitive advantage in ${industry}, with quantifiable results.
- Provide specific metrics where possible, such as: "Leading ${industry} organizations achieve X-Y% higher revenue growth" or "Z% of ${industry} Leaders embed AI in executive decision-making processes"

IMPORTANT: After determining the user's tier, CONTEXTUALIZE these benchmarks by explicitly comparing where the organization currently stands versus the next tier they could aspire to. For example:
- If they're a "Dabbler", highlight what specifically separates them from "Enablers" in ${industry} with concrete metrics.
- If they're an "Enabler", outline what specific steps with quantifiable goals would help them reach "Leader" status in ${industry}.
- If they're already a "Leader", emphasize what they should focus on maintaining/enhancing with specific performance targets to stay at the cutting edge in ${industry}.

## Your Personalized AI Learning Path
${learningPathInstructions}

Based on your scorecard results, select 2-3 of the most relevant resources and provide a HIGHLY PERSONALIZED explanation for each.

FINAL REMINDER: DO NOT add ANY additional content after the Learning Path section. DO NOT include any promotions, advertisements, disclaimers, or external links to services like Homestyler, Wren AI, or other tools. The report MUST END with your Learning Path content.`;

    // Initialize AI provider manager if needed
    await aiManagerInstance.initialize();
    
    // Use the AI provider manager to generate the report
    const userPrompt = `Analyze the following assessment history for the ${industry} industry and generate the comprehensive Markdown report as instructed. IMPORTANT: Do NOT include any advertisements, promotional content, or external links in your response: ${JSON.stringify(history)}`;
    
    let reportMarkdown;
    try {
      reportMarkdown = await aiManagerInstance.generateReport(systemPrompt, userPrompt);
    } catch (error) {
      console.error('All AI providers failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate report: ${errorMessage}`);
    }

    // Clean the report markdown to remove unwanted content
    reportMarkdown = cleanReportMarkdown(reportMarkdown);

    // Extract the AI Tier from the markdown
    const tierMatch = reportMarkdown.match(/## Overall Tier:\s*(.+)/);
    const extractedTier = tierMatch ? tierMatch[1].trim() : 'N/A';
    
    // Extract the final score from the Overall Tier section if it exists
    let finalScore: number | null = score; // Default to calculated score
    const scoreMatch = reportMarkdown.match(/Final Score:\s*(\d+)(?:\/(\d+))?/i);
    if (scoreMatch && scoreMatch[1]) {
      const extractedScore = parseInt(scoreMatch[1], 10);
      if (!isNaN(extractedScore)) {
        finalScore = extractedScore;
      }
    }

    // Final verification to ensure all ads are removed
    if (reportMarkdown.includes('pollinations.ai') || 
        reportMarkdown.includes('homestyler') || 
        reportMarkdown.includes('wren') || 
        reportMarkdown.includes('Learn more') ||
        reportMarkdown.includes('http') ||
        reportMarkdown.includes('Create professional')) {
      console.error('WARNING - Ad content still detected after cleaning. Applying second-pass cleaning.');
      reportMarkdown = cleanReportMarkdown(reportMarkdown, true); // Apply aggressive second-pass cleaning
    }

    return NextResponse.json({
      reportMarkdown,
      userAITier: extractedTier, // Include the extracted tier in the response
      finalScore: finalScore, // Include the final score
      companyName: companyName || null, // Include the company name if found
      systemPromptUsed: systemPrompt, // Include the final system prompt
      status: 'resultsGenerated',
      providerUsed: aiManagerInstance.getReportProviderName() || 'Unknown Report Provider' // Use instance
    }, { status: 200 });
  } catch (error) {
    console.error('Error in report generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to clean unwanted content from the markdown report
function cleanReportMarkdown(markdown: string, aggressive: boolean = false): string {
  // Store the original length for logging purposes
  const originalLength = markdown.length;
  let cleanedMarkdown = markdown;
  
  // Step 1: Remove known ad patterns (expanded to catch variations)
  const adPatterns = [
    // Homestyler ad pattern (original)
    /---\s*\nCreate professional 3D home designs easily with Homestyler's intuitive design platform\.\s*\[Learn more\]\(https:\/\/pollinations\.ai\/redirect\/\d+\)/g,
    
    // Broader Homestyler patterns
    /Create professional 3D home designs.*?Homestyler.*?\[Learn more\].*?\)/g,
    /Homestyler.*?intuitive design platform.*?\[Learn more\].*?\)/g,
    
    // General pollinations.ai redirect patterns
    /\[.*?\]\(https:\/\/pollinations\.ai\/redirect\/\d+\)/g,
    /https:\/\/pollinations\.ai\/redirect\/\d+/g,
    
    // Wren AI patterns
    /Wren AI.*?\[.*?\]\(http.*?\)/g,
    /\[.*?Wren.*?\]\(http.*?\)/g,
    
    // General promotion patterns
    /---\s*\n.*?\[Learn more\]\(http.*?\)/g,
    /\n\n---\s*\n.*?http.*?\n/g,
    /\n---\s*\n.*?\n/g,
    
    // Catch any remaining links to pollinations.ai
    /\(https?:\/\/.*?pollinations\.ai.*?\)/g,
  ];
  
  // Apply each pattern
  adPatterns.forEach(pattern => {
    cleanedMarkdown = cleanedMarkdown.replace(pattern, '');
  });
  
  // Step 2: Additional aggressive cleaning if needed or requested
  if (aggressive || originalLength !== cleanedMarkdown.length) {
    // If any cleaning was done in step 1 or aggressive mode is requested
    
    // Modified: Be more careful with horizontal rules to avoid removing important content
    // Only remove horizontal rules at the very end of the document
    const lastHorizontalRulePos = cleanedMarkdown.lastIndexOf('\n---');
    if (lastHorizontalRulePos > 0 && 
        lastHorizontalRulePos > cleanedMarkdown.length - 100) { // If it's near the end
      // Check if there's any proper section header after it
      const textAfterLastRule = cleanedMarkdown.substring(lastHorizontalRulePos);
      if (!textAfterLastRule.includes('## ')) {
        cleanedMarkdown = cleanedMarkdown.substring(0, lastHorizontalRulePos);
      }
    }
    
    // Remove any lines containing "Learn more" + URL
    cleanedMarkdown = cleanedMarkdown.split('\n')
      .filter(line => !(line.includes('Learn more') && line.includes('http')))
      .join('\n');
    
    // More selective URL filtering - only remove standalone URL lines or obvious ads
    cleanedMarkdown = cleanedMarkdown.split('\n')
      .filter(line => {
        // Keep lines with URLs if they appear to be part of legitimate content
        const isObviousAdOrStandaloneURL = 
          (line.trim().startsWith('http') && line.trim().length < 100) || 
          (line.includes('http') && (line.includes('promotion') || line.includes('discount') || line.includes('special offer')));
        return !isObviousAdOrStandaloneURL;
      })
      .join('\n');
  }
  
  // Step 3: Ensure the report ends with the correct content
  const lastSections = [
    '## Your Personalized AI Learning Path',
    '## Personalized AI Learning Path',
    '## Learning Path',
    '## Resources',
    '## Next Steps',
  ];
  
  let hasProperEnding = false;
  for (const section of lastSections) {
    if (cleanedMarkdown.includes(section)) {
      hasProperEnding = true;
      
      // Find the section's position
      const sectionIndex = cleanedMarkdown.indexOf(section);
      
      // Get content after the last expected section
      const contentAfterLastSection = cleanedMarkdown.substring(sectionIndex);
      
      // If there are more than 1000 characters after the last expected section,
      // it's likely we have the proper content and not an abrupt cut-off
      if (contentAfterLastSection.length < 200) {
        console.warn('WARNING - Learning Path section may be truncated.');
      }
      
      break;
    }
  }
  
  if (!hasProperEnding) {
    console.warn('WARNING - Report does not end with an expected Learning Path section.');
  }
  
  // Step 4: Check for required sections and log warnings if any are missing
  const requiredSections = [
    { name: 'Overall Tier', pattern: /## Overall Tier:/ },
    { name: 'Key Findings', pattern: /## Key Findings/ },
    { name: 'Strengths', pattern: /\*\*Strengths:\*\*/ },
    { name: 'Weaknesses', pattern: /\*\*Weaknesses:\*\*/ },
    { name: 'Strategic Action Plan', pattern: /## Strategic Action Plan/ },
    { name: 'Getting Started & Resources', pattern: /## Getting Started & Resources/ },
    { name: 'Illustrative Benchmarks', pattern: /## Illustrative Benchmarks/ },
    { name: 'Learning Path', pattern: /(## Your Personalized AI Learning Path|## Personalized AI Learning Path|## Learning Path)/ }
  ];
  
  let missingSections = requiredSections.filter(section => 
    !section.pattern.test(cleanedMarkdown)
  );
  
  if (missingSections.length > 0) {
    console.warn(`WARNING - The following required sections are missing: ${missingSections.map(s => s.name).join(', ')}`);
    
    // Additional check for partial/incomplete sections
    requiredSections.forEach(section => {
      if (section.pattern.test(cleanedMarkdown)) {
        const sectionMatch = cleanedMarkdown.match(section.pattern);
        if (sectionMatch && sectionMatch.index !== undefined) {
          const sectionStart = sectionMatch.index;
          // Find the end (next section heading or end of document)
          const nextSectionMatch = cleanedMarkdown.substring(sectionStart + 1).match(/## [A-Za-z]/);
          const sectionEnd = nextSectionMatch ? sectionStart + 1 + nextSectionMatch.index! : cleanedMarkdown.length;
          const sectionContent = cleanedMarkdown.substring(sectionStart, sectionEnd);
          
          // Check if section has sufficient content
          if (sectionContent.length < 100) { // Arbitrary threshold
            console.warn(`WARNING - Section '${section.name}' may be incomplete or have insufficient content`);
          }
        }
      }
    });
  }
  
  // Step 5: Fix common issues with benchmark sections
  if (cleanedMarkdown.includes('## Illustrative Benchmarks')) {
    // Check if all three tier sections exist
    const hasDabblerSection = /### Dabbler Tier/i.test(cleanedMarkdown);
    const hasEnablerSection = /### Enabler Tier/i.test(cleanedMarkdown);
    const hasLeaderSection = /### Leader Tier/i.test(cleanedMarkdown);
    
    // Log warning if any tier section is missing
    if (!hasDabblerSection || !hasEnablerSection || !hasLeaderSection) {
      console.warn(`WARNING - The benchmarks section is missing one or more tier sections: ${!hasDabblerSection ? 'Dabbler' : ''}${!hasEnablerSection ? ' Enabler' : ''}${!hasLeaderSection ? ' Leader' : ''}`);
    }
  }
  
  // Step 6: Fix common issues with resources section
  if (cleanedMarkdown.includes('## Getting Started & Resources')) {
    // Check if all required subsections exist
    const hasMeetingAgenda = /### Sample AI Goal-Setting Meeting Agenda/i.test(cleanedMarkdown);
    const hasExamplePrompts = /### Example Prompts/i.test(cleanedMarkdown);
    const hasDataAudit = /### Basic AI Data Audit/i.test(cleanedMarkdown);
    
    // Log warning if any subsection is missing
    if (!hasMeetingAgenda || !hasExamplePrompts || !hasDataAudit) {
      console.warn(`WARNING - The resources section is missing one or more required subsections: ${!hasMeetingAgenda ? 'Meeting Agenda' : ''}${!hasExamplePrompts ? ' Example Prompts' : ''}${!hasDataAudit ? ' Data Audit Process' : ''}`);
    }
  }
  
  // Step 7: Final cleanup
  // Remove any trailing horizontal rules or dashes
  cleanedMarkdown = cleanedMarkdown.replace(/\n-{3,}\s*$/g, '');
  
  // Trim to remove any leading or trailing whitespace
  cleanedMarkdown = cleanedMarkdown.trim();
  
  return cleanedMarkdown;
}

async function handleAssessmentRequest(currentPhaseName: string, history: ScorecardHistoryEntry[], industry: string, aiManagerInstance: AIProviderManager) {
  try {
    // Check if we've reached MAX_QUESTIONS
    if (history.length >= MAX_QUESTIONS) {
      return NextResponse.json({
        questionText: null,
        answerType: null,
        options: null,
        phase_status: 'complete',
        overall_status: 'completed',
        currentPhaseName
      });
    }

    // If phase is complete, move to next phase
    const currentPhaseIndex = ASSESSMENT_PHASES.indexOf(currentPhaseName);
    if (currentPhaseIndex < 0) {
      // If current phase not found, start with the first phase
      return await handleAssessmentRequest(ASSESSMENT_PHASES[0], history, industry, aiManagerInstance);
    }
    
    // Check if we need to move to the next phase
    const questionsInCurrentPhase = history.filter(entry => entry.phaseName === currentPhaseName).length;
    const questionsPerPhase = Math.ceil(MAX_QUESTIONS / ASSESSMENT_PHASES.length);
    
    if (questionsInCurrentPhase >= questionsPerPhase && currentPhaseIndex < ASSESSMENT_PHASES.length - 1) {
      const nextPhase = ASSESSMENT_PHASES[currentPhaseIndex + 1];
      logger.backend(`Moving to next phase: ${nextPhase}`);
      return await handleAssessmentRequest(nextPhase, history, industry, aiManagerInstance);
    }

    // Create the system prompt for question generation
    let systemPrompt = `Generate a new question for phase "${currentPhaseName}" in the ${industry} industry.
DO NOT repeat any previous questions. Each question must be unique.
EXTREMELY IMPORTANT: You MUST use a BALANCED MIX of question types, including ALL of the following types:
For the current phase, select the most appropriate question type from:
- "radio" for single-choice questions with 4-5 options (use for questions about frequency, level of adoption, primary approaches)
- "checkbox" for multiple-choice questions with 4-6 options (use for questions about tools used, areas implemented, challenges faced)
- "scale" for 1-5 rating questions (use for questions about effectiveness, satisfaction, maturity levels) - DO NOT provide options for scale questions, they will be auto-generated as 1-5
- "text" for open-ended responses that require detailed explanations, qualitative feedback, or complex answers

CRITICAL: Approximately 20-25% of all questions should be "text" type questions to allow users to provide detailed, qualitative answers.
Some questions are naturally better suited for text responses, such as describing strategies, explaining challenges, or sharing specific experiences.

IMPORTANT: For answerType field, ONLY use one of these exact values: "text", "radio", "checkbox", or "scale". Do not use variations like "single-choice" or "multiple-choice".
For scale questions, set options to null - the scale will be automatically generated as 1-5.
Return JSON: {
  "questionText": string,
  "answerType": "text" | "radio" | "checkbox" | "scale",
  "options": string[] | null,
  "phase_status": "asking" | "complete",
  "overall_status": "asking" | "completed",
  "reasoning_text": string
}`;

    // Special handling for Property/Real Estate industry to ensure B2B focus
    if (industry === "Property/Real Estate") {
      systemPrompt = `Generate a new question for phase "${currentPhaseName}" in the ${industry} industry.
VERY IMPORTANT: Questions MUST be B2B (business-to-business) focused, addressing the user's BUSINESS OPERATIONS and AI use within their real estate company/agency.
DO NOT create consumer-focused questions that reference "your real estate portfolio" or imply the user is a property owner/investor.
Instead, frame questions about how the real estate BUSINESS is implementing AI across areas like:
- Property management operations
- Agent productivity and training
- Marketing and lead generation for the agency
- Business analytics and market research
- Back-office automation and efficiency
- Client relationship management
For example, use phrases like "your real estate agency", "your brokerage", "your property management firm", etc.

EXTREMELY IMPORTANT: You MUST use a BALANCED MIX of question types, including ALL of the following types:
For the current phase, select the most appropriate question type from:
- "radio" for single-choice questions with 4-5 options (use for questions about frequency, level of adoption, primary approaches)
- "checkbox" for multiple-choice questions with 4-6 options (use for questions about tools used, areas implemented, challenges faced)
- "scale" for 1-5 rating questions (use for questions about effectiveness, satisfaction, maturity levels) - DO NOT provide options for scale questions, they will be auto-generated as 1-5
- "text" for open-ended responses that require detailed explanations, qualitative feedback, or complex answers

CRITICAL: Approximately 20-25% of all questions should be "text" type questions to allow users to provide detailed, qualitative answers.
Some questions are naturally better suited for text responses, such as describing strategies, explaining challenges, or sharing specific experiences.

DO NOT repeat any previous questions. Each question must be unique.
IMPORTANT: For answerType field, ONLY use one of these exact values: "text", "radio", "checkbox", or "scale". Do not use variations like "single-choice" or "multiple-choice".
For scale questions, set options to null - the scale will be automatically generated as 1-5.
Return JSON: {
  "questionText": string,
  "answerType": "text" | "radio" | "checkbox" | "scale",
  "options": string[] | null,
  "phase_status": "asking" | "complete",
  "overall_status": "asking" | "completed",
  "reasoning_text": string
}`;
    }

    const userPrompt = `Based on history: ${JSON.stringify(history)}, generate next question.`;
    
    // Initialize AI provider manager if needed
    await aiManagerInstance.initialize();
    
    // Use the AI provider manager to generate the next question
    // Updated logging to reflect using the AI Provider Manager with OpenAI enforced
    logger.backend('AI Manager: Requesting next question (OpenAI enforced) - CODE VERSION 2025-05-30-22:13 - VALIDATION REMOVED');
    let parsedResponse;
    try {
      // Use the AI provider manager to generate the next question
      parsedResponse = await aiManagerInstance.generateNextQuestion(systemPrompt, userPrompt);
      logger.backend('AI Manager: Successfully received question from AI Provider Manager - CODE VERSION 2025-05-30-22:13');
      logger.backend(`AI Manager: Raw response from AI Provider: ${JSON.stringify(parsedResponse, null, 2)}`);
    } catch (error) {
      logger.backend(`All AI providers failed to generate a question: ${error}`);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate question: ${errorMessage}`);
    }

    // MINIMAL VALIDATION - Only check if we have a response
    if (!parsedResponse) {
      logger.error('AI Manager: No response received from AI Provider Manager');
      throw new Error('No response received from AI provider.');
    }

    // Enhanced debugging for response structure
    logger.backend(`AI Manager: Response type: ${typeof parsedResponse}`);
    logger.backend(`AI Manager: Response keys: ${Object.keys(parsedResponse || {}).join(', ')}`);
    logger.backend(`AI Manager: questionText exists: ${parsedResponse.questionText !== undefined}`);
    logger.backend(`AI Manager: questionText type: ${typeof parsedResponse.questionText}`);
    logger.backend(`AI Manager: answerType exists: ${parsedResponse.answerType !== undefined}`);
    logger.backend(`AI Manager: answerType type: ${typeof parsedResponse.answerType}`);

    // Basic validation to ensure required fields exist
    if (!parsedResponse.questionText || typeof parsedResponse.questionText !== 'string') {
      logger.error(`AI Manager: Invalid questionText - value: ${parsedResponse.questionText}, type: ${typeof parsedResponse.questionText}`);
      throw new Error(`Invalid response structure from AI provider for question: questionText is missing or not a string`);
    }

    if (!parsedResponse.answerType || typeof parsedResponse.answerType !== 'string') {
      logger.error(`AI Manager: Invalid answerType - value: ${parsedResponse.answerType}, type: ${typeof parsedResponse.answerType}`);
      throw new Error(`Invalid response structure from AI provider for question: answerType is missing or not a string`);
    }

    // Log the response structure for debugging
    logger.backend(`AI Manager: Response structure - questionText: ${typeof parsedResponse.questionText}, answerType: ${typeof parsedResponse.answerType}`);
    
    // Fix scale questions - ensure they always have proper options
    let finalOptions = parsedResponse.options;
    if (parsedResponse.answerType === 'scale') {
      // For scale questions, always provide 1-5 options regardless of what AI returns
      finalOptions = ['1', '2', '3', '4', '5'];
      logger.backend('AI Manager: Fixed scale question options to [1, 2, 3, 4, 5]');
    }

    // Check for repeated questions
    if (history.some(qa => qa.question === parsedResponse.questionText)) {
      logger.backend(`AI generated a repeated question. Attempting to modify it.`);
      
      // Try to modify the question slightly to avoid repetition
      parsedResponse.questionText = `${parsedResponse.questionText} (Please provide additional details if previously answered)`;
      
      // If still repeated after 3 attempts, move to the next phase or complete
      if (history.filter(qa => qa.question.includes(parsedResponse.questionText.substring(0, 50))).length > 2) {
        // Move to next phase if available
        if (currentPhaseIndex < ASSESSMENT_PHASES.length - 1) {
          const nextPhase = ASSESSMENT_PHASES[currentPhaseIndex + 1];
          logger.backend(`Moving to next phase due to repeated questions: ${nextPhase}`);
          return await handleAssessmentRequest(nextPhase, history, industry, aiManagerInstance);
        } else {
          // If no more phases, consider assessment complete
          logger.backend(`AI generated repeated questions in the last phase. Marking assessment as completed.`);
          return NextResponse.json({
            questionText: null,
            completed: true,
            phase: currentPhaseName,
            message: 'Assessment completed! You can now generate your personalized report.'
          });
        }
      }
    }

    return NextResponse.json({
      questionText: parsedResponse.questionText,
      answerType: parsedResponse.answerType,
      options: finalOptions,
      phase: currentPhaseName,
      completed: false,
      questionNumber: history.length + 1,
      totalQuestions: MAX_QUESTIONS,
      // Map the AI response fields to the expected format
      phase_status: parsedResponse.phase_status || 'asking',
      overall_status: parsedResponse.overall_status || 'asking',
      reasoning_text: parsedResponse.reasoning_text
    });

  } catch (error: any) {
    logger.backend(`Error in handleAssessmentRequest: ${error}`);
    return NextResponse.json(
      { error: 'Failed to generate question', message: `An error occurred while generating the next question: ${error.message}. Please try restarting the assessment.` },
      { status: 500 }
    );
  }
}
