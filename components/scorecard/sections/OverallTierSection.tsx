'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface OverallTierSectionProps {
  markdownContent: string;
  extractedTier: string | null;
  userName?: string;
}

// All possible tiers for the AI efficiency model
const allTiers = ['Dabbler', 'Enabler', 'Leader'];

// Define tier colors and descriptions for consistency
const tierConfig = {
  'Dabbler': {
    color: '#FEC401', // Yellow
    gradient: 'from-yellow-400 to-yellow-500',
    description: 'You\'re taking your first steps with AI. Focus on building awareness and experimenting with AI tools.',
  },
  'Enabler': {
    color: '#01CEFE', // Blue
    gradient: 'from-blue-400 to-blue-500',
    description: 'You\'re actively implementing AI solutions. Focus on scaling successful pilots and developing governance.',
  },
  'Leader': {
    color: '#20E28F', // Green
    gradient: 'from-sg-bright-green to-sg-bright-green/70',
    description: 'You\'re leading with AI innovation. Focus on optimizing your AI ecosystem and driving transformative change.',
  }
};

const OverallTierSection: React.FC<OverallTierSectionProps> = ({ 
  markdownContent, 
  extractedTier,
  userName = '' 
}) => {
  // Extract name from markdown if not provided as prop
  const displayName = userName || (() => {
    const nameMatch = markdownContent.match(/leadName:\s*"([^"]+)"|companyName:\s*"([^"]+)"|name:\s*"([^"]+)"/i);
    return nameMatch ? (nameMatch[1] || nameMatch[2] || nameMatch[3]) : '';
  })();
  
  // Determine current tier index
  const currentTierIndex = extractedTier ? allTiers.indexOf(extractedTier) : -1;
  
  // Get tier configuration
  const tierInfo = extractedTier && (extractedTier in tierConfig) ? tierConfig[extractedTier as keyof typeof tierConfig] : null;

  // Get gradient for current tier
  const getProgressGradient = () => {
    if (!extractedTier) return 'from-gray-400 to-gray-500';
    return tierInfo?.gradient || 'from-sg-bright-green to-sg-bright-green/70';
  };
  
  return (
    <div className="space-y-10">
      <Card className="p-8">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative flex-shrink-0">
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getProgressGradient()} blur-xl rounded-full transform scale-110 z-0 opacity-70`}></div>
              <div className="relative flex flex-col items-center justify-center w-64 h-64 bg-white rounded-full border-4 border-sg-bright-green z-10 shadow-xl">
                <div className="text-center">
                  <span className="text-sg-dark-teal text-6xl font-black tracking-tighter">
                    {extractedTier || '?'}
                  </span>
                  <span className="block text-gray-600 text-base font-medium uppercase tracking-widest mt-1">
                    AI TIER
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 mt-6 md:mt-0">
              {displayName && (
                <h3 className="font-title-card text-sg-dark-teal mb-3">
                  Hello, <span className="text-sg-bright-green">{displayName}</span>!
                </h3>
              )}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {markdownContent.replace(/^##\s*Overall Tier:.*?\n+/im, '')} 
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Efficiency Tier Progression Visualization */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Your AI Efficiency Journey</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="flex items-center justify-between mb-8">
            <div className="text-sm font-medium text-gray-500">Beginner</div>
            <div className="text-sm font-medium text-gray-500">Advanced</div>
          </div>
          
          <div className="relative mb-16">
            {/* Progress bar background */}
            <div className="h-3 bg-gray-100 rounded-full w-full shadow-inner"></div>
            
            {/* Progress indicator */}
            <div 
              className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${getProgressGradient()} rounded-full transition-all duration-500 shadow-md`}
              style={{ width: currentTierIndex >= 0 ? `${((currentTierIndex + 1) / allTiers.length) * 100}%` : '0%' }}
            ></div>
            
            {/* Tier markers */}
            <div className="flex justify-between absolute w-full top-0 transform -translate-y-1/2">
              {allTiers.map((tier, index) => {
                const isCurrent = tier === extractedTier;
                const isPast = currentTierIndex > index;
                const tierStyle = tierConfig[tier as keyof typeof tierConfig];
                
                return (
                  <div 
                    key={tier} 
                    className={`flex flex-col items-center transition-all duration-300 ${isCurrent ? 'scale-110' : ''}`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-md ${
                        isCurrent 
                          ? 'bg-sg-bright-green ring-4 ring-sg-bright-green/30' 
                          : isPast 
                            ? 'bg-sg-bright-green/70' 
                            : 'bg-gray-300'
                      }`}
                    >
                      {isCurrent && (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span 
                      className={`mt-2 font-medium ${
                        isCurrent 
                          ? 'text-sg-bright-green text-base' 
                          : isPast 
                            ? 'text-sg-dark-teal text-sm' 
                            : 'text-gray-500 text-sm'
                      }`}
                    >
                      {tier}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Card className="bg-sg-light-mint/50 border border-sg-bright-green/10">
            <CardContent className="p-5">
              <p className="font-medium mb-2 text-sg-dark-teal">What this means:</p>
              <p className="font-body-md">
                {extractedTier && extractedTier in tierConfig && tierConfig[extractedTier as keyof typeof tierConfig].description}
                {!extractedTier && 'Complete your assessment to discover where you are on your AI efficiency journey.'}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverallTierSection;
