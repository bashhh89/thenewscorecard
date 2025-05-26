'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

interface PresentationPDFButtonProps {
  onGeneratePDF: () => Promise<void>;
  isLoading: boolean;
  className?: string;
}

/**
 * PresentationPDFButton Component
 * 
 * This component renders a button that triggers the presentation-style PDF generation
 * using the WeasyPrint service.
 */
const PresentationPDFButton: React.FC<PresentationPDFButtonProps> = ({ 
  onGeneratePDF,
  isLoading,
  className = ''
}) => {
  const handleClick = async () => {
    try {
      await onGeneratePDF();
    } catch (error) {
      console.error('Error generating presentation PDF:', error);
      toast.error('Failed to generate PDF', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 py-2 px-4 font-medium rounded-md transition-colors ${className || 'bg-[#20E28F] text-[#103138] hover:bg-[#1cc47d] focus:ring-2 focus:ring-[#20E28F]/30'}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Creating Presentation...</span>
        </span>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Enhanced Presentation PDF</span>
        </>
      )}
    </button>
  );
};

export default PresentationPDFButton;
