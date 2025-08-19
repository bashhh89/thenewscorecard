import React from 'react';
import Link from 'next/link';

interface LearningPathSectionProps {
  reportMarkdown: string | null;
  tier: string | null;
}

export const LearningPathSection: React.FC<LearningPathSectionProps> = ({ 
  reportMarkdown,
  tier
}) => {
  // Extract learning path content or generate default based on tier
  const extractLearningPathContent = (markdown: string): string => {
    // Try to find a learning path section in the markdown
    const learningPathMatch = markdown.match(/## (Learning Path|Next Steps|Personalized Learning|Continue Your Journey)[:\s]*([\s\S]*?)(?=##|$)/i);
    if (learningPathMatch && learningPathMatch[2]) {
      return learningPathMatch[2].trim();
    }
    
    // If not found, return a default
    return generateDefaultLearningPath(tier);
  };
  
  const generateDefaultLearningPath = (tier: string | null): string => {
    const tierLower = tier?.toLowerCase() || 'unknown';
    
    const paths = {
      leader: `Based on your Leader tier assessment, we recommend focusing on these advanced AI topics:

1. **AI Ethics and Responsible AI Governance**
   - Learn how to establish comprehensive AI ethics frameworks
   - Develop robust processes for AI risk assessment and mitigation

2. **Enterprise-wide AI Integration**
   - Strategies for scaling AI adoption across all business functions
   - Advanced organizational change management for AI transformation

3. **AI Innovation and Future-proofing**
   - Stay ahead of emerging AI technologies and applications
   - Develop an innovation roadmap for continued AI leadership`,

      enabler: `Based on your Enabler tier assessment, we recommend focusing on these key AI topics:

1. **Strategic AI Planning and Governance**
   - Develop a comprehensive AI strategy aligned with business objectives
   - Establish AI governance structures and policies

2. **Data Strategy and Management**
   - Build robust data infrastructure and governance practices
   - Implement data quality management processes

3. **AI Talent Development**
   - Strategies for upskilling existing staff and recruiting specialized talent
   - Creating cross-functional AI teams for maximum impact`,

      dabbler: `Based on your Dabbler tier assessment, we recommend focusing on these foundational AI topics:

1. **AI Fundamentals and Use Cases**
   - Understand key AI concepts, capabilities, and limitations
   - Identify high-value AI opportunities for your organization

2. **Building Your First AI Projects**
   - Practical approaches to starting small with AI implementation
   - Quick wins and proof-of-concept strategies

3. **Data Readiness Fundamentals**
   - Assessing your current data capabilities
   - Essential steps for improving data quality and accessibility`,

      unknown: `Our Learning Hub provides resources for organizations at all AI efficiency levels:

1. **AI Fundamentals and Strategy**
   - Key AI concepts, use cases, and strategic planning approaches
   - Identifying your organization's AI opportunities

2. **Implementation and Best Practices**
   - Practical guidance for AI project execution
   - Data readiness and infrastructure considerations

3. **Advanced Topics**
   - AI governance and ethics
   - Scaling AI across your organization`
    };
    
    return paths[tierLower as keyof typeof paths] || paths.unknown;
  };
  
  const learningPathContent = reportMarkdown ? extractLearningPathContent(reportMarkdown) : generateDefaultLearningPath(tier);

  // Recommended courses based on tier
  const getRecommendedCourses = (tier: string | null) => {
    const tierLower = tier?.toLowerCase() || 'unknown';
    
    const courses = {
      leader: [
        { title: "AI Governance Masterclass", path: "/learning-hub/ai-governance-masterclass" },
        { title: "Advanced AI Ethics", path: "/learning-hub/advanced-ai-ethics" },
        { title: "Scaling AI Enterprise-wide", path: "/learning-hub/scaling-ai-enterprise" }
      ],
      enabler: [
        { title: "Strategic AI Planning", path: "/learning-hub/strategic-ai-planning" },
        { title: "Building AI Teams", path: "/learning-hub/building-ai-teams" },
        { title: "Data Strategy for AI", path: "/learning-hub/data-strategy-ai" }
      ],
      dabbler: [
        { title: "AI Fundamentals", path: "/learning-hub/ai-fundamentals" },
        { title: "Quick Productivity Boosts with AI", path: "/learning-hub/quick-productivity-boosts" },
        { title: "Your First AI Project", path: "/learning-hub/my-first-ai-tool" }
      ],
      unknown: [
        { title: "AI Fundamentals", path: "/learning-hub/ai-fundamentals" },
        { title: "Strategic AI Planning", path: "/learning-hub/strategic-ai-planning" },
        { title: "AI Project Management", path: "/learning-hub/ai-project-management" }
      ]
    };
    
    return courses[tierLower as keyof typeof courses] || courses.unknown;
  };
  
  const recommendedCourses = getRecommendedCourses(tier);
  
  // Additional resources based on tier - mapped to actual paths that exist in the project
  const getAdditionalResources = (tier: string | null) => {
    const tierLower = tier?.toLowerCase() || 'unknown';
    
    // These paths exist in the project based on the project layout
    const resources = [
      { 
        title: "Ready-to-use Templates", 
        path: "/learning-hub/templates",
        description: "Jumpstart your AI implementation with professionally designed templates",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M5 15L5 16.4C5 17.8359 5 18.5544 5.22836 19.1111C5.43U1 19.6022 5.77919 20.021 6.20492 20.3094C6.68624 20.6364 7.32004 20.7299 8.58769 20.9168L10.6846 21.226C11.1898 21.3092 11.4425 21.3508 11.698 21.3646C11.9287 21.377 12.1597 21.3688 12.389 21.3402C12.6439 21.3092 12.8949 21.2512 13.3971 21.1353L15.5922 20.6362C16.6674 20.3929 17.2051 20.2712 17.6652 20.0285C18.0681 19.8159 18.4218 19.5347 18.7043 19.2001C19.0135 18.8322 19.2 18.363 19.5728 17.4247L22 11.5M5 15L5 5.2C5 4.07989 5 3.51984 5.21799 3.09202C5.40973 2.71569 5.71569 2.40973 6.09202 2.21799C6.51984 2 7.0 U2 8.2 2L14.8 2C15.9201 2 16.4802 2 16.908 2.21799C17.2843 2.40973 17.5903 2.71569 17.782 3.09202C18 3.51984 18 4.07989 18 5.2L18 11.5M5 15L11.5 11.5M22 11.5L18 11.5M18 11.5L11.5 11.5M11.5 11.5L5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      { 
        title: "AI Jargon Buster", 
        path: "/learning-hub/ai-jargon-buster",
        description: "Decode complex AI terminology with our simple explanations",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      { 
        title: "Recommended AI Tools", 
        path: "/learning-hub/recommended-tools",
        description: "Discover the best AI tools for your specific business needs",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M10.5 20.4L4.39081 14.2908C3.36687 13.2668 3.36687 11.6126 4.39081 10.5886L11.0999 3.87952C12.1239 2.85558 13.7781 2.85558 14.8021 3.87952L19.6033 8.68072C20.6272 9.70466 20.6272 11.3589 19.6033 12.3829L12.5 19.4863" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16.2333 5.24V5.24C17.9076 6.91438 17.9076 9.65094 16.2333 11.3253C14.5589 12.9996 11.8223 12.9996 10.148 11.3253C8.47361 9.65095 8.47361 6.91438 10.148 5.24C11.8223 3.56563 14.5589 3.56563 16.2333 5.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )
      },
    ];
    
    return resources;
  };
  
  const additionalResources = getAdditionalResources(tier);
  
  // Format user's tier value for query parameter
  const formattedTier = tier?.toLowerCase() || 'unknown';
  
  // Extract any specific learning topics from the markdown content
  const extractLearningTopics = (content: string): string[] => {
    const topics: string[] = [];
    
    // Look for numbered items and extract them
    const numberedListRegex = /\d+\.\s+\*\*([^*]+)\*\*/g;
    let match;
    
    while ((match = numberedListRegex.exec(content)) !== null) {
      if (match[1] && !topics.includes(match[1])) {
        topics.push(match[1]);
      }
    }
    
    return topics;
  };
  
  const learningTopics = extractLearningTopics(learningPathContent);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#103138] mb-4 flex items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-[#20E28F]">
          <path d="M12 9V4M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15M12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15M12 15V20M9 4H4V9M9 20H4V15M20 4H15V9M20 15H15V20" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Your Learning Path & Resources
      </h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#103138] flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-[#20E28F]">
            <path d="M4.5 12.75l6 6 9-13.5" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Personalized Learning Journey
        </h3>
        <p className="text-[#103138]/80 leading-relaxed mb-4">
          Based on your assessment results, we've created a personalized learning path to help you 
          advance your AI efficiency. These resources are tailored to your specific needs and current tier.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column - Personalized Learning Path Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 bg-[#F3FDF5]">
            <h3 className="text-lg font-semibold text-[#103138] flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-[#20E28F]">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" 
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Your Personalized Learning Path
            </h3>
          </div>
          
          <div className="p-6">
            <div className="prose prose-sm max-w-none text-[#103138]/90 space-y-4">
              {/* Display extracted topics if available, otherwise show the raw content */}
              {learningTopics.length > 0 ? (
                <ul className="space-y-5">
                  {learningTopics.map((topic, idx) => (
                    <li key={idx} className="flex">
                      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-[#F3FDF5] flex items-center justify-center mr-3 border border-[#20E28F]/20 text-[#20E28F] font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#103138] mb-1">{topic}</h4>
                        <p className="text-[#103138]/70 text-sm leading-relaxed">
                          {/* Try to extract description if possible, otherwise use static text */}
                          Tailored content to help your organization advance in this critical area
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  {learningPathContent.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className={idx > 0 ? 'mt-4' : ''}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
              <Link 
                href={`/learning-hub?tier=${formattedTier}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#20E28F] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <span>Explore Your Full Learning Hub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right column - Additional Resources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 bg-gray-50 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-[#103138] flex items-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                  stroke="#103138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Recommended Resources
            </h3>
          </div>
          
          <div className="p-6">
            <h4 className="font-medium text-[#103138] mb-3">Featured Courses for {tier || 'Your'} Tier</h4>
            <div className="grid gap-3">
              {recommendedCourses.map((course, idx) => (
                <Link
                  key={idx}
                  href={course.path}
                  className="group flex items-center p-4 border border-gray-100 rounded-lg hover:border-[#20E28F]/30 hover:bg-[#F3FDF5]/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F3FDF5] text-[#20E28F] flex items-center justify-center mr-3 group-hover:bg-[#20E28F]/10 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.5V17.5M12 6.5L7 10.5M12 6.5L17 10.5M2 17.5L2 6.5C2 4.29086 3.79086 2.5 6 2.5L18 2.5C20.2091 2.5 22 4.29086 22 6.5V17.5C22 19.7091 20.2091 21.5 18 21.5H6C3.79086 21.5 2 19.7091 2 17.5Z" 
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-[#103138] group-hover:text-[#20E28F] transition-colors">{course.title}</h5>
                    <div className="text-xs text-[#103138]/60 mt-1 group-hover:text-[#103138]/80 transition-colors">
                      Recommended for {tier || 'your'} AI maturity level
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#20E28F]">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-[#103138] mb-3">Quick Access Resources</h4>
              <div className="space-y-4">
                {additionalResources.map((resource, idx) => (
                  <Link 
                    key={idx}
                    href={resource.path}
                    className="flex items-start p-4 border border-gray-100 rounded-lg hover:border-[#20E28F]/30 hover:bg-[#F3FDF5]/10 transition-all group"
                  >
                    <div className="mt-0.5">
                      {resource.icon}
                    </div>
                    <div>
                      <div className="font-medium text-[#103138] group-hover:text-[#20E28F] transition-colors">{resource.title}</div>
                      <p className="text-xs text-[#103138]/60 mt-1">{resource.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#F3FDF5]/50 rounded-xl p-5 border border-[#20E28F]/20">
        <h4 className="font-semibold text-[#103138] mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#20E28F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Learning Path Information
        </h4>
        <p className="text-sm text-[#103138]/80 mb-2">
          Your personalized learning path is based on your assessment results and current AI maturity tier.
          As your organization evolves, your recommendations will be updated to match your progress.
        </p>
        <p className="text-sm text-[#103138]/80">
          Complete courses in your Learning Hub to track your progress and receive completion certificates.
        </p>
      </div>
    </div>
  );
}; 