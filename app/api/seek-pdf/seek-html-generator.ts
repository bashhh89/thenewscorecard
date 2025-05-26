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
  questionAnswerHistory?: any[]; // Make Q&A history optional in data
  [key: string]: any;
}

function parseMarkdown(markdown: string): string {
  if (!markdown) return '';

  let html = markdown.trim();

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
    // let isSpecialSection = false; // Not directly used for class on card anymore
    let specialSectionClass = '';

    sectionContent = sectionContent.replace(/^## (.*?)\n?/, (match, title) => {
      sectionTitle = title.trim();
      if (title.toLowerCase().includes('strengths')) {
        // isSpecialSection = true; // Not strictly needed if class is just for border
        specialSectionClass = 'strengths-section-card';
      } else if (title.toLowerCase().includes('weaknesses') || title.toLowerCase().includes('areas for improvement')) {
        // isSpecialSection = true;
        specialSectionClass = 'weaknesses-section-card';
      } else if (title.toLowerCase().includes('recommendations') || title.toLowerCase().includes('action')) {
        // isSpecialSection = true;
        specialSectionClass = 'recommendations-section-card';
      }
      return ''; 
    });
    
    sectionContent = sectionContent.trim();

    sectionContent = sectionContent
      .replace(/^##### (.*?)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
      .replace(/^### (.*?)$/gm, '<h3 class="sub-section">$1</h3>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    sectionContent = sectionContent
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/___(.*?)___/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>');

    sectionContent = sectionContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    sectionContent = sectionContent.split(/\n\s*\n/).map(paragraph => {
      if (paragraph.trim() === '') return '';
      let paraContent = paragraph.trim();
      
      // Handle multi-line list items correctly before wrapping
      // Numbered lists
      paraContent = paraContent.replace(/^\s*(\d+\.)\s+([\s\S]*?)(?=\n\s*\d+\.|\n\s*[\*\-]|\n\s*\n|$)/gm, (match, num, itemContent) => {
        return `<li>${itemContent.trim().replace(/\n(?!\s*[\*\-\d])/g, '<br>')}</li>`;
      });
      paraContent = paraContent.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/gs, (match) => `<ol>${match}</ol>`);

      // Bullet lists
      paraContent = paraContent.replace(/^\s*([\*\-])\s+([\s\S]*?)(?=\n\s*[\*\-\d]|\n\s*\n|$)/gm, (match, bullet, itemContent) => {
        return `<li>${itemContent.trim().replace(/\n(?!\s*[\*\-\d])/g, '<br>')}</li>`;
      });
      paraContent = paraContent.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/gs, (match) => {
         // Check if it was already wrapped by OL, if so, don't wrap with UL
        if (match.startsWith('<ol>')) return match;
        // A bit of a heuristic: if the list items don't look like OL items, wrap as UL
        if (!match.match(/^\s*<li>\d+\./)) {
             // Check if it's already wrapped by OL from previous step
            const tempOlMatch = match.match(/<ol>(.*)<\/ol>/s);
            if (tempOlMatch && tempOlMatch[1].trim() === match.trim()) {
                return match; // Already an OL
            }
            // If not an OL, and doesn't look like one, assume UL
            if (!match.match(/<li>\s*\d+\./)) {
                 return `<ul>${match}</ul>`;
            }
        }
        return match; // Fallback, might be an OL already
      });


      if (!paraContent.match(/^<(h[1-6]|ul|ol|div|p|pre|blockquote)/i)) {
        paraContent = `<p>${paraContent.replace(/\n/g, '<br>')}</p>`;
      } else {
        // For block elements that might still contain single newlines meant as breaks
        paraContent = paraContent.replace(/<p>([\s\S]*?)<\/p>/g, (match, pContent) => `<p>${pContent.replace(/\n(?!<\/li>|<\/ul>|<\/ol>)/g, '<br>')}</p>`);
        paraContent = paraContent.replace(/(<br>\s*){2,}/g, '<br>'); // Consolidate multiple breaks
      }
      return paraContent;
    }).join('');
     // Clean up paragraph tags around lists
    sectionContent = sectionContent.replace(/<p>\s*(<(ul|ol)>[\s\S]*?<\/\2>)\s*<\/p>/gi, '$1');
    
    sectionContent = sectionContent.replace(/<p>(Note:|Important:|Tip:|Warning:)(.*?)<\/p>/gi, (match, type, content) => {
      return `<div class="info-card"><h3>${type}</h3><p>${content.replace(/<br>/g, ' ').trim()}</p></div>`;
    });

    codeBlocks.forEach((block, index) => {
      sectionContent = sectionContent.replace(`___CODE_BLOCK_${index}___`, `<pre><code>${block}</code></pre>`);
    });
    
    if (sectionTitle) {
      processedHtml += `<div class="content-card ${specialSectionClass}">`;
      processedHtml += `<h2 class="section-header">${sectionTitle}</h2>`;
      processedHtml += `<div class="card-body">${sectionContent}</div>`;
      processedHtml += `</div>`;
    } else {
      processedHtml += `<div class="content-card"><div class="card-body">${sectionContent}</div></div>`; 
    }
  });
  
  return processedHtml;
}

function renderQuestionAnswerHistory(history?: any[]): string {
  if (!history || history.length === 0) {
    return '';
  }

  let html = '<div class="content-card qna-section">';
  html += '<h2 class="section-header">Assessment Q&A History</h2>';
  html += '<div class="card-body">';
  
  history.forEach((item, index) => {
    html += `<div class="qna-item">`;
    html += `<p><strong>Q${index + 1}: ${item.question || 'N/A'}</strong></p>`;
    let answerDisplay = item.answer;
    
    if (Array.isArray(item.answer)) {
      answerDisplay = item.answer.join(', ');
    } else if (typeof item.answer === 'string' && item.answer.includes('|')) {
      answerDisplay = item.answer.split('|').map((s: string) => s.trim()).join(', ');
    } else if (typeof item.answer !== 'string') {
      answerDisplay = String(item.answer || 'N/A');
    } else {
      answerDisplay = item.answer || 'N/A';
    }

    html += `<p><em>A: ${answerDisplay}</em></p>`;
    if (item.phaseName) {
      html += `<p><small>Phase: ${item.phaseName}</small></p>`;
    }
    html += `</div>`;
  });
  
  html += '</div></div>';
  return html;
}

export async function generateSeekHTML(data: ReportData): Promise<string> {
  const { UserInformation, ScoreInformation, FullReportMarkdown, questionAnswerHistory } = data;
  
  const getTierColor = (tierInput: string | undefined) => { // Explicitly type tierInput
    switch(tierInput?.toLowerCase()) {
      case 'leader': return '#20E28F';
      case 'enabler': return '#FE7F01';
      case 'dabbler': return '#01CEFE';
      default: return '#4A5568'; // A more neutral default color
    }
  };
  
  const tierColor = getTierColor(ScoreInformation.AITier);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Efficiency Scorecard - ${UserInformation.CompanyName || 'N/A'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    :root {
      /* Brand Colors */
      --brand-dark-teal: #103138;
      --brand-bright-green: #20E28F;
      --brand-orange: #FE7F01;
      --brand-light-blue: #01CEFE;
      --brand-light-mint: #F3FDF5;
      --brand-white: #FFFFFF;
      --brand-yellow: #FEC401; /* Added from app's color palette */

      /* Theme Assignment */
      --primary: var(--brand-dark-teal);
      --accent: var(--brand-bright-green);
      --secondary: var(--brand-orange);
      --tertiary: var(--brand-light-blue);
      
      --light-bg: var(--brand-light-mint);
      --card-bg: var(--brand-white);
      --text: #2D3748;
      --text-light: #5A6C7D; /* Adjusted for better contrast on light mint */
      --border: #D1E7DD; /* Border color derived from light-mint/accent */
      --shadow: rgba(16, 49, 56, 0.1); /* Shadow based on primary color */
      --tier-color: ${tierColor};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      line-height: 1.7; /* Adjusted for readability */
      color: var(--text);
      background-color: var(--light-bg);
      padding: 0; /* Remove body padding, handle with main-wrapper */
      margin:0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .main-wrapper { /* Added wrapper for overall padding */
        padding: 1.5rem;
    }

    @media print {
      body {
        background-color: var(--brand-white);
        padding: 20px;
        font-size: 9.5pt; /* Fine-tuned print font size */
      }
      .main-wrapper { padding: 0; }
      .content-card, .info-card, .tier-badge, .score-display, .qna-item, .header, .footer {
        page-break-inside: avoid !important;
        box-shadow: none !important; /* Remove shadows for print */
        border: 1px solid var(--border) !important; /* Ensure borders print */
      }
       h1, h2, h3, h4 {
        page-break-after: avoid !important;
      }
      .header {
        margin-bottom: 1.5rem;
        padding: 2rem 1.5rem;
        border-radius: 0; /* No radius for print header */
        background: var(--primary) !important; /* Ensure bg prints */
      }
      .header h1, .header-meta span, .header-meta strong { color: white !important; }

      .footer {
        margin-top: 1.5rem; padding: 1.5rem; border-radius: 0;
        background: var(--primary) !important; /* Ensure bg prints */
      }
      .footer p, .footer strong { color: #E2E8F0 !important; }
      .footer a { color: var(--accent) !important; }

      .main-content-area { padding: 0; }
      a { text-decoration: none; color: var(--tier-color) !important; }
      .tier-badge { background-color: var(--tier-color) !important; color: var(--primary) !important; }
      .score-display .score { color: var(--tier-color) !important; }
    }
    
    .header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--brand-dark-teal) 70%, color-mix(in srgb, var(--brand-dark-teal) 80%, var(--brand-bright-green) 20%) 100%);
      color: var(--brand-white);
      padding: 3rem 2.5rem;
      margin-bottom: 2.5rem;
      position: relative;
      overflow: hidden;
      /* Removed border-radius for a full-width feel if body has no padding */
    }
            
    .header-content {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .header h1 {
      font-size: 2.4rem;
      font-weight: 800;
      margin-bottom: 0.85rem;
      color: var(--brand-white);
      padding-left: 0;
      border-left: none;
    }
     .header h1::before { display: none; }
    
    .header-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem 2rem;
      margin-top: 1.25rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .header-meta span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header-meta strong { color: var(--brand-white); opacity: 0.8; font-weight: 600; }
    
    .tier-badge {
      display: table;
      align-items: center;
      gap: 0.75rem; /* Increased gap */
      background-color: var(--tier-color);
      color: var(--brand-white); /* White text on tier color */
      padding: 0.7rem 1.5rem; /* Adjusted padding */
      border-radius: 50px;
      font-weight: 700;
      font-size: 1.05rem; /* Slightly larger */
      margin: 2.5rem auto;
      box-shadow: 0 5px 15px color-mix(in srgb, var(--tier-color) 40%, transparent); /* Shadow with tier color */
    }
    
    .tier-badge::before {
      content: '★';
      font-size: 1.2rem; /* Larger star */
      margin-right: 0.35rem;
    }
    
    .main-content-area {
      max-width: 900px;
      margin: 0 auto;
      padding: 0; /* Padding handled by main-wrapper or body */
    }
    
    h1 { /* For H1 in markdown body, if any */
      color: var(--primary);
      font-size: 2rem;
      font-weight: 800; /* Bolder */
      margin: 2.5rem 0 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--tier-color); /* Underline instead of left border */
    }
    
    .content-card {
      background-color: var(--card-bg);
      border-radius: 12px; /* Slightly more pronounced radius */
      padding: 2rem;
      margin-bottom: 2rem; /* More space between cards */
      box-shadow: 0 6px 18px var(--shadow); /* Enhanced shadow */
      border: 1px solid var(--border);
      transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    }
    /* .content-card:hover { transform: translateY(-3px); box-shadow: 0 8px 22px var(--shadow); } */ /* Optional hover effect */
    
    .content-card .section-header {
      color: var(--primary);
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0 0 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--tier-color);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .content-card .section-header::before {
      content: '◆'; /* Changed icon */
      color: var(--tier-color);
      font-size: 1.2em;
      font-weight: normal; /* Ensure icon is not bolded by H2 */
    }
    
    .card-body {
      font-size: 0.95rem;
      line-height: 1.85; /* Slightly more line height in cards */
    }
    .card-body p, .card-body ul, .card-body ol {
        margin-bottom: 1.1rem; /* More space for p in cards */
    }
    .card-body ul, .card-body ol {
        padding-left: 1.5rem;
    }
    .card-body li {
        margin-bottom: 0.5rem;
        padding-left: 0.3rem;
    }

    h3 {
      color: var(--primary);
      font-size: 1.3rem;
      font-weight: 700;
      margin: 1.75rem 0 0.85rem; /* Adjusted margins */
    }
    
    h3.sub-section {
      color: var(--tier-color);
      font-size: 1.15rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      padding-left: 0.85rem;
      border-left: 3px solid var(--tier-color);
    }
    
    p { /* General paragraph styling */
      margin-bottom: 1.1rem;
      color: var(--text);
    }
    
    ul, ol {
      margin: 1rem 0 1.5rem 1.75rem;
    }
    
    li {
      margin-bottom: 0.6rem;
      padding-left: 0.3rem;
    }
    
    ul li::marker {
      color: var(--tier-color);
      font-size: 1.05rem;
    }
    
    .info-card {
      background-color: color-mix(in srgb, var(--secondary) 10%, var(--brand-white)); /* Tinted with secondary */
      border-left: 4px solid var(--secondary);
      padding: 1.25rem 1.5rem;
      margin: 1.75rem 0;
      border-radius: 8px;
      box-shadow: 0 3px 8px var(--shadow);
    }
    
    .info-card h3 {
      color: var(--secondary);
      font-size: 1.1rem;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .info-card p {
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--secondary) 80%, black); /* Darker text for info card */
      margin-bottom: 0;
    }
    
    .score-display {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-top: 4px solid var(--tier-color); /* Accent top border */
      border-radius: 12px; /* More pronounced radius */
      padding: 2rem 1.5rem; /* Adjusted padding */
      margin: 2.5rem auto;
      text-align: center;
      box-shadow: 0 5px 20px var(--shadow); /* Softer, larger shadow */
      max-width: 350px;
    }
    
    .score-display .score {
      font-size: 3.5rem; /* Larger score */
      font-weight: 800;
      color: var(--tier-color);
      margin: 0.5rem 0; /* More margin for score */
    }
    
    .score-display .label {
      font-size: 0.95rem;
      color: var(--text-light);
      font-weight: 600; /* Bolder label */
      text-transform: uppercase;
      letter-spacing: 0.05em; /* Slight letter spacing */
    }
    
    strong {
      font-weight: 700;
      color: var(--primary); /* Ensure strong text uses primary color */
    }
    
    em {
      font-style: italic;
      color: color-mix(in srgb, var(--text) 80%, black); /* Slightly darker italic */
    }
    
    a {
      color: var(--accent); /* Use accent for links */
      text-decoration: none;
      font-weight: 600;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    
    a:hover {
      border-bottom-color: var(--accent);
      color: color-mix(in srgb, var(--accent) 80%, black); /* Darken on hover */
    }
    
    pre {
      background-color: #EDF2F7;
      color: #2D3748;
      padding: 1rem; /* More padding */
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 0.875rem; /* Slightly larger code font */
      margin: 1.25rem 0;
      border: 1px solid #CBD5E0;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); /* Inner shadow */
    }
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      background-color: #E2E8F0; /* Slightly darker inline code bg */
      color: #2D3748;
      padding: 0.15em 0.4em; /* Adjusted padding */
      border-radius: 4px; /* Softer radius */
      font-size: 0.9em;
    }

    .footer {
      margin-top: 3rem;
      padding: 2rem 1.5rem; /* More padding */
      background-color: var(--primary);
      color: #CBD5E0; /* Lighter gray for footer text */
      text-align: center;
      border-radius: 0; /* Full width footer */
      /* border-top: 3px solid var(--accent); */ /* Optional top accent */
    }
    .footer p {
      margin: 0.5rem 0;
      font-size: 0.85rem;
      color: #CBD5E0;
    }
    .footer strong { color: var(--brand-white); }
    .footer a {
      color: var(--brand-bright-green); /* Brighter links in footer */
      font-weight: 600;
    }
    .footer-links {
      margin-bottom: 1rem;
    }
    .footer-links a {
      margin: 0 0.75rem;
      font-size: 0.85rem;
    }
    
    .qna-section.content-card {
      /* Uses content-card styles */
      border-top: 2px solid var(--border); /* Separator for QnA card */
      margin-top: 2.5rem;
    }
    .qna-item {
      margin-bottom: 1.5rem;
      padding: 1.25rem; /* More padding */
      background-color: var(--brand-white);
      border-radius: 8px;
      border: 1px solid var(--border);
      box-shadow: 0 2px 6px var(--shadow); /* Consistent shadow */
    }
    .qna-item:last-child {
        margin-bottom: 0;
    }
    .qna-item p { margin: 0.4rem 0; font-size: 0.925rem;}
    .qna-item strong { color: var(--primary); font-weight: 600; }
    .qna-item em { color: var(--text); font-style: normal; }
    .qna-item small { color: var(--text-light); font-size: 0.8rem; }

    .strengths-section-card { border-left: 5px solid var(--brand-bright-green); }
    .weaknesses-section-card { border-left: 5px solid var(--brand-orange); }
    .recommendations-section-card { border-left: 5px solid var(--brand-light-blue); }

  </style>
</head>
<body>
  <div class="main-wrapper"> <!-- Added main wrapper -->
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
    
    ${ScoreInformation.FinalScore !== null && ScoreInformation.FinalScore !== undefined ? `
      <div class="score-display">
        <div class="label">Your AI Efficiency Score</div>
        <div class="score">${ScoreInformation.FinalScore}</div>
        <div class="label">out of 100</div>
      </div>
    ` : ''}
  
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
</body>
</html>`;
}