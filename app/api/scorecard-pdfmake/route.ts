import { NextResponse } from 'next/server';

/**
 * PDFMake-based PDF generator
 * This provides another alternative PDF generation option using PDFMake library
 */
export async function POST(request: Request) {
  console.log('Starting PDFMake PDF generation');
  
  try {
    // Dynamically import pdfmake and its fonts
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    
    // Access the default export and the vfs fonts object
    const pdfMake = pdfMakeModule.default || pdfMakeModule; // Handle potential different import structures
    const pdfFonts = pdfFontsModule.pdfMake.vfs;
    
    // Set up fonts explicitly
    pdfMake.vfs = pdfFonts;
    pdfMake.fonts = {
      Roboto: { // Using Roboto as an example, ensure this font is in vfs_fonts.js
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
      // Add other fonts here if needed, ensuring their .ttf files are included in vfs_fonts.js
      // Or handle custom font loading if necessary
    };
    
    // Get the report data from the request body
    // Added a check for empty body that might cause JSON parsing errors
    const text = await request.text();
    if (!text) {
      throw new Error('Request body is empty');
    }
    const reportData = JSON.parse(text);
    
    console.log('Received report data for PDFMake template');
    
    // Validate essential data
    if (!reportData) {
      throw new Error('No report data provided after parsing');
    }
    
    // Ensure required fields exist with fallbacks
    const validatedData = {
      UserInformation: {
        UserName: reportData.UserInformation?.UserName || 'User',
        CompanyName: reportData.UserInformation?.CompanyName || 'Company',
        Email: reportData.UserInformation?.Email || '',
        Industry: reportData.UserInformation?.Industry || 'General Business'
      },
      ScoreInformation: {
        AITier: reportData.ScoreInformation?.AITier || 'Enabler',
        FinalScore: reportData.ScoreInformation?.FinalScore || null,
        ReportID: reportData.ScoreInformation?.ReportID || `REPORT-${Date.now()}`
      },
      FullReportMarkdown: reportData.FullReportMarkdown || ''
    };
    
    // Extract strengths from the report markdown
    const strengths = extractStrengths(validatedData.FullReportMarkdown);
    
    // Extract weaknesses from the report markdown
    const weaknesses = extractWeaknesses(validatedData.FullReportMarkdown);
    
    // Define document definition for PDFMake
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      
      info: {
        title: 'AI Scorecard Report',
        author: 'AI Scorecard Generator',
        subject: `AI Scorecard for ${validatedData.UserInformation.CompanyName}`,
        keywords: 'AI, scorecard, assessment, report',
      },
      
      content: [
        // Cover page
        {
          stack: [
            {
              text: 'AI EFFICIENCY SCORECARD',
              style: 'coverTitle',
              margin: [0, 100, 0, 20]
            },
            {
              text: validatedData.UserInformation.CompanyName,
              style: 'coverCompany',
              margin: [0, 10, 0, 5]
            },
            {
              text: `Prepared for: ${validatedData.UserInformation.UserName}`,
              style: 'coverPreparedFor',
              margin: [0, 5, 0, 5]
            },
            {
              text: `Industry: ${validatedData.UserInformation.Industry}`,
              style: 'coverIndustry',
              margin: [0, 5, 0, 30]
            },
            {
              text: `AI Maturity Tier: ${validatedData.ScoreInformation.AITier}`,
              style: 'coverTier',
              margin: [0, 5, 0, 50]
            },
            {
              text: new Date().toLocaleDateString(),
              style: 'coverDate'
            }
          ],
          alignment: 'center'
        },
        { text: '', pageBreak: 'after' }, // Force page break after cover
        
        // Key Findings section
        {
          stack: [
            {
              text: 'KEY FINDINGS',
              style: 'sectionHeader',
              margin: [0, 0, 0, 15]
            },
            {
              text: 'Strengths',
              style: 'subsectionHeader',
              margin: [0, 20, 0, 10]
            },
            {
              ul: strengths.map(strength => ({
                text: strength,
                style: 'listItem',
                margin: [0, 5, 0, 5]
              }))
            },
            {
              text: 'Areas for Improvement',
              style: 'subsectionHeader',
              margin: [0, 20, 0, 10]
            },
            {
              ul: weaknesses.map(weakness => ({
                text: weakness,
                style: 'listItem',
                margin: [0, 5, 0, 5]
              }))
            }
          ]
        }
      ],
      
      styles: {
        coverTitle: {
          fontSize: 28,
          bold: true,
          color: '#103138'
        },
        coverCompany: {
          fontSize: 16,
          color: '#103138',
        },
        coverPreparedFor: {
          fontSize: 14,
          color: '#333333',
        },
        coverIndustry: {
          fontSize: 14,
          color: '#333333',
        },
        coverTier: {
          fontSize: 18,
          bold: true,
          color: '#20E28F',
        },
        coverDate: {
          fontSize: 12,
          color: '#666666',
        },
        sectionHeader: {
          fontSize: 20,
          bold: true,
          color: '#103138',
          alignment: 'left'
        },
        subsectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#103138',
          alignment: 'left'
        },
        listItem: {
          fontSize: 12,
          color: '#333333',
          alignment: 'left'
        }
      },
      
      footer: function(currentPage, pageCount) {
        return {
          text: `Page ${currentPage} of ${pageCount} | Report ID: ${validatedData.ScoreInformation.ReportID}`,
          alignment: 'center',
          fontSize: 8,
          color: '#666666',
          margin: [40, 0]
        };
      },
      
      header: function(currentPage, pageCount) {
        if (currentPage === 1) return {}; // No header on cover page
        return {
          text: 'AI EFFICIENCY SCORECARD',
          alignment: 'right',
          fontSize: 8,
          color: '#666666',
          bold: true,
          margin: [40, 20, 40, 0]
        };
      }
    };
    
    // Generate PDF and get the buffer
    console.log('Generating PDF with PDFMake');
    
    const pdfDoc = pdfMake.createPdfKitDocument(docDefinition);
    
    return new Promise<NextResponse>((resolve, reject) => {
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        // Extract company name for the filename if available
        let fileName = 'ai-scorecard-pdfmake.pdf';
        try {
          const companyName = validatedData.UserInformation.CompanyName;
          if (companyName && companyName !== 'N/A' && companyName !== 'Company') {
            const sanitizedName = companyName.replace(/[^\\w\\s-]/g, '').trim();
            if (sanitizedName) {
              fileName = `ai-scorecard-pdfmake-${sanitizedName.toLowerCase().replace(/\\s+/g, '-')}.pdf`;
            }
          }
          console.log(`Using filename: ${fileName}`);
        } catch (e) {
          console.error('Error extracting company name:', e);
        }
        
        // Return the PDF
        resolve(new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`,
          },
        }));
      });
      pdfDoc.on('error', (error) => {
        console.error('Error generating PDF buffer:', error);
        reject(error);
      });
      pdfDoc.end(); // Finalize the PDF and trigger the 'end' event
    });
  } catch (error) {
    console.error('Error generating PDF with PDFMake:', error);
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to generate PDF with PDFMake',
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
 * Extract strengths from the FullReportMarkdown
 */
function extractStrengths(markdownContent: string): string[] {
  if (!markdownContent) return [];
  
  console.log('Extracting strengths from markdown content');
  
  // Look for strengths section
  const keyFindingsMatch = markdownContent.match(/## Key Findings([\s\S]*?)(?=##|$)/i);
  if (!keyFindingsMatch) return [];

  // Find strengths text
  const strengthsMatch = keyFindingsMatch[1].match(/\*\*Strengths:\*\*([\s\S]*?)(?=\*\*Weaknesses|$)/i);
  if (!strengthsMatch) return [];
  
  // Extract bullet points
  const strengthContent = strengthsMatch[1].trim();
  let bulletPoints = strengthContent.split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(point => point.replace(/^-\s*/, '').trim())
    .filter(point => point.length > 0);
  
  console.log(`Found ${bulletPoints.length} strengths in the markdown`);

  // Default strengths if none were found or too few
  if (bulletPoints.length < 3) {
    const defaultStrengths = [
      'Initiative in exploring AI technologies',
      'Adoption of basic AI tools',
      'Commitment to data privacy and security'
    ];
    
    // Fill in any missing points with defaults
    while (bulletPoints.length < 3) {
      bulletPoints.push(defaultStrengths[bulletPoints.length]);
    }
  }
  
  return bulletPoints;
}

/**
 * Extract weaknesses from the FullReportMarkdown
 */
function extractWeaknesses(markdownContent: string): string[] {
  if (!markdownContent) return [];
  
  console.log('Extracting weaknesses from markdown content');
  
  // Look for key findings section
  const keyFindingsMatch = markdownContent.match(/## Key Findings([\s\S]*?)(?=##|$)/i);
  if (!keyFindingsMatch) return [];

  // Find weaknesses text
  const weaknessesMatch = keyFindingsMatch[1].match(/\*\*Weaknesses:\*\*([\s\S]*?)(?=##|$)/i);
  if (!weaknessesMatch) return [];
  
  // Extract bullet points
  const weaknessContent = weaknessesMatch[1].trim();
  let bulletPoints = weaknessContent.split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(point => point.replace(/^-\s*/, '').trim())
    .filter(point => point.length > 0);
  
  console.log(`Found ${bulletPoints.length} weaknesses in the markdown`);

  // Default weaknesses if none were found or too few
  if (bulletPoints.length < 3) {
    const defaultWeaknesses = [
      'Need for a unified AI strategy',
      'Data quality and integration challenges',
      'Limited AI expertise across teams'
    ];
    
    // Fill in any missing points with defaults
    while (bulletPoints.length < 3) {
      bulletPoints.push(defaultWeaknesses[bulletPoints.length]);
    }
  }
  
  return bulletPoints;
}

// Simple GET handler for testing
export async function GET() {
  return new NextResponse(JSON.stringify({ 
    status: 'ready',
    message: 'PDFMake generator is ready. Use POST method to generate a PDF.'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 