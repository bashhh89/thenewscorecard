import { NextRequest, NextResponse } from 'next/server';
import { generateScorecardDocumentDefinition } from '@/lib/pdf-generation/scorecard-pdf-v2';
import PdfPrinter from 'pdfmake';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Font configuration for pdfmake
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
  PlusJakartaSans: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  }
};

/**
 * Generate PDF using local pdfmake library
 * @param scorecardData Scorecard data to generate PDF from
 * @returns PDF buffer
 */
async function generatePDFWithPdfMake(scorecardData: any): Promise<Buffer> {
  try {
    const printer = new PdfPrinter(fonts);
    const docDefinition = generateScorecardDocumentDefinition(scorecardData);
    
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      
      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      
      pdfDoc.on('error', (error) => {
        reject(error);
      });
      
      pdfDoc.end();
    });
  } catch (error) {
    console.error('Error generating PDF with pdfmake:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scorecardData } = body;

    if (!scorecardData) {
      return NextResponse.json(
        { error: 'Missing scorecard data' },
        { status: 400 }
      );
    }

    // Validate required data structure
    if (!scorecardData.UserInformation || !scorecardData.ScoreInformation || !scorecardData.FullReportMarkdown) {
      return NextResponse.json(
        { error: 'Invalid scorecard data structure' },
        { status: 400 }
      );
    }

    console.log('Generating PDF with local pdfmake...');
    const pdfBuffer = await generatePDFWithPdfMake(scorecardData);
    
    console.log('PDF generated successfully, size:', pdfBuffer.byteLength, 'bytes');

    // Extract company name for the filename if available
    const companyName = scorecardData.UserInformation?.CompanyName || '';
    const sanitizedName = companyName.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    let fileName = 'ai-scorecard-report.pdf';
    if (sanitizedName) {
      fileName = `ai-scorecard-${sanitizedName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    }

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error in PDF generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'Local PDF generation endpoint available',
    method: 'POST',
    requiredBody: {
      scorecardData: {
        UserInformation: { /* user data */ },
        ScoreInformation: { /* score data */ },
        FullReportMarkdown: '/* report markdown */',
        QuestionAnswerHistory: [/* Q&A data */]
      }
    }
  });
}
