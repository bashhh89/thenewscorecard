const fetch = require('node-fetch');

async function testWeasyPrint() {
  const testHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test PDF</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #20E28F; }
      </style>
    </head>
    <body>
      <h1>WeasyPrint Test</h1>
      <p>This is a test PDF generated from HTML content.</p>
      <p>If you can see this, the WeasyPrint service is working correctly!</p>
    </body>
    </html>
  `;

  try {
    console.log('Testing WeasyPrint service...');
    
    const response = await fetch('http://168.231.115.219:5001/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: testHTML
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    if (response.ok) {
      const pdfBuffer = await response.buffer();
      console.log('PDF generated successfully!');
      console.log('PDF size:', pdfBuffer.length, 'bytes');
      
      // Save the test PDF
      const fs = require('fs');
      fs.writeFileSync('test-weasyprint-output.pdf', pdfBuffer);
      console.log('Test PDF saved as test-weasyprint-output.pdf');
    } else {
      const errorText = await response.text();
      console.error('Error:', response.status, errorText);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testWeasyPrint(); 