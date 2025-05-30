'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface SeekPDFButtonProps {
  scorecardData: any; // Simplified type
  className?: string;
  children: React.ReactNode;
}

const SeekPDFButton: React.FC<SeekPDFButtonProps> = ({
  scorecardData,
  children,
  className = 'bg-gradient-to-r from-[#008080] to-[#20B2AA] text-white hover:from-[#006666] hover:to-[#188F8F] border-2 border-[#008080] focus:ring-2 focus:ring-[#008080]/50'
}) => {
  return (
    <Button
      onClick={async () => {
        console.log('SeekPDFButton scorecardData:', JSON.stringify(scorecardData, null, 2));
        console.log('Specific finalScore value:', scorecardData.finalScore, 'Type:', typeof scorecardData.finalScore);
        try {
          // Transform the data to match the expected format
          const transformedData = {
            UserInformation: {
              UserName: scorecardData.userName || 'User',
              CompanyName: scorecardData.userCompany || 'Company', // Corrected to use userCompany
              Email: scorecardData.userEmail || 'N/A',
              Industry: scorecardData.userIndustry || 'Unknown'
            },
            ScoreInformation: {
              AITier: scorecardData.userTier || 'Unknown',
              FinalScore: scorecardData.finalScore !== null && scorecardData.finalScore !== undefined ? scorecardData.finalScore : 0,
              ReportID: scorecardData.reportId || 'unknown'
            },
            FullReportMarkdown: scorecardData.reportMarkdown || '',
            questionAnswerHistory: scorecardData.questionAnswerHistory || [],
            strengths: scorecardData.strengths || [],
            weaknesses: scorecardData.weaknesses || [],
            actionItems: scorecardData.actionItems || []
          };
          
          console.log('Transformed data for API:', JSON.stringify(transformedData, null, 2));
          
          const response = await fetch('/api/seek-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transformedData),
          });

          if (!response.ok) throw new Error('PDF generation failed');
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `seek-report-${Date.now()}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error('SeekPDF error:', error);
          alert('Failed to generate PDF. Please try again.');
        }
      }}
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${className}`}
    >
      {children}
    </Button>
  );
};

export default SeekPDFButton;
