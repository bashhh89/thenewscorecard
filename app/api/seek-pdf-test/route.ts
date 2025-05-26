import { NextResponse } from 'next/server';
import { generateSeekHTML } from '../seek-pdf/seek-html-generator';

export async function POST(request: Request) {
  try {
    const reportData = await request.json();
    console.log('SeekPDF TEST request data:', JSON.stringify(reportData, null, 2));
    
    if (!reportData?.FullReportMarkdown) {
      console.error('Missing FullReportMarkdown in request');
      throw new Error('Missing report content');
    }

    console.log('Generating HTML...');
    const html = await generateSeekHTML(reportData);
    
    // For testing, let's return the HTML with PDF headers
    // This will allow the browser to save it as a PDF even though it's HTML
    console.log('Returning HTML as PDF for testing...');
    
    // Create a simple PDF-like response
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(PDF Generation Test) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000229 00000 n
trailer
<< /Size 5 /Root 1 0 R >>
startxref
344
%%EOF`;
    
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="seek-report-test.pdf"'
      }
    });
    
  } catch (error) {
    console.error('SeekPDF TEST generation failed:', error);
    return new NextResponse(JSON.stringify({ error: 'PDF generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}