import { NextResponse } from 'next/server';
import { generate } from '@pdfme/generator';
import { Template } from '@pdfme/common';
// import * as fs from 'fs'; // No longer needed
// import * as path from 'path'; // No longer needed

/**
 * PDFMe template-based PDF generator
 * This provides an alternative to the WeasyPrint approach with better design control
 */
export async function POST(request: Request) {
  console.log('Starting PDFMe template-based PDF generation');

  try {
    // Safely get the report data from the request body
    let reportData;
    try {
      const text = await request.text();
       if (!text) {
        throw new Error('Request body is empty');
      }
      reportData = JSON.parse(text);
      console.log('Successfully parsed JSON from request');
    } catch (e) {
      console.error('Failed to parse request body:', e);
      throw new Error('Invalid JSON in request body: ' + (e instanceof Error ? e.message : String(e)));
    }

    // Validate essential data
    if (!reportData) {
      throw new Error('No report data provided after parsing');
    }

    console.log('Received report data for PDFMe template with structure:', Object.keys(reportData).join(', '));

    // Ensure required fields exist with fallbacks
    const validatedData = { // Consider a Zod schema for robust validation
      UserInformation: {
        UserName: reportData.UserInformation?.UserName || 'User',
        CompanyName: reportData.UserInformation?.CompanyName || 'Company',
        Email: reportData.UserInformation?.Email || '',
        Industry: reportData.UserInformation?.Industry || 'General Business'
      },
      ScoreInformation: {
        AITier: reportData.ScoreInformation?.AITier || 'Enabler',
        FinalScore: reportData.ScoreInformation?.FinalScore || null,
        ReportID: reportData.ScoreInformation?.ReportID || `REPORT-${Date.now()}`
      },
      FullReportMarkdown: reportData.FullReportMarkdown || ''
    };

    // Extract strengths from the report markdown
    const strengths = extractStrengths(validatedData.FullReportMarkdown);

    // Extract weaknesses from the report markdown
    const weaknesses = extractWeaknesses(validatedData.FullReportMarkdown);

    // Create the inputs data for our template
    // Ensure all expected template fields are populated
    const inputs = [{
      companyName: validatedData.UserInformation.CompanyName,
      reportId: validatedData.ScoreInformation.ReportID,
      userName: validatedData.UserInformation.UserName,
      industry: validatedData.UserInformation.Industry,
      aiTier: validatedData.ScoreInformation.AITier,
      date: new Date().toLocaleDateString(),
      // Provide fallbacks for strengths/weaknesses in inputs
      strength1: strengths[0] || '',
      strength2: strengths[1] || '',
      strength3: strengths[2] || '',
      weakness1: weaknesses[0] || '',
      weakness2: weaknesses[1] || '',
      weakness3: weaknesses[2] || '',
      // Add other template fields as needed
    }];

    // Define a simple PDF template
    // This should match the schema expected by the PDFMe generator
    const template: Template = {
      basePdf: await getBasePdfTemplate(), // Assuming getBasePdfTemplate fetches a base PDF as Uint8Array
      schemas: [
        // Example schema definition - ADJUST THIS TO MATCH YOUR ACTUAL TEMPLATE SCHEMA
        {
          companyName: {
            type: 'text',
            position: { x: 50, y: 50 },
            width: 100,
            height: 10,
            // fontName: 'Helvetica', // Specify font if needed and included in vfs
          },
          reportId: {
             type: 'text',
             position: { x: 50, y: 70 },
             width: 100,
             height: 10,
           },
           userName: {
             type: 'text',
             position: { x: 50, y: 90 },
             width: 100,
             height: 10,
           },
           aiTier: {
              type: 'text',
              position: { x: 50, y: 110 },
              width: 100,
              height: 10,
            },
           strength1: {
               type: 'text',
               position: { x: 50, y: 130 },
               width: 150,
               height: 10,
             },
             weakness1: {
                type: 'text',
                position: { x: 50, y: 150 },
                width: 150,
                height: 10,
              },
        } as any, // Use 'any' temporarily if schema is complex and doesn't match simple type
      ],
    };

    // Generate PDF
    console.log('Generating PDF with PDFMe');
    console.log('Template schemas count:', template.schemas.length);
    // console.log('Inputs data:', inputs); // Log inputs for debugging

    const pdf = await generate({ template, inputs });

    // Extract company name for the filename if available
    let fileName = 'ai-scorecard-pdfme.pdf';
    try {
      const companyName = validatedData.UserInformation.CompanyName;
      if (companyName && companyName !== 'N/A' && companyName !== 'Company') {
        const sanitizedName = companyName.replace(/[^\w\s-]/g, '').trim();
        if (sanitizedName) {
          fileName = `ai-scorecard-pdfme-${sanitizedName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        }
      }
      console.log(`Using filename: ${fileName}`);
    } catch (e) {
      console.error('Error extracting company name:', e);
    }

    // Return the PDF
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`, // Include filename in header
      },
    });
  } catch (error) {
    console.error('Error generating PDF with PDFMe:', error);

    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(JSON.stringify({
      error: 'Failed to generate PDF with PDFMe',
      details: errorMessage
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * Gets a base PDF template file
 * This needs to be a real PDF file loaded as Uint8Array or ArrayBuffer
 * You might need to use 'fs' module or fetch the PDF depending on your setup
 */
async function getBasePdfTemplate(): Promise<Uint8Array> {
  // *** IMPORTANT: Replace this with actual loading of your base PDF template file ***
  // Example: Loading a blank PDF from a base64 string (replace with your actual blank PDF base64)
   const blankPdfBase64 = 'JVBERi0xLjcKJb/3ov4KMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFsgMyAwIFIgNSAwIFIgXSAvQ291bnQgMiA+PgplbmRvYmoKMyAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9SZXNvdXJjZXMgPDwgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0gPj4gL01lZGlhQm94IFswIDAgNTk1LjI3NiA4NDEuODldIC9Db250ZW50cyA0IDAgUiA+PgplbmRvYmoKNCAwIG9iago8PCAvTGVuZ3RoIDAgPj4Kc3RyZWFtCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9SZXNvdXJjZXMgPDwgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0gPj4gL01lZGlhQm94IFswIDAgNTk1LjI3NiA4NDEuODldIC9Db250ZW50cyA2IDAgUiA+PgplbmRvYmoKNjAgMCBvYmoKPDwgL0xlbmd0aCAwID4+CnN0cmVhbQplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMzMgMDAwMDAgbiAKMDAwMDAwMjg4IDAwMDAwIG4gCjAwMDAwMDAzMDcgMDAwMDAgbiAKMDAwMDAwMDQ2MiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDcgL1Jvb3QgMSAwIFIgL0luZm8gPDwgL1Byb2R1Y2VyIChwd2RnZW4pID4+ID4+CnN0YXJ0eHJlZgo0ODMKJSVFT0YK'; // This is a minimal blank PDF base64
  return Buffer.from(blankPdfBase64, 'base64');
}

/**
 * Extract strengths from the FullReportMarkdown
 */
function extractStrengths(markdownContent: string): string[] {
  if (!markdownContent) return [];

  console.log('Extracting strengths from markdown content');

  // Look for strengths section
  const keyFindingsMatch = markdownContent.match(/## Key Findings([\s\S]*?)(?=##|$)/i);
  if (!keyFindingsMatch) return [];

  // Find strengths text
  const strengthsMatch = keyFindingsMatch[1].match(/\*\*Strengths:\*\*([\s\S]*?)(?=\*\*Weaknesses|$)/i);
  if (!strengthsMatch) return [];

  // Extract bullet points
  const strengthContent = strengthsMatch[1].trim();
  let bulletPoints = strengthContent.split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(point => point.replace(/^-\s*/, '').trim())
    .filter(point => point.length > 0);

  console.log(`Found ${bulletPoints.length} strengths in the markdown`);

  // Default strengths if none were found or too few
  if (bulletPoints.length < 3) {
    const defaultStrengths = [
      'Initiative in exploring AI technologies',
      'Adoption of basic AI tools',
      'Commitment to data privacy and security'
    ];

    // Fill in any missing points with defaults
    while (bulletPoints.length < 3) {
      bulletPoints.push(defaultStrengths[bulletPoints.length]);
    }
  }

  return bulletPoints;
}

/**
 * Extract weaknesses from the FullReportMarkdown
 */
function extractWeaknesses(markdownContent: string): string[] {
  if (!markdownContent) return [];

  console.log('Extracting weaknesses from markdown content');

  // Look for key findings section
  const keyFindingsMatch = markdownContent.match(/## Key Findings([\s\S]*?)(?=##|$)/i);
  if (!keyFindingsMatch) return [];

  // Find weaknesses text
  const weaknessesMatch = keyFindingsMatch[1].match(/\*\*Weaknesses:\*\*([\s\S]*?)(?=##|$)/i);
  if (!weaknessesMatch) return [];

  // Extract bullet points
  const weaknessContent = weaknessesMatch[1].trim();
  let bulletPoints = weaknessContent.split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(point => point.replace(/^-\s*/, '').trim())
    .filter(point => point.length > 0);

  console.log(`Found ${bulletPoints.length} weaknesses in the markdown`);

  // Default weaknesses if none were found or too few
  if (bulletPoints.length < 3) {
    const defaultWeaknesses = [
      'Need for a unified AI strategy',
      'Data quality and integration challenges',
      'Limited AI expertise across teams'
    ];

    // Fill in any missing points with defaults
    while (bulletPoints.length < 3) {
      bulletPoints.push(defaultWeaknesses[bulletPoints.length]);
    }
  }

  return bulletPoints;
}

// Simple GET handler for testing
export async function GET() {
  return new NextResponse(JSON.stringify({
    status: 'ready',
    message: 'PDFMe template-based PDF generator is ready. Use POST method to generate a PDF.'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 