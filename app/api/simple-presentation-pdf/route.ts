import { NextResponse } from 'next/server';
import { generateScorecardHTML } from '../generate-scorecard-report-v6/scorecard-html-generator';

/**
 * A simplified presentation PDF generator using WeasyPrint instead of PDFShift
 * for better performance and consistency with other PDF generators
 */
export async function POST(request: Request) {
  console.log('Starting simplified presentation PDF generation with WeasyPrint');
  try {
    // Get the report data from the request body
    const reportData = await request.json();
    console.log('Received report data for simplified presentation PDF');
    
    // Validate essential data
    if (!reportData) {
      throw new Error('No report data provided');
    }

    // Validate required fields
    const requiredFields = [
      'UserInformation.UserName',
      'UserInformation.CompanyName',
      'UserInformation.Email',
      'UserInformation.Industry',
      'ScoreInformation.AITier'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const [parent, child] = field.split('.');
      return !reportData[parent]?.[child];
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Ensure required fields exist with fallbacks
    const validatedData = {
      UserInformation: {
        UserName: reportData.UserInformation?.UserName || 'User',
        CompanyName: reportData.UserInformation?.CompanyName || 'Company',
        Email: reportData.UserInformation?.Email || '',
        Industry: reportData.UserInformation?.Industry
      },
      ScoreInformation: {
        AITier: reportData.ScoreInformation?.AITier || 'Enabler',
        FinalScore: reportData.ScoreInformation?.FinalScore || 'N/A',
        ReportID: reportData.ScoreInformation?.ReportID || `REPORT-${Date.now()}`
      },
      QuestionAnswerHistory: Array.isArray(reportData.QuestionAnswerHistory) ? 
        reportData.QuestionAnswerHistory : [],
      FullReportMarkdown: reportData.FullReportMarkdown || ''
    };
    
    // Generate HTML using the scorecard HTML generator
    console.log('Generating HTML from scorecard data');
    const html = await generateScorecardHTML(validatedData);
    console.log(`Generated HTML size: ${html.length} bytes`);
    
    // Add presentation styling
    const presentationHtml = addPresentationStyling(html, validatedData);
    
    // Generate PDF using WeasyPrint service
    console.log('Generating PDF with WeasyPrint service');
    const pdfBuffer = await generatePDFWithWeasyPrint(presentationHtml);
    console.log('PDF generated successfully');
    
    // Extract company name for the filename if available
    let fileName = 'ai-scorecard-presentation.pdf';
    try {
      const companyName = validatedData.UserInformation.CompanyName;
      if (companyName && companyName !== 'N/A' && companyName !== 'Company') {
        const sanitizedName = companyName.replace(/[^\w\s-]/g, '').trim();
        if (sanitizedName) {
          fileName = `ai-scorecard-presentation-${sanitizedName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        }
      }
      console.log(`Using filename: ${fileName}`);
    } catch (e) {
      console.error('Error extracting company name:', e);
    }
    
    // Return the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error generating presentation PDF:', error);
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to generate presentation PDF',
      details: errorMessage
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * Generate PDF using WeasyPrint service
 * @param html HTML content to convert to PDF
 * @returns PDF buffer
 */
async function generatePDFWithWeasyPrint(html: string): Promise<Buffer> {
  try {
    // WeasyPrint service URL
    const weasyPrintServiceUrl = process.env.WEASYPRINT_SERVICE_URL || 'http://168.231.86.114:5001/generate-pdf';
    
    console.log(`Using WeasyPrint service at: ${weasyPrintServiceUrl}`);
    
    // Add web fonts for better rendering if not already included
    if (!html.includes('fonts.googleapis.com')) {
      html = html.replace('</head>', 
        '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n</head>'
      );
    }
    
    // Check if this is a complete HTML document
    if (!html.includes('<!DOCTYPE html>') && !html.includes('<html')) {
      // Wrap the HTML in a proper document structure
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>AI Scorecard Presentation</title>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: Letter landscape;
              margin: 0.5in;
            }
            @media print {
              body {
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 14pt;
                line-height: 1.5;
                color: #263238;
                background-color: #ffffff;
              }
              .page-break {
                page-break-before: always;
              }
              .avoid-break {
                page-break-inside: avoid;
              }
              section {
                page-break-after: auto;
              }
              h1, h2, h3 {
                page-break-after: avoid;
              }
              ul, ol {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
    }
    
    // Make request to WeasyPrint service with enhanced options
    const response = await fetch(weasyPrintServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html_content: html,
        pdf_options: {
          presentational_hints: true,
          optimize_size: ['fonts', 'images'],
          full_page: true,
          pdf_format: {
            page_size: 'Letter',
            orientation: 'landscape',
            margin: {
              top: '0.5in',
              right: '0.5in',
              bottom: '0.5in',
              left: '0.5in'
            }
          },
          font_config: {
            font_map: {
              'Plus Jakarta Sans': '/app/fonts/PlusJakartaSans-Regular.ttf',
              'Plus Jakarta Sans Bold': '/app/fonts/PlusJakartaSans-Bold.ttf',
              'Plus Jakarta Sans Medium': '/app/fonts/PlusJakartaSans-Medium.ttf',
              'Plus Jakarta Sans SemiBold': '/app/fonts/PlusJakartaSans-SemiBold.ttf',
              'Plus Jakarta Sans ExtraBold': '/app/fonts/PlusJakartaSans-ExtraBold.ttf'
            }
          }
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(e => 'Could not read error response');
      throw new Error(`WeasyPrint service returned ${response.status}: ${response.statusText}. Details: ${errorText}`);
    }

    // Get PDF as buffer
    const pdfBuffer = await response.arrayBuffer();
    
    // Validate PDF buffer
    if (!pdfBuffer || pdfBuffer.byteLength < 1000) {
      throw new Error(`Generated PDF is too small or empty (${pdfBuffer?.byteLength || 0} bytes)`);
    }
    
    console.log(`Generated PDF size: ${pdfBuffer.byteLength} bytes`);
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF with WeasyPrint:', error);
    throw error;
  }
}

/**
 * Process the HTML to add our custom strengths and weaknesses layout
 * Uses direct HTML replacement to ensure our layout is applied
 */
function addPresentationStyling(html: string, data: any): string {
  console.log('Applying presentation styling - SIMPLER VERSION');
  
  // Replace common placeholders that might show up in the presentation
  // This fixes the issue with placeholder values showing instead of actual data
  let processedHtml = html;
  
  // Extract user information for replacements
  const userName = data.UserInformation.UserName || 'User';
  const companyName = data.UserInformation.CompanyName || 'Company';
  const email = data.UserInformation.Email || '';
  const industry = data.UserInformation.Industry || '';
  const reportId = data.ScoreInformation.ReportID || '';
  const aiTier = data.ScoreInformation.AITier || 'Dabbler';
  const finalScore = data.ScoreInformation.FinalScore ? `${data.ScoreInformation.FinalScore}/100` : 'N/A/100';
  
  console.log('Fixing placeholders with actual values:', {
    userName, companyName, email, industry, reportId, aiTier, finalScore
  });
  
  // Replace placeholder text with actual values
  // Generic placeholder replacement using mustache-style templates
  const replacements: Record<string, string> = {
    'UserInformation.UserName': userName || 'Not provided',
    'UserInformation.CompanyName': companyName || 'Not provided',
    'UserInformation.Email': email || 'Not provided',
    'UserInformation.Industry': industry || 'Not provided',
    'ScoreInformation.ReportID': reportId || 'Not provided',
    'ScoreInformation.AITier': aiTier || 'Not provided',
    'ScoreInformation.FinalScore': data.ScoreInformation.FinalScore?.toString() || 'Not available'
  };

  processedHtml = processedHtml.replace(
    /{{\s*([\w.]+)\s*}}/g,
    (_, key) => replacements[key] || ''
  );

  // Handle score formatting separately
  processedHtml = processedHtml.replace(
    /Overall Score: {{\s*ScoreInformation\.FinalScore\s*}}\/100/g,
    `Overall Score: ${replacements['ScoreInformation.FinalScore']}/100`
  );
  
  // First find if we have strengths content
  const strengthsMatch = processedHtml.match(/<div class="markdown-content strengths-content">([\s\S]*?)<\/div>/);
  let strengthsContent = '';
  
  if (strengthsMatch && strengthsMatch[1]) {
    strengthsContent = strengthsMatch[1];
    console.log('Found strengths content: ' + strengthsContent.substring(0, 100) + '...');
  } else {
    console.log('No strengths content found, using default content');
    strengthsContent = `
      <ul>
        <li>Initiative in Exploring AI: The agency has taken initial steps to identify and prioritize AI initiatives within property management and marketing.</li>
        <li>Adoption of Basic AI Tools: Utilization of AI-enhanced CRM systems and automated marketing tools shows an openness to integrating AI.</li>
        <li>Commitment to Data Privacy: Established processes for data privacy and compliance, including regular staff training.</li>
      </ul>
    `;
  }
  
  // Now directly inject this content into key findings section
  if (processedHtml.includes('<div class="markdown-content key-findings-content"></div>')) {
    console.log('Found empty key-findings-content div, replacing it');
    processedHtml = processedHtml.replace(
      '<div class="markdown-content key-findings-content"></div>',
      `<div class="markdown-content key-findings-content">
        <h2>Strengths</h2>
        ${strengthsContent}
      </div>`
    );
  } else if (processedHtml.includes('key-findings-content')) {
    console.log('Found key-findings-content, replacing it');
    const keyFindingsPattern = /<div[^>]*class="[^"]*key-findings-content[^"]*"[^>]*>[\s\S]*?<\/div>/i;
    if (keyFindingsPattern.test(processedHtml)) {
      processedHtml = processedHtml.replace(
        keyFindingsPattern,
        `<div class="markdown-content key-findings-content">
          <h2>Strengths</h2>
          ${strengthsContent}
        </div>`
      );
    }
  }
  
  // Add a simple style for the key findings section
  const headEndMatch = processedHtml.match(/<\/head>/i);
  if (headEndMatch) {
    const additionalStyles = `
      <style>
        .key-findings-content h2 {
          font-size: 28pt;
          color: #103138;
          margin-bottom: 1em;
          border-bottom: 3px solid #20E28F;
          padding-bottom: 0.2em;
        }
        
        .key-findings-content ul {
          padding-left: 1.5em;
          list-style-type: none;
        }
        
        .key-findings-content li {
          position: relative;
          padding-left: 1.5em;
          margin-bottom: 1em;
          font-size: 16pt;
        }
        
        .key-findings-content li:before {
          content: "•";
          color: #20E28F;
          font-weight: bold;
          position: absolute;
          left: 0;
          font-size: 1.5em;
        }
      </style>
    `;
    processedHtml = processedHtml.replace(/<\/head>/i, additionalStyles + '</head>');
  }
  
  return processedHtml;
}

// For simple testing
export async function GET() {
  return new NextResponse(JSON.stringify({ 
    status: 'ready',
    message: 'Simple presentation PDF generator is ready. Use POST method to generate a PDF.'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 