import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

export const OverallTierSection = ({ 
  tier, 
  userName, 
  industry 
}: { 
  tier: string | null; 
  userName: string | null;
  industry: string | null;
}) => {
  // Determine tier for styling
  const tierLower = tier?.toLowerCase() || 'unknown';
  const tierDescriptions = {
    leader: "Your organization is at the forefront of AI adoption, with strategic implementation across multiple business areas. You have well-established processes and are likely seeing significant ROI from AI initiatives.",
    enabler: "Your organization has begun meaningful implementation of AI solutions in several areas. You have established processes but may have opportunities to expand scope or increase strategic alignment.",
    dabbler: "Your organization is in the early stages of AI adoption. You may have experimented with AI tools but likely lack comprehensive strategy or full organizational integration.",
    unknown: "Based on your responses, your organization's AI efficiency tier couldn't be precisely determined. The recommendations in this report will help guide your next steps."
  };

  return (
    <div>
      <h2 className="section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 7L12 12L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Overall AI Efficiency Assessment
      </h2>
      
      <div className="tier-card">
        <div className="tier-header">
          <span className={`tier-badge`} data-tier={tierLower}>{tier || 'Unknown'}</span>
          <h3 className="tier-title">
            {userName ? `${userName}, your` : 'Your'} Organization is {tier === 'Leader' ? 'Leading' : tier === 'Enabler' ? 'Advancing' : tier === 'Dabbler' ? 'Beginning' : 'Developing'} in AI Efficiency
          </h3>
        </div>
        
        <p className="tier-description">
          {tierDescriptions[tierLower as keyof typeof tierDescriptions] || tierDescriptions.unknown}
          {industry && ` Your assessment is tailored to the ${industry} industry, with specific recommendations to help you advance your AI capabilities.`}
        </p>
      </div>
    </div>
  );
};

export const KeyFindingsSection = ({ 
  strengths, 
  weaknesses 
}: { 
  strengths: string[]; 
  weaknesses: string[];
}) => {
  return (
    <div>
      <h2 className="section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 10.5L11 12.5L15.5 8M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Key Findings
      </h2>
      
      <div className="p-6 bg-white rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-sg-dark-teal">Summary of Your AI Efficiency Assessment</h3>
        <p className="mb-6 text-sg-dark-teal/80">
          Based on your responses, we've identified key areas where your organization excels and areas that present opportunities for improvement.
          These insights provide a foundation for the strategic recommendations in the next section.
        </p>
      </div>
      
      <div className="insights-grid">
        <div className="strengths-card">
          <h3 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22V16M12 16L15 19M12 16L9 19M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Organizational Strengths
          </h3>
          
          <ul className="insights-list">
            {strengths && strengths.length > 0 ? (
              strengths.map((strength, index) => (
                <li key={`strength-${index}`} className="insight-item">
                  <div className="insight-icon strength">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {strength}
                    </ReactMarkdown>
                  </div>
                </li>
              ))
            ) : (
              <li className="insight-item empty">No specific strengths identified.</li>
            )}
          </ul>
        </div>
        
        <div className="weaknesses-card">
          <h3 className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14V12M12 10H12.01M11 3H13M5.5 7.5L7 6M19 7.5L17.5 6M11.9998 22H12.9998C16.9998 22 19.9998 20 19.9998 15C19.9998 11.5 17.9998 10 16.9998 10C16.9998 7 14.9998 5 11.9998 5C8.99976 5 6.99976 7 6.99976 10C5.99976 10 3.99976 11.5 3.99976 15C3.99976 20 6.99976 22 10.9998 22H11.9998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Improvement Opportunities
          </h3>
          
          <ul className="insights-list">
            {weaknesses && weaknesses.length > 0 ? (
              weaknesses.map((weakness, index) => (
                <li key={`weakness-${index}`} className="insight-item">
                  <div className="insight-icon weakness">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {weakness}
                    </ReactMarkdown>
                  </div>
                </li>
              ))
            ) : (
              <li className="insight-item empty">No specific improvement areas identified.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const RecommendationsSection = ({ 
  actionItems 
}: { 
  actionItems: string[];
}) => {
  return (
    <div>
      <h2 className="section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Recommendations & Action Plan
      </h2>
      
      <div className="p-6 bg-white rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-sg-dark-teal">Strategic Next Steps</h3>
        <p className="mb-6 text-sg-dark-teal/80">
          Based on your assessment results, we've developed these targeted recommendations to help you advance your AI efficiency.
          These actionable steps focus on the highest-impact opportunities for your organization.
        </p>
      </div>
      
      <div className="action-plan-preview">
        <div className="action-items">
          {actionItems && actionItems.length > 0 ? (
            actionItems.map((action, index) => (
              <div key={`action-${index}`} className="action-item">
                <div className="action-number">{index + 1}</div>
                <div className="action-text">
                  <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                    {action}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          ) : (
            <div className="action-item empty">No specific action items identified.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DetailedAnalysisSection = ({ 
  reportMarkdown, 
  tier 
}: { 
  reportMarkdown: string | null;
  tier: string | null;
}) => {
  // Parse the markdown to extract detailed sections
  const extractSections = (markdown: string) => {
    const sections: {[key: string]: string} = {};
    
    console.log('DETAILED ANALYSIS: Extracting sections from markdown');
    
    // Try to extract strategy section - more flexible pattern
    const strategyMatch = markdown.match(/## [^#]*?(Strategy|Strategic)[^#]*?([\s\S]*?)(?=##|$)/i);
    if (strategyMatch && strategyMatch[2]) {
      sections.strategy = strategyMatch[2].trim();
      console.log('DETAILED ANALYSIS: Found strategy section');
    }
    
    // Try to extract data section - more flexible pattern
    const dataMatch = markdown.match(/## [^#]*?(Data)[^#]*?([\s\S]*?)(?=##|$)/i);
    if (dataMatch && dataMatch[2]) {
      sections.data = dataMatch[2].trim();
      console.log('DETAILED ANALYSIS: Found data section');
    }
    
    // Try to extract technology section - more flexible pattern
    const techMatch = markdown.match(/## [^#]*?(Technology|Tech)[^#]*?([\s\S]*?)(?=##|$)/i);
    if (techMatch && techMatch[2]) {
      sections.technology = techMatch[2].trim();
      console.log('DETAILED ANALYSIS: Found technology section');
    }
    
    // Try to extract team/process section - more flexible pattern
    const teamMatch = markdown.match(/## [^#]*?(Team|Process|Team\/Process|Team and Process)[^#]*?([\s\S]*?)(?=##|$)/i);
    if (teamMatch && teamMatch[2]) {
      sections.team = teamMatch[2].trim();
      console.log('DETAILED ANALYSIS: Found team section');
    }
    
    // Try to extract governance section - more flexible pattern
    const govMatch = markdown.match(/## [^#]*?(Governance|Ethics|Governance and Ethics)[^#]*?([\s\S]*?)(?=##|$)/i);
    if (govMatch && govMatch[2]) {
      sections.governance = govMatch[2].trim();
      console.log('DETAILED ANALYSIS: Found governance section');
    }
    
    // If we didn't find any sections, look for other common report sections
    if (Object.keys(sections).length === 0) {
      console.log('DETAILED ANALYSIS: No standard sections found, looking for other sections');
      
      // Look for any h2 headings and extract their content
      const headingRegex = /## ([^#\n]+)([\s\S]*?)(?=##|$)/g;
      let match;
      while ((match = headingRegex.exec(markdown)) !== null) {
        const heading = match[1].trim();
        const content = match[2].trim();
        
        // Skip headings that are already included as standard sections
        if (heading.toLowerCase().includes('overall tier') || 
            heading.toLowerCase().includes('strengths') || 
            heading.toLowerCase().includes('weaknesses') || 
            heading.toLowerCase().includes('recommendations')) {
          continue;
        }
        
        // Use the heading as section key (lowercase, with spaces replaced by underscores)
        const key = heading.toLowerCase().replace(/\s+/g, '_');
        sections[key] = content;
        console.log(`DETAILED ANALYSIS: Found additional section: ${heading}`);
      }
    }
    
    return sections;
  };
  
  const sections = reportMarkdown ? extractSections(reportMarkdown) : {};
  
  return (
    <div>
      <h2 className="section-title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 9H6M15.5 11C13.567 11 12 9.433 12 7.5C12 5.567 13.567 4 15.5 4C17.433 4 19 5.567 19 7.5C19 9.433 17.433 11 15.5 11ZM6.5 21C4.567 21 3 19.433 3 17.5C3 15.567 4.567 14 6.5 14C8.433 14 10 15.567 10 17.5C10 19.433 8.433 21 6.5 21ZM18 16.5H14M18 19.5H14M6 6L10 6" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Detailed Analysis
      </h2>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-sg-dark-teal">Comprehensive AI Efficiency Breakdown</h3>
        <p className="mb-4 text-sg-dark-teal/80">
          This detailed analysis breaks down your assessment results across five key dimensions of AI efficiency. 
          Each dimension is evaluated based on your responses and includes specific insights.
        </p>
        
        {tier && (
          <div className="mt-4 p-4 bg-sg-light-mint rounded-lg">
            <p className="font-medium">
              <span className="text-sg-bright-green font-semibold">Current AI Efficiency Tier:</span> {tier}
            </p>
          </div>
        )}
      </div>
      
      {Object.keys(sections).length > 0 ? (
        <div className="space-y-6">
          {sections.strategy && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-sg-dark-teal">Strategy</h3>
              <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {sections.strategy}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {sections.data && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-sg-dark-teal">Data</h3>
              <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {sections.data}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {sections.technology && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-sg-dark-teal">Technology</h3>
              <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {sections.technology}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {sections.team && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-sg-dark-teal">Team & Process</h3>
              <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {sections.team}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {sections.governance && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-sg-dark-teal">Governance</h3>
              <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {sections.governance}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      ) : reportMarkdown ? (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="prose prose-sm max-w-none text-sg-dark-teal/80">
            <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {reportMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow">
          <p className="text-center text-sg-dark-teal/50 italic">Detailed report content not available.</p>
        </div>
      )}
    </div>
  );
}; 