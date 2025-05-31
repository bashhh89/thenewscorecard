const fetch = require('node-fetch');

async function testScorecardPDF() {
  // Sample scorecard data
  const testData = {
    "UserInformation": {
      "Industry": "Property/Real Estate",
      "UserName": "Test User",
      "CompanyName": "Test Company",
      "Email": "test@example.com"
    },
    "ScoreInformation": {
      "AITier": "Dabbler",
      "FinalScore": 25,
      "ReportID": "TEST123"
    },
    "QuestionAnswerHistory": [
      {
        "question": "How would you describe your organization's current use of AI tools?",
        "answer": "We are just beginning to explore AI tools",
        "phaseName": "Current AI Usage",
        "answerType": "radio"
      },
      {
        "question": "What is your primary goal for implementing AI?",
        "answer": "Improve efficiency and productivity",
        "phaseName": "AI Goals",
        "answerType": "radio"
      }
    ],
    "FullReportMarkdown": `## Overall Tier: Dabbler

As a Dabbler, your organization is at the beginning of its AI journey. You're exploring AI tools and understanding their potential, but haven't yet implemented comprehensive AI strategies.

### Key Strengths
- Willingness to explore new technologies
- Recognition of AI's potential value
- Open mindset towards innovation

### Areas for Improvement
- Limited AI implementation experience
- Need for structured AI strategy
- Lack of dedicated AI resources

### Strategic Action Plan
1. **Start Small**: Begin with simple AI tools for specific tasks
2. **Build Knowledge**: Invest in AI education for your team
3. **Develop Strategy**: Create a roadmap for AI implementation
4. **Measure Progress**: Set clear metrics for AI success

### Next Steps
Focus on building foundational AI knowledge and implementing your first AI tools in low-risk areas of your business.`
  };

  try {
    console.log('Testing scorecard PDF generation...');
    
    const response = await fetch('http://localhost:3006/api/generate-scorecard-weasyprint-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    if (response.ok) {
      const pdfBuffer = await response.buffer();
      console.log('Scorecard PDF generated successfully!');
      console.log('PDF size:', pdfBuffer.length, 'bytes');
      
      // Save the test PDF
      const fs = require('fs');
      fs.writeFileSync('test-scorecard-output.pdf', pdfBuffer);
      console.log('Test scorecard PDF saved as test-scorecard-output.pdf');
    } else {
      const errorText = await response.text();
      console.error('Error:', response.status, errorText);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testScorecardPDF(); 