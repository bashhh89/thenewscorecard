'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';

export default function Module4() {
  const [activeRecipe, setActiveRecipe] = useState<string | null>(null);
  const [copiedRecipe, setCopiedRecipe] = useState<string | null>(null);
  
  const recipes = [
    {
      id: 'email',
      title: 'Drafting a Professional & Effective Email',
      template: `Act as a [Your Desired Role/Persona, e.g., 'Senior Account Manager at a digital marketing agency,' 'Founder of a new e-commerce startup,' 'Internal Communications Specialist'].

I need to compose an email to [Recipient Description, e.g., 'a key client who has raised a concern about project timelines,' 'a list of warm leads who downloaded our latest whitepaper,' 'all employees regarding a new company policy'].

The primary OBJECTIVE of this email is to [Specific Desired Outcome, e.g., 'address the client's concern empathetically and propose a revised timeline,' 'encourage leads to book a personalized demo,' 'clearly explain the new policy and its benefits'].

The email must convey the following KEY INFORMATION/POINTS:
[Essential Point 1 - e.g., Acknowledge the client's feedback directly]
[Essential Point 2 - e.g., Explain the reason for the proposed change or the value of the demo]
[Essential Point 3 - e.g., Clearly state the next step or call to action]
[Essential Point 4 (if applicable) - e.g., Reiterate commitment or offer further assistance]

Please maintain a [Desired Tone - e.g., 'highly professional and reassuring,' 'enthusiastic and benefit-driven,' 'clear, concise, and informative'] tone throughout the entire message.

CONSTRAINTS & ADDITIONAL CONTEXT:
- The email should be approximately [Word/Paragraph Count - e.g., '200-250 words' or '4 concise paragraphs'].
- Include a compelling subject line that is [Subject Line Characteristic - e.g., 'clear and action-oriented,' 'benefit-focused and intriguing'].
- Please ensure [Any Specific Inclusions/Exclusions - e.g., 'you mention the upcoming holiday schedule,' 'you do not refer to our competitor X directly'].
- [Any other relevant background information for the AI].`
    },
    {
      id: 'social-media',
      title: 'Brainstorming High-Impact Social Media Content Ideas',
      template: `You are 'CreativeContentBot,' an expert social media content strategist specializing in [Your Industry/Niche, e.g., 'sustainable lifestyle products,' 'B2B financial technology solutions,' 'local artisan food businesses'].

My company, [Your Company Name], offers [Brief Description of Products/Services and Key Differentiators, e.g., 'eco-friendly home goods made from recycled materials, known for minimalist design and ethical sourcing,' 'an AI-powered platform that automates compliance reporting for banks,' 'small-batch, handcrafted jams and preserves using locally sourced organic fruit'].

Our primary TARGET AUDIENCE on [Specific Social Media Platform - e.g., Instagram, LinkedIn, TikTok, Facebook] consists of [Detailed Audience Description - e.g., 'environmentally conscious consumers aged 28-45, primarily urban females, interested in ethical living and home decor,' 'CFOs and compliance officers in mid-to-large financial institutions,' 'foodies and supporters of local businesses in the [City/Region] area'].

I need you to brainstorm [Number] distinct and engaging content ideas for [Specific Social Media Platform] for the next [Timeframe, e.g., 'week,' 'month's theme on X'].

The GOAL for this content is to [Specific Marketing Objective - e.g., 'increase brand awareness among our target demographic,' 'drive qualified leads to our upcoming webinar,' 'boost engagement (likes, comments, shares) on our posts,' 'educate our audience about the benefits of Y'].

For each content idea, please provide:
1. A catchy and platform-appropriate HEADLINE or HOOK.
2. A brief (1-2 sentences) DESCRIPTION of the content.
3. A specific SUGGESTION for the VISUAL element (e.g., 'High-quality photo of product in use,' 'Short, energetic video demonstrating feature X,' 'User-generated photo contest,' 'Informative infographic carousel,' 'Behind-the-scenes video of our crafting process').
4. A list of 3-5 relevant HASHTAGS.
5. A clear CALL TO ACTION (if applicable for the post type).

CONSTRAINTS & STYLE NOTES:
- Ensure a mix of content pillars/types: [e.g., 'Educational (how-to, tips),' 'Entertaining (fun facts, relatable humor),' 'Community-Building (questions, polls, user spotlights),' 'Promotional (subtle product features, special offers),' 'Behind-the-Scenes'].
- The overall TONE should be [Desired Tone - e.g., 'aspirational and inspiring,' 'authoritative and trustworthy,' 'playful and approachable'].
- Output as a clearly numbered list.`
    },
    {
      id: 'summarize',
      title: 'Summarizing Complex Information Concisely',
      template: `Act as an [Specify AI Persona - e.g., 'Executive Research Analyst tasked with briefing a time-poor CEO,' 'Student creating concise study notes from a dense textbook chapter,' 'Content Curator writing a compelling abstract for a long-form article'].

I require a summary of the key information from the following text:
[PASTE THE FULL TEXT YOU WANT SUMMARIZED HERE. BE SURE TO INCLUDE THE ENTIRETY OF THE RELEVANT TEXT.]

This summary is intended for an AUDIENCE of [Detailed Audience Description - e.g., 'executives who need to grasp the main strategic implications without reading the full document,' 'students who need to understand the core concepts and arguments for an exam,' 'potential readers who will use the summary to decide if they want to read the full article'].

The primary GOAL of this summary is to [Specific Purpose of the Summary - e.g., 'extract the top 3-5 actionable recommendations and their justifications,' 'condense the main argument, supporting evidence, and conclusion into a brief overview,' 'highlight all data points related to market growth and competitor activity'].

CONSTRAINTS & FORMATTING:
- The summary must be approximately [Desired Length - e.g., '150 words,' 'no more than 5 bullet points,' 'a single paragraph of about 5-7 sentences'].
- Focus specifically on [Key Aspects to Prioritize in the Summary - e.g., 'the problem statement, the proposed solution, and the expected outcomes,' 'only the financial data and projections,' 'the historical context and its impact on current events'].
- Please EXCLUDE [Specific Aspects to Omit - e.g., 'any anecdotal examples or personal opinions from the original author,' 'direct quotations unless they are extremely concise and impactful,' 'highly technical jargon unless defined'].
- Output the summary in [Desired Format - e.g., 'a series of concise bullet points, each starting with an action verb if applicable,' 'a well-structured paragraph with a clear topic sentence and supporting details,' 'a table with two columns: "Key Concept" and "Brief Explanation"'].`
    }
  ];
  
  const copyToClipboard = (recipe: string, id: string) => {
    navigator.clipboard.writeText(recipe);
    setCopiedRecipe(id);
    setTimeout(() => setCopiedRecipe(null), 2000);
  };

  return (
    <div className="animate-fadeIn">
      <h2>Module 4: Simple Prompt Recipes for Common Marketing Tasks (Your Starting Templates)</h2>
      
      <p>Let's put the Golden Keys into action with some practical, fill-in-the-blank "recipes." These are designed as starting points – adapt and refine them to fit your unique needs and achieve that "Diamond Standard" output!</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {recipes.map(recipe => (
          <div 
            key={recipe.id}
            className={`cursor-pointer transition-all duration-300 ${activeRecipe === recipe.id ? 'ring-2 ring-sg-bright-green rounded-xl' : ''}`}
            onClick={() => setActiveRecipe(recipe.id === activeRecipe ? null : recipe.id)}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recipe {recipes.indexOf(recipe) + 1}:</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium text-lg text-sg-dark-teal">{recipe.title}</h3>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-sg-dark-teal/70">Click to view recipe</p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      
      {activeRecipe && (
        <div className="animate-fadeIn my-6">
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle>{recipes.find(r => r.id === activeRecipe)?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden">
                <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200 text-sm font-mono">
                  {recipes.find(r => r.id === activeRecipe)?.template}
                </pre>
                <button 
                  onClick={() => copyToClipboard(recipes.find(r => r.id === activeRecipe)?.template || '', activeRecipe)}
                  className="absolute top-3 right-3 bg-white hover:bg-sg-light-mint text-sg-dark-teal p-2 rounded-md border border-gray-200 shadow-sm transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedRecipe === activeRecipe ? (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-sm text-sg-dark-teal/70">
                <span className="font-semibold">Instructions:</span> Replace the bracketed text with your specific details, then paste into your AI tool
              </p>
              <button 
                className="bg-sg-bright-green hover:bg-sg-bright-green/90 text-white font-semibold py-2 px-4 rounded-full transition-colors"
                onClick={() => copyToClipboard(recipes.find(r => r.id === activeRecipe)?.template || '', activeRecipe)}
              >
                Try This Recipe
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <div className="my-8 p-6 bg-sg-dark-teal/5 border border-sg-dark-teal/20 rounded-lg">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M20.4 14.5 16 10 4 20"></path>
          </svg>
          Action Step: Test Drive a Recipe!
        </h3>
        
        <p>Select the recipe that best fits a task you frequently handle. Customize it with your specific details, run it through your AI tool, and observe how the structured input helps the AI generate a more targeted, useful, and "Diamond Standard" first draft. Then, practice iterating on that output!</p>
        
        <div className="flex justify-center mt-6">
          <button 
            className="bg-sg-bright-green hover:bg-sg-bright-green/90 text-white font-semibold py-2 px-6 rounded-full transition-colors"
            onClick={() => setActiveRecipe(recipes[0].id)}
          >
            Browse Recipes
          </button>
        </div>
      </div>
    </div>
  );
} 