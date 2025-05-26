interface ReportData {
  UserInformation: {
    UserName: string;
    CompanyName: string;
    Email: string;
    Industry: string;
  };
  ScoreInformation: {
    AITier: string;
    FinalScore: number | null;
    ReportID: string;
  };
  FullReportMarkdown: string;
  questionAnswerHistory?: any[];
  [key: string]: any;
}

function parseMarkdown(markdown: string): string {
  if (!markdown) return '';
  let html = markdown.trim();

  // Remove the specific lines containing "## Overall Tier:" and "Final Score:"
  // Using more general regex to remove these lines regardless of their position or surrounding content
  // Removing these lines before splitting the markdown into sections
  html = html.replace(/^##\s*Overall Tier:.*$/im, '');
  html = html.replace(/^Final Score:\s*\d+\/\d+.*$/im, '');

  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
    codeBlocks.push(code.trim());
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  const sections = html.split(/(?=^##\s)/m);
  let processedHtml = '';

  sections.forEach(section => {
    if (section.trim() === '') return;
    let sectionContent = section;
    let sectionTitle = '';
    let specialSectionClass = '';

    // Extract section title and check if it's the "Overall Tier" section
    const titleMatch = sectionContent.match(/^## (.*?)\n?/);
    if (titleMatch && titleMatch[1]) {
      sectionTitle = titleMatch[1].trim();
      // The lines for Overall Tier and Final Score are now removed by the regex above,
      // so we don't need to explicitly skip this section based on title anymore.
      // Remove the header from the content for other sections
      sectionContent = sectionContent.replace(/^## (.*?)\n?/, '');

      if (sectionTitle.toLowerCase().includes('strengths')) specialSectionClass = 'strengths-card-accent';
      else if (sectionTitle.toLowerCase().includes('weaknesses') || sectionTitle.toLowerCase().includes('areas for improvement')) specialSectionClass = 'weaknesses-card-accent';
      else if (sectionTitle.toLowerCase().includes('recommendations') || sectionTitle.toLowerCase().includes('action')) specialSectionClass = 'recommendations-card-accent';
    } else {
      // If no ## header, treat the whole section as content without a specific title/class
      sectionTitle = 'Content'; // Or some default
    }
    
    sectionContent = sectionContent.trim();

    sectionContent = sectionContent
      .replace(/^##### (.*?)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
      .replace(/^### (.*?)$/gm, '<h3 class="sub-section">$1</h3>')
      .replace(/^# (.*?)$/gm, '<h1 class="body-h1">$1</h1>');

    sectionContent = sectionContent
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/___(.*?)___/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>');

    sectionContent = sectionContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    let listBuffer = '';
    const paragraphs = sectionContent.split(/\n\s*\n/);
    let finalParagraphs: string[] = [];

    paragraphs.forEach(paragraph => {
        let currentBlock = paragraph.trim();
        // Process lists first
        currentBlock = currentBlock.replace(/^\s*(\d+\.|\*|-)\s+([\s\S]*)/gm, (match) => {
            listBuffer += match + '\n';
            return ''; // Remove list items from paragraph flow for now
        });

        if (listBuffer) {
            // Process collected list items
            listBuffer = listBuffer.replace(/^\s*(\d+\.)\s+([\s\S]*?)(?=\n\s*\d+\.|\n\s*[\*\-]|\n*$)/gm, 
                (m, n, c) => `<li>${c.trim().replace(/\n/g, '<br>')}</li>`);
            listBuffer = listBuffer.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/gs, (m) => {
                return listBuffer.match(/^\s*<li>\d+\./) ? `<ol>${m}</ol>` : `<ul>${m}</ul>`;
            });
            finalParagraphs.push(listBuffer);
            listBuffer = '';
        }
        
        currentBlock = currentBlock.trim();
        if (currentBlock) {
            if (!currentBlock.match(/^<(h[1-5]|ul|ol|div|p|pre|blockquote)/i)) {
                finalParagraphs.push(`<p>${currentBlock.replace(/\n/g, '<br>')}</p>`);
            } else {
                finalParagraphs.push(currentBlock); // Already a block or needs specific handling
            }
        }
    });
    sectionContent = finalParagraphs.join('');
    sectionContent = sectionContent.replace(/<p>\s*(<(ul|ol)>[\s\S]*?<\/\2>)\s*<\/p>/gi, '$1'); // Clean up p around lists


    sectionContent = sectionContent.replace(/<p>(Note:|Important:|Tip:|Warning:)\s*(.*?)<\/p>/gi, (match, type, content) => {
      return `<div class="info-card"><p><strong>${type}</strong> ${content.replace(/<br>/g, ' ').trim()}</p></div>`;
    });

    codeBlocks.forEach((block, index) => {
      sectionContent = sectionContent.replace(`___CODE_BLOCK_${index}___`, `<pre><code>${block}</code></pre>`);
    });
    
    if (sectionTitle) {
      processedHtml += `<div class="content-card ${specialSectionClass}">`;
      processedHtml += `<div class="card-header"><h2 class="section-title">${sectionTitle}</h2></div>`;
      processedHtml += `<div class="card-body">${sectionContent}</div>`;
      processedHtml += `</div>`;
    } else if (sectionContent) { // Content that wasn't under an H2
      processedHtml += `<div class="content-card"><div class="card-body">${sectionContent}</div></div>`; 
    }
  });
  
  return processedHtml;
}

function renderQuestionAnswerHistory(history?: any[]): string {
  if (!history || history.length === 0) return '';
  let html = `<div class="content-card qna-card">`;
  html += `<div class="card-header"><h2 class="section-title">Assessment Q&A</h2></div>`;
  html += `<div class="card-body">`;
  history.forEach((item, index) => {
    html += `<div class="qna-item">`;
    html += `<p class="qna-question"><strong>Q${index + 1}:</strong> ${item.question || 'N/A'}</p>`;
    let answerDisplay = item.answer;
    if (Array.isArray(item.answer)) answerDisplay = item.answer.join(', ');
    else if (typeof item.answer === 'string' && item.answer.includes('|')) answerDisplay = item.answer.split('|').map((s: string) => s.trim()).join('; ');
    else if (typeof item.answer !== 'string') answerDisplay = String(item.answer || 'N/A');
    else answerDisplay = item.answer || 'N/A';
    html += `<p class="qna-answer"><strong>A:</strong> ${answerDisplay}</p>`;
    if (item.phaseName) html += `<p class="qna-phase"><small>Phase: ${item.phaseName}</small></p>`;
    html += `</div>`;
  });
  html += '</div></div>';
  return html;
}

export async function generateSeekHTML(data: ReportData): Promise<string> {
  const { UserInformation, ScoreInformation, FullReportMarkdown, questionAnswerHistory } = data;
  
  const getTierColor = (tierInput: string | undefined) => {
    switch(tierInput?.toLowerCase()) {
      case 'leader': return 'var(--brand-bright-green)'; // Green for Leader
      case 'enabler': return 'var(--brand-orange)';    // Orange for Enabler
      case 'dabbler': return 'var(--brand-light-blue)'; // Light Blue for Dabbler
      default: return '#6B7280'; // Neutral Gray for default/unknown
    }
  };
  const tierColorHex = getTierColor(ScoreInformation.AITier);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Efficiency Scorecard - ${UserInformation.CompanyName || 'N/A'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    :root {
      --brand-dark-teal: #103138;
      --brand-bright-green: #20E28F;
      --brand-light-mint: #F0FAF6; /* Lighter mint for bg */
      --brand-white: #FFFFFF;
      --brand-orange: #FE7F01;
      --brand-light-blue: #01CEFE;

      --primary: var(--brand-dark-teal);
      --accent: var(--brand-bright-green);
      --text-primary: #1F2937; /* Dark gray for text */
      --text-secondary: #4B5563; 
      --bg-main: var(--brand-light-mint);
      --bg-card: var(--brand-white);
      --border-color: #D1D5DB; /* Neutral gray border */
      --shadow-color: rgba(0, 0, 0, 0.07);
      --tier-color-dynamic: ${tierColorHex};
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      line-height: 1.6; 
      color: var(--text-primary);
      background-color: var(--bg-main); 
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .main-wrapper { padding: 2rem; }

    @media print {
      body { background-color: var(--brand-white); font-size: 9pt; line-height: 1.45; }
      .main-wrapper { padding: 10mm; }
      .content-card, .info-card, .tier-badge, .score-display, .qna-item, .header, .footer {
        page-break-inside: avoid !important; box-shadow: none !important; 
        border: 1px solid #e5e7eb !important;
      }
      .header, .footer { background: var(--primary) !important; color: var(--brand-white) !important; border-radius:0 !important; }
      .header *, .footer * { color: var(--brand-white) !important; }
      .footer a { color: var(--accent) !important; }
      a { color: var(--accent) !important; text-decoration: none !important; }
      .tier-badge { background-color: var(--tier-color-dynamic) !important; color: var(--brand-white) !important; }
      .score-display .score { color: var(--tier-color-dynamic) !important; }
      .card-header { background-color: #f9fafb !important; color: var(--primary) !important; }
      .card-header .section-title { color: var(--primary) !important; }
      .card-header::before { color: var(--tier-color-dynamic) !important; }
    }
    
    .header {
      background: var(--primary);
      color: var(--brand-white);
      padding: 2rem 2.5rem; 
      margin-bottom: 2.5rem; 
      border-radius: 10px;
    }
    .header-content { max-width: 800px; margin: 0 auto; }
    .header h1 {
      font-size: 2.1rem; font-weight: 800; margin-bottom: 0.75rem;
      color: var(--brand-white); line-height: 1.25;
    }
    .header-meta { display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; margin-top: 1rem; font-size: 0.85rem; opacity: 0.9; }
    .header-meta span { display: flex; align-items: center; gap: 0.4rem; }
    .header-meta strong { font-weight: 600; opacity: 0.9; } 
    
    .tier-badge {
      display: table; margin: 2rem auto;
      background-color: var(--tier-color-dynamic);
      color: var(--brand-white); 
      padding: 0.6rem 1.25rem; border-radius: 50px; 
      font-weight: 700; font-size: 1rem; 
      box-shadow: 0 3px 10px color-mix(in srgb, var(--tier-color-dynamic) 25%, transparent);
    }
    .tier-badge::before { content: '★'; font-size: 1.1em; margin-right: 0.5em; }
    
    .main-content-area { max-width: 800px; margin: 0 auto; }
    
    .body-h1 { /* H1 from markdown body */
      color: var(--primary); font-size: 1.7rem; font-weight: 700;
      margin: 2rem 0 1.25rem; padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--accent);
    }
    
    .content-card {
      background-color: var(--bg-card);
      border-radius: 10px; 
      margin-bottom: 1.75rem;
      box-shadow: 0 4px 12px var(--shadow-color); 
      border: 1px solid var(--border-color);
    }
    .card-header {
      background-color: color-mix(in srgb, var(--tier-color-dynamic) 8%, var(--brand-white));
      padding: 0.9rem 1.5rem;
      border-bottom: 1px solid var(--border-color); 
      border-radius: 10px 10px 0 0; 
    }
    .card-header .section-title { /* H2 */
      color: var(--primary); font-size: 1.3rem; font-weight: 700; 
      margin: 0; display: flex; align-items: center; gap: 0.6rem;
    }
    .card-header .section-title::before { 
      content: '❖'; /* Diamond icon */
      color: var(--tier-color-dynamic);
      font-size: 1.1em; 
    }
    .card-body { padding: 1.5rem; font-size: 0.925rem; line-height: 1.7; }
    .card-body p { margin-bottom: 0.85rem; }
    .card-body ul, .card-body ol { padding-left: 1.25rem; margin-bottom: 0.85rem; }
    .card-body li { margin-bottom: 0.35rem; padding-left: 0.25rem; }

    h3 { color: var(--primary); font-size: 1.15rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
    h3.sub-section { 
      color: var(--tier-color-dynamic); font-size: 1.05rem; font-weight: 600;
      margin-top: 1.25rem; margin-bottom: 0.6rem;
      padding-left: 0.75rem; border-left: 3px solid var(--tier-color-dynamic);
    }
    
    p { margin-bottom: 1rem; color: var(--text-secondary); }
    ul, ol { margin: 0.75rem 0 1.25rem 1.5rem; }
    li { margin-bottom: 0.4rem; padding-left: 0.25rem; }
    ul li::marker { color: var(--accent); font-size: 0.9rem; }
    
    .info-card {
      background-color: color-mix(in srgb, var(--brand-yellow) 12%, var(--brand-white));
      border-left: 4px solid var(--brand-yellow); 
      padding: 1rem 1.25rem; margin: 1.5rem 0; border-radius: 6px;
      box-shadow: 0 2px 5px var(--shadow-color);
    }
    .info-card p { font-size: 0.875rem; color: color-mix(in srgb, var(--brand-yellow) 90%, black); margin-bottom: 0; }
    .info-card p strong { color: color-mix(in srgb, var(--brand-yellow) 70%, black); }
    
    .score-display {
      background: var(--brand-white); border: 1px solid var(--border-color);
      border-top: 4px solid var(--tier-color-dynamic); 
      border-radius: 8px; padding: 1.5rem; margin: 2rem auto; 
      text-align: center; box-shadow: 0 4px 15px var(--shadow-color); max-width: 280px; 
    }
    .score-display .score {
      font-size: 3rem; font-weight: 800; 
      color: var(--tier-color-dynamic); margin: 0.25rem 0;
    }
    .score-display .label {
      font-size: 0.8rem; color: var(--text-light); font-weight: 600; 
      text-transform: uppercase; letter-spacing: 0.05em; 
    }
    
    strong { font-weight: 700; color: var(--text-primary); }
    em { font-style: italic; color: var(--text-secondary); }
    
    a { color: var(--accent); text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; color: color-mix(in srgb, var(--accent) 80%, black); }
    
    pre {
      background-color: #e9ecef; color: #212529; 
      padding: 0.85rem 1rem; border-radius: 6px; overflow-x: auto;
      font-family: 'SFMono-Regular', Consolas, Menlo, Courier, monospace;
      font-size: 0.85em; margin: 1rem 0; border: 1px solid #ced4da;
    }
    code { 
      font-family: 'SFMono-Regular', Consolas, Menlo, Courier, monospace;
      background-color: #e9ecef; color: #c92a2a; /* Reddish for inline code */
      padding: 0.15em 0.35em; border-radius: 3px; font-size: 0.875em;
    }

    .footer {
      margin-top: 2.5rem; padding: 1.75rem; background-color: var(--primary);
      color: #adb5bd; text-align: center; border-radius: 0;
    }
    .footer p { margin: 0.4rem 0; font-size: 0.8rem; color: #adb5bd; }
    .footer strong { color: var(--brand-white); } 
    .footer a { color: var(--accent); font-weight: 600; }
    .footer-links { margin-bottom: 0.75rem; }
    .footer-links a { margin: 0 0.5rem; font-size: 0.8rem; }
    
    .qna-card .card-header {
        background-color: color-mix(in srgb, var(--accent) 8%, var(--brand-white));
    }
    .qna-card .card-header .section-title::before { color: var(--accent); }

    .qna-item {
      margin-bottom: 1rem; padding: 1rem;
      background-color: var(--brand-white); 
      border-radius: 6px; border: 1px solid var(--border-color);
    }
    .qna-item:last-child { margin-bottom: 0; }
    .qna-question { font-size: 0.9rem; margin-bottom: 0.25rem !important; }
    .qna-answer { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem !important; }
    .qna-answer strong { font-weight: normal; } /* Reset A: strong */
    .qna-phase { font-size: 0.75rem; color: var(--text-light); }

    .strengths-card-accent > .card-header { background-color: color-mix(in srgb, var(--brand-bright-green) 10%, var(--brand-white)); }
    .strengths-card-accent > .card-header .section-title::before { color: var(--brand-bright-green); }
    
    .weaknesses-card-accent > .card-header { background-color: color-mix(in srgb, var(--brand-orange) 10%, var(--brand-white)); }
    .weaknesses-card-accent > .card-header .section-title::before { color: var(--brand-orange); }

    .recommendations-card-accent > .card-header { background-color: color-mix(in srgb, var(--brand-light-blue) 10%, var(--brand-white)); }
    .recommendations-card-accent > .card-header .section-title::before { color: var(--brand-light-blue); }

  </style>
</head>
<body>
  <div class="main-wrapper">
    <div class="header">
      <div class="header-content">
        <h1>AI Efficiency Scorecard Report</h1>
        <div class="header-meta">
          <span><strong>Company:</strong> ${UserInformation.CompanyName || 'N/A'}</span>
          <span><strong>Name:</strong> ${UserInformation.UserName || 'N/A'}</span>
          ${UserInformation.Industry ? `<span><strong>Industry:</strong> ${UserInformation.Industry}</span>` : ''}
          <span><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  
    <div class="main-content-area">
      <div class="tier-badge">
        AI Maturity Tier: ${ScoreInformation.AITier || 'N/A'}
      </div>
      
      ${parseMarkdown(FullReportMarkdown)}
      
      ${renderQuestionAnswerHistory(questionAnswerHistory)}
    </div>

    <div class="footer">
      <div class="footer-links">
        <a href="#" target="_blank">Privacy Policy</a> | 
        <a href="#" target="_blank">Terms of Service</a> | 
        <a href="#" target="_blank">Contact Us</a>
      </div>
      <p><strong>${UserInformation.CompanyName || 'Your Company'}</strong></p>
      <p>Report ID: ${ScoreInformation.ReportID || 'N/A'} | Generated by AI Efficiency Scorecard System</p>
      <p>&copy; ${new Date().getFullYear()} All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>`;
}
