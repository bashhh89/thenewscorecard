'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { Loader } from '@/components/learning-hub/loader';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ToastProvider, useToast, Toaster } from '@/components/ui/toast-provider';
import PresentationPDFButton from '@/components/ui/pdf-download/PresentationPDFButton';
import SeekPDFButton from '@/components/ui/pdf-download/SeekPDFButton';
import { toast as sonnerToast } from 'sonner';

// Import all section components
import { 
  DetailedAnalysisSection 
} from '@/components/scorecard/sections/SectionComponents';

// Import enhanced section components
import KeyFindingsSection from '@/components/scorecard/sections/KeyFindingsSection';
import { StrategicActionPlanSection } from '@/components/scorecard/sections/StrategicActionPlanSection';
import { BenchmarksSection } from '@/components/scorecard/sections/BenchmarksSection';
import { QAndASection } from '@/components/scorecard/sections/QAndASection';
import { LearningPathSection } from '@/components/scorecard/sections/LearningPathSection';

// Import lead capture component
import LeadCaptureForm from '@/components/scorecard/LeadCaptureForm';

// Add import for the WeasyPrint PDF button
import WeasyprintPDFButton from '@/components/ui/pdf-download/WeasyprintPDFButton';

// Client color palette
const colors = {
  brightGreen: '#20E28F',
  darkTeal: '#103138',
  white: '#FFFFFF',
  lightMint: '#F3FDF5',
  orange: '#FE7F01',
  yellow: '#FEC401',
  lightBlue: '#01CEFE',
  cream1: '#FFF9F2',
  cream2: '#FFFCF2',
  lightBlueShade: '#F5FDFF'
};

// Define SectionName type
type SectionName = 'Overall Tier' | 'Key Findings' | 'Recommendations' | 'Strategic Action Plan' | 'Detailed Analysis' | 'Benchmarks' | 'Assessment Q&A' | 'Learning Path';

// Define SectionRefs interface with correct syntax
interface SectionRefs {
  [key: string]: React.RefObject<HTMLDivElement>;
}

interface NewResultsPageProps {
  initialUserName?: string | null;
}

export default function NewResultsPage({ initialUserName }: NewResultsPageProps = {}) {
  // State variables
  const [activeTab, setActiveTab] = useState('Overall Tier');
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [questionAnswerHistory, setQuestionAnswerHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(initialUserName || null);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [userIndustry, setUserIndustry] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isPresentationPdfLoading, setIsPresentationPdfLoading] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<string | null>(null); // Add state for company name
  const [processedReportMarkdown, setProcessedReportMarkdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items for both desktop and mobile
  const navigationItems = [
    {
      id: 'Overall Tier',
      label: 'Overall Tier',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 7L12 12L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'Key Findings',
      label: 'Key Findings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 10.5L11 12.5L15.5 8M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'Recommendations',
      label: 'Recommendations',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'Strategic Action Plan',
      label: 'Strategic Action Plan',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 9H16M12 13H16M12 17H16M6 13V21M2 5H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'Detailed Analysis',
      label: 'Detailed Analysis',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 9H6M15.5 11C13.567 11 12 9.433 12 7.5C12 5.567 13.567 4 15.5 4C17.433 4 19 5.567 19 7.5C19 9.433 17.433 11 15.5 11ZM6.5 21C4.567 21 3 19.433 3 17.5C3 15.567 4.567 14 6.5 14C8.433 14 10 15.567 10 17.5C10 19.433 8.433 21 6.5 21ZM18 16.5H14M18 19.5H14M6 6L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'Benchmarks',
      label: 'Illustrative Benchmarks',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 16V14M11.5 16V12M16 16V10M14 21V7L18 3H21V21H14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'Assessment Q&A',
      label: 'Assessment Q&A',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6.77V15.5C20 16.6 19.1 17.5 18 17.5H13.44L9.31 19.7C9.13 19.8 8.92 19.84 8.73 19.82C8.36 19.79 8.09 19.5 8.09 19.14V17.5H6C4.9 17.5 4 16.6 4 15.5V6.77C4 5.67 4.9 4.77 6 4.77H18C19.1 4.77 20 5.67 20 6.77Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'Learning Path',
      label: 'Your Learning Path & Resources',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V4M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15M12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15M12 15V20M9 4H4V9M9 20H4V15M20 4H15V9M20 15H15V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];
  
  // Calculate final score from question history IF NOT ALREADY SET from Firestore
  useEffect(() => {
    // Only calculate if finalScore hasn't been set by Firestore data and we have history
    if (finalScore === null && questionAnswerHistory?.length > 0) {
      console.log("RESULTS PAGE: Calculating FinalScore from questionAnswerHistory as it was not found/prioritized in Firestore reportData.");
      const calculatedScore = questionAnswerHistory.reduce((acc, q) => {
        const points = q.answerType === 'scale' ? parseInt(q.answer) || 0 : 0;
        return acc + points;
      }, 0);
      setFinalScore(calculatedScore);
    } else if (finalScore !== null) {
        console.log("RESULTS PAGE: FinalScore is already set (likely from Firestore or previous calculation), not recalculating from history. Current score:", finalScore);
    }
  }, [questionAnswerHistory, finalScore]); // Add finalScore to dependency array
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  
  // Initialize toast hook
  const { toast } = useToast();
  
  // Refs for scroll animations
  const contentRef = useRef<HTMLDivElement>(null);
  const overallTierRef = useRef<HTMLDivElement>(null);
  const keyFindingsRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const strategicActionPlanRef = useRef<HTMLDivElement>(null);
  const detailedAnalysisRef = useRef<HTMLDivElement>(null);
  const benchmarksRef = useRef<HTMLDivElement>(null);
  const qAndARef = useRef<HTMLDivElement>(null);
  const learningPathRef = useRef<HTMLDivElement>(null);

  // Important: Make this safe for SSG by checking if window is defined
  const searchParams = useSearchParams();
  
  // Data fetching - Protect for SSG environment
  useEffect(() => {
    if (reportMarkdown && finalScore !== null) {
      let updatedMarkdown = reportMarkdown;
      const scoreRegex = /^(Final Score:\s*)(\d+)(\s*\/100)/im;
      const overallTierRegex = /^(## Overall Tier:\s*.*?)$/im;

      if (scoreRegex.test(updatedMarkdown)) {
        updatedMarkdown = updatedMarkdown.replace(scoreRegex, `$1${finalScore}$3`);
      } else if (overallTierRegex.test(updatedMarkdown)) {
        // If "Overall Tier" exists but "Final Score" doesn't, add it after
        updatedMarkdown = updatedMarkdown.replace(overallTierRegex, `$1\n\nFinal Score: ${finalScore}/100`);
      } else {
        // If neither exists, prepend it (less ideal, but covers edge cases)
        // This might need adjustment based on typical markdown structure
        updatedMarkdown = `## Overall Tier: ${userTier || 'N/A'}\n\nFinal Score: ${finalScore}/100\n\n${updatedMarkdown}`;
      }
      setProcessedReportMarkdown(updatedMarkdown);
    } else if (reportMarkdown) {
      setProcessedReportMarkdown(reportMarkdown); // Pass through if finalScore isn't ready
    }
  }, [reportMarkdown, finalScore, userTier]);

  // Data fetching - Protect for SSG environment
  useEffect(() => {
    async function fetchReportData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // If we already have a userName from props, use it
        if (initialUserName && !userName) {
          console.log("RESULTS PAGE: Using initialUserName from props:", initialUserName);
          setUserName(initialUserName);
        }
        
        // Get reportId from URL or storage
        let fetchedReportId: string | null = null;

        if (searchParams) {
          fetchedReportId = searchParams.get('reportId');
          console.log("RESULTS PAGE: Got reportId from URL params:", fetchedReportId);
        }
        
        if (!fetchedReportId && typeof window !== 'undefined') {
          fetchedReportId = sessionStorage.getItem('currentReportID') || sessionStorage.getItem('reportId');
          if (!fetchedReportId) {
            fetchedReportId = localStorage.getItem('currentReportID') || localStorage.getItem('reportId');
          }
        }
        
        if (!fetchedReportId) {
          // Instead of throwing an error, redirect to home page to complete scorecard
          console.log("RESULTS PAGE: No reportId found, redirecting to complete scorecard");
          if (typeof window !== 'undefined') {
            // Add a small delay to ensure the console log is visible
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
          setError("No scorecard results found. Please complete the AI Efficiency Scorecard first.");
          return;
        }
        
        // Set the report ID in state
        setReportId(fetchedReportId);
        
        console.log("RESULTS PAGE: Attempting to fetch report from Firestore with ID:", fetchedReportId);
        
        // Fetch report data from Firestore
        const reportRef = doc(db, 'scorecardReports', fetchedReportId);
        const reportSnapshot = await getDoc(reportRef);
        
        if (!reportSnapshot.exists()) {
          throw new Error(`No report found in Firestore with ID: ${fetchedReportId}`);
        }
        
        const reportData = reportSnapshot.data();
        console.log("RESULTS PAGE: Full Firestore report data sample:", {
          id: reportSnapshot.id,
          hasMarkdown: !!reportData.reportMarkdown,
          hasScoreInfo: !!reportData.ScoreInformation,
          scoreInScoreInfo: reportData.ScoreInformation?.FinalScore,
          scoreAtRoot: reportData.finalScore,
          tier: reportData.tier || reportData.userAITier || reportData.aiTier,
          answersCount: reportData.questionAnswerHistory?.length || 0,
        });
        
        // Extract all necessary data with fallbacks
        let reportMarkdownValue = reportData.reportMarkdown || reportData.markdown;
          if (!reportMarkdownValue) {
          throw new Error("Report markdown is missing from Firestore document");
        }

        // Remove the "Getting Started & Resources" section and everything after it
        const gettingStartedIndex = reportMarkdownValue.indexOf('## Getting Started & Resources');
        if (gettingStartedIndex !== -1) {
            reportMarkdownValue = reportMarkdownValue.substring(0, gettingStartedIndex).trim();
            console.log("RESULTS PAGE: Removed 'Getting Started & Resources' section from markdown.");
        }
        
        const questionAnswerHistoryValue = reportData.questionAnswerHistory || reportData.answers || [];
        
        // Improved user name retrieval logic with more fallbacks
        let userNameValue = null;
        
        // Try to get name from Firestore data first
        if (reportData.userName && reportData.userName !== 'User') {
          userNameValue = reportData.userName;
        } else if (reportData.leadName && reportData.leadName !== 'User') {
          userNameValue = reportData.leadName;
        }
        
        // If not found in Firestore, check session/local storage
        if (!userNameValue && typeof window !== 'undefined') {
          const storedName = sessionStorage.getItem('scorecardUserName') || 
                             sessionStorage.getItem('scorecardLeadName') || 
                             localStorage.getItem('scorecardUserName') || 
                             localStorage.getItem('scorecardLeadName');
          
          if (storedName && storedName !== 'User') {
            userNameValue = storedName;
          }
        }
        
        // Last resort fallback
        if (!userNameValue) {
          userNameValue = 'Customer';  // Using a more personalized default than "User"
          console.log("RESULTS PAGE: No user name found, using default placeholder");
        }
        
        // Extract tier with multiple fallbacks
        let userTierValue = reportData.tier || reportData.userAITier || reportData.aiTier;
        
        // If tier is missing/unknown, try to extract from markdown
        if (!userTierValue || userTierValue === 'Unknown') {
            userTierValue = extractTierFromMarkdown(reportMarkdownValue);
          console.log("RESULTS PAGE: Extracted tier from markdown:", userTierValue);
        }
        
        // Validate tier
        if (!userTierValue || !['Dabbler', 'Enabler', 'Leader'].includes(userTierValue)) {
          console.error("RESULTS PAGE: Invalid tier value:", userTierValue);
          userTierValue = extractTierFromMarkdown(reportMarkdownValue) || 'Unknown';
        }
        
        // Extract industry from report data or markdown/history
        let userIndustryValue = reportData.industry || reportData.userIndustry || reportData.leadIndustry;
        if (!userIndustryValue) {
           userIndustryValue = extractIndustryFromMarkdown(reportMarkdownValue) || extractIndustryFromHistory(questionAnswerHistoryValue);
        }
        if (userIndustryValue) {
          console.log("RESULTS PAGE: Extracted industry:", userIndustryValue);
        }
        
        // Extract company name from report data or storage
        let userCompanyValue = reportData.companyName || reportData.leadCompany;
        if (!userCompanyValue && typeof window !== 'undefined') {
           userCompanyValue = sessionStorage.getItem('scorecardLeadCompany') || localStorage.getItem('scorecardLeadCompany');
        }
        if (userCompanyValue) {
          console.log("RESULTS PAGE: Extracted company name:", userCompanyValue);
        }


        // Extract sections
        const extractedStrengths = extractStrengthsFromMarkdown(reportMarkdownValue);
        const extractedWeaknesses = extractWeaknessesFromMarkdown(reportMarkdownValue);
        const extractedActions = extractActionsFromMarkdown(reportMarkdownValue);
        
        // Update all state at once to minimize re-renders
        // Remove bold markdown (**) from the report markdown
        const cleanedReportMarkdown = reportMarkdownValue.replace(/\*\*/g, '');

        setReportMarkdown(cleanedReportMarkdown); // This will trigger the processedReportMarkdown update
        // setProcessedReportMarkdown(cleanedReportMarkdown); // Set initial value, will be updated by the other useEffect
        setQuestionAnswerHistory(questionAnswerHistoryValue);
        setUserName(userNameValue);
        setUserTier(userTierValue);
        setUserIndustry(userIndustryValue);
        setUserCompany(userCompanyValue); // Set company name state
          setStrengths(extractedStrengths);
          setWeaknesses(extractedWeaknesses);
          setActionItems(extractedActions);
          
        // Backup to storage
        if (typeof window !== 'undefined') {
          try {
            // Session storage - store the original cleaned one, processing is for display/PDF
            sessionStorage.setItem('reportMarkdown', cleanedReportMarkdown);
            sessionStorage.setItem('questionAnswerHistory', JSON.stringify(questionAnswerHistoryValue));
            sessionStorage.setItem('userAITier', userTierValue);
            sessionStorage.setItem('reportId', fetchedReportId);
            if (userCompanyValue) sessionStorage.setItem('scorecardLeadCompany', userCompanyValue); // Store company name
            
            // Local storage backup
            localStorage.setItem('reportMarkdown', reportMarkdownValue);
            localStorage.setItem('questionAnswerHistory', JSON.stringify(questionAnswerHistoryValue));
            localStorage.setItem('userAITier', userTierValue);
            localStorage.setItem('reportId', fetchedReportId);
            if (userCompanyValue) localStorage.setItem('scorecardLeadCompany', userCompanyValue); // Store company name
          } catch (storageError) {
            console.error("Failed to backup to storage:", storageError);
            // Non-critical error, don't throw
          }
        }
        
        // After successfully loading the report, check if lead info exists
        if (typeof window !== 'undefined') {
          const leadEmail = sessionStorage.getItem('scorecardLeadEmail') || localStorage.getItem('scorecardLeadEmail');
          const leadName = sessionStorage.getItem('scorecardLeadName') || localStorage.getItem('scorecardLeadName');
          const leadCompany = sessionStorage.getItem('scorecardLeadCompany') || localStorage.getItem('scorecardLeadCompany'); // Get company from storage

          if (leadEmail) {
            setUserEmail(leadEmail);
          }
          // Also set company from storage if available
          if (leadCompany) {
            setUserCompany(leadCompany);
          }


          if (!leadEmail || !leadName) {
            console.log('RESULTS PAGE: Report exists but no lead info found, showing lead form');
            setShowLeadForm(true);
          } else {
            setLeadCaptured(true);
          }
        }
      } catch (error) {
        console.error("RESULTS PAGE ERROR:", error);
        setError(error instanceof Error ? error.message : 'Failed to load report');
      } finally {
        setIsLoading(false);
      }
    }
    
      fetchReportData();
  }, [searchParams, initialUserName]); // Only re-run if searchParams changes

  // Handle lead capture success
  const handleLeadCaptureSuccess = (capturedName: string) => {
    console.log("RESULTS PAGE: Lead capture successful. Captured name:", capturedName);
    
    // Don't accept "User" as a valid input from the lead form
    if (capturedName && capturedName.trim() !== '' && capturedName.toLowerCase() !== 'user') {
      setUserName(capturedName.trim());
      setLeadCaptured(true);
      setShowLeadForm(false);
      
      // Store the name in multiple places for redundancy
      if (typeof window !== 'undefined') {
        const companyName = sessionStorage.getItem('scorecardLeadCompany') ||
                           localStorage.getItem('scorecardLeadCompany');
        const email = sessionStorage.getItem('scorecardLeadEmail') ||
                     localStorage.getItem('scorecardLeadEmail');
        
        if (email) {
          setUserEmail(email);
        }
        // Set company name state from storage
        if (companyName) {
          setUserCompany(companyName);
        }
                
        sessionStorage.setItem('scorecardUserName', capturedName.trim());
        sessionStorage.setItem('scorecardLeadName', capturedName.trim());
        localStorage.setItem('scorecardUserName', capturedName.trim());
        
        // If we have a reportId, try to update the Firestore document with the user's name
        if (reportId) {
          try {
            const reportRef = doc(db, 'scorecardReports', reportId);
            updateDoc(reportRef, {
              userName: capturedName.trim(),
              leadName: capturedName.trim(),
              companyName: companyName || userIndustry || '',
              email: email || '',
              updatedAt: new Date()
            }).then(() => {
              console.log("RESULTS PAGE: Successfully updated report with user info");
            }).catch(err => {
              console.error("RESULTS PAGE: Error updating report with user info:", err);
            });
          } catch (err) {
            console.error("RESULTS PAGE: Error updating Firestore:", err);
          }
        }
      }
    } else {
      console.warn("RESULTS PAGE: Invalid name captured from lead form");
      setUserName("Customer");
    }
  };

  // Helper functions to extract data from markdown
  const extractTierFromMarkdown = (markdown: string | null): string | null => {
    if (!markdown) return null;
    
    console.log('EXTRACT TIER: Extracting tier from markdown');
    
    // First try to find the specific "Overall Tier" heading
    const tierMatch = markdown.match(/## Overall Tier:?\s*(.+?)($|\n)/i);
    if (tierMatch && tierMatch[1]) {
      const extracted = tierMatch[1].trim();
      console.log('EXTRACT TIER: Found tier via "Overall Tier" heading:', extracted);
      return extracted;
    }
    
    // Next, try to find tier mentioned after "Overall" heading
    const overallMatch = markdown.match(/## Overall:?\s*(.+?)($|\n)/i);
    if (overallMatch && overallMatch[1]) {
      const line = overallMatch[1].trim();
      // Look for Leader, Enabler, or Dabbler in this line
      if (line.includes('Leader') || line.includes('leader')) return 'Leader';
      if (line.includes('Enabler') || line.includes('enabler')) return 'Enabler';
      if (line.includes('Dabbler') || line.includes('dabbler')) return 'Dabbler';
    }
    
    // If not found yet, try looking for the terms with specific formatting
    const leaderBoldMatch = markdown.match(/\*\*Leader\*\*/i) || markdown.match(/__Leader__/i);
    if (leaderBoldMatch) {
      console.log('EXTRACT TIER: Found tier via bold "Leader" format');
      return 'Leader';
    }
    
    const enablerBoldMatch = markdown.match(/\*\*Enabler\*\*/i) || markdown.match(/__Enabler__/i);
    if (enablerBoldMatch) {
      console.log('EXTRACT TIER: Found tier via bold "Enabler" format');
      return 'Enabler';
    }
    
    const dabblerBoldMatch = markdown.match(/\*\*Dabbler\*\*/i) || markdown.match(/__Dabbler__/i);
    if (dabblerBoldMatch) {
      console.log('EXTRACT TIER: Found tier via bold "Dabbler" format');
      return 'Dabbler';
    }
    
    // Fallback to searching for Leader, Enabler, or Dabbler anywhere in the markdown
    // Looking for most frequent tier mentioned
    const leaderCount = (markdown.match(/Leader/gi) || []).length;
    const enablerCount = (markdown.match(/Enabler/gi) || []).length;
    const dabblerCount = (markdown.match(/Dabbler/gi) || []).length;
    
    console.log('EXTRACT TIER: Term frequency -', { leaderCount, enablerCount, dabblerCount });
    
    if (leaderCount > enablerCount && leaderCount > dabblerCount && leaderCount > 0) {
      console.log('EXTRACT TIER: Found tier via frequency of "Leader"');
      return 'Leader';
    } else if (enablerCount > leaderCount && enablerCount > dabblerCount && enablerCount > 0) {
      console.log('EXTRACT TIER: Found tier via frequency of "Enabler"');
      return 'Enabler';
    } else if (dabblerCount > 0) {
      console.log('EXTRACT TIER: Found tier via frequency of "Dabbler"');
      return 'Dabbler';
    }
    
    // If we still can't determine, return "Enabler" as a default
    console.log('EXTRACT TIER: Could not determine tier from markdown content, using default "Enabler"');
    return 'Enabler';
  };
  
  const extractStrengthsFromMarkdown = (markdown: string): string[] => {
    console.log('EXTRACT STRENGTHS: Extracting strengths from markdown');
    
    // Try different patterns to find strengths section
    let strengthsSection = null;
    
    // Pattern 1: Standard "Strengths" heading
    const pattern1 = markdown.match(/## Strengths[:\s]*([\s\S]*?)(?=##|$)/i);
    if (pattern1 && pattern1[1]) {
      strengthsSection = pattern1[1];
      console.log('EXTRACT STRENGTHS: Found strengths via pattern 1 (standard heading)');
    }
    
    // Pattern 2: Inside "Key Findings" section
    if (!strengthsSection) {
      const keyFindingsSection = markdown.match(/## Key Findings[:\s]*([\s\S]*?)(?=##|$)/i);
      if (keyFindingsSection && keyFindingsSection[1]) {
        const strengthsInFindings = keyFindingsSection[1].match(/Strengths[:\s]*([\s\S]*?)(?=Weaknesses|Areas for Improvement|##|$)/i);
        if (strengthsInFindings && strengthsInFindings[1]) {
          strengthsSection = strengthsInFindings[1];
          console.log('EXTRACT STRENGTHS: Found strengths via pattern 2 (inside Key Findings)');
        }
      }
    }
    
    // If we found a strengths section, extract the bullet points
    if (strengthsSection) {
      const strengthsList = strengthsSection.split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().match(/^\d+\.\s/))
        .map(line => line.trim().replace(/^[*-]\s+/, '').replace(/^\d+\.\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT STRENGTHS: Found', strengthsList.length, 'strengths');
      
      return strengthsList.slice(0, 5); // Limit to 5 strengths
    }
    
    // If no strengths section found with specific headings, look for bullet points after a "strong" or "strength" keyword
    const strengthKeywordSection = markdown.match(/(strength|strong)[^\n]*\n+((?:[*-]\s+[^\n]+\n*)+)/i);
    if (strengthKeywordSection && strengthKeywordSection[2]) {
      const strengthsList = strengthKeywordSection[2].split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        .map(line => line.trim().replace(/^[*-]\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT STRENGTHS: Found', strengthsList.length, 'strengths via keyword pattern');
      
      if (strengthsList.length > 0) {
        return strengthsList.slice(0, 5);
      }
    }
    
    // Last resort: Find first set of bullet points in the document
    const firstBulletPoints = markdown.match(/(?:[*-]\s+[^\n]+\n*){2,}/);
    if (firstBulletPoints) {
      const bulletList = firstBulletPoints[0].split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        .map(line => line.trim().replace(/^[*-]\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT STRENGTHS: Using first bullet points as fallback, found', bulletList.length, 'items');
      
      if (bulletList.length > 0) {
        return bulletList.slice(0, 5);
      }
    }
    
    console.log('EXTRACT STRENGTHS: Could not find any strengths in the markdown');
    return [];
  };
  
  const extractWeaknessesFromMarkdown = (markdown: string): string[] => {
    console.log('EXTRACT WEAKNESSES: Extracting weaknesses from markdown');
    
    // Try different patterns to find weaknesses section
    let weaknessesSection = null;
    
    // Pattern 1: Standard "Weaknesses" or variations heading
    const pattern1 = markdown.match(/## (Weaknesses|Areas for Improvement|Challenges|Opportunities)[:\s]*([\s\S]*?)(?=##|$)/i);
    if (pattern1 && pattern1[2]) {
      weaknessesSection = pattern1[2];
      console.log('EXTRACT WEAKNESSES: Found weaknesses via pattern 1 (standard heading)');
    }
    
    // Pattern 2: Inside "Key Findings" section
    if (!weaknessesSection) {
      const keyFindingsSection = markdown.match(/## Key Findings[:\s]*([\s\S]*?)(?=##|$)/i);
      if (keyFindingsSection && keyFindingsSection[1]) {
        const weaknessesInFindings = keyFindingsSection[1].match(/(Weaknesses|Areas for Improvement|Challenges|Opportunities)[:\s]*([\s\S]*?)(?=##|$)/i);
        if (weaknessesInFindings && weaknessesInFindings[2]) {
          weaknessesSection = weaknessesInFindings[2];
          console.log('EXTRACT WEAKNESSES: Found weaknesses via pattern 2 (inside Key Findings)');
        }
      }
    }
    
    // If we found a weaknesses section, extract the bullet points
    if (weaknessesSection) {
      const weaknessesList = weaknessesSection.split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().match(/^\d+\.\s/))
        .map(line => line.trim().replace(/^[*-]\s+/, '').replace(/^\d+\.\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT WEAKNESSES: Found', weaknessesList.length, 'weaknesses');
      
      return weaknessesList.slice(0, 5); // Limit to 5 weaknesses
    }
    
    // If no weaknesses section found with specific headings, look for bullet points after a weakness-related keyword
    const weaknessKeywordSection = markdown.match(/(weakness|improve|challenge|opportunity|gap)[^\n]*\n+((?:[*-]\s+[^\n]+\n*)+)/i);
    if (weaknessKeywordSection && weaknessKeywordSection[2]) {
      const weaknessesList = weaknessKeywordSection[2].split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        .map(line => line.trim().replace(/^[*-]\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT WEAKNESSES: Found', weaknessesList.length, 'weaknesses via keyword pattern');
      
      if (weaknessesList.length > 0) {
        return weaknessesList.slice(0, 5);
      }
    }
    
    // Last resort: Find second set of bullet points in the document
    const allBulletSections = markdown.match(/(?:[*-]\s+[^\n]+\n*){2,}/g);
    if (allBulletSections && allBulletSections.length > 1) {
      const secondBulletPoints = allBulletSections[1]; // Use the second bullet list
      const bulletList = secondBulletPoints.split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        .map(line => line.trim().replace(/^[*-]\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT WEAKNESSES: Using second bullet points as fallback, found', bulletList.length, 'items');
      
      if (bulletList.length > 0) {
        return bulletList.slice(0, 5);
      }
    }
    
    console.log('EXTRACT WEAKNESSES: Could not find any weaknesses in the markdown');
    return [];
  };
  
  const extractActionsFromMarkdown = (markdown: string): string[] => {
    console.log('EXTRACT ACTIONS: Extracting action items from markdown');
    
    // Try different patterns to find actions section
    let actionsSection = null;
    
    // Pattern 1: Standard action-related headings
    const pattern1 = markdown.match(/## (Recommendations|Action Plan|Action Items|Next Steps|Strategic Action Plan)[:\s]*([\s\S]*?)(?=##|$)/i);
    if (pattern1 && pattern1[2]) {
      actionsSection = pattern1[2];
      console.log('EXTRACT ACTIONS: Found actions via pattern 1 (standard heading)');
    }
    
    // If we found an actions section, extract the bullet points
    if (actionsSection) {
      const actionsList = actionsSection.split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().match(/^\d+\.\s/))
        .map(line => line.trim().replace(/^[*-]\s+/, '').replace(/^\d+\.\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT ACTIONS: Found', actionsList.length, 'actions');
      
      return actionsList.slice(0, 5); // Limit to 5 action items
    }
    
    // If no actions section found with specific headings, look for numbered lists that might indicate actions
    const numberedListSection = markdown.match(/(?:\d+\.\s+[^\n]+\n*){2,}/);
    if (numberedListSection) {
      const numberedList = numberedListSection[0].split('\n')
        .filter(line => line.trim().match(/^\d+\.\s/))
        .map(line => line.trim().replace(/^\d+\.\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT ACTIONS: Found', numberedList.length, 'actions via numbered list pattern');
      
      if (numberedList.length > 0) {
        return numberedList.slice(0, 5);
      }
    }
    
    // Look for bullet points after action-related keywords
    const actionKeywordSection = markdown.match(/(recommendation|action|next step|implement|strategic)[^\n]*\n+((?:[*-]\s+[^\n]+\n*)+)/i);
    if (actionKeywordSection && actionKeywordSection[2]) {
      const actionsList = actionKeywordSection[2].split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        .map(line => line.trim().replace(/^[*-]\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT ACTIONS: Found', actionsList.length, 'actions via keyword pattern');
      
      if (actionsList.length > 0) {
        return actionsList.slice(0, 5);
      }
    }
    
    // Last resort: Find the third or last set of bullet points in the document
    const allBulletSections = markdown.match(/(?:[*-]\s+[^\n]+\n*){2,}/g);
    if (allBulletSections && allBulletSections.length > 0) {
      // Use the third bullet list if available, otherwise use the last one
      const bulletPointsSection = allBulletSections.length > 2 ? allBulletSections[2] : allBulletSections[allBulletSections.length - 1];
      const bulletList = bulletPointsSection.split('\n')
        .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
        .map(line => line.trim().replace(/^[*-]\s+/, ''))
        .filter(line => line.length > 0);
        
      console.log('EXTRACT ACTIONS: Using bullet points as fallback, found', bulletList.length, 'items');
      
      if (bulletList.length > 0) {
        return bulletList.slice(0, 5);
      }
    }
    
    console.log('EXTRACT ACTIONS: Could not find any action items in the markdown');
    return [];
  };

  // Enhanced tab change handler that closes mobile menu
  const handleTabChange = (tabName: SectionName) => {
    if (animating) return;
    
    setAnimating(true);
    setIsMobileMenuOpen(false); // Close mobile menu on tab change
    
    setTimeout(() => {
      setActiveTab(tabName);
      setAnimating(false);
      
      // Scroll section into view if it exists
      const sectionRefs: SectionRefs = {
        'Overall Tier': overallTierRef,
        'Key Findings': keyFindingsRef,
        'Recommendations': recommendationsRef,
        'Strategic Action Plan': strategicActionPlanRef,
        'Detailed Analysis': detailedAnalysisRef,
        'Benchmarks': benchmarksRef,
        'Assessment Q&A': qAndARef,
        'Learning Path': learningPathRef
      };
      
      const targetRef = sectionRefs[tabName];
      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 150);
  };

  // Handle report sharing
  const handleShareReport = () => {
    try {
      setIsSharing(true);
      
      // Create shareable URL with reportId
      const reportId = searchParams?.get('reportId') || 
        (typeof window !== 'undefined' ? 
          sessionStorage.getItem('currentReportID') || 
          sessionStorage.getItem('reportId') || 
          localStorage.getItem('currentReportID') || 
          localStorage.getItem('reportId') : null);
      
      if (!reportId) {
        throw new Error('No report ID found to share');
      }
      
      // Create the URL to share
      const shareUrl = `${window.location.origin}/scorecard/results?reportId=${reportId}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: `AI Efficiency Scorecard for ${userName || 'your organization'}`,
          text: `Check out this AI Efficiency Scorecard (Tier: ${userTier || 'Evaluation'})`,
          url: shareUrl
        }).catch(err => {
          console.error('Share failed:', err);
          // Fallback to clipboard if share fails
          navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        });
      } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share report:', error);
      alert('Unable to share. Please try copying the URL manually.');
    } finally {
      setIsSharing(false);
    }
  };

  // Replace the handleDownloadPdf function
  const handleDownloadPdf = async () => {
    if (!reportId) {
      toast({
        title: "Error",
        description: "Report ID not found. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    // Store report data in localStorage as fallback for PDF generation
    if (reportMarkdown) {
      localStorage.setItem('reportMarkdown', reportMarkdown);
    }
    if (questionAnswerHistory) {
      localStorage.setItem('questionAnswerHistory', JSON.stringify(questionAnswerHistory));
    }
    if (userTier) {
      localStorage.setItem('userAITier', userTier);
    }
    if (userName) {
      localStorage.setItem('userName', userName);
    }
    
    // We'll now use the download button component which handles the PDF generation
    setIsDownloadingPdf(true);
    
    try {
      // Programmatically click the PDF download button if needed
      const downloadButton = document.getElementById('pdf-download-button');
      if (downloadButton) {
        downloadButton.click();
      } else {
        // Fallback to direct API call
        window.open(`/api/generate-pdf?reportId=${reportId}`, '_blank');
      }
      
      toast({
        title: "PDF Ready",
        description: "Your PDF report is being downloaded.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // New handler for pdfmake-based PDF V2
  const handleDownloadPdfV2 = async () => {
    try {
      // Open the API route in a new tab for direct PDF download
      window.open(`/api/generate-scorecard-report`, '_blank');
      
      toast({
        title: "PDF V2 Ready",
        description: "Your PDF report is being generated and downloaded.",
      });
    } catch (error) {
      console.error("Error downloading PDF V2:", error);
      toast({
        title: "Error",
        description: "Failed to download PDF V2. Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Handler for presentation-style PDF using WeasyPrint
  const handlePresentationPdf = async () => {
    setIsPresentationPdfLoading(true);
    
    try {
      // Instead of checking reportData which doesn't exist, check if we have the required state variables
      if (!reportMarkdown) {
        throw new Error('No report content available');
      }
      
      // Use companyName from session storage or other available sources
      // Get lead data from storage
      const companyName = sessionStorage.getItem('scorecardLeadCompany') || '';
      const userEmail = sessionStorage.getItem('scorecardLeadEmail') || '';
      const userIndustry = sessionStorage.getItem('scorecardLeadIndustry') || '';
      
      // Create the PDF data object using available state variables
      const pdfReportData = {
        UserInformation: {
          UserName: userName || 'User',
          Industry: userIndustry || '', // Remove fallback to 'General Business'
          CompanyName: companyName,
          Email: typeof window !== 'undefined' ? 
            (sessionStorage.getItem('scorecardLeadEmail') || 
             localStorage.getItem('scorecardLeadEmail') || '') : ''
        },
        ScoreInformation: {
          AITier: userTier || 'Enabler',
          FinalScore: finalScore, // Make sure this comes from state/props
          ReportID: reportId || `REPORT-${new Date().getTime().toString().substring(0, 6)}`
        },
        QuestionAnswerHistory: questionAnswerHistory || [],
        FullReportMarkdown: reportMarkdown || '',
        section1_items: [
          { title: "AI Implementation", description: "Strong foundation in basic AI tools" },
          { title: "Data Strategy", description: "Need improvement in data governance" }
        ],
        section3_items: [
          { number: 1, title: "Implement Training", description: "Start AI literacy program" },
          { number: 2, title: "Upgrade Infrastructure", description: "Migrate to cloud-based AI platform" }
        ],
        benchmarks: [
          { metric: "AI Adoption Rate", value: "35%" },
          { metric: "Industry Average", value: "42%" }
        ],
        resources: [
          { title: "AI Implementation Guide", url: "https://example.com/guide" },
          { title: "Cloud Migration Checklist", url: "https://example.com/checklist" }
        ]
      };
      
      // Log the data being sent to the PDF generator
      console.log("PRESENTATION PDF: Full data payload:", {
        UserName: pdfReportData.UserInformation.UserName,
        CompanyName: pdfReportData.UserInformation.CompanyName,
        Industry: pdfReportData.UserInformation.Industry,
        Email: pdfReportData.UserInformation.Email,
        AITier: pdfReportData.ScoreInformation.AITier,
        FinalScore: pdfReportData.ScoreInformation.FinalScore
      });
      
      // Call the new PDFShift-based API endpoint instead of WeasyPrint
      const response = await fetch('/api/simple-presentation-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfReportData),
      });

      if (!response.ok) {
        // Try to get error details if available
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || `Error: ${response.status}`);
        } catch (e) {
          throw new Error(`Error: ${response.status}`);
        }
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Use a sanitized filename
      const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const safeUserName = (userName || 'user').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      a.download = `${safeUserName}_${safeCompanyName}_AI_Scorecard_Presentation.pdf`;
      
      // Append to document, click and remove
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Show success toast
      sonnerToast.success('Presentation PDF downloaded successfully', {
        description: 'Your presentation-style report has been generated.'
      });
      
    } catch (err) {
      console.error('Failed to generate Presentation-style PDF:', err);
      sonnerToast.error('Failed to generate PDF', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    } finally {
      setIsPresentationPdfLoading(false);
    }
  };

  // Helper function to generate recommendation descriptions
  const getRecommendationDescription = (index: number, action: string): string => {
    // Generate contextual descriptions based on keywords in the action item
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('strategy') || actionLower.includes('roadmap') || actionLower.includes('vision')) {
      return "Develop a clear strategic direction to align AI initiatives with business objectives and maximize ROI.";
    }
    
    if (actionLower.includes('team') || actionLower.includes('talent') || actionLower.includes('skill') || actionLower.includes('training')) {
      return "Build the necessary skills and expertise to successfully implement and manage AI solutions across your organization.";
    }
    
    if (actionLower.includes('data') || actionLower.includes('infrastructure') || actionLower.includes('platform')) {
      return "Establish the foundation for successful AI implementation with robust data management and technical infrastructure.";
    }
    
    if (actionLower.includes('governance') || actionLower.includes('ethic') || actionLower.includes('policy') || actionLower.includes('standard')) {
      return "Implement frameworks to ensure responsible, compliant, and ethical AI use aligned with your organization's values.";
    }
    
    if (actionLower.includes('pilot') || actionLower.includes('experiment') || actionLower.includes('test')) {
      return "Start with targeted pilot projects to demonstrate value, build momentum, and learn from practical implementation.";
    }
    
    // Generic descriptions if no specific keywords match
    const genericDescriptions = [
      "Implement this recommendation to advance your organization's AI maturity and drive business value.",
      "This strategic action will help build foundational capabilities necessary for AI success.",
      "Focus on this area to address key gaps identified in your AI maturity assessment.",
      "Prioritize this recommendation to gain competitive advantage through enhanced AI capabilities.",
      "This action represents a critical step toward more advanced AI implementation and value creation."
    ];
    
    return genericDescriptions[index % genericDescriptions.length];
  };
  
  // Helper function to get tier description
  const getTierDescription = (tier: string | null): string => {
    if (!tier) return "";
    
    switch(tier.toLowerCase()) {
      case 'leader':
        return " This means your organization has developed mature AI capabilities, with well-established processes for developing, deploying, and managing AI solutions. You have a strong foundation of data infrastructure, AI talent, governance frameworks, and strategic alignment.";
      case 'enabler':
        return " This means your organization has begun to develop significant AI capabilities with some successful implementations. You have established basic data infrastructure and are working toward more systematized approaches to AI development and deployment.";
      case 'dabbler':
        return " This means your organization is in the early stages of AI adoption, with limited formal processes and capabilities. You may have experimented with some AI applications but lack a comprehensive strategy and infrastructure for AI implementation.";
      default:
        return " Your assessment results indicate you're at an early stage of AI adoption. The recommendations in this report will help you establish a solid foundation for AI implementation.";
    }
  };
  
  // Helper function to get tier strengths
  const getTierStrengths = (tier: string | null): string[] => {
    if (!tier) return [];
    
    switch(tier.toLowerCase()) {
      case 'leader':
        return [
          "Strong alignment between AI initiatives and business strategy",
          "Established data infrastructure and governance",
          "Effective AI talent acquisition and development",
          "Mature processes for AI development and deployment",
          "Clear frameworks for responsible AI use"
        ];
      case 'enabler':
        return [
          "Growing alignment of AI initiatives with business goals",
          "Developing data infrastructure and practices",
          "Building internal AI capabilities and expertise",
          "Successful implementation of selected AI use cases",
          "Emerging governance frameworks"
        ];
      case 'dabbler':
        return [
          "Initial experimentation with AI technologies",
          "Recognition of AI's potential value",
          "Willingness to explore and learn about AI applications",
          "Some pockets of data collection and management",
          "Early-stage awareness of AI governance needs"
        ];
      default:
        return [
          "Interest in exploring AI potential",
          "Recognition of the need for digital transformation",
          "Openness to innovation and new technologies",
          "Ability to start with a clean slate in AI implementation"
        ];
    }
  };
  
  // Helper function to get tier focus areas
  const getTierFocusAreas = (tier: string | null): string[] => {
    if (!tier) return [];
    
    switch(tier.toLowerCase()) {
      case 'leader':
        return [
          "Scaling AI initiatives across the organization",
          "Optimizing AI operations and processes",
          "Developing cutting-edge AI capabilities",
          "Expanding responsible AI frameworks",
          "Leveraging AI for competitive advantage"
        ];
      case 'enabler':
        return [
          "Formalizing AI strategy and governance",
          "Expanding data infrastructure and capabilities",
          "Systematizing AI development processes",
          "Building broader AI talent and skills",
          "Integrating AI more deeply with business processes"
        ];
      case 'dabbler':
        return [
          "Developing an AI strategy and roadmap",
          "Building foundational data infrastructure",
          "Identifying high-value AI use cases",
          "Acquiring essential AI skills and expertise",
          "Establishing basic AI governance frameworks"
        ];
      default:
        return [
          "Understanding AI fundamentals and potential",
          "Assessing current data capabilities",
          "Identifying initial AI use cases",
          "Building awareness of AI best practices"
        ];
    }
  };

  // New function to extract industry from markdown report
  const extractIndustryFromMarkdown = (markdown: string | null): string | null => {
    if (!markdown) return null;
    
    console.log('EXTRACT INDUSTRY: Extracting industry from markdown');

    // Pattern 1: Look for "Industry:" or similar labels near the beginning
    // Search within the first 500 characters for efficiency and relevance
    const beginningMarkdown = markdown.substring(0, Math.min(markdown.length, 500));
    const labeledMatch = beginningMarkdown.match(/Industry:?\s*([^\n]+)/i);
    if (labeledMatch && labeledMatch[1]) {
      const extracted = labeledMatch[1].trim();
      console.log('EXTRACT INDUSTRY: Found industry via label pattern near beginning:', extracted);
      return extracted;
    }
    
    // Pattern 2: Look for "X industry" pattern with emphasis
    const emphasisMatch = markdown.match(/\*\*([^*]+) industry\*\*/i);
    if (emphasisMatch && emphasisMatch[1]) {
      const extracted = emphasisMatch[1].trim();
      console.log('EXTRACT INDUSTRY: Found industry via emphasis pattern:', extracted);
      return extracted;
    }
    
    // Pattern 3: Look for "in the X industry" pattern
    const phraseMatch = markdown.match(/in the ([^\.]+) industry/i);
    if (phraseMatch && phraseMatch[1]) {
      const extracted = phraseMatch[1].trim();
      console.log('EXTRACT INDUSTRY: Found industry via phrase pattern:', extracted);
      return extracted;
    }
    
    // Pattern 4: Look for "for the X industry" pattern
    const forPhraseMatch = markdown.match(/for the ([^\.]+) industry/i);
    if (forPhraseMatch && forPhraseMatch[1]) {
      const extracted = forPhraseMatch[1].trim();
      console.log('EXTRACT INDUSTRY: Found industry via for-phrase pattern:', extracted);
      return extracted;
    }
    
    // Pattern 5: Look for "in the X sector" pattern
    const sectorMatch = markdown.match(/in the ([^\.]+) sector/i);
    if (sectorMatch && sectorMatch[1]) {
      const extracted = sectorMatch[1].trim();
      console.log('EXTRACT INDUSTRY: Found industry via sector pattern:', extracted);
      return extracted;
    }
    
    console.log('EXTRACT INDUSTRY: Could not find industry in markdown');
    return null;
  };

  // Extract industry from question-answer history
  const extractIndustryFromHistory = (history: any[]): string | null => {
    if (!history || !history.length) return null;
    
    console.log('EXTRACT INDUSTRY: Attempting to extract industry from QA history');
    
    // Look for industry in the first question (often contains industry selection)
    const firstQuestion = history[0]?.question;
    if (firstQuestion) {
      // Look for industry mention in the question
      const industryMatch = firstQuestion.match(/in the ([^\.]+) industry/i) || 
                            firstQuestion.match(/for the ([^\.]+) industry/i) ||
                            firstQuestion.match(/in ([^\.]+) organizations/i);
      
      if (industryMatch && industryMatch[1]) {
        const extracted = industryMatch[1].trim();
        console.log('EXTRACT INDUSTRY: Found industry in first question:', extracted);
        return extracted;
      }
    }
    
    // Try looking at the answers for industry mentions
    for (const entry of history) {
      if (typeof entry.answer === 'string' && entry.answer.toLowerCase().includes('industry')) {
        const industryMatch = entry.answer.match(/([^\.]+) industry/i);
        if (industryMatch && industryMatch[1]) {
          const extracted = industryMatch[1].trim();
          console.log('EXTRACT INDUSTRY: Found industry in QA answers:', extracted);
          return extracted;
        }
      }
    }
    
    console.log('EXTRACT INDUSTRY: Could not find industry in QA history');
    return null;
  };

  // Add this function before the return statement in the NewResultsPage component
  const formatReportDataForPDF = () => {
    // Get company name from all possible sources
    let companyName = null;
    
    // Check session/local storage
    if (typeof window !== 'undefined') {
      companyName = sessionStorage.getItem('scorecardLeadCompany') || 
                   localStorage.getItem('scorecardLeadCompany');
    }
    
    // Fallback to industry if we still don't have a company name
    if (!companyName) {
      companyName = userIndustry || "Company";
    }
    
    // Get email with fallbacks
    const email = sessionStorage.getItem('scorecardLeadEmail') || 
                localStorage.getItem('scorecardLeadEmail') || 
                "user@example.com";
    
    // Format data into the structure expected by ScoreCardData interface
    return {
      UserInformation: {
        UserName: userName || 'User',
        CompanyName: companyName,
        Industry: userIndustry || '', // Remove fallback to 'Industry'
        Email: email,
      },
      ScoreInformation: {
        AITier: userTier || 'Dabbler',
        FinalScore: 0, // Add score if available
        ReportID: reportId || 'unknown',
      },
      QuestionAnswerHistory: questionAnswerHistory || [],
      FullReportMarkdown: reportMarkdown || '',
    };
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <div className="w-24 h-24 mb-8 border-4 border-sg-bright-green/30 border-t-sg-bright-green rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold mb-3 text-sg-dark-teal">Loading Your AI Scorecard</h2>
        <p className="text-sg-dark-teal/70 text-center max-w-md">
          Please wait while we prepare your results. This may take a few moments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white p-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg max-w-lg w-full mb-6">
          <h2 className="text-2xl font-bold mb-3 text-blue-700">Complete Your AI Scorecard First</h2>
          <p className="text-blue-600 mb-4">{error}</p>
          <p className="text-sg-dark-teal/70 mb-6">
            To view your personalized AI efficiency results, you need to:
            <ul className="list-disc pl-6 mt-2">
              <li>Complete the AI Efficiency Scorecard assessment</li>
              <li>Answer questions about your current AI usage</li>
              <li>Get your personalized tier and recommendations</li>
            </ul>
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.href = '/'}  
              className="px-6 py-3 bg-sg-bright-green text-white font-semibold rounded-lg shadow-sm hover:brightness-105 transition-all"
            >
              Start AI Scorecard
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-sg-dark-teal text-white font-semibold rounded-lg shadow-sm hover:brightness-105 transition-all"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the lead form if needed
  if (showLeadForm && !leadCaptured && !isLoading && reportMarkdown) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <LeadCaptureForm
          aiTier={userTier}
          onSubmitSuccess={handleLeadCaptureSuccess}
          reportMarkdown={reportMarkdown}
          questionAnswerHistory={questionAnswerHistory}
          industry={userIndustry || ''}
        />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="bg-white min-h-screen">
        {reportMarkdown ? (
          <>
            {/* Header */}
            <header className="header">
              <div className="header-content">
                <div className="flex items-center gap-3 flex-1">
                  <div className="logo-container">
                    {/* Social Garden Logo */}
                    <Image 
                      src="/footer-logo.svg" 
                      alt="AI Efficiency Scorecard Logo" 
                      width={120} 
                      height={24} 
                      className="logo-inner"
                      priority
                    />
                  </div>
                  <h1>AI Efficiency Scorecard</h1>
                </div>
                
                {/* Mobile menu button - only visible on mobile */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#103138] text-white hover:bg-[#103138]/90 transition-colors flex-shrink-0"
                  aria-label="Toggle navigation menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                <div className="header-actions hidden md:flex">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleShareReport}
                      className="flex items-center gap-2 bg-white text-[#103138] border border-[#103138] hover:bg-gray-50 transition-colors px-4 py-2 rounded-md font-medium mx-2"
                      disabled={isSharing}
                    >
                      {isSharing ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sharing...</span>
                        </span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share Report
                        </>
                      )}
                    </button>

                    <Link href={`/learning-hub${userTier ? `?tier=${userTier.toLowerCase()}` : ''}`} passHref>
                      <button
                        type="button"
                        className="sg-button-primary flex items-center justify-center"
                      >
                        Access Learning Hub
                      </button>
                    </Link>

                    {/* PDF download button */}
                    <div id="pdf-download-container" className="flex gap-4">
                      <PresentationPDFButton
                        onGeneratePDF={handlePresentationPdf}
                        isLoading={isPresentationPdfLoading}
                        className="btn-primary-divine bg-[#20E28F] text-[#103138] hover:bg-[#20E28F]/90 hidden"
                      />
                      <SeekPDFButton
                        scorecardData={{
                          reportMarkdown: processedReportMarkdown, // Use processed markdown
                          questionAnswerHistory: questionAnswerHistory,
                          userName: userName,
                          userTier: userTier,
                          userIndustry: userIndustry,
                          strengths: strengths,
                          weaknesses: weaknesses,
                          actionItems: actionItems,
                          finalScore: finalScore,
                          reportId: reportId,
                          userEmail: userEmail,
                          userCompany: userCompany, // Include userCompany in scorecardData
                        }}
                        className="bg-gradient-to-r from-[#20E28F] to-[#01CEFE] text-white font-bold py-3 px-7 rounded-xl shadow-lg flex items-center gap-2 hover:from-[#1CC47E] hover:to-[#01B6D6] transition-all duration-200 border-2 border-[#20E28F] focus:outline-none focus:ring-2 focus:ring-[#20E28F]/50"
                      >
                        {/* Download icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" /></svg>
                        Download Report
                      </SeekPDFButton>
                      {/* WeasyPrint PDF button - Hidden but implementation preserved */}
                      <WeasyprintPDFButton 
                        scorecardData={formatReportDataForPDF()}
                        className="btn-primary-divine bg-[#FEC401] text-[#103138] hover:bg-[#FEC401]/90 hidden"
                      >
                        download pdf 2
                      </WeasyprintPDFButton>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Navigation Menu - Only visible when menu is open */}
            {isMobileMenuOpen && (
              <>
                {/* Overlay to close menu when clicking outside */}
                <div 
                  className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-hidden="true"
                />
                
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 max-h-[90vh] overflow-y-auto">
                  <nav className="px-4 py-6">
                    <div className="space-y-1">
                      {navigationItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleTabChange(item.id as SectionName);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeTab === item.id
                              ? 'bg-[#F3FDF5] text-[#20E28F] border-l-4 border-[#20E28F]'
                              : 'text-[#103138] hover:bg-gray-50'
                          }`}
                        >
                          <span className={`${activeTab === item.id ? 'text-[#20E28F]' : 'text-[#103138]/60'}`}>
                            {item.icon}
                          </span>
                          <span className="font-medium text-sm">
                            {item.label}
                          </span>
                          {activeTab === item.id && (
                            <svg className="ml-auto h-4 w-4 text-[#20E28F]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-8-8a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Mobile Action Buttons */}
                    <div className="border-t border-gray-200 mt-6 pt-6 pb-8">
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            handleShareReport();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 bg-white text-[#103138] border border-[#103138] hover:bg-gray-50 transition-colors px-4 py-3 rounded-lg font-medium"
                          disabled={isSharing}
                        >
                          {isSharing ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Sharing...</span>
                            </span>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              Share Report
                            </>
                          )}
                        </button>

                        <Link href={`/learning-hub${userTier ? `?tier=${userTier.toLowerCase()}` : ''}`} passHref>
                          <button
                            type="button"
                            className="w-full sg-button-primary flex items-center justify-center gap-3 px-4 py-3 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Access Learning Hub
                          </button>
                        </Link>

                        <div onClick={() => setIsMobileMenuOpen(false)}>
                          <SeekPDFButton
                            scorecardData={{
                              reportMarkdown: processedReportMarkdown,
                              questionAnswerHistory: questionAnswerHistory,
                              userName: userName,
                              userTier: userTier,
                              userIndustry: userIndustry,
                              strengths: strengths,
                              weaknesses: weaknesses,
                              actionItems: actionItems,
                              finalScore: finalScore,
                              reportId: reportId,
                              userEmail: userEmail,
                              userCompany: userCompany,
                            }}
                            className="w-full bg-gradient-to-r from-[#20E28F] to-[#01CEFE] text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 hover:from-[#1CC47E] hover:to-[#01B6D6] transition-all duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                            </svg>
                            Download Report
                          </SeekPDFButton>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
              </>
            )}

            {/* Main Content - add ID for PDF capture */}
            <main id="scorecard-report-content" className="main-content">
              {/* Sidebar / Navigation */}
              <div className="sidebar">
                <div className="tier-indicator">
                  <div className="tier-circle">
                    <span className="tier-text">{userTier || 'N/A'}</span>
                    <span className="tier-label">AI Maturity</span>
                  </div>
                </div>
                
                <div className="tier-progress">
                  <div className="tier-progress-label">Your Progress</div>
                  <div className="tier-progress-bar">
                    <div 
                      className="tier-progress-fill" 
                      style={{ 
                        width: userTier === 'Leader' ? '100%' : 
                               userTier === 'Enabler' ? '66%' : 
                               userTier === 'Dabbler' ? '33%' : '0%' 
                      }}
                    ></div>
                  </div>
                  <div className="tier-progress-labels">
                    <div>Dabbler</div>
                    <div>Enabler</div>
                    <div>Leader</div>
                  </div>
                </div>
                
                <nav className="nav-menu">
                  <div className="nav-section-title">Navigate Report</div>
                  <ul>
                    {navigationItems.map(item => (
                      <li key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => handleTabChange(item.id as SectionName)}>
                        {item.icon}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </nav>
                
                {userName && (
                  <div className="user-info">
                    <div className="user-info-label">Report for</div>
                    <div className="user-info-name">{userName}</div>
                  </div>
                )}
              </div>

              {/* Content Panel */}
              <div className={`content-panel ${animating ? 'fade-out' : 'fade-in'}`} ref={contentRef}>
                {/* Mobile Section Indicator - only visible on mobile */}
                <div className="md:hidden mb-4 p-3 bg-[#F3FDF5] rounded-lg border-l-4 border-[#20E28F]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#20E28F]">
                      {navigationItems.find(item => item.id === activeTab)?.icon}
                    </span>
                    <span className="font-semibold text-[#103138]">
                      {navigationItems.find(item => item.id === activeTab)?.label || activeTab}
                    </span>
                  </div>
                </div>

                {/* Content based on active tab - maintaining exact existing content */}
                {/* Overall Tier Section */}
                {activeTab === 'Overall Tier' && (
                  <div ref={overallTierRef} className="section-content">
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-[#103138] mb-4 flex items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-[#20E28F]">
                          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 7L12 12L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Overall AI Maturity Assessment
                      </h2>
                      
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 pt-6">
                          <div className="flex flex-col md:flex-row md:items-center mb-5">
                            <div className="flex items-center mb-4 md:mb-0 md:mr-8">
                              <div 
                                className={`w-14 h-14 rounded-full border-4 flex items-center justify-center mr-4 ${
                                  userTier === 'Leader' ? 'border-[#20E28F] bg-[#F3FDF5]' : 
                                  userTier === 'Enabler' ? 'border-orange-500 bg-orange-50' : 
                                  'border-blue-400 bg-blue-50'
                                }`}
                              >
                                <span 
                                  className={`text-lg font-bold ${
                                    userTier === 'Leader' ? 'text-[#20E28F]' : 
                                    userTier === 'Enabler' ? 'text-orange-500' : 
                                    'text-blue-400'
                                  }`}
                                >
                                  {userTier?.[0] || '?'}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-[#103138]">{userTier || 'Unknown'}</h3>
                                <p className="text-[#103138]/70 text-sm">AI Maturity Tier</p>
                              </div>
                            </div>
                            
                            <div className="w-full md:w-3/5">
                              <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`tier-progress-fill ${ 
                                    userTier === 'Leader' ? 'w-full bg-gradient-to-r from-[#20E28F] to-[#5de4b1]' : 
                                    userTier === 'Enabler' ? 'w-2/3 bg-gradient-to-r from-orange-400 to-orange-300' : 
                                    userTier === 'Dabbler' ? 'w-1/3 bg-gradient-to-r from-[#01CEFE] to-[#01CEFE]/80' : 
                                    'w-0'
                                  }`}
                                  // Removed the incorrect style attribute since className now handles width and color
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6 bg-[#F3FDF5]/40 rounded-lg border border-[#20E28F]/10 mb-6">
                            <h4 className="font-semibold text-lg text-[#103138] mb-3 flex items-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-[#20E28F]">
                                <path d="M9 10.5L11 12.5L15.5 8M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" 
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                              Your Assessment Results
                            </h4>
                            <p className="text-[#103138]/80 leading-relaxed">
                              {userName ? `${userName}, your` : 'Your'} organization is at the <strong className="text-[#103138]">{userTier}</strong> tier of AI maturity.
                              {getTierDescription(userTier)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-6 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-[#103138]">Next Steps</h4>
                            <button onClick={() => handleTabChange('Strategic Action Plan')} className="text-sm text-[#20E28F] font-medium hover:text-[#103138] transition-colors flex items-center gap-1">
                              View Action Plan
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-[#103138]/70 mt-2">
                            Explore your detailed results and recommendations in the sections of this report. We've created a personalized action plan to help advance your AI maturity.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={keyFindingsRef} className={`section-content ${activeTab !== 'Key Findings' && 'hidden'}`}>
                  <KeyFindingsSection 
                    markdownContent={reportMarkdown || ''}
                  />
                </div>

                {activeTab === 'Recommendations' && (
                  <div className={`section-content ${activeTab !== 'Recommendations' && 'hidden'}`}>
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-[#103138] mb-4 flex items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-[#20E28F]">
                          <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Recommendations & Next Steps
                      </h2>
                      
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-[#103138] flex items-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-[#20E28F]">
                            <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Key Recommendations Based on Your Assessment
                        </h3>
                        <p className="text-[#103138]/80 leading-relaxed mb-4">
                          Based on your assessment results, we've identified the following recommendations to help your organization
                          advance its AI maturity. These action items are tailored to your specific needs and current capabilities.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {actionItems && actionItems.length > 0 ? (
                          actionItems.map((action, index) => (
                            <div key={`action-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#20E28F]/20 transition-colors overflow-hidden group">
                              <div className="p-1 bg-gradient-to-r from-[#20E28F]/10 to-[#F3FDF5]/50"></div>
                              <div className="p-5">
                                <div className="flex items-start gap-4 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-[#F3FDF5] flex items-center justify-center text-[#20E28F] flex-shrink-0">
                                    <span className="font-bold">{index + 1}</span>
                                  </div>
                                  <h4 className="font-semibold text-[#103138] group-hover:text-[#20E28F] transition-colors leading-tight pt-1">
                                    <ReactMarkdown rehypePlugins={[rehypeRaw as any, rehypeSanitize as any]}>
                                      {action}
                                    </ReactMarkdown>
                                  </h4>
                                </div>
                                <div className="ml-12 text-sm text-[#103138]/70">
                                  <ReactMarkdown rehypePlugins={[rehypeRaw as any, rehypeSanitize as any]}>
                                    {getRecommendationDescription(index, action)}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 bg-gray-50 p-8 rounded-lg text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-500 mb-2">No Recommendations Found</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                              We couldn't extract specific recommendations from your assessment.
                              Please contact support for personalized guidance.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-[#F3FDF5]/50 rounded-xl p-5 border border-[#20E28F]/20">
                        <h4 className="font-semibold text-[#103138] mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#20E28F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Implementation Tips
                        </h4>
                        <p className="text-sm text-[#103138]/80 mb-2">
                          For best results, prioritize these recommendations based on your organization's specific goals and constraints.
                          Consider forming cross-functional teams to implement these changes effectively.
                        </p>
                        <p className="text-sm text-[#103138]/80">
                          For a more detailed action plan, see the Strategic Action Plan section of this report.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Strategic Action Plan' && (
                  <div className={`section-content ${activeTab !== 'Strategic Action Plan' && 'hidden'}`}>
                    <StrategicActionPlanSection
                      reportMarkdown={reportMarkdown}
                    />
                  </div>
                )}

                {activeTab === 'Detailed Analysis' && (
                  <div className={`section-content ${activeTab !== 'Detailed Analysis' && 'hidden'}`}>
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-[#103138] mb-4 flex items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-[#20E28F]">
                          <path d="M10 9H6M15.5 11C13.567 11 12 9.433 12 7.5C12 5.567 13.567 4 15.5 4C17.433 4 19 5.567 19 7.5C19 9.433 17.433 11 15.5 11ZM6.5 21C4.567 21 3 19.433 3 17.5C3 15.567 4.567 14 6.5 14C8.433 14 10 15.567 10 17.5C10 19.433 8.433 21 6.5 21ZM18 16.5H14M18 19.5H14M6 6L10 6" 
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Detailed Analysis
                      </h2>
                      
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4 text-[#103138] flex items-center">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 5.25A2.25 2.25 0 014.25 3h15.5A2.25 2.25 0 0122 5.25v13.5A2.25 2.25 0 0119.75 21H4.25A2.25 2.25 0 012 18.75V5.25z" 
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 3v18M9 15h13" 
                              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Detailed Analysis
                        </h3>
                        <p className="text-[#103138]/80 leading-relaxed mb-4">
                          This analysis breaks down your assessment results across key dimensions of AI maturity.
                          Each dimension is evaluated based on your responses and includes specific insights for improvement.
                        </p>
                        
                        {userTier && (
                          <div className="mt-4 p-4 bg-[#F3FDF5] rounded-lg">
                            <p className="font-medium flex items-center">
                              <span className="w-3 h-3 rounded-full bg-[#20E28F] mr-2 flex-shrink-0"></span>
                              <span className="text-[#20E28F] font-semibold mr-2">Current AI Maturity Tier:</span> 
                              <span className="text-[#103138]">{userTier}</span>
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {reportMarkdown ? (
                        <DetailedAnalysisSection reportMarkdown={reportMarkdown} tier={userTier} />
                      ) : (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-500 mb-2">No Detailed Analysis Found</h3>
                          <p className="text-gray-400 max-w-md mx-auto">
                            We couldn't locate a detailed analysis section in your assessment report.
                            Please contact support for assistance.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'Benchmarks' && (
                  <div className={`section-content ${activeTab !== 'Benchmarks' && 'hidden'}`}>
                    <BenchmarksSection
                      reportMarkdown={reportMarkdown}
                      tier={userTier}
                      industry={userIndustry}
                    />
                  </div>
                )}

                {activeTab === 'Assessment Q&A' && (
                  <div className={`section-content ${activeTab !== 'Assessment Q&A' && 'hidden'}`}>
                    <QAndASection
                      questionAnswerHistory={questionAnswerHistory}
                    />
                  </div>
                )}

                {activeTab === 'Learning Path' && (
                  <div className={`section-content ${activeTab !== 'Learning Path' && 'hidden'}`}>
                    <LearningPathSection
                      reportMarkdown={reportMarkdown}
                      tier={userTier}
                    />
                  </div>
                )}
              </div>
            </main>
          </>
        ) : (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-white p-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg max-w-lg w-full mb-6">
              <h2 className="text-2xl font-bold mb-3 text-yellow-700">Report Not Found</h2>
              <p className="text-sg-dark-teal/70 mb-6">
                We couldn't find your report data. Would you like to return to the homepage and start a new assessment?
              </p>
              <button 
                onClick={() => window.location.href = '/'}  
                className="px-6 py-3 bg-sg-dark-teal text-white font-semibold rounded-lg shadow-sm hover:brightness-105 transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          
          body {
            background-color: ${colors.lightMint};
            color: ${colors.darkTeal};
          }
          
          .results-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          
          .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 10;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          }
          
          .header-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .header h1 {
            color: ${colors.darkTeal};
            font-weight: 700;
            margin-left: 0.5rem;
            font-size: 1.3rem;
          }
          
          .logo-container {
            width: auto;
            height: 32px;
            border-radius: 8px;
            background: linear-gradient(135deg, #103138, #1a4a52);
            border: 1px solid rgba(32, 226, 143, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px 12px;
            box-shadow: 0 2px 8px rgba(16, 49, 56, 0.15);
          }
          
          .logo-inner {
            height: 100%;
            width: auto;
            object-fit: contain;
            filter: brightness(1.1) contrast(1.05);
          }
          
          .header-actions {
            display: flex;
            gap: 12px;
          }
          
          .btn-primary {
            background-color: ${colors.brightGreen};
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
          }
          
          .btn-primary:hover {
            background-color: #1CC47E;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(32, 226, 143, 0.35);
          }
          
          .btn-secondary {
            background-color: white;
            color: ${colors.darkTeal};
            border: 1px solid rgba(16, 49, 56, 0.15);
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
          }
          
          .btn-secondary:hover {
            border-color: rgba(16, 49, 56, 0.3);
            background-color: rgba(16, 49, 56, 0.02);
          }
          
          .main-content {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 2rem;
            max-width: 1280px;
            margin: 2rem auto;
            padding: 0 2rem;
            flex-grow: 1;
            height: calc(100vh - 120px); /* Set explicit height for container */
          }
          
          .sidebar {
            background: ${colors.white};
            border-radius: 16px;
            padding: 1.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            height: fit-content;
            position: sticky;
            top: 100px;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-height: calc(100vh - 120px); /* Match parent container height */
            overflow-y: auto; /* Allow sidebar to scroll if content exceeds height */
          }
          
          .tier-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 1rem;
          }
          
          .tier-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: ${colors.white};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin-bottom: 1rem;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          }
          
          .tier-circle::before {
            content: '';
            position: absolute;
            top: -4px;
            right: -4px;
            bottom: -4px;
            left: -4px;
            background: linear-gradient(135deg, ${colors.brightGreen}, ${colors.lightBlue});
            border-radius: 50%;
            z-index: -1;
          }
          
          .tier-text {
            background: linear-gradient(90deg, ${colors.darkTeal}, ${colors.brightGreen});
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 1.75rem;
            font-weight: 700;
          }
          
          .tier-label {
            color: ${colors.darkTeal}cc;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            font-weight: 500;
          }
          
          .tier-progress {
            background: ${colors.white};
            border-radius: 12px;
            padding: 1.2rem;
            padding-top: 1rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.03);
          }
          
          .tier-progress-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: ${colors.darkTeal};
            margin-bottom: 0.8rem;
          }
          
          .tier-progress-bar {
            height: 8px;
            background: ${colors.lightMint};
            border-radius: 4px;
            position: relative;
            margin-bottom: 0.8rem;
            overflow: hidden;
          }
          
          .tier-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, ${colors.brightGreen}, #5de4b1);
            border-radius: 4px;
            transition: width 1s ease-in-out;
            box-shadow: 0 0 8px rgba(32, 226, 143, 0.4);
          }
          
          .tier-progress-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.7rem;
            color: ${colors.darkTeal}99;
            font-weight: 500;
          }
          
          .nav-menu {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .nav-section-title {
            font-size: 0.8rem;
            font-weight: 700;
            color: ${colors.darkTeal}cc;
            margin-bottom: 0.3rem;
            padding-left: 0.5rem;
          }
          
          .nav-item {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 0.8rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            color: ${colors.darkTeal}dd;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          
          .nav-item:hover {
            background: ${colors.lightMint}66;
          }
          
          .nav-item.active {
            background: ${colors.lightMint};
            color: ${colors.brightGreen};
            font-weight: 600;
          }
          
          .nav-item svg {
            color: inherit;
          }
          
          .user-info {
            margin-top: auto;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
          }
          
          .user-info-label {
            font-size: 0.7rem;
            color: ${colors.darkTeal}99;
            margin-bottom: 0.3rem;
          }
          
          .user-info-name {
            font-size: 0.9rem;
            font-weight: 600;
            color: ${colors.darkTeal};
          }
          
          .content-panel {
            background: ${colors.lightMint}33;
            border-radius: 16px;
            padding: 2rem;
            overflow-y: auto;
            height: calc(100vh - 120px);
            transition: opacity 0.3s ease;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.01);
          }
          
          .content-panel.fade-out {
            opacity: 0;
          }
          
          .content-panel.fade-in {
            opacity: 1;
          }
          
          /* Common Card Styles */
          .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: all 0.2s ease;
          }
          
          .card:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }
          
          .card-header {
            padding: 1.25rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: ${colors.darkTeal};
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .card-body {
            padding: 1.25rem;
          }
          
          .card-footer {
            padding: 1rem 1.25rem;
            background: ${colors.lightMint}33;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            font-size: 0.875rem;
          }
          
          /* Typography */
          .section-title {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            font-size: 1.8rem;
            font-weight: 700;
            color: ${colors.darkTeal};
            margin-bottom: 1.5rem;
          }
          
          .section-subtitle {
            font-size: 1.4rem;
            font-weight: 600;
            color: ${colors.darkTeal};
            margin-bottom: 1rem;
            margin-top: 2rem;
          }
          
          .text-primary {
            color: ${colors.brightGreen};
          }
          
          .text-secondary {
            color: ${colors.darkTeal}aa;
          }
          
          .text-sm {
            font-size: 0.875rem;
          }
          
          /* Badges */
          .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 30px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .badge-primary {
            background: ${colors.lightMint};
            color: ${colors.brightGreen};
          }
          
          .badge-secondary {
            background: ${colors.cream1};
            color: ${colors.orange};
          }
          
          /* Lists */
          .feature-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin: 1rem 0;
          }
          
          .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .feature-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${colors.lightMint};
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: ${colors.brightGreen};
          }
          
          .feature-text {
            color: ${colors.darkTeal}dd;
            line-height: 1.5;
            font-size: 0.95rem;
          }
          
          /* Gradients & Dividers */
          .gradient-top-border {
            position: relative;
          }
          
          .gradient-top-border::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, ${colors.brightGreen}, ${colors.lightBlue});
            border-radius: 4px 4px 0 0;
          }
          
          .divider {
            height: 1px;
            background: rgba(0, 0, 0, 0.05);
            margin: 1.5rem 0;
          }
          
          /* Tables */
          .table-container {
            overflow-x: auto;
            margin: 1.5rem 0;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .data-table th {
            background: ${colors.lightMint}55;
            padding: 0.75rem 1rem;
            text-align: left;
            font-weight: 600;
            color: ${colors.darkTeal};
            font-size: 0.875rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          }
          
          .data-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            color: ${colors.darkTeal}dd;
            font-size: 0.875rem;
          }
          
          .data-table tr:last-child td {
            border-bottom: none;
          }
          
          .data-table tr:hover td {
            background: ${colors.lightMint}22;
          }
          
          /* Accordions */
          .accordion {
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 1rem;
          }
          
          .accordion-header {
            padding: 1rem;
            background: white;
            font-weight: 600;
            color: ${colors.darkTeal};
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .accordion-body {
            padding: 0 1rem 1rem 1rem;
            color: ${colors.darkTeal}dd;
            font-size: 0.95rem;
            line-height: 1.6;
          }
          
          /* Alerts */
          .alert {
            padding: 1rem;
            border-radius: 8px;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin: 1rem 0;
          }
          
          .alert-info {
            background: ${colors.lightMint}44;
            border-left: 4px solid ${colors.brightGreen};
          }
          
          .alert-warning {
            background: ${colors.cream1};
            border-left: 4px solid ${colors.orange};
          }
          
          .alert-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
          }
          
          .alert-content {
            flex: 1;
          }
          
          .alert-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
          }
          
          .alert-text {
            font-size: 0.875rem;
            line-height: 1.5;
          }
          
          /* General spacing utilities */
          .mt-2 { margin-top: 0.5rem; }
          .mt-4 { margin-top: 1rem; }
          .mt-6 { margin-top: 1.5rem; }
          .mt-8 { margin-top: 2rem; }
          
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          
          /* Additional responsive styles */
          @media (max-width: 1024px) {
            .main-content {
              grid-template-columns: 240px 1fr;
              padding: 0 1rem;
            }
            
            .content-panel {
              padding: 1.5rem;
            }
          }
          
          @media (max-width: 768px) {
            .main-content {
              grid-template-columns: 1fr;
              gap: 1rem;
              padding: 0 1rem;
              margin: 1rem auto;
              height: auto; /* Remove fixed height on mobile */
              min-height: calc(100vh - 140px); /* Ensure minimum height but allow expansion */
            }
            
            .sidebar {
              display: none; /* Hide sidebar on mobile - replaced with mobile menu */
            }
            
            .content-panel {
              height: auto; /* Remove fixed height on mobile */
              max-height: none;
              padding: 1rem;
              min-height: 60vh; /* Ensure minimum content height */
            }
            
            .insights-grid {
              grid-template-columns: 1fr;
            }
            
            .header-actions {
              display: none; /* Hide desktop header actions on small screens */
            }
            
            .header-content {
              padding: 1rem;
              justify-content: space-between;
            }
            
            .header-content h1 {
              font-size: 1.25rem;
            }
            
            .logo-container {
              width: 120px;
            }
            
            /* Ensure mobile menu appears properly */
            .header {
              position: sticky; /* Keep sticky positioning but ensure proper z-index */
              z-index: 30; /* Ensure header is above content but below mobile menu */
            }
          }
          
          @media (max-width: 480px) {
            .header-content {
              padding: 0.75rem;
            }
            
            .header-content h1 {
              font-size: 1.1rem;
            }
            
            .logo-container {
              width: 100px;
            }
            
            .content-panel {
              padding: 0.75rem;
              border-radius: 8px;
              margin-bottom: 2rem; /* Add bottom margin for better footer spacing */
            }
            
            .main-content {
              margin-bottom: 2rem; /* Add bottom margin to main content */
              padding-bottom: 2rem; /* Add bottom padding */
            }
            
            /* Mobile-specific improvements */
            .section-title {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
            
            .section-subtitle {
              font-size: 1.25rem;
              margin-bottom: 0.75rem;
              margin-top: 1.5rem;
            }
            
            /* Improve touch targets on mobile */
            button {
              min-height: 44px;
            }
            
            /* Better spacing for mobile readability */
            .prose {
              font-size: 0.95rem;
              line-height: 1.6;
            }
            
            .prose h1, .prose h2, .prose h3 {
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }
            
            .prose p {
              margin-bottom: 1rem;
            }
            
            .prose ul, .prose ol {
              margin-bottom: 1rem;
              padding-left: 1.5rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}
