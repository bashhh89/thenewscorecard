'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/Card';
import Link from 'next/link';

// Define the structure for a checklist item
interface ChecklistItem {
  id: string;
  text: string;
  section: 'before' | 'during' | 'after' | 'verdict';
  checked: boolean;
  notes: string;
}

export default function AIToolChecklistContent() {
  // Initialize checklist data
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    // Section 1: Before You Dive In
    { id: 'item-1', text: 'What specific marketing problem does this tool claim to solve for ME?', section: 'before', checked: false, notes: '' },
    { id: 'item-2', text: 'Is this problem a genuine pain point or a high-priority need for me/my business RIGHT NOW?', section: 'before', checked: false, notes: '' },
    { id: 'item-3', text: 'What\'s the "hook"? Does it offer a free trial, a freemium plan, or a very low-cost entry point for testing?', section: 'before', checked: false, notes: '' },
    { id: 'item-4', text: 'Quick Credibility Check: Do I recognize the company? Are there any obvious red flags from a quick Google search of "[Tool Name] reviews"?', section: 'before', checked: false, notes: '' },
    
    // Section 2: During the Test Drive
    { id: 'item-5', text: 'Ease of Sign-Up & Onboarding: Was it quick and painless to get started, or a frustrating nightmare?', section: 'during', checked: false, notes: '' },
    { id: 'item-6', text: 'User Interface (UI) First Impressions: Does it look clean, modern, and intuitive? Or is it cluttered and confusing as hell?', section: 'during', checked: false, notes: '' },
    { id: 'item-7', text: 'Core Feature Test: Can I easily find and test its MAIN advertised feature within 10-15 minutes?', section: 'during', checked: false, notes: '' },
    { id: 'item-8', text: 'Quality of Output (for Generative Tools): If it creates something (text, images), is the initial quality decent? Does it understand simple instructions?', section: 'during', checked: false, notes: '' },
    { id: 'item-9', text: '"Aha!" Moment Potential: Did I experience any small "wow" or "aha!" moment where I could see genuine value or time-saving potential?', section: 'during', checked: false, notes: '' },
    { id: 'item-10', text: 'Learning Curve: Does it feel like I could get reasonably proficient with the core features quickly, or does it seem like it needs a massive time investment to learn?', section: 'during', checked: false, notes: '' },
    
    // Section 3: After the Test Drive
    { id: 'item-11', text: 'Did it solve (or show clear potential to solve) the specific problem I identified in Question 1?', section: 'after', checked: false, notes: '' },
    { id: 'item-12', text: 'Was the experience generally positive and intuitive, or frustrating?', section: 'after', checked: false, notes: '' },
    { id: 'item-13', text: 'Realistically, will this tool save me time, improve my results, or enable me to do something valuable I can\'t easily do now?', section: 'after', checked: false, notes: '' },
    { id: 'item-14', text: '(If it\'s a paid tool after trial) Is the potential value worth the cost based on this initial test drive?', section: 'after', checked: false, notes: '' },
    
    // Verdict Section
    { id: 'verdict-1', text: 'HELL YES! (Explore Further / Consider Adopting)', section: 'verdict', checked: false, notes: '' },
    { id: 'verdict-2', text: 'MEH... (Maybe Revisit Later / Not a Priority Now)', section: 'verdict', checked: false, notes: '' },
    { id: 'verdict-3', text: 'FUCK NO! (Run Away, Don\'t Waste More Time)', section: 'verdict', checked: false, notes: '' },
  ]);
  
  const [toolName, setToolName] = useState<string>('');
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  
  // Load saved data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('aiToolChecklist');
      if (savedData) {
        try {
          const { items, name } = JSON.parse(savedData);
          setChecklistItems(items);
          setToolName(name || '');
        } catch (e) {
          console.error('Error loading saved checklist data:', e);
        }
      }
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiToolChecklist', JSON.stringify({
        items: checklistItems,
        name: toolName
      }));
    }
  }, [checklistItems, toolName]);
  
  // Handle checkbox toggling
  const handleCheckItem = (id: string) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    
    // For verdict items, uncheck other verdict items
    if (id.startsWith('verdict-')) {
      setChecklistItems(items => 
        items.map(item => 
          item.id.startsWith('verdict-') && item.id !== id 
            ? { ...item, checked: false } 
            : item
        )
      );
    }
  };
  
  // Handle note updates
  const handleNoteChange = (id: string, notes: string) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };
  
  // Handle tool name input change
  const handleToolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToolName(e.target.value);
  };
  
  // Toggle note expansion
  const toggleNoteExpansion = (id: string) => {
    setExpandedNotes(expandedNotes === id ? null : id);
  };
  
  // Reset all data
  const handleReset = () => {
    if (confirm('Are you sure you want to reset this checklist? All your progress and notes will be lost.')) {
      setChecklistItems(items => 
        items.map(item => ({ ...item, checked: false, notes: '' }))
      );
      setToolName('');
    }
  };
  
  // Render checklist item
  const renderChecklistItem = (item: ChecklistItem, index: number) => {
    const isNoteExpanded = expandedNotes === item.id;
    const sectionIndex = checklistItems
      .filter(i => i.section === item.section)
      .findIndex(i => i.id === item.id);
    
    // For verdict items, use a different style
    if (item.section === 'verdict') {
      return (
        <div key={item.id} className="mb-3">
          <label className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors ${
            item.checked 
              ? item.id === 'verdict-1' 
                ? 'bg-green-50 border border-green-200' 
                : item.id === 'verdict-2'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              : 'hover:bg-gray-50 border border-transparent'
          }`}>
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheckItem(item.id)}
                className={`form-checkbox h-5 w-5 transition duration-150 ease-in-out cursor-pointer ${
                  item.id === 'verdict-1' 
                    ? 'text-green-500 focus:ring-green-500' 
                    : item.id === 'verdict-2'
                      ? 'text-yellow-500 focus:ring-yellow-500'
                      : 'text-red-500 focus:ring-red-500'
                }`}
              />
            </div>
            <div className="ml-3 flex-1">
              <span className={`text-base font-medium ${
                item.checked
                  ? item.id === 'verdict-1' 
                    ? 'text-green-700' 
                    : item.id === 'verdict-2'
                      ? 'text-yellow-700'
                      : 'text-red-700'
                  : 'text-gray-700'
              }`}>
                {item.text}
              </span>
            </div>
          </label>
        </div>
      );
    }
    
    // Regular checklist items
    return (
      <div key={item.id} className="mb-4 border-b pb-6">
        <div className="flex items-start mb-2">
          <div className="flex items-center h-5 mt-1">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleCheckItem(item.id)}
              className="form-checkbox h-5 w-5 text-sg-bright-green focus:ring-sg-bright-green transition duration-150 ease-in-out cursor-pointer"
            />
          </div>
          <div className="ml-3">
            <label
              htmlFor={item.id}
              className="block text-base font-medium text-sg-dark-teal cursor-pointer"
            >
              {(item.section === 'before' || item.section === 'during' || item.section === 'after') && `${sectionIndex + 1}. `}{item.text}
            </label>
          </div>
        </div>
        
        <div className="ml-8 mt-1">
          <div className="flex items-center mb-1">
            <button 
              onClick={() => toggleNoteExpansion(item.id)}
              className="text-sm text-sg-bright-green flex items-center focus:outline-none"
            >
              <span>{isNoteExpanded ? 'Hide notes' : 'Add/Edit notes'}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`ml-1 transition-transform ${isNoteExpanded ? 'transform rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
          
          {isNoteExpanded && (
            <div className="animate-fadeIn">
              <textarea
                value={item.notes}
                onChange={(e) => handleNoteChange(item.id, e.target.value)}
                placeholder="Add your notes here..."
                className="w-full h-24 p-3 bg-white text-sm text-sg-dark-teal/90 border border-sg-bright-green/30 rounded-md focus:ring-sg-bright-green focus:border-sg-bright-green resize-none"
              />
            </div>
          )}
          
          {!isNoteExpanded && item.notes && (
            <div 
              className="text-sm text-sg-dark-teal/80 bg-sg-light-mint/30 p-2 rounded-md cursor-pointer"
              onClick={() => toggleNoteExpansion(item.id)}
            >
              {item.notes.length > 100 
                ? `${item.notes.substring(0, 100)}...` 
                : item.notes}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Calculate progress
  const totalItems = checklistItems.filter(item => item.section !== 'verdict').length;
  const checkedItems = checklistItems.filter(item => item.section !== 'verdict' && item.checked).length;
  const progressPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-plus-jakarta prose-headings:font-bold prose-headings:text-sg-dark-teal prose-p:text-sg-dark-teal/90 prose-a:text-sg-bright-green prose-a:no-underline hover:prose-a:underline prose-strong:text-sg-dark-teal prose-li:text-sg-dark-teal/90">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-4">AI Tool Test Drive Checklist: Is This Tool Worth Your Time?</h1>
        <p className="text-xl text-sg-dark-teal/70 mb-6">
          Feeling overwhelmed by the never-ending flood of new AI marketing tools? Use this checklist to quickly evaluate if it's worth your time and effort.
        </p>
      </div>
      
      {/* Tool Name Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Tool Information</CardTitle>
          <CardDescription>Enter the name of the AI tool you're evaluating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="tool-name" className="block mb-2 text-sm font-medium text-sg-dark-teal">
              Tool Name
            </label>
            <input
              type="text"
              id="tool-name"
              value={toolName}
              onChange={handleToolNameChange}
              placeholder="e.g., ChatGPT, Midjourney, etc."
              className="w-full p-3 bg-white text-sg-dark-teal border border-sg-bright-green/30 rounded-md focus:ring-sg-bright-green focus:border-sg-bright-green"
            />
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-sg-dark-teal">Checklist Progress</span>
              <span className="text-sm font-medium text-sg-dark-teal">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-sg-bright-green h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-500 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset Checklist
          </button>
        </CardFooter>
      </Card>
      
      {/* Section 1: Before You Dive In */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sg-bright-green text-white mr-2 text-sm">1</span>
            Before You Dive In (5 Minutes of Prep)
          </CardTitle>
          <CardDescription>Quick questions to consider before investing time in a new tool</CardDescription>
        </CardHeader>
        <CardContent>
          {checklistItems
            .filter(item => item.section === 'before')
            .map((item, index) => renderChecklistItem(item, index))}
        </CardContent>
      </Card>
      
      {/* Section 2: During the Test Drive */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sg-bright-green text-white mr-2 text-sm">2</span>
            During the Test Drive (Focus on a 15-30 Minute Exploration)
          </CardTitle>
          <CardDescription>What to look for while actually testing the tool</CardDescription>
        </CardHeader>
        <CardContent>
          {checklistItems
            .filter(item => item.section === 'during')
            .map((item, index) => renderChecklistItem(item, index))}
        </CardContent>
      </Card>
      
      {/* Section 3: After the Test Drive */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sg-bright-green text-white mr-2 text-sm">3</span>
            After the Test Drive (Quick Verdict)
          </CardTitle>
          <CardDescription>Final evaluation of the tool's value to you</CardDescription>
        </CardHeader>
        <CardContent>
          {checklistItems
            .filter(item => item.section === 'after')
            .map((item, index) => renderChecklistItem(item, index))}
        </CardContent>
      </Card>
      
      {/* Verdict Section */}
      <Card className="mb-8 border-t-4 border-sg-bright-green">
        <CardHeader>
          <CardTitle className="text-xl">Your Quick Verdict</CardTitle>
          <CardDescription>What's your final assessment of this tool?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {checklistItems
              .filter(item => item.section === 'verdict')
              .map((item, index) => renderChecklistItem(item, index))}
          </div>
        </CardContent>
      </Card>
      
      {/* Next Steps */}
      <Card className="bg-sg-light-mint/50 mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Next Steps & Further Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>If this tool looks promising, dive deeper! Explore its advanced features.</li>
            <li>
              Feeling unsure about evaluating AI claims? Check out our Mini-Course:{' '}
              <Link href="/learning-hub/ai-jargon-buster" className="text-sg-bright-green hover:underline">
                "Spotting AI Hype: A Dabbler's Guide to Real vs. Overblown Claims."
              </Link>
            </li>
          </ul>
          <p className="mt-4 font-medium text-sg-dark-teal">
            Remember, the goal is to find tools that genuinely help YOU, not to collect a graveyard of unused AI subscriptions. Test smart!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
