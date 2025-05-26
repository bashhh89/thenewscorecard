import { NextResponse } from 'next/server';

/**
 * Simple WeasyPrint test endpoint to verify connectivity
 */
export async function GET() {
  console.log('Testing WeasyPrint service connectivity');
  
  try {
    // WeasyPrint service URL
    const weasyPrintServiceUrl = process.env.WEASYPRINT_SERVICE_URL || 'http://168.231.86.114:5001/generate-pdf';
    console.log(`Using WeasyPrint service at: ${weasyPrintServiceUrl}`);
    
    // Minimal HTML to test with
    const testHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WeasyPrint Test</title>
        <style>
          body { font-family: sans-serif; margin: 20px; }
          h1 { color: #01579b; }
        </style>
      </head>
      <body>
        <h1>WeasyPrint Test Document</h1>
        <p>This is a simple test document to verify WeasyPrint connectivity.</p>
        <p>Generated at: ${new Date().toISOString()}</p>
      </body>
      </html>
    `;
    
    // Try to make a simple request to generate a test PDF
    console.log('Sending simple test request to WeasyPrint service...');
    const response = await fetch(weasyPrintServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: testHtml,
        options: {
          presentational_hints: true
        }
      }),
    });
    
    console.log(`WeasyPrint test response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(e => 'Could not read error response');
      console.error(`WeasyPrint service test error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      
      return new NextResponse(JSON.stringify({ 
        status: 'error', 
        message: `WeasyPrint service returned ${response.status}: ${response.statusText}`,
        details: errorText
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // If we get here, the service is responding
    // Get PDF as buffer
    const pdfBuffer = await response.arrayBuffer();
    console.log(`Generated test PDF size: ${pdfBuffer.byteLength} bytes`);
    
    // Option 1: Return status only
    /*
    return new NextResponse(JSON.stringify({ 
      status: 'success', 
      message: 'WeasyPrint service is working correctly',
      pdfSize: pdfBuffer.byteLength
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    */
    
    // Option 2: Return the actual PDF for inspection
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="weasyprint-test.pdf"',
      },
    });
    
  } catch (error) {
    console.error('Error testing WeasyPrint service:', error);
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return new NextResponse(JSON.stringify({ 
      status: 'error', 
      message: 'Failed to connect to WeasyPrint service',
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