'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WeasyprintPDFButtonProps {
  reportId?: string;
  scorecardData?: any;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  children?: React.ReactNode;
}

/**
 * Button component for downloading AI Efficiency Scorecard PDF reports
 * using the WeasyPrint implementation.
 */
export default function WeasyprintPDFButton({
  reportId,
  scorecardData,
  className,
  size = 'default',
  children
}: WeasyprintPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      // If we have reportId, use the GET endpoint
      if (reportId) {
        const response = await fetch(`/api/generate-scorecard-weasyprint-report/download-pdf?reportId=${reportId}`);
        
        if (!response.ok) {
          let errorMessage = 'Failed to generate PDF';
          
          // Try to parse error as JSON, but handle cases where API returns HTML
          try {
            // Check content type first
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              
              // Check for specific error messages that might indicate connection issues
              if (errorData.details && typeof errorData.details === 'string' && 
                  (errorData.details.includes('ECONNREFUSED') || 
                   errorData.details.includes('WeasyPrint service'))) {
                throw new Error('PDF service is currently unavailable. Please try again later.');
              }
              
              errorMessage = errorData.error || errorMessage;
            } else {
              // For non-JSON responses, use status text or a generic message
              errorMessage = response.statusText || `Server error: ${response.status}`;
            }
          } catch (parseError) {
            // If parsing fails, use status code in error message
            console.error('Error parsing error response:', parseError);
            errorMessage = `Server error: ${response.status}`;
          }
          
          throw new Error(errorMessage);
        }
        
        const pdfBlob = await response.blob();
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-scorecard-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('PDF Downloaded', {
          description: 'Your AI Efficiency Scorecard PDF has been downloaded.',
        });
      }
      // If we have scorecardData, use the POST endpoint
      else if (scorecardData) {
        const response = await fetch('/api/generate-scorecard-weasyprint-report/download-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scorecardData),
        });
        
        if (!response.ok) {
          let errorMessage = 'Failed to generate PDF';
          
          // Try to parse error as JSON, but handle cases where API returns HTML
          try {
            // Check content type first
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              
              // Check for specific error messages that might indicate connection issues
              if (errorData.details && typeof errorData.details === 'string' && 
                  (errorData.details.includes('ECONNREFUSED') || 
                   errorData.details.includes('WeasyPrint service'))) {
                throw new Error('PDF service is currently unavailable. Please try again later.');
              }
              
              errorMessage = errorData.error || errorMessage;
            } else {
              // For non-JSON responses, use status text or a generic message
              errorMessage = response.statusText || `Server error: ${response.status}`;
              
              // If we get a 404 Not Found, provide a clearer message
              if (response.status === 404) {
                errorMessage = 'PDF generation service endpoint not found. Please contact support.';
              }
            }
          } catch (parseError) {
            // If parsing fails, use status code in error message
            console.error('Error parsing error response:', parseError);
            errorMessage = `Server error: ${response.status}`;
          }
          
          throw new Error(errorMessage);
        }
        
        const pdfBlob = await response.blob();
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-scorecard-report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('PDF Downloaded', {
          description: 'Your AI Efficiency Scorecard PDF has been downloaded.',
        });
      }
      // If neither reportId nor scorecardData is provided, show an error
      else {
        throw new Error('Either reportId or scorecardData must be provided');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Check for connection-related errors in the error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to download PDF';
      if (errorMessage.includes('ECONNREFUSED') || 
          errorMessage.includes('connection') || 
          errorMessage.includes('service')) {
        toast.error('PDF Service Unavailable', {
          description: 'The PDF generation service is currently unavailable. Please try again later or contact support.',
        });
      } else {
        toast.error('Download Failed', {
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className={cn(
        'flex items-center justify-center px-4 py-2 font-medium rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        // Apply variant styles based on className prop or default
        className || 'bg-blue-600 text-white hover:bg-blue-700', // Example default styles
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-lg'
      )}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </>
      ) : children || (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Report
        </>
      )}
    </Button>
  );
} 