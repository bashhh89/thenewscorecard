'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LocalPDFButtonProps {
  scorecardData: any;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
}

export function LocalPDFButton({ 
  scorecardData, 
  className, 
  variant = 'default',
  size = 'default',
  disabled = false 
}: LocalPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (!scorecardData) {
      toast.error('No scorecard data available');
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Starting local PDF generation...');
      
      const response = await fetch('/api/generate-scorecard-pdf-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scorecardData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || 'ai-scorecard-report.pdf';
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGeneratePDF}
      disabled={disabled || isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Generating...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </>
      )}
    </Button>
  );
}
