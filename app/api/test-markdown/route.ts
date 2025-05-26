import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Import db from firebase config
import { getDoc, doc } from 'firebase/firestore'; // Import firestore functions

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get report ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const reportId = searchParams.get('reportId');
    
    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch report data from Firestore
    const reportRef = doc(db, 'scorecardReports', reportId);
    const reportSnapshot = await getDoc(reportRef);
    
    if (!reportSnapshot.exists()) {
      return NextResponse.json(
        { error: `No report found with ID: ${reportId}` },
        { status: 404 }
      );
    }
    
    const reportData = reportSnapshot.data();
    
    // Extract the markdown content
    const markdown = reportData.FullReportMarkdown || reportData.markdown || reportData.reportMarkdown || '';
    
    // Check for the Strategic Action Plan section
    const strategicPlanMatch = markdown.match(/## Strategic Action Plan\s*([\s\S]*?)(?=##|$)/i);
    const strategicPlanContent = strategicPlanMatch ? strategicPlanMatch[1].trim() : 'Not found';
    
    // Return the results
    return NextResponse.json({
      markdownLength: markdown.length,
      markdownStart: markdown.substring(0, 100),
      containsStrategicActionPlan: markdown.includes('Strategic Action Plan'),
      containsHashStrategicActionPlan: markdown.includes('## Strategic Action Plan'),
      strategicPlanContent: strategicPlanContent,
    });
    
  } catch (error) {
    console.error('Error in test-markdown route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
