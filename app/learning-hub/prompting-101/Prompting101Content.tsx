'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/Card';
import { Accordion } from '@/components/ui/Accordion';
import MiniFloatingSidebar from '@/components/learning-hub/MiniFloatingSidebar';
import ModuleNavigation from '@/components/learning-hub/ModuleNavigation';
import Module1 from './Module1';
import Module2 from './Module2';
import Module3 from './Module3';
import Module4 from './Module4';
import Module5 from './Module5';

// Define module structure
const modules = [
  {
    id: 'introduction',
    label: 'Introduction: Unlock AI\'s True Potential',
    component: () => (
      <div className="animate-fadeIn">
        <h2>Introduction: Unlock AI's True Potential – It Starts With Your Instructions!</h2>
        
        <p>Have you experimented with AI tools like ChatGPT, Gemini, or others for your marketing tasks? Perhaps you've asked for content, ideas, or explanations, and found the results... a little underwhelming? Maybe they were too generic, not quite hitting the mark, or simply not what you envisioned. If so, you're not alone, and there's a straightforward way to significantly improve your outcomes.</p>
        
        <p>The secret to unlocking truly <em>amazing</em> results from AI isn't about complex coding or needing to be an AI expert. It's about mastering the art of <strong>clear, effective communication</strong>. It's about providing specific instructions – known as "prompts" – that guide the AI to deliver <em>exactly</em> what you need.</p>
        
        <p>This mini-course is your practical, no-nonsense guide to <strong>Fundamental Power Prompting</strong>. We'll skip the deep technical jargon and focus on simple, potent strategies that will immediately elevate your AI interactions from "meh" to "magic," even if you're just beginning your AI journey.</p>
        
        <Card className="my-6">
          <CardContent className="p-6">
            <h3 className="font-title-card text-sg-dark-teal mb-3">What You'll Master in This Course:</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>Why vague prompts lead to vague results (and the simple fix).</li>
              <li>The 5 "Golden Keys" to crafting prompts that command attention and deliver quality.</li>
              <li>Actionable "prompt recipes" for common marketing tasks like drafting emails, brainstorming content, and summarizing information.</li>
              <li>The crucial skill of iteration: How to guide the AI to refine its output until it meets your highest standards.</li>
            </ul>
          </CardContent>
        </Card>
        
        <p>Ready to transition from being a passive AI <em>user</em> to a confident AI <em>director</em>? Let's begin your journey to prompting like a pro.</p>
      </div>
    )
  },
  {
    id: 'module1',
    label: 'Module 1: The Absolute Basics',
    component: () => <Module1 />
  },
  {
    id: 'module2',
    label: 'Module 2: The 5 Golden Keys',
    component: () => <Module2 />
  },
  {
    id: 'module3',
    label: 'Module 3: Prompt Recipes',
    component: () => <Module3 />
  },
  {
    id: 'module4',
    label: 'Module 4: Mastering Iteration',
    component: () => <Module4 />
  },
  {
    id: 'module5',
    label: 'Module 5: Practical Applications',
    component: () => <Module5 />
  }
];

export default function Prompting101Content() {
  const [activeModuleId, setActiveModuleId] = useState('introduction');
  
  // Get current module index
  const activeModuleIndex = modules.findIndex(module => module.id === activeModuleId);
  
  // Set up prev/next navigation
  const prevModule = activeModuleIndex > 0 
    ? { id: modules[activeModuleIndex - 1].id, label: modules[activeModuleIndex - 1].label } 
    : undefined;
    
  const nextModule = activeModuleIndex < modules.length - 1 
    ? { id: modules[activeModuleIndex + 1].id, label: modules[activeModuleIndex + 1].label } 
    : undefined;
  
  // Handle module change
  const handleModuleChange = (id: string) => {
    setActiveModuleId(id);
    // Scroll to top when changing modules
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-plus-jakarta prose-headings:font-bold prose-headings:text-sg-dark-teal prose-p:text-sg-dark-teal/90 prose-a:text-sg-bright-green prose-a:no-underline hover:prose-a:underline prose-strong:text-sg-dark-teal prose-li:text-sg-dark-teal/90 prose-ol:text-sg-dark-teal/90 prose-ul:text-sg-dark-teal/90">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-4">Prompting 101: From "Meh" to "Magic" with Simple Instructions</h1>
        <p className="text-xl text-sg-dark-teal/70 mb-6">Unlock AI's true potential with clear, effective communication techniques.</p>
        
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="bg-sg-dark-teal/10 text-sg-dark-teal text-sm font-semibold px-3 py-1 rounded-full">
            Dabbler Tier
          </span>
          <span className="flex items-center text-sm text-sg-dark-teal/70">
            <svg className="w-4 h-4 mr-1 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            30 minutes
          </span>
          <span className="flex items-center text-sm text-sg-dark-teal/70">
            <svg className="w-4 h-4 mr-1 text-sg-bright-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            5 modules
          </span>
        </div>
      </div>
      
      {/* Content display with floating sidebar */}
      <div className="relative">
        {/* Display active module content */}
        <div className="pr-0 md:pr-72">
          {modules.map(module => (
            <div 
              key={module.id}
              className={`transition-opacity duration-300 ${module.id === activeModuleId ? 'block' : 'hidden'}`}
            >
              {module.component()}
            </div>
          ))}
          
          {/* Navigation buttons */}
          <div className="mt-12">
            <ModuleNavigation
              prevModule={prevModule}
              nextModule={nextModule}
              onModuleChange={handleModuleChange}
              backToCoursesUrl="/learning-hub"
            />
          </div>
        </div>
        
        {/* Floating sidebar for module navigation (visible on medium and larger screens) */}
        <div className="hidden md:block absolute top-0 right-0 w-64">
          <MiniFloatingSidebar
            modules={modules.map(module => ({
              id: module.id,
              label: module.label,
              completed: modules.findIndex(m => m.id === module.id) < activeModuleIndex
            }))}
            activeModuleId={activeModuleId}
            onModuleChange={handleModuleChange}
          />
        </div>
      </div>
    </div>
  );
} 