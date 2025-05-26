// Test script for the fixed scorecard API
const testData = {
  "UserInformation": {
    "Industry": "Technology",
    "UserName": "John Smith",
    "CompanyName": "TechCorp Inc",
    "Email": "john.smith@techcorp.com"
  },
  "ScoreInformation": {
    "AITier": "Enabler",
    "FinalScore": 75,
    "ReportID": "RPT-2024-001"
  },
  "QuestionAnswerHistory": [
    {
      "question": "How would you rate your organization's current AI strategy?",
      "answer": "3",
      "phaseName": "Strategy & Goals",
      "reasoningText": "We have a basic strategy in place",
      "answerType": "scale",
      "options": ["No strategy", "Basic awareness", "Developing strategy", "Comprehensive strategy", "Advanced implementation"],
      "index": 1,
      "answerSource": "user"
    },
    {
      "question": "What is your primary goal for AI implementation?",
      "answer": "Improve operational efficiency",
      "phaseName": "Strategy & Goals",
      "answerType": "text",
      "index": 2,
      "answerSource": "user"
    },
    {
      "question": "How would you describe your data quality?",
      "answer": "4",
      "phaseName": "Data Readiness",
      "answerType": "scale",
      "options": ["Poor", "Fair", "Good", "Very Good", "Excellent"],
      "index": 3,
      "answerSource": "user"
    }
  ],
  "FullReportMarkdown": `# AI Efficiency Assessment Report

## Executive Summary

Your organization, TechCorp Inc, has been assessed as an **Enabler** tier organization with a score of 75/100. This indicates that you have established foundational AI capabilities and are ready to expand your AI initiatives.

## Key Findings

### Strengths
- **Strategic Vision**: Your organization demonstrates a clear understanding of AI's potential value
- **Data Infrastructure**: Good data quality and management practices are in place
- **Leadership Support**: Management shows commitment to AI initiatives

### Areas for Improvement
- **Technical Skills**: Need to develop more specialized AI expertise
- **Process Integration**: AI workflows need better integration with existing processes
- **Measurement Framework**: Establish better metrics for AI success

## Strategic Action Plan

### Phase 1: Foundation Building (0-6 months)
1. **Skill Development**: Invest in AI training for key personnel
2. **Data Preparation**: Enhance data quality and accessibility
3. **Pilot Projects**: Launch 2-3 small-scale AI pilots

### Phase 2: Scaling (6-18 months)
1. **Technology Platform**: Implement comprehensive AI platform
2. **Process Integration**: Integrate AI into core business processes
3. **Performance Metrics**: Establish KPIs for AI initiatives

### Phase 3: Optimization (18+ months)
1. **Advanced Analytics**: Deploy sophisticated AI models
2. **Automation**: Automate routine decision-making processes
3. **Innovation**: Explore cutting-edge AI applications

## Getting Started & Resources

### Sample AI Goal-Setting Meeting Agenda
1. **Current State Assessment** (30 minutes)
   - Review existing AI initiatives
   - Identify gaps and opportunities
   
2. **Vision Setting** (45 minutes)
   - Define AI success metrics
   - Align on strategic priorities
   
3. **Action Planning** (30 minutes)
   - Assign responsibilities
   - Set timelines and milestones

### Example Prompts for AI Tools
- "Analyze customer feedback trends from the last quarter"
- "Generate a summary of key performance indicators"
- "Identify potential process improvement opportunities"

### Basic AI Data Audit Process
1. **Data Inventory**: Catalog all available data sources
2. **Quality Assessment**: Evaluate data completeness and accuracy
3. **Access Review**: Ensure proper data governance and security
4. **Gap Analysis**: Identify missing data needed for AI initiatives

## Illustrative Benchmarks

### Dabbler Tier Organizations
- Limited AI awareness and experimentation
- Ad-hoc data management practices
- Minimal AI-related investments
- Score range: 0-40

### Enabler Tier Organizations
- Established AI strategy and governance
- Good data infrastructure and quality
- Moderate AI investments and pilot projects
- Score range: 41-75

### Leader Tier Organizations
- Advanced AI capabilities and innovation
- Excellent data management and analytics
- Significant AI investments and ROI
- Score range: 76-100

## Your Personalized AI Learning Path

Based on your assessment results, we recommend the following learning sequence:

1. **AI Fundamentals** (2-4 weeks)
   - Understanding machine learning basics
   - AI use cases in your industry
   - Data requirements for AI

2. **Strategic Planning** (4-6 weeks)
   - AI strategy development
   - ROI measurement frameworks
   - Change management for AI

3. **Implementation Skills** (8-12 weeks)
   - Project management for AI initiatives
   - Vendor selection and management
   - Risk assessment and mitigation

4. **Advanced Topics** (Ongoing)
   - Emerging AI technologies
   - Ethical AI considerations
   - Industry-specific applications`
};

async function testScorecardAPI() {
  try {
    console.log('Testing Scorecard API...');
    
    const response = await fetch('http://localhost:3006/api/generate-scorecard-report-v6', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    console.log('✅ API call successful!');
    console.log(`📄 Generated HTML length: ${html.length} characters`);
    
    // Check if HTML contains expected content
    const checks = [
      { name: 'Company Name', test: html.includes('TechCorp Inc') },
      { name: 'User Name', test: html.includes('John Smith') },
      { name: 'AI Tier', test: html.includes('Enabler') },
      { name: 'Final Score', test: html.includes('75') },
      { name: 'Full Report Content', test: html.includes('Strategic Action Plan') },
      { name: 'Q&A Section', test: html.includes('Question & Answer History') },
      { name: 'Professional Styling', test: html.includes('Inter') && html.includes('--primary') }
    ];

    console.log('\n📋 Content Validation:');
    checks.forEach(check => {
      console.log(`${check.test ? '✅' : '❌'} ${check.name}`);
    });

    // Save the generated HTML for inspection
    const fs = require('fs');
    fs.writeFileSync('generated-scorecard-test.html', html);
    console.log('\n💾 Generated HTML saved as "generated-scorecard-test.html"');
    
    const allPassed = checks.every(check => check.test);
    console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed'}`);
    
    return allPassed;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testScorecardAPI().then(success => {
  process.exit(success ? 0 : 1);
});
