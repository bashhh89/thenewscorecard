import { NextResponse } from 'next/server';
import { generateSeekHTML } from './seek-html-generator';

export async function POST(request: Request) {
  try {
    const reportData = await request.json();
    console.log('SeekPDF request data:', JSON.stringify(reportData, null, 2));
    console.log('Specific ScoreInformation:', reportData.ScoreInformation);
    console.log('FinalScore from request:', reportData.ScoreInformation?.FinalScore);
    
    if (!reportData?.FullReportMarkdown) {
      console.error('Missing FullReportMarkdown in request');
      throw new Error('Missing report content');
    }

    console.log('Generating HTML...');
    const html = await generateSeekHTML(reportData);
    
    // Validate HTML structure
    if (!html.includes('</body>') || !html.includes('</html>')) {
      throw new Error('Invalid HTML structure - missing closing tags');
    }
    
    console.log('HTML Validation:');
    console.log('  Length:', html.length, 'characters');
    console.log('  Body tag:', html.includes('<body>') ? 'Found' : 'Missing');
    console.log('  Sample Content:', html.slice(1000, 1500)); // Middle section
    
    console.log('Generating PDF...');
    const pdfBuffer = await generatePDF(html);
    console.log('PDF generated successfully, size:', pdfBuffer.byteLength, 'bytes');
    
    // Extract company name for the filename if available
    let fileName = 'seek-report.pdf';
    try {
      const companyName = reportData?.UserInformation?.CompanyName;
      if (companyName && companyName !== 'N/A') {
        const sanitizedName = companyName.replace(/[^\w\s-]/g, '').trim();
        if (sanitizedName) {
          fileName = `seek-report-${sanitizedName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        }
      }
    } catch (e) {
      console.error('Error extracting company name:', e);
    }
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
    
  } catch (error) {
    console.error('SeekPDF generation failed:', error);
    return new NextResponse(JSON.stringify({ error: 'PDF generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function generatePDF(html: string): Promise<Buffer> {
  const serviceUrl = process.env.WEASYPRINT_SERVICE_URL || 'https://sg-weasyprint.w5oak9.easypanel.host/pdf';
  console.log(`Using WeasyPrint service at: ${serviceUrl}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 180s timeout (3 minutes)
    
    try {
      // Make request to WeasyPrint service
      const response = await fetch(serviceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        body: JSON.stringify({
          html_content: html,
          pdf_options: {
            margin: {
              top: "20mm",
              right: "15mm",
              bottom: "20mm",
              left: "15mm"
            },
            format: "A4",
            landscape: false,
            preferCssPageSize: true,
            printBackground: true,
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
        signal: controller.signal
      });
      
      // Clear timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetails = "";
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch {
          errorDetails = await response.text();
        }
        
        console.error(`WeasyPrint service error (${response.status}): ${errorDetails}`);
        throw new Error(`WeasyPrint service error: ${response.status} - ${errorDetails.substring(0, 300)}`);
      }
      
      // Check if the response is actually a PDF
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/pdf')) {
        console.error(`WeasyPrint returned wrong content type: ${contentType}`);
        throw new Error(`WeasyPrint service error: Expected PDF but got ${contentType}`);
      }
      
      // Get PDF as buffer
      const pdfBuffer = await response.arrayBuffer();
      if (!pdfBuffer || pdfBuffer.byteLength === 0) {
        throw new Error("WeasyPrint service returned empty PDF");
      }
      
      console.log(`PDF generated successfully: ${pdfBuffer.byteLength} bytes`);
      return Buffer.from(pdfBuffer);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("WeasyPrint service request timed out after 3 minutes");
    }
    
    console.log('Falling back to simple PDF generation...');
    
    // Fallback: Return a simple PDF with a message
    const simplePDF = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 16 Tf
50 700 Td
(PDF Generation Service Unavailable) Tj
0 -30 Td
/F1 12 Tf
(The WeasyPrint service is not accessible.) Tj
0 -20 Td
(Please contact support for assistance.) Tj
0 -40 Td
(HTML content has been generated but could not be converted to PDF.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000308 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
560
%%EOF`;
    
    return Buffer.from(simplePDF);
  }
}
