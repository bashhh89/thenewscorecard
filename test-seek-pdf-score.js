const fs = require('fs');

async function testSeekPDF() {
  const testData = {
    UserInformation: {
      UserName: "Ahmad Basheer",
      CompanyName: "QanDu.io",
      Email: "ahmadbasheerr@gmail.com",
      Industry: "Property/Real Estate"
    },
    ScoreInformation: {
      AITier: "Dabbler",
      FinalScore: 45,
      ReportID: "pWx86IcHxD5ZL9JBJY33"
    },
    FullReportMarkdown: `## Overall Tier: Dabbler
Final Score: 45/100

## Key Findings

**Strengths:**
- Initiative in Exploring AI
- Awareness of AI's Potential
- Basic AI Application in Tools

**Weaknesses:**
- Lack of Formal AI Strategy
- Data Quality and Integration Issues
- Governance and Measurement Challenges`,
    questionAnswerHistory: [],
    strengths: ["Initiative in Exploring AI", "Awareness of AI's Potential", "Basic AI Application in Tools"],
    weaknesses: ["Lack of Formal AI Strategy", "Data Quality and Integration Issues", "Governance and Measurement Challenges"],
    actionItems: ["Develop a Formal AI Strategy", "Improve Data Quality and Integration", "Strengthen AI Governance and Measurement"]
  };

  console.log('Testing SeekPDF with score:', testData.ScoreInformation.FinalScore);
  console.log('Full test data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/seek-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    fs.writeFileSync('test-seek-pdf-score.pdf', Buffer.from(pdfBuffer));
    console.log('PDF saved as test-seek-pdf-score.pdf');
    console.log('PDF size:', pdfBuffer.byteLength, 'bytes');
  } catch (error) {
    console.error('Error:', error);
  }
}

testSeekPDF();