/**
 * Replaces placeholders in the template with actual data
 */

interface TemplateData {
  UserInformation: {
    Industry: string;
    UserName: string;
    CompanyName: string;
    Email: string;
  };
  ScoreInformation: {
    AITier: string;
    FinalScore: number | null;
    ReportID: string;
  };
  ReportDate: string;
  CurrentYear: number;
  introText: string;
  sections: Record<string, string>;
  dynamicSections: Array<{ title: string; content: string }>;
  QuestionAnswerHistory: Array<{
    question: string;
    answer: string;
    phaseName?: string;
    reasoningText?: string;
    answerType?: string;
    options?: string[] | null;
    index?: number;
    answerSource?: string;
  }>;
}

/**
 * Replaces placeholders in the HTML template with actual content
 */
export function replacePlaceholders(template: string, data: TemplateData): string {
  console.log('REPLACE_PLACEHOLDERS: Starting placeholder replacement');
  
  let html = template;
  
  // Get the user name with proper fallback
  const userName = data.UserInformation?.UserName || 'Not Provided';
  console.log('REPLACE_PLACEHOLDERS: Using userName:', userName);

  // Basic user information - ensure UserName is replaced everywhere
  html = html.replace(/{{UserInformation.UserName}}/g, userName);
  
  // Replace the generic "User" placeholder with the actual user's name
  // This handles cases where "User" appears in assessment results text
  if (userName !== 'Not Provided') {
    // Using word boundary to replace only standalone "User" instances
    const userRegex = new RegExp('\\bUser\\b', 'g');
    html = html.replace(userRegex, userName);
    
    // Also replace "User's" with "[Name]'s"
    html = html.replace(/\bUser's\b/g, `${userName}'s`);
  }
  
  // Special handling for CompanyName - make sure it's clearly visible in multiple places
  const companyName = data.UserInformation?.CompanyName || 'Company Not Provided';
  html = html.replace(/{{UserInformation.CompanyName}}/g, companyName);
  html = html.replace(/\[Client Company Name\]/g, companyName);
  
  html = html.replace(/{{UserInformation.Industry}}/g, data.UserInformation?.Industry || 'Industry Not Specified');
  html = html.replace(/{{UserInformation.Email}}/g, data.UserInformation?.Email || '');
  
  // Score information - special handling for FinalScore to ensure it's displayed
  html = html.replace(/{{ScoreInformation.AITier}}/g, data.ScoreInformation?.AITier || 'Not Available');
  
  // Format the score for display if available
  const finalScore = data.ScoreInformation?.FinalScore !== null && data.ScoreInformation?.FinalScore !== undefined
    ? `${data.ScoreInformation.FinalScore}/100`
    : 'Score Not Available';
  html = html.replace(/{{ScoreInformation.FinalScore}}/g, finalScore);
  
  html = html.replace(/{{ScoreInformation.ReportID}}/g, data.ScoreInformation?.ReportID || 'Report ID Not Available');
  
  // Date and metadata
  html = html.replace(/{{ReportDate}}/g, data.ReportDate || new Date().toLocaleDateString());
  html = html.replace(/{{CurrentYear}}/g, String(data.CurrentYear || new Date().getFullYear()));
  
  // Enhanced formatting for the assessment results section
  if (data.introText) {
    // Add proper paragraph structure and emphasis to key points in the assessment results
    let enhancedIntroText = data.introText;
    
    // Replace "User" placeholders with actual user name throughout the intro text
    if (userName !== 'Not Provided') {
      // Replace standalone "User" with the actual user name
      enhancedIntroText = enhancedIntroText.replace(/\bUser\b/g, userName);
      enhancedIntroText = enhancedIntroText.replace(/\bUser's\b/g, `${userName}'s`);
      
      // Also handle variations in assessment results text
      enhancedIntroText = enhancedIntroText.replace(
        /Based on (your|the user's|user) assessment results/gi, 
        `Based on <strong>${userName}'s</strong> assessment results`
      );
    }
    
    // Enhance AI Tier formatting - make it bold when mentioned
    const aiTier = data.ScoreInformation?.AITier;
    if (aiTier && aiTier !== 'Not Available') {
      // Bold the AI tier name when it appears in the text
      const tierRegex = new RegExp(`\\b${aiTier}\\b`, 'gi');
      enhancedIntroText = enhancedIntroText.replace(tierRegex, `<strong>${aiTier}</strong>`);
      
      // Also handle "tier" mentions
      enhancedIntroText = enhancedIntroText.replace(
        new RegExp(`\\b${aiTier}\\s+tier\\b`, 'gi'),
        `<strong>${aiTier} Tier</strong>`
      );
    }
    
    // Add paragraph breaks for better readability - improved logic
    enhancedIntroText = enhancedIntroText.replace(
      /(\.)(\s+)([A-Z][^.]*(?:tier|score|assessment|result|recommendation))/gi, 
      '$1</p><p>$3'
    );
    
    // Ensure proper paragraph wrapping
    if (!enhancedIntroText.startsWith('<p>')) {
      enhancedIntroText = '<p>' + enhancedIntroText;
    }
    if (!enhancedIntroText.endsWith('</p>')) {
      enhancedIntroText = enhancedIntroText + '</p>';
    }
    
    // Apply the enhanced intro text
    data.introText = enhancedIntroText;
  }
  
  // Report content sections
  html = html.replace(/{{introText}}/g, data.introText || '');
  html = html.replace(/{{sections.overallTier}}/g, data.sections?.overallTier || '');
  html = html.replace(/{{sections.strengths}}/g, data.sections?.strengths || '');
  html = html.replace(/{{sections.weaknesses}}/g, data.sections?.weaknesses || '');
  html = html.replace(/{{sections.strategicPlan}}/g, data.sections?.strategicPlan || '');
  html = html.replace(/{{sections.resources}}/g, data.sections?.resources || '');
  html = html.replace(/{{sections.benchmarks}}/g, data.sections?.benchmarks || '');
  html = html.replace(/{{sections.learningPath}}/g, data.sections?.learningPath || '');
  
  // Handle dynamic sections if any
  let dynamicSectionsHtml = '';
  if (data.dynamicSections && data.dynamicSections.length > 0) {
    dynamicSectionsHtml = data.dynamicSections.map(section => {
      // Replace User with actual name in dynamic section content
      let sectionContent = section.content;
      if (userName !== 'Not Provided') {
        sectionContent = sectionContent.replace(/\bUser\b/g, userName);
        sectionContent = sectionContent.replace(/\bUser's\b/g, `${userName}'s`);
      }
      
      return `
      <div class="section-wrapper">
        <div class="section-asymmetric">
          <div class="section-sidebar">
            <h2>${section.title}</h2>
          </div>
          <div class="section-content">
            <div class="card">
              ${sectionContent}
            </div>
          </div>
        </div>
      </div>
    `}).join('');
  }
  html = html.replace(/{{#each dynamicSections}}[\s\S]*?{{\/each}}/g, dynamicSectionsHtml);
  
  // Group questions by phase for Q&A section
  const phaseMap: Record<string, Array<{ question: string; answer: string; reasoning?: string; }>> = {};
  
  // Process question history
  if (data.QuestionAnswerHistory && data.QuestionAnswerHistory.length > 0) {
    data.QuestionAnswerHistory.forEach(qa => {
      const phaseName = qa.phaseName || 'General';
      if (!phaseMap[phaseName]) {
        phaseMap[phaseName] = [];
      }
      
      // Format answer based on type if possible
      let formattedAnswer = qa.answer;
      if (qa.answerType === 'checkbox' && typeof qa.answer === 'string') {
        // For checkbox, try to display as bullet list if it contains separators
        const items = qa.answer.split(/[|,;]/g).filter(Boolean);
        if (items.length > 1) {
          formattedAnswer = items.map(item => `• ${item.trim()}`).join('<br>');
        }
      }
      
      phaseMap[phaseName].push({
        question: qa.question,
        answer: formattedAnswer,
        reasoning: qa.reasoningText
      });
    });
  }
  
  // Generate HTML for Q&A sections
  let qaHtml = '';
  Object.keys(phaseMap).forEach(phase => {
    qaHtml += `
      <div class="qa-section">
        <h3 class="qa-phase-title">${phase}</h3>
        <div class="qa-items">
    `;
    
    phaseMap[phase].forEach(item => {
      // Replace User with actual name in questions and answers
      let question = item.question;
      let answer = item.answer;
      let reasoning = item.reasoning || '';
      
      if (userName !== 'Not Provided') {
        question = question.replace(/\bUser\b/g, userName);
        question = question.replace(/\bUser's\b/g, `${userName}'s`);
        answer = answer.replace(/\bUser\b/g, userName);
        answer = answer.replace(/\bUser's\b/g, `${userName}'s`);
        reasoning = reasoning.replace(/\bUser\b/g, userName);
        reasoning = reasoning.replace(/\bUser's\b/g, `${userName}'s`);
      }
      
      qaHtml += `
        <div class="qa-item">
          <div class="qa-question">${question}</div>
          <div class="qa-answer">${answer}</div>
          ${reasoning ? `<div class="qa-reasoning"><strong>Analysis:</strong> ${reasoning}</div>` : ''}
        </div>
      `;
    });
    
    qaHtml += `
        </div>
      </div>
    `;
  });
  
  // Replace Q&A placeholder
  html = html.replace(/{{qaContent}}/g, qaHtml || '<p>No assessment responses available.</p>');
  
  // Additional check to replace any remaining generic "User" placeholders in the entire HTML
  if (userName !== 'Not Provided') {
    // This is a safety measure to catch any remaining instances
    html = html.replace(/\bUser\b/g, userName);
    html = html.replace(/\bUser's\b/g, `${userName}'s`);
  }
  
  // Check for any remaining unprocessed placeholders and log warnings
  const remainingPlaceholders = html.match(/{{[^}]+}}/g);
  if (remainingPlaceholders && remainingPlaceholders.length > 0) {
    console.warn('REPLACE_PLACEHOLDERS: Unprocessed placeholders remain:', remainingPlaceholders);
  }
  
  console.log('REPLACE_PLACEHOLDERS: Placeholder replacement completed');
  return html;
}
