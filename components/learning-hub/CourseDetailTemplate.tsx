"use client";

import React, { useState, ReactNode, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import SidebarNav from './SidebarNav';
import { MiniCourseNav } from './MiniCourseNav';
import { MiniCourseInfo } from '../../lib/learningHubData';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import EnhancedCourseNav from './EnhancedCourseNav';
import { Accordion } from '@/components/ui/Accordion';

interface CourseDetailTemplateProps {
  course: MiniCourseInfo;
  markdownContent?: string;
  children?: ReactNode;
}

export default function CourseDetailTemplate({ course, markdownContent, children }: CourseDetailTemplateProps) {
  const [activeSection, setActiveSection] = useState<string>('Mini Courses');
  
  // Parse markdown content into structured sections for modules if available
  const [contentSections, setContentSections] = useState<{id: string; label: string; content: string; isCompleted?: boolean}[]>([]);
  const [activeModuleId, setActiveModuleId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  
  useEffect(() => {
    if (markdownContent) {
      setIsLoading(true); // Set loading to true when markdownContent is available
      // Try to extract sections based on h2 headings
      const sections: {id: string; label: string; content: string; isCompleted?: boolean}[] = [];
      const sectionRegex = /##\s+([^\n]+)([^#]*?)(?=##|$)/g;
      
      let match;
      let index = 0;
      
      // If no sections are found, create a single "Overview" section
      let foundSections = false;
      
      while ((match = sectionRegex.exec(markdownContent)) !== null) {
        foundSections = true;
        const title = match[1].trim();
        const content = match[2].trim();
        
        sections.push({
          id: `section-${index}`,
          label: title,
          content: content,
          isCompleted: index === 0 // Mark first section as completed by default for demo
        });
        
        index++;
      }
      
      if (!foundSections) {
        sections.push({
          id: 'section-overview',
          label: 'Overview',
          content: markdownContent,
          isCompleted: false
        });
      }
      
      setContentSections(sections);
      
      // Set the first section as active by default only if contentSections was previously empty
      if (sections.length > 0 && contentSections.length === 0) {
        setActiveModuleId(sections[0].id);
      } else if (sections.length > 0 && !sections.find(section => section.id === activeModuleId)) {
         // If contentSections changed and the current activeModuleId is no longer valid, reset to the first section
         setActiveModuleId(sections[0].id);
      } else if (sections.length === 0) {
         // If contentSections is empty, clear activeModuleId
         setActiveModuleId('');
      }

      setIsLoading(false); // Set loading to false after processing
    } else {
      setContentSections([]); // Ensure contentSections is empty if no markdownContent
      setActiveModuleId(''); // Clear activeModuleId if no markdownContent
      setIsLoading(false); // Also set loading to false if no markdownContent
    }
  }, [markdownContent, contentSections.length, activeModuleId]); // Add dependencies
  
  // Handle module change
  const handleModuleChange = (id: string | number) => {
    setActiveModuleId(String(id)); // Ensure activeModuleId remains string if MiniCourseNav uses number
    
    // Mark previous modules as completed when navigating forward
    setContentSections(prevSections => {
      const newSections = [...prevSections];
      const currentIndex = newSections.findIndex(s => s.id === id);
      
      // Mark all previous sections as completed
      for (let i = 0; i < currentIndex; i++) {
        newSections[i] = { ...newSections[i], isCompleted: true };
      }
      
      return newSections;
    });
    
    // Scroll to top when changing modules
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <main className="flex min-h-screen font-plus-jakarta">
      {/* Left sidebar with main navigation */}
      <aside className="sidebar w-[300px] bg-sg-dark-teal text-white p-6 h-full min-h-screen relative overflow-auto">
        <SidebarNav
          userName="Guest"
          tier="Dabbler"
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </aside>
      
      {/* Main content area */}
      <div className="flex-1 bg-sg-light-mint overflow-auto">
        <div className="p-6 md:p-8">
          {/* Breadcrumb */}
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Course navigation - Now in a sidebar on larger screens */}
            <div className="order-2 lg:order-1">
              {contentSections.length > 0 && (
                <MiniCourseNav
                  courseName={course.title}
                  lessons={contentSections.map(section => ({
                    id: section.id,
                    title: section.label,
                    completed: section.isCompleted || false, // Ensure completed is boolean
                  }))}
                  currentLessonId={activeModuleId}
                  onLessonSelect={handleModuleChange}
                  userTier={course.tier[0] || 'All'} // Assuming tier is an array and taking the first one
                />
              )}
            </div>
            
            {/* Main content area */}
            <div className="order-1 lg:order-2">
              {/* Course header */}
              <Card className="mb-6 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="font-title-main">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="font-body-md mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {course.tier.map((tierName) => (
                      <span key={tierName} className="bg-sg-dark-teal/10 text-sg-dark-teal text-sm font-semibold px-3 py-1 rounded-full">
                        {tierName} Tier
                      </span>
                    ))}
                    
                    {course.duration && (
                      <span className="flex items-center text-sm text-sg-dark-teal/70">
                        <svg className="w-4 h-4 mr-1 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {course.duration}
                      </span>
                    )}
                    
                    {course.modules && (
                      <span className="flex items-center text-sm text-sg-dark-teal/70">
                        <svg className="w-4 h-4 mr-1 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        {course.modules} modules
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Content area */}
              <Card className="overflow-hidden">
                {isLoading ? (
                  <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 mb-4 border-4 border-sg-light-mint border-t-sg-bright-green rounded-full animate-spin"></div>
                      <h3 className="text-lg font-semibold text-sg-dark-teal mb-2">Loading Course Content</h3>
                      <p className="text-sm text-sg-dark-teal/70">Please wait while we prepare your learning experience...</p>
                    </div>
                  </CardContent>
                ) : children ? (
                  <CardContent className="p-8">
                    {children}
                  </CardContent>
                ) : markdownContent && contentSections.length > 0 ? (
                  <CardContent className="p-8">
                    {/* Find and render only the active module's content */}
                    {contentSections.find(section => section.id === activeModuleId) ? (
                      <div className="prose prose-lg max-w-none prose-headings:font-plus-jakarta prose-headings:font-bold prose-headings:text-sg-dark-teal prose-p:text-sg-dark-teal/90 prose-a:text-sg-bright-green prose-a:no-underline hover:prose-a:underline prose-strong:text-sg-dark-teal prose-li:text-sg-dark-teal/90 prose-ol:text-sg-dark-teal/90 prose-ul:text-sg-dark-teal/90">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {contentSections.find(section => section.id === activeModuleId)?.content || ''}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>Module content not found.</p>
                    )}
                  </CardContent>
                ) : markdownContent && contentSections.length === 0 && !isLoading ? (
                  <CardContent className="p-8 text-center">
                    <p>No content sections found for this course.</p>
                  </CardContent>
                ) : (
                  <CardContent className="p-8">
                    <h2 className="font-title-section mb-4">Course Content</h2>
                    <p className="font-body-md mb-6">
                      Course content for '{course.title}' will go here. This will eventually render Markdown or structured content.
                    </p>
                    
                    <Card className="p-6 bg-sg-light-mint/50 border border-sg-bright-green/10">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="font-title-card">Coming Soon</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="font-body-md">
                          We're currently developing the full course content. Check back soon for the complete learning experience.
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
