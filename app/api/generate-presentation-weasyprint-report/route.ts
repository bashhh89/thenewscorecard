import { NextResponse } from 'next/server';
import { generateScorecardHTMLv5 as generateScorecardHTML } from '@/lib/html-generation/scorecard-html-v5';

/**
 * Generate PDF using WeasyPrint service (self-hosted)
 * This is optimized for presentation-style PDFs with enhanced styling
 * @param html HTML content to convert to PDF
 * @returns PDF buffer
 */
async function generatePresentationPDF(html: string): Promise<Buffer> {
  try {
    // WeasyPrint service URL
    const weasyPrintServiceUrl = process.env.WEASYPRINT_SERVICE_URL || 'http://168.231.115.219:5001/generate-pdf';
    console.log(`Using WeasyPrint service at: ${weasyPrintServiceUrl}`);
    
    // Modify HTML to add presentation-specific CSS
    const presentationHtml = addPresentationStyling(html);
    console.log(`Presentation HTML size: ${presentationHtml.length} bytes`);
    
    // Make request to WeasyPrint service
    console.log('Sending request to WeasyPrint service...');
    const response = await fetch(weasyPrintServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: presentationHtml,
        options: {
          presentational_hints: true,
          optimize_size: ['fonts', 'images'],
          font_config: {
            font_map: {
              'Plus Jakarta Sans': '/app/fonts/PlusJakartaSans-Regular.ttf',
              'Plus Jakarta Sans Bold': '/app/fonts/PlusJakartaSans-Bold.ttf'
            }
          }
        }
      }),
    });

    console.log(`WeasyPrint service response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(e => 'Could not read error response');
      console.error(`WeasyPrint service error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      throw new Error(`WeasyPrint service returned ${response.status}: ${response.statusText} - ${errorText}`);
    }

    // Get PDF as buffer
    const pdfBuffer = await response.arrayBuffer();
    console.log(`Generated PDF size: ${pdfBuffer.byteLength} bytes`);
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Error generating presentation PDF with WeasyPrint:', error);
    // Log detailed error info
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`);
      console.error(`Error message: ${error.message}`);
      console.error(`Error stack: ${error.stack}`);
    }
    throw error;
  }
}

/**
 * Add presentation-specific styling to the HTML
 * @param html Original HTML content
 * @returns Modified HTML with presentation styling
 */
function addPresentationStyling(html: string): string {
  try {
    console.log('Adding presentation-specific styling');
    // Additional CSS for presentation-style PDF - with simpler styling to reduce potential rendering issues
    const presentationCss = `
      @page {
        size: 11in 8.5in landscape; /* Standard presentation format instead of wide format */
        margin: 0.5in;
      }
      
      /* Enhanced presentation styling with simplified properties */
      body {
        font-size: 14pt;
      }
      
      .header {
        padding: 0.5in 0;
      }
      
      .report-title {
        font-size: 32pt;
      }
      
      .report-subtitle {
        font-size: 18pt;
      }
      
      .section-title {
        font-size: 24pt;
        margin-bottom: 0.5in;
      }
      
      .card {
        padding: 0.4in;
        margin-bottom: 0.5in;
        /* Removed box-shadow as it can cause rendering issues */
        border: 2px solid #e3eaf2;
      }
      
      .card-title {
        font-size: 20pt;
        margin-bottom: 0.3in;
      }
      
      .info-row {
        margin-bottom: 0.2in;
        font-size: 14pt;
      }
      
      .maturity-tier-value {
        font-size: 28pt;
      }
      
      .markdown-content p {
        font-size: 14pt;
        margin-bottom: 0.2in;
      }
      
      .markdown-content ul li, 
      .markdown-content ol li {
        font-size: 14pt;
        margin-bottom: 0.15in;
      }
      
      /* Ensure page breaks */
      .section {
        page-break-before: always;
      }
      
      /* Simplify columns to avoid flex layout issues */
      .two-column {
        display: block;
      }
      
      .two-column .column {
        width: 100%;
        margin-bottom: 0.5in;
      }
    `;
    
    // Insert the additional CSS into the HTML
    const styledHtml = html.replace('</style>', `${presentationCss}\n</style>`);
    
    return styledHtml;
  } catch (error) {
    console.error('Error in addPresentationStyling:', error);
    // Fall back to original HTML if styling fails
    return html;
  }
}

export async function POST(request: Request) {
  console.log('Starting presentation PDF generation process');
  try {
    // Get the report data from the request body
    const reportData = await request.json();
    console.log('Received report data for presentation PDF generation');
    
    // Generate HTML using the scorecard HTML generator (reusing v6 generator)
    console.log('Generating HTML from scorecard data');
    const html = await generateScorecardHTML(reportData);
    console.log(`Generated HTML size: ${html.length} bytes`);
    
    // Check if HTML size is too large (WeasyPrint might have size limitations)
    if (html.length > 5000000) { // 5MB threshold
      console.warn('HTML is very large, may cause processing issues');
    }
    
    // Add a simple timeout to the PDF generation to ensure it has enough time
    console.log('Generating presentation-style PDF from HTML');
    const pdfGenerationPromise = generatePresentationPDF(html);
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF generation timed out after 30 seconds')), 30000);
    });
    
    // Race the promises
    const pdfBuffer = await Promise.race([
      pdfGenerationPromise,
      timeoutPromise
    ]) as Buffer;
    
    console.log('Successfully generated presentation PDF');
    
    // Extract company name for the filename if available
    let fileName = 'ai-scorecard-presentation.pdf';
    try {
      const companyName = reportData?.UserInformation?.CompanyName;
      if (companyName && companyName !== 'N/A') {
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
    console.log('Returning PDF response');
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error generating presentation scorecard report:', error);
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to generate presentation report',
      details: errorMessage,
      stack: errorStack 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// For simple debugging and testing
export async function GET() {
  return new NextResponse(JSON.stringify({ status: 'Presentation PDF service is running' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 