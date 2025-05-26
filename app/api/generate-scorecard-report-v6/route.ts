import { NextResponse } from 'next/server';
import { generateScorecardHTML } from './scorecard-html-generator-fixed';

// Handle GET requests - redirect to preview page
export async function GET(request: Request) {
  return NextResponse.redirect(new URL('/scorecard-preview-v6', request.url));
}

export async function POST(request: Request) {
  try {
    // Get the report data from the request body
    const reportData = await request.json();
    
    // Generate HTML using the scorecard HTML generator
    const html = await generateScorecardHTML(reportData);
    
    // Return the generated HTML
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating scorecard report:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Example usage for testing:
// 
// POST to /api/generate-scorecard-report-v6 with body:
// {
//   "report_title": "AI Efficiency Scorecard",
//   "report_subject_name": "Company XYZ",
//   "report_description": "A comprehensive assessment of AI effectiveness and strategic opportunities",
//   "report_author": "AI Strategy Team",
//   "header_image_url": "https://example.com/image.jpg",
//   "header_banner_text": "Confidential Assessment Report",
//   "section1_title": "Key Strengths in AI Adoption",
//   "section1_items": [
//     {
//       "title": "Strength 1",
//       "description": "Description of strength 1"
//     },
//     {
//       "title": "Strength 2",
//       "description": "Description of strength 2"
//     }
//   ],
//   "section1_banner_text": "Build on these strengths for continued success",
//   "section2_title": "Challenges and Weaknesses",
//   "section2_items": [
//     {
//       "title": "Challenge 1",
//       "description": "Description of challenge 1"
//     },
//     {
//       "title": "Challenge 2",
//       "description": "Description of challenge 2"
//     },
//     {
//       "title": "Challenge 3",
//       "description": "Description of challenge 3"
//     }
//   ],
//   "section2_banner_text": "Address these challenges to improve AI efficiency",
//   "section3_title": "Strategic Action Plan Overview",
//   "section3_items": [
//     {
//       "number": 1,
//       "title": "Action 1",
//       "description": "Description of action 1"
//     },
//     {
//       "number": 2,
//       "title": "Action 2",
//       "description": "Description of action 2"
//     },
//     {
//       "number": 3,
//       "title": "Action 3",
//       "description": "Description of action 3"
//     }
//   ],
//   "section3_banner_text": "Implement these actions for optimal results",
//   "footer_text": "© 2023 AI Efficiency Assessment Team | Report ID: ABC123"
// } 