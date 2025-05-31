import { NextResponse } from 'next/server';
import { generateScorecardHTMLv5 as generateScorecardHTML } from '@/lib/html-generation/scorecard-html-v5';

/**
 * Generate PDF using WeasyPrint service (self-hosted)
 * @param html HTML content to convert to PDF
 * @returns PDF buffer
 */
async function generatePDFWithWeasyPrint(html: string): Promise<Buffer> {
  try {
    // WeasyPrint service URL
    const weasyPrintServiceUrl = process.env.WEASYPRINT_SERVICE_URL || 'http://168.231.115.219:5001/generate-pdf';
    
    // Make request to WeasyPrint service
    const response = await fetch(weasyPrintServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
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

    if (!response.ok) {
      throw new Error(`WeasyPrint service returned ${response.status}: ${response.statusText}`);
    }

    // Get PDF as buffer
    const pdfBuffer = await response.arrayBuffer();
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF with WeasyPrint:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Get the report data from the request body
    const reportData = await request.json();
    
    // Generate HTML using the scorecard HTML generator (reusing v6 generator)
    const html = await generateScorecardHTML(reportData);
    
    // Generate PDF from HTML
    const pdfBuffer = await generatePDFWithWeasyPrint(html);
    
    // Extract company name for the filename if available
    let fileName = 'ai-scorecard-report.pdf';
    try {
      const companyName = reportData?.UserInformation?.CompanyName;
      if (companyName && companyName !== 'N/A') {
        const sanitizedName = companyName.replace(/[^\w\s-]/g, '').trim();
        if (sanitizedName) {
          fileName = `ai-scorecard-${sanitizedName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        }
      }
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
    console.error('Error generating scorecard report with WeasyPrint:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// For simple debugging and testing
export async function GET() {
  return new NextResponse(JSON.stringify({ status: 'WeasyPrint PDF service is running' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 