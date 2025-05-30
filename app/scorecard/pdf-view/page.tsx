'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ScorecardPDFDocument from '@/components/ui/pdf-download/ScorecardPDFDocument';

// Dynamically import PDF components with proper ESM handling
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => ({
    default: mod.PDFDownloadLink
  })),
  { ssr: false }
);

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(mod => ({
    default: mod.PDFViewer
  })),
  { ssr: false }
);

export default function PDFViewPage() {
  const searchParams = useSearchParams();
  const reportId = searchParams?.get('reportId');
  
  const [isClient, setIsClient] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    if (reportId) {
      fetchReportData();
    } else {
      setError('No reportId provided');
      setLoading(false);
    }
  }, [reportId]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/scorecard-ai/get-report?reportId=${reportId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Prepare the data for the PDF component
      setReportData({
        reportId,
        ...data,
        // Set defaults for missing fields
        reportMarkdown: data.reportMarkdown || '# Report Content\n\nNo content available.',
        questionAnswerHistory: data.questionAnswerHistory || []
      });
      
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Failed to fetch report data');
      tryLocalStorageFallback();
    } finally {
      setLoading(false);
    }
  };
  
  // Try to get data from localStorage as fallback
  const tryLocalStorageFallback = () => {
    if (typeof window !== 'undefined') {
      try {
        const reportMarkdown = localStorage.getItem('reportMarkdown');
        const questionAnswerHistory = localStorage.getItem('questionAnswerHistory');
        const userAITier = localStorage.getItem('userAITier') || localStorage.getItem('tier');
        const userName = localStorage.getItem('userName') || localStorage.getItem('leadName');
        
        if (reportMarkdown) {
          console.log('Using localStorage data as fallback for PDF generation');
          setReportData({
            reportId: reportId || 'fallback',
            reportMarkdown,
            questionAnswerHistory: questionAnswerHistory ? JSON.parse(questionAnswerHistory) : [],
            userAITier,
            userName,
            timestamp: new Date().toISOString()
          });
          setError(null);
        }
      } catch (err) {
        console.error('Error using localStorage fallback:', err);
      }
    }
  };

  // Determine PDF filename
  const getPdfFilename = () => {
    const nameSegment = reportData?.leadName || reportData?.userName || 'Report';
    const sanitizedName = nameSegment.replace(/[^a-z0-9]/gi, '_');
    return `AI_Efficiency_Scorecard_${reportId || 'Report'}_${sanitizedName}.pdf`;
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <p>Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">AI Efficiency Scorecard PDF</h1>
        
        {loading ? (
          <div className="flex justify-center p-8 bg-white rounded-lg shadow-md">
            <p>Loading report data...</p>
          </div>
        ) : error && !reportData ? (
          <div className="p-8 bg-white rounded-lg shadow-md">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <a 
              href="/scorecard" 
              className="bg-brand-deep-teal hover:bg-brand-deep-teal/90 text-white px-4 py-2 rounded-md"
            >
              Back to Scorecard
            </a>
          </div>
        ) : reportData ? (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="font-semibold">
                  {reportData.leadName || reportData.userName || 'Scorecard Report'}
                </h2>
                {reportData.leadCompany || reportData.companyName ? (
                  <p className="text-sm text-gray-600">
                    {reportData.leadCompany || reportData.companyName}
                  </p>
                ) : null}
              </div>
              
              {/* Download button */}
              <div>
                {isClient && reportData && (
                  <PDFDownloadLink
                    document={<ScorecardPDFDocument reportData={reportData} />}
                    fileName={getPdfFilename()}
                    className="bg-brand-deep-teal hover:bg-brand-deep-teal/90 text-white px-4 py-2 rounded-md text-sm"
                  >
                    {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
                  </PDFDownloadLink>
                )}
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="w-full h-[80vh] border border-gray-300 bg-white rounded-lg shadow-md">
              {isClient && reportData && (
                <PDFViewer width="100%" height="100%" style={{border: 'none'}}>
                  <ScorecardPDFDocument reportData={reportData} />
                </PDFViewer>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 