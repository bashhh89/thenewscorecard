/**
 * HTML Generator for AI Efficiency Scorecard (V6) - FIXED VERSION
 * This utility generates a complete HTML document based on the ScoreCardData structure
 */

import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

interface AnswerHistoryEntry {
  question: string;
  answer: string;
  phaseName?: string;
  reasoningText?: string;
  answerType?: string;
  options?: string[] | null;
  index?: number;
  answerSource?: string;
}

interface ScoreCardData {
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
  QuestionAnswerHistory: AnswerHistoryEntry[];
  FullReportMarkdown: string;
  section1_items?: Array<{ title: string; description: string }>;
  section3_items?: Array<{ number: number; title: string; description: string }>;
  benchmarks?: Array<{ metric: string; value: string }>;
  resources?: Array<{ title: string; url: string }>;
}

/**
 * Enhanced Markdown to HTML converter
 */
function parseMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  console.log('PARSE_MARKDOWN: Processing markdown of length:', markdown.length);

  // Convert headers with optional colons
  let html = markdown
    .replace(/^##\s+(.*?):?\s*$/gm, '<h2 class="section-header">$1</h2>')
    .replace(/^###\s+(.*?):?\s*$/gm, '<h3 class="sub-section">$1</h3>')
    // Convert bullet lists with proper indentation
    .replace(/^-\s+(.*)/gm, '<li>$1</li>')
    // Preserve code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Convert links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>')
    // Wrap contiguous list items in UL tags
    .replace(/(<li>.*<\/li>)(\s*<li>.*<\/li>)+/gs, '<ul>$&</ul>')
    // Convert paragraphs
    .replace(/(^|\n\n)([^\n]+)(\n\n|$)/g, '<p>$2</p>')
    // Add horizontal rules between sections
    .replace(/\n---\n/g, '<hr class="section-divider">');

  // Ensure proper list wrapping
  html = html.replace(/<li>/g, '\n<ul>\n<li>')
             .replace(/<\/li>/g, '</li>\n</ul>\n');

  // Bold text (two patterns)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic text (two patterns)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Process lists
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listType = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check for list items
    const isUnorderedListItem = /^[\s]*[-*+]\s/.test(line);
    const isOrderedListItem = /^[\s]*\d+\.\s/.test(line);
    
    if (isUnorderedListItem || isOrderedListItem) {
      const newListType = isUnorderedListItem ? 'ul' : 'ol';
      
      if (!inList || listType !== newListType) {
        if (inList) {
          processedLines.push(`</${listType}>`);
        }
        processedLines.push(`<${newListType}>`);
        inList = true;
        listType = newListType;
      }
      
      const content = isUnorderedListItem 
        ? line.replace(/^[\s]*[-*+]\s/, '') 
        : line.replace(/^[\s]*\d+\.\s/, '');
      
      processedLines.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        processedLines.push(`</${listType}>`);
        inList = false;
      }
      
      if (trimmedLine) {
        processedLines.push(line);
      } else {
        processedLines.push('');
      }
    }
  }
  
  if (inList) {
    processedLines.push(`</${listType}>`);
  }

  html = processedLines.join('\n');

  // Convert paragraphs
  const paragraphs = html.split(/\n\s*\n/);
  const formattedParagraphs = paragraphs.map(paragraph => {
    paragraph = paragraph.trim();
    if (!paragraph) return '';
    
    // Skip wrapping if already a HTML block element
    if (paragraph.startsWith('<h') || 
        paragraph.startsWith('<p') || 
        paragraph.startsWith('<ul') || 
        paragraph.startsWith('<ol') || 
        paragraph.startsWith('<pre') || 
        paragraph.startsWith('<div')) {
      return paragraph;
    }
    
    return `<p>${paragraph}</p>`;
  });

  html = formattedParagraphs.join('\n\n');

  return html.trim();
}

/**
 * Groups questions by their phase name
 */
function groupQuestionsByPhase(questionAnswerHistory: AnswerHistoryEntry[]): Array<{phaseName: string, questions: AnswerHistoryEntry[]}> {
  if (!questionAnswerHistory || !Array.isArray(questionAnswerHistory)) {
    console.warn('No question answer history provided or empty array');
    return [];
  }
  
  console.log(`Grouping ${questionAnswerHistory.length} Q&A items by phase`);
  
  const groupedMap: Record<string, AnswerHistoryEntry[]> = {};
  
  questionAnswerHistory.forEach((item, idx) => {
    if (!item) {
      console.warn(`Skipping null or undefined item at index ${idx}`);
      return;
    }
    
    const phase = item.phaseName || 'General Assessment';
    if (!groupedMap[phase]) {
      groupedMap[phase] = [];
    }
    groupedMap[phase].push(item);
  });
  
  // Convert to array format
  const groupedPhases = Object.entries(groupedMap).map(([phaseName, questions]) => ({
    phaseName,
    questions
  }));
  
  console.log(`Grouped into ${groupedPhases.length} phases`);
  return groupedPhases;
}

/**
 * Formats the answer based on its type
 */
function formatAnswer(item: AnswerHistoryEntry): string {
  if (!item || !item.answer) {
    return 'No answer provided';
  }

  if (item.answerType === 'scale' && item.options && Array.isArray(item.options)) {
    const index = parseInt(item.answer);
    if (!isNaN(index) && index >= 0 && index < item.options.length) {
      return `${escapeHtml(item.answer)}: ${escapeHtml(item.options[index])}`;
    }
    return `Level ${escapeHtml(item.answer)}`;
  } else if (item.answerType === 'text' || item.answerType === 'textarea') {
    return item.answer.split('\n')
      .map(line => escapeHtml(line))
      .join('<br>');
  } else if (item.answerType === 'checkbox' || item.answerType === 'multiselect') {
    const selections = item.answer.split('|').map(s => s.trim()).filter(Boolean);
    if (selections.length > 0) {
      return selections.map(s => escapeHtml(s)).join(', ');
    }
  }
  
  return escapeHtml(item.answer);
}

/**
 * Helper function to escape HTML special characters
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Main function to generate HTML from ScoreCardData
 */
async function generateScorecardHTML(reportData: ScoreCardData): Promise<string> {
  try {
    console.log('Starting HTML generation for scorecard report');
    
    // Extract relevant data
    const {
      UserInformation: { UserName, CompanyName, Email, Industry },
      ScoreInformation: { AITier, FinalScore, ReportID },
      QuestionAnswerHistory,
      FullReportMarkdown
    } = reportData;

    console.log('Report data extracted:', {
      userName: UserName,
      companyName: CompanyName,
      aiTier: AITier,
      finalScore: FinalScore,
      markdownLength: FullReportMarkdown?.length || 0,
      qaCount: QuestionAnswerHistory?.length || 0
    });

    // Group questions by phase
    const groupedQuestions = groupQuestionsByPhase(QuestionAnswerHistory);

    // Generate formatted date
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Process the full markdown content, but remove any score lines
    let filteredMarkdown = FullReportMarkdown || '';
    filteredMarkdown = filteredMarkdown
      .split('\n')
      .filter(line => !/^\s*Final Score:/i.test(line.trim()))
      .join('\n');
    const fullReportContent = parseMarkdown(filteredMarkdown);
    console.log('Processed markdown content length:', fullReportContent.length);

    // Generate Q&A history section HTML if there are questions
    let qaHistorySection = '';
    if (groupedQuestions.length > 0) {
      qaHistorySection = `
      <div class="page-break"></div>
      <section class="qa-section">
        <div class="section-header">
          <div class="section-icon"></div>
          <h2 class="section-title">Question & Answer History</h2>
        </div>
        ${groupedQuestions.map(group => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${escapeHtml(group.phaseName || 'Assessment Questions')}</h3>
            </div>
            <div class="card-body">
              ${group.questions.map(item => `
                <div class="qa-item">
                  <div class="qa-question"><strong>Q:</strong> ${escapeHtml(item.question)}</div>
                  <div class="qa-answer"><strong>A:</strong> ${formatAnswer(item)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </section>
    `;
    }

    // Create the complete HTML document
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Efficiency Scorecard - ${escapeHtml(UserName)} at ${escapeHtml(CompanyName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    @page {
      size: A4;
      margin: 1.5cm 2cm;
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Inter', sans-serif;
        font-size: 10pt;
        color: #6b7280;
        margin-top: 1cm;
      }
      @bottom-right {
        content: "© 2024 AI Efficiency Report";
        font-family: 'Inter', sans-serif;
        font-size: 9pt;
        color: #9ca3af;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.5;
      color: #1f2937;
      background: #ffffff;
      font-size: 11pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Professional Color Palette */
    :root {
      --primary: #1e40af;
      --primary-light: #3b82f6;
      --secondary: #0f172a;
      --accent: #06b6d4;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --gray-900: #111827;
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
    }

    /* Modern Header Design */
    .header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
      color: white;
      padding: 2rem 2.5rem;
      margin: -1.5cm -2cm 2rem -2cm;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: translate(50%, -50%);
    }

    .header-content {
      position: relative;
      z-index: 2;
    }

    .logo-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .logo-placeholder {
      background: rgba(255, 255, 255, 0.2);
      border: 2px dashed rgba(255, 255, 255, 0.4);
      border-radius: 8px;
      padding: 1rem 1.5rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 10pt;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .report-date {
      color: rgba(255, 255, 255, 0.8);
      font-size: 11pt;
      font-weight: 400;
    }

    .report-title {
      font-size: 36pt;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.5pt;
    }

    .report-subtitle {
      font-size: 16pt;
      font-weight: 400;
      opacity: 0.9;
    }

    /* Modern Card System */
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--gray-200);
      margin-bottom: 1.5rem;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .card-header {
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      padding: 1.25rem 1.5rem;
    }

    .card-title {
      font-size: 16pt;
      font-weight: 600;
      color: var(--secondary);
      margin: 0;
    }

    .card-body {
      padding: 1.5rem;
    }

    /* Grid System */
    .grid {
      display: grid;
      gap: 1.5rem;
    }

    .grid-2 {
      grid-template-columns: 1fr 1fr;
    }

    /* Info Rows */
    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--gray-100);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 500;
      color: var(--gray-600);
      min-width: 120px;
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-weight: 600;
      color: var(--gray-800);
      font-size: 12pt;
    }

    /* Maturity Tier Highlight */
    .maturity-showcase {
      background: linear-gradient(135deg, var(--accent) 0%, var(--primary-light) 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .maturity-showcase::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .maturity-label {
      font-size: 12pt;
      font-weight: 500;
      opacity: 0.9;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .maturity-value {
      font-size: 32pt;
      font-weight: 700;
      margin-bottom: 0.5rem;
      position: relative;
      z-index: 2;
    }

    .maturity-score {
      font-size: 14pt;
      font-weight: 500;
      opacity: 0.9;
      position: relative;
      z-index: 2;
    }

    /* Section Headers */
    .section {
      margin: 2rem 0;
      page-break-inside: avoid;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 3px solid var(--primary);
    }

    .section-title {
      font-size: 22pt;
      font-weight: 700;
      color: var(--secondary);
      margin: 0;
    }

    .section-icon {
      width: 24px;
      height: 24px;
      background: var(--primary);
      border-radius: 6px;
      margin-right: 1rem;
    }

    /* Q&A Section */
    .qa-section {
      margin-top: 2rem;
      page-break-before: always;
    }

    .qa-item {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      margin-bottom: 1rem;
      padding: 1rem;
    }

    .qa-question {
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 0.5rem;
    }

    .qa-answer {
      color: var(--gray-700);
      line-height: 1.6;
    }

    /* Page Breaks */
    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    /* Full Report Section */
    .full-report-section {
      margin: 2rem 0;
    }

    .full-report-section h1,
    .full-report-section h2 {
      font-size: 18pt;
      color: var(--primary);
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--primary);
    }

    .full-report-section h3 {
      font-size: 16pt;
      color: var(--secondary);
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .full-report-section h4 {
      font-size: 14pt;
      color: var(--gray-800);
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    .full-report-section ul {
      list-style-type: disc;
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .full-report-section li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    .full-report-section p {
      margin-bottom: 1rem;
      line-height: 1.6;
      color: var(--gray-700);
    }

    .full-report-section strong {
      color: var(--gray-800);
      font-weight: 600;
    }
</head>
<body>
  <div class="container">
    <!-- Professional Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo-area">
          <div class="report-date">${formattedDate}</div>
        </div>
        <h1 class="report-title">AI Efficiency Scorecard</h1>
        <p class="report-subtitle">Comprehensive Assessment Report for ${escapeHtml(UserName)} at ${escapeHtml(CompanyName)}</p>
      </div>
    </header>

    <!-- Executive Summary Card -->
    <div class="card avoid-break">
      <div class="card-header">
        <h2 class="card-title">Executive Summary</h2>
      </div>
      <div class="card-body">
        <div class="grid grid-2">
          <div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Client Name</span>
                <span class="info-value">${escapeHtml(UserName)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Company</span>
                <span class="info-value">${escapeHtml(CompanyName)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">${escapeHtml(Email)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Industry</span>
                <span class="info-value">${escapeHtml(Industry)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Report ID</span>
                <span class="info-value">${escapeHtml(ReportID)}</span>
              </div>
            </div>
          </div>
          <div>
            <div class="maturity-showcase">
              <div class="maturity-label">AI Maturity Level</div>
              <div class="maturity-value">${escapeHtml(AITier)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Full Report Content -->
    <div class="page-break"></div>
    <section class="section">
      <div class="section-header">
        <div class="section-icon"></div>
        <h2 class="section-title">Complete Assessment Report</h2>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="full-report-section">
            ${fullReportContent}
          </div>
        </div>
      </div>
    </section>

    <!-- Question & Answer History -->
    ${qaHistorySection}
  </div>
</body>
</html>`;

    console.log('HTML generation completed successfully');
    return html;

  } catch (error) {
    console.error('Error generating scorecard HTML:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return `<html><body><h1>Error Generating Report</h1><p>${errorMessage}</p></body></html>`;
  }
}

// Export the main function for use in other modules
export { generateScorecardHTML };
