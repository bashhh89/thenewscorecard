'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { generateFindings, insertKeyFindings } from '@/lib/findings-generator';

interface LeadCaptureFormProps {
  aiTier: string | null;
  onSubmitSuccess: (capturedName: string) => void; // Update to accept capturedName
  reportMarkdown: string | null;
  questionAnswerHistory: any[];
  industry: string; // Add the industry prop
  reportId?: string | null; // Added reportId as optional
}

interface FormData {
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  consent: boolean;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  aiTier,
  onSubmitSuccess,
  reportMarkdown,
  questionAnswerHistory,
  industry, // Destructure the industry prop
  reportId // Destructure reportId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      consent: false
    }
  });

  const onSubmit = async (data: FormData) => {
    console.log('Lead form submission started');
    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure the name is properly formatted (capitalize first letters)
      const formattedName = data.fullName.trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // Calculate strengths and weaknesses based on questionAnswerHistory
      const findings = generateFindings(questionAnswerHistory);
      
      // Store the data in session storage first for later reference if needed
      if (typeof window !== 'undefined') {
        console.log('Storing lead data in session storage');
        sessionStorage.setItem('scorecardLeadName', formattedName);
        localStorage.setItem('scorecardLeadName', formattedName);
        sessionStorage.setItem('scorecardUserName', formattedName);
        localStorage.setItem('scorecardUserName', formattedName);
        sessionStorage.setItem('scorecardLeadCompany', data.companyName);
        localStorage.setItem('scorecardLeadCompany', data.companyName);
        sessionStorage.setItem('scorecardLeadEmail', data.email);
        localStorage.setItem('scorecardLeadEmail', data.email);
        sessionStorage.setItem('scorecardLeadPhone', data.phone || '');
        localStorage.setItem('scorecardLeadPhone', data.phone || '');
        sessionStorage.setItem('scorecardLeadIndustry', industry);
        localStorage.setItem('scorecardLeadIndustry', industry);
      }

      // Determine if this is a pre-assessment or post-assessment lead capture
      const captureType = reportMarkdown ? 'leadCompleted' : 'leadCapture';
      console.log('Lead capture type:', captureType);

      // Add Key Findings to the report markdown if it exists
      let enhancedReportMarkdown = reportMarkdown;
      if (reportMarkdown) {
        enhancedReportMarkdown = insertKeyFindings(reportMarkdown, findings);
      }

      // Send the notification
      console.log('Sending lead notification to API');
      const response = await fetch('/api/send-lead-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadName: formattedName,
          leadCompany: data.companyName,
          leadEmail: data.email,
          leadPhone: data.phone,
          industry: industry,
          consent: data.consent,
          aiTier: aiTier || 'Not Available',
          type: captureType,
          reportMarkdown: enhancedReportMarkdown,
          questionAnswerHistory: questionAnswerHistory.slice(0, 20),
          findings: findings // Include the generated findings
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Failed to send lead notification:', response.status, errorBody);
        throw new Error(`Failed to submit lead data. Status: ${response.status}`);
      }

      console.log('Lead notification sent successfully');
      
      // Important: Call onSubmitSuccess before setting isSubmitting to false
      onSubmitSuccess(formattedName);

    } catch (err) {
      console.error('Error in form submission:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // Don't set isSubmitting to false here - move it to finally
    } finally {
      // Add a small delay before setting isSubmitting to false to ensure state updates are processed
      setTimeout(() => {
        setIsSubmitting(false);
      }, 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sg-card-featured mb-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-sg-light-mint rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sg-bright-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {reportMarkdown ? (
            <>
              <h2 className="text-2xl font-bold text-sg-dark-teal mb-2">Your AI Scorecard is Ready!</h2>
              <p className="text-lg text-sg-dark-teal/70 mb-2">
                Congratulations on completing the assessment.
              </p>
              <p className="text-md text-sg-dark-teal/70">
                Please provide your details to receive your personalized AI efficiency report.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-sg-dark-teal mb-2">You're Almost Done!</h2>
              <p className="text-lg text-sg-dark-teal/70 mb-2">
                Just a few more questions to complete your assessment.
              </p>
              <p className="text-md text-sg-dark-teal/70">
                Please provide your details to continue your AI efficiency journey and receive your personalized report.
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-sg-dark-teal mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-sg-bright-green focus:border-sg-bright-green`}
                placeholder="Your full name"
                {...register('fullName', { 
                  required: 'Full name is required',
                  validate: {
                    notPlaceholder: (value) => {
                      const lowercaseValue = value.toLowerCase().trim();
                      return (
                        lowercaseValue !== 'user' && 
                        lowercaseValue !== 'test' && 
                        lowercaseValue !== 'customer' && 
                        lowercaseValue !== 'placeholder'
                      ) || 'Please enter your real name';
                    },
                    minLength: (value) => value.trim().length > 2 || 'Name is too short'
                  }
                })}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-sg-dark-teal mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                className={`w-full px-4 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-sg-bright-green focus:border-sg-bright-green`}
                placeholder="Your company name"
                {...register('companyName', { required: 'Company name is required' })}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sg-dark-teal mb-2">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-sg-bright-green focus:border-sg-bright-green`}
                placeholder="your.email@company.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-sg-dark-teal mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-sg-bright-green focus:border-sg-bright-green`}
                placeholder="Your phone number"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="consent"
                  type="checkbox"
                  className={`h-4 w-4 rounded border-gray-300 text-sg-bright-green focus:ring-sg-bright-green ${errors.consent ? 'border-red-500' : ''}`}
                  {...register('consent', { required: 'You must agree to the terms' })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="consent" className="font-medium text-sg-dark-teal/80">
                  I consent to Social Garden contacting me and processing my data as per the <a href="https://socialgarden.com.au/privacy-policy/" className="text-sg-bright-green hover:underline">privacy policy</a>. <span className="text-red-500">*</span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-sm text-red-500">{errors.consent.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-sg-bright-green text-white font-medium rounded-lg shadow-sm hover:bg-sg-bright-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sg-bright-green transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : reportMarkdown ? (
                "View Your Scorecard"
              ) : (
                "Continue to Assessment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureForm;
