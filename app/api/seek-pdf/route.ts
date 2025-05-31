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
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="seek-report.pdf"'
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
  const serviceUrl = process.env.WEASYPRINT_SERVICE_URL || 'http://168.231.115.219:5001/generate-pdf';
  console.log(`Using WeasyPrint service at: ${serviceUrl}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: html }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('WeasyPrint error:', await response.text());
      throw new Error('PDF conversion failed');
    }

    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error('PDF generation failed:', error);
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