// Test script for SeekPDF API
const testSeekPDF = async () => {
  try {
    console.log('Testing SeekPDF API...');
    
    const testData = {
      UserInformation: {
        UserName: 'Test User',
        CompanyName: 'Test Company',
        Email: 'test@example.com',
        Industry: 'Technology'
      },
      ScoreInformation: {
        AITier: 'Leader',
        FinalScore: 85,
        ReportID: 'test-123'
      },
      FullReportMarkdown: `# AI Efficiency Scorecard Report

## Overall Tier: Leader

You are at the **Leader** tier of AI maturity.

## Key Findings

### Strengths
- Strong AI implementation
- Good data governance
- Excellent team skills

### Areas for Improvement
- Need more automation
- Better integration required
- Scale AI initiatives

## Recommendations
1. Expand AI usage across departments
2. Invest in advanced AI tools
3. Build AI center of excellence
`,
      questionAnswerHistory: [],
      strengths: ['Strong AI implementation', 'Good data governance'],
      weaknesses: ['Need more automation', 'Better integration required'],
      actionItems: ['Expand AI usage', 'Invest in tools', 'Build CoE']
    };
    
    console.log('Sending request to /api/seek-pdf-test...');
    const response = await fetch('http://localhost:3006/api/seek-pdf-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const blob = await response.blob();
    console.log('PDF blob size:', blob.size, 'bytes');
    console.log('PDF blob type:', blob.type);
    
    // Save the PDF to check if it's valid
    const fs = require('fs');
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync('test-seek-output.pdf', buffer);
    console.log('PDF saved as test-seek-output.pdf');
    
    // Check if it's a valid PDF by looking at the header
    const header = buffer.toString('utf8', 0, 5);
    console.log('PDF header:', header);
    if (header === '%PDF-') {
      console.log('✓ Valid PDF file detected');
    } else {
      console.log('✗ Invalid PDF file - header does not match PDF format');
      console.log('First 100 bytes:', buffer.toString('utf8', 0, 100));
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testSeekPDF();