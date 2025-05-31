"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import InteractivePlaceholder from '@/components/InteractivePlaceholder';
import SidebarNav from '../../components/learning-hub/SidebarNav';
import ToolCard from '../../components/learning-hub/ToolCard';
import { usePathname, useSearchParams } from 'next/navigation';
import { miniCourses } from '../../lib/learningHubData';
import MiniCourseCard from '../../components/learning-hub/MiniCourseCard';
import { templates } from '../../lib/learningHubData';
import TemplateCard from '../../components/learning-hub/TemplateCard';

// Define UserTier type to be used throughout the file
type UserTier = 'Dabbler' | 'Enabler' | 'Leader';

const sidebarLinks = [
  { title: 'Checklists', href: '#' },
  { title: 'Prompt Library', href: '#' },
  { title: 'Mini Courses', href: '#' },
];

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistDisplayProps {
  checklistTitle: string;
  introduction?: string;
  items: ChecklistItem[];
  onBack: () => void;
}

function ChecklistDisplay({ checklistTitle, introduction, items, onBack }: ChecklistDisplayProps) {
  const [checked, setChecked] = React.useState<boolean[]>(Array(items.length).fill(false));
  const handleCheck = (idx: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };
  return (
    <div className="w-full max-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl p-8 relative font-plus-jakarta">
      <button
        className="inline-flex items-center gap-2 bg-sg-bright-green text-sg-dark-teal font-semibold py-2 px-4 rounded-lg shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-sg-bright-green mb-8 transition-colors"
        onClick={onBack}
        type="button"
        aria-label="Back to All Checklists"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to All Checklists
      </button>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-sg-dark-teal mb-6">{checklistTitle}</h2>
      {introduction && (
        <p className="text-lg text-sg-dark-teal/80 leading-relaxed mb-8">{introduction}</p>
      )}
      <ol className="flex flex-col gap-4">
        {items.map((item, idx) => (
          <li
            key={item.id}
            className="flex items-start gap-4 bg-gray-50 rounded-md shadow-sm p-4 hover:bg-sg-light-mint border border-transparent hover:border-sg-bright-green transition-colors group"
          >
            <div className="flex flex-col items-center mr-2 select-none">
              <span className="text-xs font-bold text-sg-bright-green mb-2">{idx + 1}</span>
              <button
                type="button"
                aria-label={checked[idx] ? 'Mark step as incomplete' : 'Mark step as complete'}
                className={
                  'w-7 h-7 flex items-center justify-center rounded-full border-2 transition-colors duration-150 ' +
                  (checked[idx]
                    ? 'bg-sg-bright-green border-sg-bright-green'
                    : 'bg-white border-gray-300 group-hover:border-sg-bright-green')
                }
                onClick={() => handleCheck(idx)}
              >
                {checked[idx] ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                ) : null}
              </button>
            </div>
            <span className="text-lg text-sg-dark-teal leading-relaxed">{item.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

interface KillerChecklistItem {
  id: string;
  text: string;
  // Optionally, add substeps or notes in the future
}

interface KillerChecklistDisplayProps {
  checklistTitle: string;
  introduction?: string;
  items: KillerChecklistItem[];
  onBack: () => void;
}

// Confetti component (simple SVG burst, not a full library)
function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-fade-in">
      <svg width="180" height="80" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle cx="30" cy="40" r="6" fill="#20E28F"/>
          <circle cx="60" cy="20" r="4" fill="#103138"/>
          <circle cx="90" cy="60" r="5" fill="#20E28F"/>
          <circle cx="120" cy="30" r="6" fill="#103138"/>
          <circle cx="150" cy="50" r="4" fill="#20E28F"/>
        </g>
      </svg>
    </div>
  );
}

// Progress bar
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
      <div
        className="h-full bg-sg-bright-green transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

// Individual checklist item card for horizontal grid layout
interface ChecklistItemCardProps {
  number: number;
  text: string;
  checked: boolean;
  onToggle: () => void;
  animate?: boolean;
  completed?: boolean;
}

function ChecklistItemCard({ number, text, checked, onToggle, animate, completed }: ChecklistItemCardProps) {
  // Bold the first phrase (before colon or dash) for action emphasis
  const match = text.match(/^(.*?[:\-])\s*(.*)$/);
  const main = match ? match[1] : '';
  const rest = match ? match[2] : text;
  return (
    <div
      className={
        'bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out p-6 flex flex-col items-start cursor-pointer group border border-transparent hover:border-sg-bright-green min-h-[220px] relative font-plus-jakarta ' +
        (animate ? 'animate-fade-in-up' : '') +
        (completed ? ' ring-4 ring-sg-bright-green/40' : '')
      }
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      style={{ transform: checked ? 'scale(1.03) rotate(-2deg)' : undefined }}
    >
      <div className="flex items-center gap-3 mb-4 w-full">
        {/* Step number in mint green circle */}
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-sg-bright-green text-sg-dark-teal font-bold text-xl shadow border-2 border-sg-bright-green">
          {number}
        </span>
        {/* Custom bubble checkbox */}
        <button
          type="button"
          aria-label={checked ? 'Mark step as incomplete' : 'Mark step as complete'}
          className={
            'ml-2 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-200 ' +
            (checked
              ? 'bg-sg-bright-green border-sg-bright-green scale-110 shadow-lg animate-bounce-in'
              : 'bg-white border-sg-bright-green group-hover:border-sg-bright-green')
          }
          onClick={e => { e.stopPropagation(); onToggle(); }}
        >
          {checked && (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          )}
        </button>
      </div>
      <div className="text-lg text-sg-dark-teal leading-normal">
        {main && <span className="font-semibold text-sg-dark-teal">{main} </span>}
        {rest}
      </div>
      {checked && <span className="absolute top-3 right-3 text-sg-bright-green font-bold text-xs animate-fade-in">Done!</span>}
    </div>
  );
}

// Overhauled killer checklist display with horizontal card grid, progress, and confetti
function KillerChecklistDisplay({ checklistTitle, introduction, items, onBack }: KillerChecklistDisplayProps) {
  const [checked, setChecked] = React.useState<boolean[]>(Array(items.length).fill(false));
  const [showConfetti, setShowConfetti] = React.useState(false);
  const prevComplete = useRef(false);
  const percent = Math.round((checked.filter(Boolean).length / items.length) * 100);

  useEffect(() => {
    const allDone = checked.every(Boolean);
    if (allDone && !prevComplete.current) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1800);
    }
    prevComplete.current = allDone;
  }, [checked]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-2xl p-10 relative overflow-visible font-plus-jakarta">
      <ConfettiBurst show={showConfetti} />
      <ProgressBar percent={percent} />
      <button
        className="inline-flex items-center gap-2 bg-sg-bright-green text-sg-dark-teal font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sg-bright-green mb-10"
        onClick={onBack}
        type="button"
        aria-label="Back to All Checklists"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to All Checklists
      </button>
      <h2 className="text-4xl md:text-5xl font-extrabold text-sg-dark-teal mb-4 tracking-tight drop-shadow-sm">
        {checklistTitle}
      </h2>
      {introduction && (
        <p className="text-xl text-sg-dark-teal/80 leading-relaxed mb-10">{introduction}</p>
      )}
      <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, idx) => (
          <li key={item.id} className="list-none">
            <ChecklistItemCard
              number={idx + 1}
              text={item.text}
              checked={checked[idx]}
              onToggle={() => setChecked(prev => {
                const next = [...prev];
                next[idx] = !next[idx];
                return next;
              })}
              animate
              completed={checked[idx]}
            />
          </li>
        ))}
      </ol>
      {percent === 100 && (
        <div className="mt-10 flex flex-col items-center animate-fade-in">
          <span className="text-2xl font-bold text-sg-bright-green mb-2">🎉 Checklist Complete!</span>
          <span className="text-lg text-sg-dark-teal">You're ready for the next step.</span>
        </div>
      )}
    </div>
  );
}

const checklistTitles = [
  'Generating Leads with an AI Agent',
  'Prompting AI for Hyper-Personalized Social Media Content',
  'Utilizing Your Data with AI for True Personalization',
  'Identifying Processes for AI Implementation',
  'Assessing Your Tech & Data for AI Readiness',
  'Selecting the Right AI Tool',
  'Training Your Team for AI Success',
  'Running an Effective AI Pilot Program',
  'Measuring the Impact & ROI of Your AI Initiatives',
];

// Demo user data (replace with real user info if available)
const user = {
  name: 'Alex',
  avatar: '', // fallback to initials
  tier: 'Dabbler',
  progress: 0.44, // 44% complete
};

// --- V1 Learning Progress Tracking ---
// 1. Define trackable items for "Dabbler" tier (9 checklists, 10 prompts)
const dabblerChecklistIds = [
  'Generating Leads with an AI Agent',
  'Prompting AI for Hyper-Personalized Social Media Content',
  'Utilizing Your Data with AI for True Personalization',
  'Identifying Processes for AI Implementation',
  'Assessing Your Tech & Data for AI Readiness',
  'Selecting the Right AI Tool',
  'Training Your Team for AI Success',
  'Running an Effective AI Pilot Program',
  'Measuring the Impact & ROI of Your AI Initiatives',
];

// Dabbler prompt IDs (7 Content Ideation, 3 Market Research)
const dabblerPromptIds = [
  'p1_enhanced',
  'dabbler_content_blog_titles',
  'dabbler_content_social_ideas',
  'dabbler_content_rewrite',
  'dabbler_content_audience_questions',
  'dabbler_content_hashtags',
  'dabbler_content_email_intro',
  'dabbler_market_research_competitors',
  'dabbler_market_research_pain_points',
  'dabbler_market_research_competitor_features',
];

const trackableItems = {
  Dabbler: [
    ...dabblerChecklistIds.map(id => ({ id, type: 'checklist' })),
    ...dabblerPromptIds.map(id => ({ id, type: 'prompt' })),
  ],
  Enabler: [], // Empty array for now, can be populated later
  Leader: [], // Empty array for now, can be populated later
};

// --- Tip of the Day cycling ---
const tips = [
  'Start small: Pick one process to automate with AI this week.',
  'Check your progress regularly to stay motivated!',
  'Try copying a prompt and using it in your workflow today.',
];
function getTipOfTheDay() {
  let idx = 0;
  try {
    const stored = localStorage.getItem('SG_tip_counter');
    idx = stored ? (parseInt(stored, 10) + 1) % tips.length : 0;
    localStorage.setItem('SG_tip_counter', idx.toString());
  } catch {}
  return tips[idx];
}

// Navigation icons
const navIcons: Record<string, React.ReactNode> = {
  'Checklists': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  'Prompt Library': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-8-4h8" /></svg>,
  'Templates': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M3 7h18" /></svg>,
  'Recommended Tools': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 21l3-1.5L15 21l-.75-4M4 4l16 16" /></svg>,
  'Mini Courses': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12V4" /></svg>,
};

// Social icons
const socialLinks = [
  { href: 'https://www.linkedin.com/company/social-garden/', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg> },
  { href: 'https://twitter.com/socialgardenau', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.924 2.204-4.924 4.924 0 .386.044.762.127 1.124-4.09-.205-7.719-2.166-10.148-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.23-.616v.062c0 2.386 1.697 4.374 3.95 4.827-.413.112-.849.172-1.298.172-.318 0-.626-.031-.927-.088.627 1.956 2.444 3.377 4.6 3.417-1.68 1.317-3.797 2.102-6.102 2.102-.396 0-.787-.023-1.175-.069 2.179 1.397 4.768 2.213 7.548 2.213 9.057 0 14.015-7.506 14.015-14.015 0-.213-.005-.425-.014-.636.962-.695 1.797-1.562 2.457-2.549z" /></svg> },
];

// Tiered content for the first four checklists
const tieredChecklists: Record<string, Record<'Dabbler' | 'Enabler' | 'Leader', { checklistTitle: string; introduction: string; items: { id: string; text: string; }[] }>> = {
  'Generating Leads with an AI Agent': {
    Dabbler: {
      checklistTitle: 'Getting Started: Your First AI Lead Generation Agent',
      introduction: 'Ready to explore how AI can help you find new leads? This checklist will guide you through setting up a simple AI agent for your initial lead generation efforts.',
      items: [
        { id: '1', text: 'Define a VERY Specific Goal: What single, simple task do you want your AI agent to achieve? (e.g., "Identify 5 potential leads per day from [specific online source] matching [simple criteria]" OR "Draft initial outreach messages for leads who visit our pricing page.")' },
        { id: '2', text: 'Choose a Beginner-Friendly AI Tool/Platform: Research and select an AI tool known for its ease of use for lead generation or task automation (e.g., a simple web scraping tool with AI integration, or a basic AI chatbot builder if applicable to the goal). Focus on free or low-cost options to start.' },
        { id: '3', text: 'Outline Your Ideal Lead Profile (Simple Version): List 3-4 key characteristics of the leads you want the AI to find or interact with (e.g., "Job Title: Marketing Manager," "Industry: SaaS," "Company Size: 10-50 employees").' },
        { id: '4', text: 'Draft Your First Basic Prompt/Instruction for the AI: Based on your goal and lead profile, write a clear, simple instruction for the AI. (e.g., "Find companies in the SaaS industry with 10-50 employees and identify their marketing managers." OR "If a website visitor asks about pricing, ask for their email to send them details.")' },
        { id: '5', text: "Set Up the AI Agent (Basic Configuration): Follow the chosen tool's instructions to input your prompt/criteria. Don't worry about advanced settings yet." },
        { id: '6', text: 'Run a Small Test: Let the AI agent run for a short period or on a small dataset.' },
        { id: '7', text: 'Review Initial Results (Manually): Carefully check the leads or outputs generated. Are they relevant? Are there any obvious errors?' },
        { id: '8', text: 'Make One Small Tweak to Your Prompt/Criteria: Based on the review, adjust one thing in your instructions to the AI to try and improve the results.' },
        { id: '9', text: "Document Your Learnings: Note down what worked, what didn't, and what you'll try next." },
      ],
    },
    Enabler: {
      checklistTitle: 'Effective AI Lead Generation: Integration & Optimization',
      introduction: "You've experimented with AI for lead generation. Now, let's make it more efficient and integrated into your workflows. This checklist focuses on optimizing your AI agents.",
      items: [
        { id: '1', text: 'Review Current AI Agent Performance: Analyze the results from your initial "Dabbler" experiments. What worked well? What were the main challenges or inaccuracies?' },
        { id: '2', text: 'Refine Your Ideal Lead Profile: Add more detail and nuance to your lead profile (e.g., specific company attributes, pain points, buying signals).' },
        { id: '3', text: 'Develop More Sophisticated Prompts/Instructions: Craft prompts that include negative constraints (what *not* to look for), multiple criteria, and desired output formats.' },
        { id: '4', text: "Explore AI Tool's Advanced Features: Dive deeper into the settings of your chosen AI tool. Are there options for better filtering, scheduling, or integration?" },
        { id: '5', text: 'Plan for CRM Integration: How will leads generated by the AI agent be added to your CRM? Manually, via CSV import, or is there a direct integration option? Outline the process.' },
        { id: '6', text: 'A/B Test One Variable: Try running two slightly different versions of your AI agent (e.g., with different key prompts or targeting slightly different sources) to see which performs better.' },
        { id: '7', text: 'Develop a Basic Standard Operating Procedure (SOP): Document the steps for running your AI lead generation agent, including prompt examples and review criteria.' },
        { id: '8', text: 'Set Up Basic Monitoring: How will you regularly check the quality and quantity of leads generated? (e.g., daily spot check, weekly summary).' },
        { id: '9', text: 'Train a Colleague (if applicable): If others will use this, train them on the SOP and how to use the AI agent effectively.' },
        { id: '10', text: 'Track Key Metrics: Start tracking simple metrics like "Number of qualified leads generated per week by AI" or "Time saved on prospecting."' },
      ],
    },
    Leader: {
      checklistTitle: 'Strategic & Scaled AI Lead Generation: Maximizing ROI',
      introduction: "You're effectively using AI for lead generation. This checklist helps you scale your efforts, implement advanced strategies, and ensure continuous improvement for maximum impact.",
      items: [
        { id: '1', text: 'Align AI Lead Gen with Overall Sales/Marketing Strategy: Ensure your AI lead generation efforts directly support broader campaign goals and revenue targets.' },
        { id: '2', text: 'Implement Advanced Data Integration: Fully integrate AI lead generation with CRM and other marketing automation platforms for seamless data flow and lead nurturing.' },
        { id: '3', text: 'Utilize Predictive Lead Scoring with AI: If not already, explore using AI to score incoming leads based on their likelihood to convert, prioritizing follow-up.' },
        { id: '4', text: 'Deploy & Manage Multiple Specialized AI Agents: Consider using different AI agents for different market segments, lead sources, or stages of the funnel.' },
        { id: '5', text: 'Implement Robust A/B Testing & Multivariate Analysis: Continuously test and optimize AI agent prompts, targeting parameters, and data sources.' },
        { id: '6', text: 'Develop Advanced Analytics & Reporting Dashboards: Track detailed performance metrics, including conversion rates from AI-generated leads, cost per lead, and ROI.' },
        { id: '7', text: 'Ensure Full Compliance & Ethical AI Use: Regularly review data privacy practices, consent mechanisms, and ethical implications of your AI lead generation activities.' },
        { id: '8', text: 'Establish a Feedback Loop for Continuous Improvement: Create a system for sales teams to provide feedback on the quality of AI-generated leads, using this to refine AI models and prompts.' },
        { id: '9', text: 'Automate Reporting & Alerts: Set up automated reports on AI lead gen performance and alerts for any significant deviations or issues.' },
        { id: '10', text: 'Research & Pilot Emerging AI Lead Gen Technologies: Stay updated on new AI tools and techniques that could further enhance your lead generation capabilities.' },
      ],
    },
  },
  'Prompting AI for Hyper-Personalized Social Media Content': {
    Dabbler: {
      checklistTitle: 'Crafting Your First Personalized Social Media Posts with AI',
      introduction: "Want to make your social media posts resonate more deeply? This checklist helps you use AI for more personalized content, even if you're just starting.",
      items: [
        { id: '1', text: 'Identify 1-2 Key Audience Segments (e.g., "Small Business Owners," "New Moms interested in eco-friendly products").' },
        { id: '2', text: 'List 1 Key Pain Point or Interest for Each Segment (e.g., For Small Business Owners: "Struggling with time management").' },
        { id: '3', text: 'Choose a Social Media Platform for your test (e.g., Facebook, Instagram).' },
        { id: '4', text: 'Select a Simple AI Writing Tool.' },
        { id: '5', text: 'Draft a Basic Personalization Prompt (e.g., "Write a short Facebook post for [Small Business Owners] about [time management tip] related to [your service] in an [encouraging] tone.").' },
        { id: '6', text: 'Generate 2-3 Post Variations using the AI tool.' },
        { id: '7', text: 'Review & Edit for Authenticity and Brand Voice. **Crucial: Make it sound like you!**' },
        { id: '8', text: 'Add a Relevant Image/Video (Optional).' },
        { id: '9', text: 'Post Your Best Version.' },
        { id: '10', text: 'Note What Worked and any engagement received.' },
      ],
    },
    Enabler: {
      checklistTitle: 'Advanced AI Prompting for Engaging Social Media',
      introduction: "You're comfortable with basic AI prompts for social media. This checklist helps you craft more sophisticated prompts to create highly engaging and personalized content that drives results.",
      items: [
        { id: '1', text: 'Review Past Performance: Analyze which AI-generated posts performed best and why.' },
        { id: '2', text: 'Deep Dive into Audience Sub-Segments: Identify micro-segments within your audience for more tailored messaging.' },
        { id: '3', text: 'Craft Multi-Layered Prompts: Include variables for tone, call-to-action, and emotional triggers.' },
        { id: '4', text: 'Incorporate Data Insights: Use analytics (e.g., best times, formats) to inform your prompt structure.' },
        { id: '5', text: 'Test Advanced Personalization: Use AI to insert dynamic fields (e.g., first name, recent interaction).' },
        { id: '6', text: 'A/B Test Prompt Variations: Systematically test different prompt structures for engagement.' },
        { id: '7', text: 'Document Winning Prompts: Build a library of high-performing prompt templates.' },
        { id: '8', text: 'Integrate with Scheduling/Approval Workflows: Ensure prompts fit your content calendar and review process.' },
        { id: '9', text: 'Share Learnings: Present findings and best practices to your team.' },
        { id: '10', text: 'Set Up Ongoing Monitoring: Regularly review AI-generated content for quality and brand alignment.' },
      ],
    },
    Leader: {
      checklistTitle: 'Strategic Hyper-Personalization: AI-Driven Social Media at Scale',
      introduction: "You're adept at AI prompting for social media. This checklist focuses on systemizing hyper-personalization, integrating it with your broader strategy, and scaling effectively.",
      items: [
        { id: '1', text: 'Integrate Social Personalization with CRM/CDP Data: Use real-time customer data to drive content variations.' },
        { id: '2', text: 'Develop Dynamic Prompt Templates: Enable AI to generate content based on live data feeds and behavioral triggers.' },
        { id: '3', text: 'Automate Multi-Channel Distribution: Ensure AI-generated content is published across all relevant platforms.' },
        { id: '4', text: 'Implement Multivariate Testing at Scale: Test multiple variables (e.g., images, CTAs, timing) using AI analytics.' },
        { id: '5', text: 'Build Real-Time Performance Dashboards: Monitor engagement, conversions, and ROI by segment and message.' },
        { id: '6', text: 'Continuously Refine Prompts & Segments: Use AI insights to update your audience segments and prompt templates regularly.' },
        { id: '7', text: 'Ensure Brand & Compliance Safeguards: Implement review/approval steps and monitor for off-brand or non-compliant content.' },
        { id: '8', text: 'Share Advanced Learnings: Present key findings and best practices to leadership and cross-functional teams.' },
        { id: '9', text: 'Establish Feedback Loops: Use sales and customer service feedback to further refine AI content.' },
        { id: '10', text: 'Research & Pilot Emerging AI Social Tech: Stay updated on new AI tools and techniques for social media.' },
      ],
    },
  },
  'Utilizing Your Data with AI for True Personalization': {
    Dabbler: {
      checklistTitle: 'Unlocking Your Data: First Steps to AI Personalization',
      introduction: "Your existing customer data is a goldmine! This checklist helps you take initial steps to use AI for more personalized marketing, even with basic data.",
      items: [
        { id: '1', text: 'Identify 1-2 Key Data Sources you already have (e.g., "Email list," "Basic CRM contacts").' },
        { id: '2', text: 'List 3-5 Key Data Points you consistently have for these sources (e.g., "Name," "Email," "Last Purchase Date").' },
        { id: '3', text: 'Define 1-2 Simple Audience Segments based on this data (e.g., "Customers who bought Product X," "Leads from Region Y").' },
        { id: '4', text: 'Choose 1 Marketing Channel for a test (e.g., "Email," "Social Media Ad").' },
        { id: '5', text: 'Brainstorm 1 Personalized Element to change for one segment vs. another (e.g., "Different email subject line," "Mention their city").' },
        { id: '6', text: 'Use an AI Writing Tool to Draft Varied Messages for your segments incorporating the personalized element.' },
        { id: '7', text: 'Review AI Output for clarity, tone, and ensure personalization makes sense. Edit as needed.' },
        { id: '8', text: 'Run Your Small Personalized Test.' },
        { id: '9', text: 'Compare Basic Results if possible (e.g., open rates for different subject lines).' },
        { id: '10', text: 'Note Learnings: What data was most useful? What was easy/hard?' },
      ],
    },
    Enabler: {
      checklistTitle: 'Leveraging Your Data: Intermediate AI Personalization Techniques',
      introduction: "You've started using basic data for AI personalization. This checklist guides you on using more diverse data sources and more sophisticated AI techniques for deeper personalization.",
      items: [
        { id: '1', text: 'Audit Existing Data Sources: List all available data sources (CRM, website, email, purchase history, etc.).' },
        { id: '2', text: 'Prioritize Key Data Points: Identify which data points are most valuable for personalization.' },
        { id: '3', text: 'Consolidate & Clean Data: Ensure your data is accurate, up-to-date, and unified across platforms.' },
        { id: '4', text: 'Develop Multi-Dimensional Segments: Create audience segments using multiple data points (e.g., behavior, lifecycle stage, preferences).' },
        { id: '5', text: 'Select an AI Tool for Personalization: Choose a tool that can ingest your data and generate personalized content or recommendations.' },
        { id: '6', text: 'Map Data Fields to Personalization Elements: Define how each data point will be used in messaging (e.g., "First Name" for greeting, "Last Purchase" for offer).' },
        { id: '7', text: 'Test AI-Generated Personalization: Run a campaign or message batch using AI-driven personalization for each segment.' },
        { id: '8', text: 'Review Results by Segment: Analyze performance (open rates, clicks, conversions) for each segment.' },
        { id: '9', text: 'Document Your Process: Create a repeatable workflow for data prep, segmentation, and AI content generation.' },
        { id: '10', text: 'Share Learnings: Summarize what worked and what didn\'t for future campaigns.' },
      ],
    },
    Leader: {
      checklistTitle: 'Mastering Data-Driven AI Personalization: A Strategic Framework',
      introduction: "You're skilled in using data for AI personalization. This checklist focuses on creating a fully integrated, strategic, and ethically sound data-driven personalization ecosystem.",
      items: [
        { id: '1', text: 'Implement a Customer Data Platform (CDP): Centralize and unify customer data for AI-driven personalization.' },
        { id: '2', text: 'Develop Predictive Models with AI: Use machine learning to anticipate customer needs and behaviors.' },
        { id: '3', text: 'Automate Real-Time Personalization: Set up workflows for AI to deliver personalized messages in real time across channels.' },
        { id: '4', text: 'Leverage AI for Next-Best-Action Recommendations: Use AI to suggest the most relevant offer or content for each user.' },
        { id: '5', text: 'Establish Data Governance & Privacy Protocols: Ensure compliance and ethical use of data.' },
        { id: '6', text: 'Develop Advanced Analytics Dashboards: Monitor personalization performance, lift, and ROI in real time.' },
        { id: '7', text: 'Continuously Refine Segments & Content: Use AI insights to update segments and content rules regularly.' },
        { id: '8', text: 'Share Advanced Learnings: Present key findings and best practices to leadership and cross-functional teams.' },
        { id: '9', text: 'Foster a Data-Driven Culture: Train teams and encourage data-driven decision making.' },
        { id: '10', text: 'Pilot Emerging AI Personalization Tech: Test new tools and approaches for competitive advantage.' },
      ],
    },
  },
  'Identifying Processes for AI Implementation': {
    Dabbler: {
      checklistTitle: 'Finding Quick Wins: Is This Task Ready for a Simple AI Boost?',
      introduction: "AI can help with many tasks, but where to start? This checklist helps you find simple, repetitive tasks in your marketing or sales work that could be good candidates for an initial AI boost.",
      items: [
        { id: '1', text: 'List 3-5 Repetitive Daily/Weekly Tasks you or your team perform (e.g., "Manually sorting new leads," "Writing first-draft social media updates").' },
        { id: '2', text: 'For Each Task, Ask: Is it Rule-Based (follows consistent steps)? (Yes/No).' },
        { id: '3', text: 'For Each Task, Ask: Is it Time-Consuming but not overly complex strategically? (Yes/No).' },
        { id: '4', text: 'For Each Task, Ask: Does it involve Digital Data (text, numbers) an AI could process? (Yes/No).' },
        { id: '5', text: 'Identify 1-2 "High Potential" Tasks that scored "Yes" on most questions.' },
        { id: '6', text: 'For one high-potential task, Think of 1 Simple AI Application (e.g., "For \'writing social media updates,\' an AI could generate initial ideas from a blog link.").' },
        { id: '7', text: 'Research 1-2 Beginner-Friendly AI Tools for that specific application.' },
        { id: '8', text: 'Estimate Potential Time Saved (Roughly) if AI assisted with this task.' },
        { id: '9', text: 'Decide on 1 Task to Experiment With First using a simple AI tool.' },
      ],
    },
    Enabler: {
      checklistTitle: 'Strategic Process Audit for AI Transformation Opportunities',
      introduction: "You've identified some quick wins with AI. This checklist helps you conduct a more strategic audit of your marketing and sales processes to find deeper opportunities for AI transformation.",
      items: [
        { id: '1', text: 'Map Key Marketing & Sales Value Streams: Diagram the main flows that drive value in your business.' },
        { id: '2', text: 'Identify Bottlenecks & Inefficiencies: Pinpoint where delays, errors, or manual effort are highest.' },
        { id: '3', text: 'Assess Data Availability & Quality: Check if the required data is digital, accessible, and high quality.' },
        { id: '4', text: 'Score Processes for AI Potential: Rate each process on impact, feasibility, and data readiness.' },
        { id: '5', text: 'Select High-Impact Opportunities: Choose those with the best balance of value and ease of implementation.' },
        { id: '6', text: 'Research AI Tools/Platforms: Identify tools that match your prioritized opportunities.' },
        { id: '7', text: 'Develop a Pilot Plan: Outline steps, success metrics, and timeline for a small-scale AI pilot.' },
        { id: '8', text: 'Get Stakeholder Buy-In: Share your plan with relevant team members and get feedback/support.' },
        { id: '9', text: 'Document & Share Learnings: After the pilot, summarize results and recommendations for broader rollout.' },
        { id: '10', text: 'Establish Ongoing Review: Set up regular check-ins to monitor progress and surface new opportunities.' },
      ],
    },
    Leader: {
      checklistTitle: 'Architecting an AI-Native Organization: Continuous Process Optimization',
      introduction: "Your organization leverages AI strategically. This checklist focuses on embedding AI into the DNA of your processes for continuous optimization and innovation.",
      items: [
        { id: '1', text: 'Establish an AI Center of Excellence (CoE): Create a cross-functional team to drive AI adoption and best practices.' },
        { id: '2', text: 'Implement Process Mining: Use AI tools to analyze and optimize end-to-end processes.' },
        { id: '3', text: 'Automate & Orchestrate Workflows: Deploy AI to automate and coordinate complex, multi-step processes.' },
        { id: '4', text: 'Integrate AI into Change Management: Ensure AI is part of all process improvement initiatives.' },
        { id: '5', text: 'Monitor & Optimize Continuously: Use analytics to track performance and identify further optimization opportunities.' },
        { id: '6', text: 'Scale Proven AI Solutions: Roll out successful pilots to additional teams or processes.' },
        { id: '7', text: 'Foster a Culture of Innovation: Encourage teams to suggest new AI use cases and share best practices.' },
        { id: '8', text: 'Ensure Compliance & Risk Management: Regularly assess data privacy, security, and regulatory compliance.' },
        { id: '9', text: 'Share Results & ROI: Present outcomes and learnings to leadership and the wider organization.' },
        { id: '10', text: 'Pilot Emerging AI Process Tech: Test new tools and approaches for continuous improvement.' },
      ],
    },
  },
  'Assessing Your Tech & Data for AI Readiness': {
    Dabbler: {
      checklistTitle: 'Basic Tech & Data Readiness Check',
      introduction: 'A simple checklist to help you quickly assess if your current technology and data are ready for a first AI project.',
      items: [
        { id: '1', text: 'List your main marketing/sales tools (CRM, email, analytics, etc.).' },
        { id: '2', text: 'Check if you can easily export or access your key data (contacts, leads, campaign results).' },
        { id: '3', text: 'Is your data mostly digital and up-to-date?' },
        { id: '4', text: 'Do you have permission to use this data for AI (privacy, consent)?' },
        { id: '5', text: 'Pick one AI use case and check if you have the data needed for it.' },
        { id: '6', text: 'Note any obvious gaps or issues to address before starting.' },
      ],
    },
    Enabler: {
      checklistTitle: 'Comprehensive Tech & Data Audit for AI Integration',
      introduction: "You've done a basic tech check. This checklist guides you through a more thorough assessment of your technology stack and data landscape to ensure smooth AI integration and effectiveness.",
      items: [
        { id: '1', text: 'Map Your Current MarTech/SalesTech Stack: Document all key software tools used and how they currently (or don\'t) interconnect.' },
        { id: '2', text: 'Evaluate Data Quality Across Key Sources: For your primary data sources (CRM, analytics, etc.), assess data for completeness, accuracy, consistency, and timeliness. Identify major quality gaps.' },
        { id: '3', text: 'Assess Data Accessibility & API Availability: Can AI tools access the necessary data? Are there APIs available for key systems? What are the data extraction/integration capabilities?' },
        { id: '4', text: 'Identify Data Silos & Integration Challenges: Pinpoint where important data is isolated and what technical or organizational hurdles exist for integrating it.' },
        { id: '5', text: 'Review Data Governance & Compliance Policies: Understand your company\'s policies on data privacy (e.g., GDPR, CCPA), security, and consent management, especially as they apply to AI.' },
        { id: '6', text: 'Define Data Requirements for Prioritized AI Use Cases: For the 2-3 AI initiatives you\'re planning, list the specific data fields, formats, and volumes required.' },
        { id: '7', text: 'Evaluate Existing Infrastructure for AI Scalability: Can your current systems (if AI is to be hosted internally or heavily integrated) handle increased data processing loads?' },
        { id: '8', text: 'Plan for Data Cleansing & Preparation: Outline the steps and resources needed to address identified data quality issues before feeding data to AI models.' },
        { id: '9', text: 'Assess Team\'s Data Literacy & Skills: Does your team have the necessary skills to work with and interpret data from AI tools? Identify training needs.' },
        { id: '10', text: 'Develop a Data Readiness Action Plan: Summarize key findings and create a plan to address critical gaps in your tech and data readiness for AI.' },
      ],
    },
    Leader: {
      checklistTitle: 'Architecting a Future-Ready Data Ecosystem for Strategic AI',
      introduction: "Your organization has a solid data foundation. This checklist focuses on architecting an advanced, scalable, and ethical data ecosystem to power strategic, enterprise-wide AI initiatives.",
      items: [
        { id: '1', text: 'Establish a Unified Data Strategy Aligned with Business Goals: Define a clear vision for how data will be leveraged as a strategic asset across the organization, driven by AI.' },
        { id: '2', text: 'Implement a Modern Data Architecture (e.g., Data Lakehouse, Data Fabric): Design and deploy a flexible, scalable, and secure data infrastructure that supports diverse AI workloads.' },
        { id: '3', text: 'Automate Data Ingestion, Integration, & Quality Management: Use AI-powered tools to automate data pipelines, ensure data quality, and provide real-time data access.' },
        { id: '4', text: 'Develop a Comprehensive Data Governance Framework for AI: Implement robust policies, roles, responsibilities, and technologies for managing data access, security, privacy, and ethical AI use across the enterprise.' },
        { id: '5', text: 'Foster a Data-Driven Culture & Advanced Data Literacy: Invest in organization-wide training and tools to empower all employees to leverage data and AI insights effectively and responsibly.' },
        { id: '6', text: 'Explore Synthetic Data Generation & Advanced Data Augmentation Techniques: For AI model training where real data is scarce or sensitive, investigate using synthetic data.' },
        { id: '7', text: 'Implement MLOps Practices for AI Model Management: Establish processes and platforms for efficiently deploying, monitoring, managing, and updating AI models that rely on your data.' },
        { id: '8', text: 'Ensure Real-Time Data Streaming & Processing Capabilities for AI applications requiring immediate insights and actions.' },
        { id: '9', text: 'Continuously Monitor & Optimize Data Ecosystem Performance & Cost-Effectiveness.' },
        { id: '10', text: 'Champion Ethical AI & Data Stewardship throughout the organization, ensuring transparency and accountability.' },
      ],
    },
  },
  'Selecting the Right AI Tool': {
    Dabbler: {
      checklistTitle: 'Choosing Your First AI Tool: Quick Start',
      introduction: 'A simple checklist to help you pick a beginner-friendly AI tool for your first project.',
      items: [
        { id: '1', text: 'Define your main goal for using AI (e.g., write social posts, find leads, automate a task).' },
        { id: '2', text: 'Search for 2-3 AI tools that match your goal (look for free trials or demos).' },
        { id: '3', text: 'Check if the tool is easy to use (look for tutorials, reviews, or a simple interface).' },
        { id: '4', text: 'Does it connect with your existing tools (CRM, email, etc.)?' },
        { id: '5', text: 'Try a demo or free version with your own data.' },
        { id: '6', text: 'Pick the tool that feels easiest and most useful for your needs.' },
      ],
    },
    Enabler: {
      checklistTitle: 'Strategic AI Tool Evaluation & Selection',
      introduction: "Choosing the right AI tools is crucial for success. This checklist guides you through a more strategic evaluation process, considering integration, scalability, and ROI.",
      items: [
        { id: '1', text: 'Clearly Define Business Requirements & Use Cases: For each AI need, detail the specific problems to solve, desired outcomes, and key functionalities required from a tool.' },
        { id: '2', text: 'Research a Broader Range of AI Vendors/Solutions: Look beyond basic tools to evaluate more specialized or enterprise-grade platforms.' },
        { id: '3', text: 'Develop Detailed Evaluation Criteria: Create a scorecard with weighted criteria (e.g., functionality, ease of use, integration capabilities, vendor support, pricing, scalability, security).' },
        { id: '4', text: 'Request Demos & Conduct Proof-of-Concepts (POCs): Engage with vendors for personalized demos and run small POCs with shortlisted tools using your own data.' },
        { id: '5', text: 'Thoroughly Assess Integration Capabilities: Verify how well potential tools integrate with your existing CRM, marketing automation, and other critical systems.' },
        { id: '6', text: 'Evaluate Scalability & Performance: Consider if the tool can handle your future data volumes and user load.' },
        { id: '7', text: 'Analyze Total Cost of Ownership (TCO) & Potential ROI: Look beyond subscription fees to include implementation, training, and maintenance costs. Model potential ROI.' },
        { id: '8', text: 'Check Vendor Reputation, Support, & Roadmap: Investigate vendor stability, customer reviews, support quality, and their future product development plans.' },
        { id: '9', text: 'Involve Key Stakeholders in the Decision: Include representatives from IT, sales, marketing, and potentially legal/compliance in the evaluation process.' },
        { id: '10', text: 'Negotiate Contract Terms & SLAs: Carefully review and negotiate licensing agreements and service level agreements.' },
      ],
    },
    Leader: {
      checklistTitle: 'Building a Cohesive & Future-Proof AI Tool Ecosystem',
      introduction: "Your organization uses multiple AI tools. This checklist focuses on strategically building and managing a cohesive, adaptable, and future-proof AI tool ecosystem.",
      items: [
        { id: '1', text: 'Develop an Enterprise AI Tool Strategy & Governance Framework: Define principles for AI tool selection, integration, and management across the organization.' },
        { id: '2', text: 'Prioritize Interoperability & Open Standards: Favor AI tools that can easily integrate with each other and with your existing data platforms, ideally supporting open standards.' },
        { id: '3', text: 'Conduct Regular Audits of Your AI Tool Stack: Periodically review your portfolio of AI tools for redundancy, underutilization, emerging needs, and cost-effectiveness.' },
        { id: '4', text: 'Balance Best-of-Breed Solutions with Platform Approaches: Strategically decide when to use specialized AI point solutions versus integrated AI capabilities within larger platforms.' },
        { id: '5', text: 'Invest in AI Tools that Support Customization & Model Building (if applicable): For strategic differentiation, consider platforms that allow you to build or fine-tune your own AI models.' },
        { id: '6', text: 'Establish a Centralized AI Tool Management & Support System: Provide internal resources and support for users of approved AI tools.' },
        { id: '7', text: 'Foster a "Build vs. Buy vs. Partner" Decision Framework for AI Capabilities.' },
        { id: '8', text: 'Continuously Scan the Market for Emerging & Disruptive AI Technologies and assess their potential impact on your ecosystem.' },
        { id: '9', text: 'Ensure Robust Security & Compliance Across All AI Tools in your stack, especially regarding data handling.' },
        { id: '10', text: 'Plan for AI Tool Sunsetting & Migration Strategies as technologies evolve or business needs change.' },
      ],
    },
  },
  'Training Your Team for AI Success': {
    Dabbler: {
      checklistTitle: 'AI Basics: Team Training Quick Start',
      introduction: 'A simple checklist to help you get your team started with AI basics and build confidence.',
      items: [
        { id: '1', text: 'Identify who on your team will use AI tools first.' },
        { id: '2', text: 'Find 1-2 short intro videos or articles about your chosen AI tool.' },
        { id: '3', text: 'Schedule a short team session to watch/read and discuss.' },
        { id: '4', text: 'Let each person try the tool with a simple task.' },
        { id: '5', text: 'Share early wins and tips in a team chat or meeting.' },
        { id: '6', text: 'Ask for feedback and note any questions or concerns.' },
      ],
    },
    Enabler: {
      checklistTitle: 'Effective AI Team Training & Adoption Program',
      introduction: "Successful AI implementation requires a well-trained and engaged team. This checklist helps you develop and roll out an effective AI training and adoption program.",
      items: [
        { id: '1', text: 'Identify Specific AI Skills Gaps & Training Needs for different roles/teams.' },
        { id: '2', text: 'Develop Role-Based Training Curriculums: Tailor training content to how different teams (e.g., sales, marketing, content) will use specific AI tools.' },
        { id: '3', text: 'Create a Mix of Training Materials: Use diverse formats (e.g., live workshops, video tutorials, written guides, hands-on exercises, SOPs).' },
        { id: '4', text: 'Include Modules on Responsible AI Use, Data Privacy, & Ethics in all training.' },
        { id: '5', text: 'Identify & Train Internal AI Champions/Super-Users within teams to provide peer support.' },
        { id: '6', text: 'Implement a Phased Training Rollout Plan, starting with pilot groups or key teams.' },
        { id: '7', text: 'Provide Easy Access to Documentation & Support Resources (e.g., internal wiki, helpdesk).' },
        { id: '8', text: 'Track Training Completion & Gather Feedback on training effectiveness.' },
        { id: '9', text: 'Address Change Management Proactively: Communicate the benefits of AI, address concerns, and showcase early wins to encourage adoption.' },
        { id: '10', text: 'Establish Ongoing Learning Opportunities: Offer refresher training, share best practices, and introduce new AI features/tools as they become relevant.' },
      ],
    },
    Leader: {
      checklistTitle: 'Cultivating an AI-Fluent Organization: Continuous Learning & Innovation',
      introduction: "Your organization is committed to AI. This checklist focuses on fostering a pervasive culture of AI fluency, continuous learning, and AI-driven innovation across all levels.",
      items: [
        { id: '1', text: 'Integrate AI Literacy & Skills Development into Overall Talent Strategy & Employee Lifecycle.' },
        { id: '2', text: 'Establish a Centralized AI Learning & Development Hub/Platform with curated resources, courses, and expert communities.' },
        { id: '3', text: 'Develop Advanced, Specialized AI Training Programs for technical roles (e.g., data scientists, AI engineers) and strategic roles (e.g., AI product managers).' },
        { id: '4', text: 'Implement AI-Powered Personalized Learning Paths for employees based on their roles, skill gaps, and career aspirations.' },
        { id: '5', text: 'Foster a Culture of Experimentation & "Safe-to-Fail" AI Piloting to encourage innovation.' },
        { id: '6', text: 'Promote Cross-Functional Collaboration & Knowledge Sharing on AI Initiatives (e.g., internal AI conferences, hackathons, communities of practice).' },
        { id: '7', text: 'Recognize & Reward AI Innovation & Successful Implementations.' },
        { id: '8', text: 'Partner with Academic Institutions & External Experts for Advanced AI Training & Research.' },
        { id: '9', text: 'Continuously Assess & Evolve AI Training Programs Based on Emerging Technologies & Business Needs.' },
        { id: '10', text: 'Embed Ethical AI Principles & Responsible Innovation into All AI Training & Organizational Culture.' },
      ],
    },
  },
  'Running an Effective AI Pilot Program': {
    Dabbler: {
      checklistTitle: 'Quick AI Pilot: Test & Learn',
      introduction: 'A simple checklist to help you run your first small AI pilot and learn from the results.',
      items: [
        { id: '1', text: 'Pick a Simple Use Case: Choose one specific task or process to test with AI (e.g., "Drafting email subject lines" or "Sorting leads").' },
        { id: '2', text: 'Select an AI Tool: Use a tool you already have access to, or try a free/low-cost option.' },
        { id: '3', text: 'Define What Success Looks Like: What would make you say "this worked"? (e.g., "Saves me 30 minutes a week" or "Results are accurate 80% of the time").' },
        { id: '4', text: 'Set Up the Pilot: Configure the tool for your use case. Keep it simple.' },
        { id: '5', text: 'Run the Pilot for a Short Period: Try it for a few days or on a small batch of data.' },
        { id: '6', text: 'Review the Results: Did it work as expected? What surprised you?' },
        { id: '7', text: 'Make One Improvement: Adjust your setup or prompt and try again.' },
        { id: '8', text: 'Document What You Learned: Note what worked, what didn\'t, and what you\'d do differently next time.' },
        { id: '9', text: 'Decide: Is this worth rolling out more broadly, or should you try a different use case/tool?' },
      ],
    },
    Enabler: {
      checklistTitle: 'Designing & Managing High-Impact AI Pilot Programs',
      introduction: "You've run initial AI tests. This checklist guides you through designing and managing more structured AI pilot programs to validate solutions and build a case for wider adoption.",
      items: [
        { id: '1', text: 'Define Clear Pilot Objectives & Success Criteria: What specific questions does this pilot aim to answer? What quantifiable outcomes define success (e.g., achieve X% accuracy, reduce Y hours, improve Z metric by W%)?' },
        { id: '2', text: 'Select a Well-Defined Use Case & AI Tool: Choose a specific, manageable use case and the AI tool you\'ve evaluated as most promising for it.' },
        { id: '3', text: 'Assemble a Representative Pilot Team: Include users who will ultimately use the AI, a technical resource (if needed), and a project lead.' },
        { id: '4', text: 'Develop a Detailed Pilot Plan & Timeline: Outline key activities, responsibilities, duration, and milestones for the pilot.' },
        { id: '5', text: 'Prepare Necessary Data & System Access: Ensure the pilot team has access to the required data (cleaned and prepared) and any integrated systems.' },
        { id: '6', text: 'Conduct Focused Training for the Pilot Team on the AI tool and pilot process.' },
        { id: '7', text: 'Establish Clear Communication & Feedback Channels for the pilot duration.' },
        { id: '8', text: 'Monitor Pilot Performance Rigorously Against KPIs: Track both quantitative metrics and qualitative feedback from the pilot team.' },
        { id: '9', text: 'Document All Findings, Challenges, and Lessons Learned throughout the pilot.' },
        { id: '10', text: 'Present Pilot Results & Recommendations to Stakeholders: Clearly communicate outcomes, ROI potential, and a go/no-go recommendation for broader rollout.' },
      ],
    },
    Leader: {
      checklistTitle: 'Strategic AI Piloting: Driving Innovation & Scalable Solutions',
      introduction: "Your organization uses pilots to vet AI solutions. This checklist focuses on a strategic approach to AI piloting that drives innovation, de-risks large investments, and ensures solutions are scalable and aligned with enterprise goals.",
      items: [
        { id: '1', text: 'Align Pilot Portfolio with Strategic Business Objectives & AI Roadmap.' },
        { id: '2', text: 'Establish a Formalized AI Pilot Program Framework & Governance Process.' },
        { id: '3', text: 'Prioritize Pilots Based on Potential Impact, Feasibility, and Strategic Fit.' },
        { id: '4', text: 'Design Pilots for Rapid Iteration & Learning (Fail Fast, Learn Faster).' },
        { id: '5', text: 'Incorporate Scalability, Security, and Integration Requirements from the Outset of Pilot Design.' },
        { id: '6', text: 'Utilize Cross-Functional Teams with Diverse Expertise for Pilot Execution & Evaluation.' },
        { id: '7', text: 'Implement Advanced Monitoring & Analytics for Pilot Performance, including leading and lagging indicators.' },
        { id: '8', text: 'Develop Standardized Reporting Templates & Dashboards for Communicating Pilot Outcomes to Executive Leadership.' },
        { id: '9', text: 'Create a Knowledge Base of Pilot Learnings, Best Practices, and Reusable Components.' },
        { id: '10', text: 'Transition Successful Pilots to Full-Scale Production with Clear Handover & Support Plans.' },
      ],
    },
  },
  'Measuring the Impact & ROI of Your AI Initiatives': {
    Dabbler: {
      checklistTitle: 'Simple AI Impact & ROI Check',
      introduction: 'A quick checklist to help you measure the basic impact of your first AI project.',
      items: [
        { id: '1', text: 'Recall Your Original Goal: What did you hope AI would help you achieve?' },
        { id: '2', text: 'Check the Results: Did you save time, get more leads, or improve quality? Write down any numbers or examples.' },
        { id: '3', text: 'Estimate Time or Cost Savings: Roughly how much time or money did you save in a week or month?' },
        { id: '4', text: 'Ask for Feedback: Did anyone on your team or in your audience notice a difference?' },
        { id: '5', text: 'List Any Extra Benefits: Did you learn something new, or did the AI help in unexpected ways?' },
        { id: '6', text: 'Write Down Any Issues: What didn\'t work as well as you hoped?' },
        { id: '7', text: 'Decide: Was the benefit worth the effort and cost?' },
        { id: '8', text: 'Share a Short Summary with Your Team or Manager.' },
      ],
    },
    Enabler: {
      checklistTitle: 'Measuring AI Impact: Key Metrics & Basic ROI Calculation',
      introduction: "It's important to show the value of your AI efforts. This checklist helps you identify key metrics and perform a basic Return on Investment (ROI) calculation for your AI projects.",
      items: [
        { id: '1', text: 'Revisit KPIs Defined Before AI Implementation: What were the original success metrics for the AI project?' },
        { id: '2', text: 'Collect Post-Implementation Performance Data: Gather data for the same KPIs after the AI tool/process has been in use for a defined period.' },
        { id: '3', text: 'Identify Direct Cost Savings: Calculate any clear cost reductions (e.g., reduced software licenses, less overtime, lower cost per lead).' },
        { id: '4', text: 'Quantify Time Savings & Efficiency Gains: Estimate time saved by individuals or teams due to AI, and translate this into a monetary value if possible.' },
        { id: '5', text: 'Measure Improvements in Key Outputs: Track changes in metrics like lead conversion rates, content engagement, customer satisfaction scores, or sales cycle length.' },
        { id: '6', text: 'List Costs Associated with the AI Initiative: Include software costs, implementation time, training expenses, and ongoing maintenance.' },
        { id: '7', text: 'Calculate Basic ROI: (Total Benefits - Total Costs) / Total Costs. Express as a percentage.' },
        { id: '8', text: 'Gather Qualitative Feedback & Testimonials: Collect user stories and anecdotal evidence of AI\'s impact.' },
        { id: '9', text: 'Prepare a Simple Report Summarizing Findings, Metrics, and Basic ROI.' },
        { id: '10', text: 'Identify Areas for Improvement in Future AI Impact Measurement.' },
      ],
    },
    Leader: {
      checklistTitle: 'Advanced AI Performance Measurement & Strategic ROI Realization',
      introduction: "Your organization strategically invests in AI. This checklist focuses on implementing a comprehensive framework for measuring AI's multifaceted impact and maximizing strategic ROI.",
      items: [
        { id: '1', text: 'Establish a Standardized AI Value Realization Framework Across the Organization.' },
        { id: '2', text: 'Define a Balanced Scorecard of AI Metrics: Include financial, operational, customer impact, and strategic/innovation metrics.' },
        { id: '3', text: 'Implement Advanced Analytics & Attribution Modeling to accurately measure AI\'s contribution to complex business outcomes.' },
        { id: '4', text: 'Track Both Tangible (Financial) and Intangible (Strategic) Benefits of AI.' },
        { id: '5', text: 'Conduct Regular, In-Depth ROI Analyses for All Major AI Initiatives, including sensitivity analysis and forecasting.' },
        { id: '6', text: 'Develop Executive Dashboards to Communicate AI Performance & Strategic Value to Leadership.' },
        { id: '7', text: 'Integrate AI Performance Metrics into Business Unit Scorecards & Individual Performance Goals.' },
        { id: '8', text: 'Use AI Itself to Monitor and Predict the Performance of Other AI Systems.' },
        { id: '9', text: 'Continuously Benchmark AI Performance Against Industry Peers & Best-in-Class Organizations.' },
        { id: '10', text: 'Reinvest Gains from AI Initiatives to Fund Further Innovation & Strategic Growth.' },
      ],
    },
  },
};

// Prompt Library Types
interface PromptPlaceholderMeta {
  guidance: string;
  examples: string[];
}

interface PromptWithPlaceholders {
  id: string;
  title: string;
  tier: string;
  category: string;
  fullText: string;
  placeholders: Record<string, PromptPlaceholderMeta>;
}

// Placeholder prompt data
const promptCategories = [
  'All',
  'Content Ideation & Creation',
  'Market Research',
  'Sales & Outreach',
  'Strategic Content & Campaign Development',
];

const samplePrompts: PromptWithPlaceholders[] = [
  {
    id: 'p1_enhanced',
    title: 'Blog Post Titles with Guidance',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Content Strategist for {{CLIENT_BUSINESS_TYPE}}. Their target audience is {{TARGET_AUDIENCE_DETAIL}}. Based on the primary goal of {{CLIENT_GOAL}}, generate 10 blog post titles.",
    placeholders: {
      CLIENT_BUSINESS_TYPE: {
        guidance: "What kind of business is your client? Be specific!",
        examples: [
          "'a local eco-friendly cafe'",
          "'a B2B software company specializing in cybersecurity'",
        ],
      },
      TARGET_AUDIENCE_DETAIL: {
        guidance:
          "Describe your audience in detail. Consider demographics, interests, challenges.",
        examples: [
          "'environmentally conscious millennials (25-35) who value community'",
          "'IT managers in mid-sized financial firms concerned about data breaches'",
        ],
      },
      CLIENT_GOAL: {
        guidance: "What is the main objective for these blog post titles?",
        examples: [
          "'attracting more lunchtime customers'",
          "'increasing sign-ups for our upcoming webinar'",
        ],
      },
    },
  },
  {
    id: 'p2_enhanced',
    title: 'Ad Copy for Product Launch',
    tier: 'Enabler',
    category: 'Content Ideation & Creation',
    fullText:
      "Write a compelling ad for {{PRODUCT_NAME}} targeting {{TARGET_MARKET}}. Highlight the key benefit: {{KEY_BENEFIT}}.",
    placeholders: {
      PRODUCT_NAME: {
        guidance: "What is the name of your product?",
        examples: ["'EcoBrew Travel Mug'", "'SecureCloud Pro'"],
      },
      TARGET_MARKET: {
        guidance: "Who is the main audience for this ad?",
        examples: ["'busy professionals who commute'", "'small business owners needing secure backups'"],
      },
      KEY_BENEFIT: {
        guidance: "What is the #1 benefit you want to emphasize?",
        examples: ["'keeps drinks hot for 12 hours'", "'automated daily encrypted backups'"],
      },
    },
  },
  // --- ADDED: Dabbler Prompts for Content Ideation & Creation ---
  {
    id: 'dabbler_content_blog_titles',
    title: 'Brainstorm Blog Post Titles (Beginner)',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a helpful Content Strategist. I need ideas for blog posts...\nMy business/client is: {{CLIENT_DESCRIPTION}}\nMy target audience is: {{TARGET_AUDIENCE}}\nThe main topic I want to cover is: {{BLOG_TOPIC}}\nMy primary goal for these blog posts is: {{BLOG_GOAL}}\n\nPlease generate 10 blog post titles that are engaging, relevant to my target audience, and hint at solving a problem or offering value related to my goal. Provide a mix of title styles (e.g., how-to, listicle, question-based).",
    placeholders: {
      CLIENT_DESCRIPTION: {
        guidance: "Briefly describe your business or your client's business. What do you do/offer?",
        examples: [
          "'a local bakery specializing in custom cakes'",
          "'a B2B SaaS company offering project management software'",
          "'a personal finance coach for millennials'"
        ]
      },
      TARGET_AUDIENCE: {
        guidance: "Who are you trying to reach with these blog posts? Be specific.",
        examples: [
          "'busy parents looking for quick dinner recipes'",
          "'startup founders seeking advice on early-stage funding'",
          "'DIY home renovators on a budget'"
        ]
      },
      BLOG_TOPIC: {
        guidance: "What is the general subject area for these blog posts?",
        examples: [
          "'healthy eating'",
          "'digital marketing trends'",
          "'sustainable gardening'"
        ]
      },
      BLOG_GOAL: {
        guidance: "What do you want these blog posts to achieve for your business?",
        examples: [
          "'attract more visitors to our website'",
          "'establish ourselves as experts in [topic]'",
          "'generate leads for our new service'"
        ]
      }
    }
  },
  {
    id: 'dabbler_content_social_ideas',
    title: 'Social Media Post Ideas (Beginner)',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a creative Social Media Assistant.\nI want to promote my: {{PRODUCT_SERVICE_TYPE}}\nThe specific product/service name (if any) is: {{PRODUCT_SERVICE_NAME_OPTIONAL}}\nMy target audience for this promotion is: {{TARGET_AUDIENCE_SOCIAL}}\nThe social media platform I'm focusing on is: {{SOCIAL_PLATFORM}}\nThe key message or benefit I want to highlight is: {{KEY_MESSAGE_BENEFIT}}\n\nPlease write 5 distinct social media post ideas for this platform to promote my product/service. Each idea should be engaging and suitable for the chosen platform. Include a suggestion for a relevant emoji for each post.",
    placeholders: {
      PRODUCT_SERVICE_TYPE: {
        guidance: "What general type of product or service are you promoting?",
        examples: [
          "'a new line of handmade soaps'",
          "'a webinar on financial planning'",
          "'a local dog walking service'"
        ]
      },
      PRODUCT_SERVICE_NAME_OPTIONAL: {
        guidance: "If there's a specific name for your product/service, enter it here. (Optional)",
        examples: [
          "'The 'Zen Garden' Soap Collection'",
          "'Financial Freedom 101 Webinar'",
          "'Pawsitive Steps Dog Walking'"
        ]
      },
      TARGET_AUDIENCE_SOCIAL: {
        guidance: "Who are you trying to reach with these social media posts?",
        examples: [
          "'young professionals interested in unique gifts'",
          "'students looking to improve their study habits'",
          "'pet owners in the downtown area'"
        ]
      },
      SOCIAL_PLATFORM: {
        guidance: "Which social media platform are these posts for?",
        examples: [
          "'Instagram'",
          "'Facebook'",
          "'LinkedIn'",
          "'Twitter/X'"
        ]
      },
      KEY_MESSAGE_BENEFIT: {
        guidance: "What is the single most important thing you want to communicate or the main benefit for the user?",
        examples: [
          "'our soaps are all-natural and great for sensitive skin'",
          "'learn how to budget effectively in just one hour'",
          "'reliable and loving care for your dog while you're at work'"
        ]
      }
    }
  },
  {
    id: 'dabbler_content_email_subjects',
    title: 'Catchy Email Subject Lines (Beginner)',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a direct response copywriter.\nI'm writing a newsletter about: {{NEWSLETTER_TOPIC}}\nThe key benefit or offer is: {{NEWSLETTER_KEY_BENEFIT}}\nThe audience for this newsletter is: {{NEWSLETTER_AUDIENCE}}\nThe tone I want is: {{NEWSLETTER_TONE}}\n\nPlease generate 5 catchy, curiosity-driven subject lines that will increase open rates and are relevant to the topic, benefit, and audience.",
    placeholders: {
      NEWSLETTER_TOPIC: {
        guidance: "What is the main topic or theme of your newsletter?",
        examples: [
          "'spring gardening tips'",
          "'latest updates in digital marketing'",
          "'healthy meal planning for busy families'"
        ]
      },
      NEWSLETTER_KEY_BENEFIT: {
        guidance: "What is the main benefit, offer, or value proposition for this newsletter?",
        examples: [
          "'exclusive discount for subscribers'",
          "'insider strategies to grow your business'",
          "'quick recipes to save time'"
        ]
      },
      NEWSLETTER_AUDIENCE: {
        guidance: "Who is the target audience for this newsletter?",
        examples: [
          "'small business owners'",
          "'parents of young children'",
          "'marketing professionals'"
        ]
      },
      NEWSLETTER_TONE: {
        guidance: "What tone or style do you want for the subject lines?",
        examples: [
          "'friendly and upbeat'",
          "'professional and informative'",
          "'playful and witty'"
        ]
      }
    }
  },
  {
    id: 'dabbler_content_summarize_article',
    title: 'Quick Article Summary (Beginner)',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a research assistant.\nPlease summarize the following article text into {{NUMBER_OF_SENTENCES}} clear, concise sentences that capture the main points.\nArticle Text:\n{{ARTICLE_TEXT_TO_SUMMARIZE}}",
    placeholders: {
      NUMBER_OF_SENTENCES: {
        guidance: "How many sentences should the summary be? (e.g., 3, 5, 7)",
        examples: [
          "3",
          "5",
          "7"
        ]
      },
      ARTICLE_TEXT_TO_SUMMARIZE: {
        guidance: "Paste the article or passage you want summarized.",
        examples: [
          "'Artificial intelligence is transforming industries by automating tasks...'",
          "'In this article, we explore the benefits of remote work...'"
        ]
      }
    }
  },
  {
    id: 'dabbler_content_rewrite_paragraph',
    title: 'Change Paragraph Tone (Beginner)',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as an expert editor.\nI need to rewrite the following paragraph to make it sound more {{DESIRED_TONE}} for {{PARAGRAPH_AUDIENCE}}.\nThe key message to keep is: {{PARAGRAPH_KEY_MESSAGE}}\nOriginal Paragraph:\n{{ORIGINAL_PARAGRAPH_TEXT}}",
    placeholders: {
      DESIRED_TONE: {
        guidance: "What tone do you want the rewritten paragraph to have?",
        examples: [
          "'friendly and conversational'",
          "'formal and authoritative'",
          "'excited and energetic'"
        ]
      },
      PARAGRAPH_AUDIENCE: {
        guidance: "Who is the intended audience for this paragraph?",
        examples: [
          "'potential customers'",
          "'industry peers'",
          "'internal team members'"
        ]
      },
      PARAGRAPH_KEY_MESSAGE: {
        guidance: "What is the main message or point that must be preserved?",
        examples: [
          "'our product saves time'",
          "'team collaboration is essential'",
          "'this new policy improves efficiency'"
        ]
      },
      ORIGINAL_PARAGRAPH_TEXT: {
        guidance: "Paste the original paragraph you want to rewrite.",
        examples: [
          "'Our software helps you finish projects faster by automating repetitive tasks.'",
          "'Working together as a team leads to better results.'"
        ]
      }
    }
  },
  {
    id: 'dabbler_content_audience_questions',
    title: 'Anticipate Audience Questions (Beginner)',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a customer-focused Content Researcher.\nMy product/service/topic is: {{PRODUCT_SERVICE_TOPIC}}\nMy target audience is: {{AUDIENCE_DESCRIPTION_QUESTIONS}}\nThe main goal of understanding these questions is: {{GOAL_FOR_QUESTIONS}}\n\nPlease list 5-7 common questions this target audience might have about my product/service/topic. Frame them as if the audience member is asking.",
    placeholders: {
      PRODUCT_SERVICE_TOPIC: {
        guidance: "What specific product, service, or general topic are you focusing on?",
        examples: [
          "'getting a home mortgage for the first time'",
          "'our new vegan meal delivery service'",
          "'learning basic Python programming'"
        ]
      },
      AUDIENCE_DESCRIPTION_QUESTIONS: {
        guidance: "Describe the target audience who would have these questions. Be specific.",
        examples: [
          "'first-time homebuyers with little financial knowledge'",
          "'health-conscious busy professionals looking for convenient meal options'",
          "'absolute beginners to coding who want to learn a new skill'"
        ]
      },
      GOAL_FOR_QUESTIONS: {
        guidance: "Why do you want to know these questions? (e.g., to create FAQ content, to address concerns in sales calls, to improve website copy).",
        examples: [
          "'to create a helpful FAQ section for our website'",
          "'to prepare our sales team for common objections'",
          "'to ensure our marketing messages address their main concerns'"
        ]
      }
    }
  },
  {
    id: 'dabbler_content_hashtags',
    title: 'Find Relevant Hashtags (Beginner)',
    tier: 'Dabbler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Social Media Specialist.\nI'm creating a social media post about: {{POST_TOPIC_HASHTAGS}}\nThe main platform for this post is: {{SOCIAL_PLATFORM_HASHTAGS}}\nMy target audience for this post is: {{AUDIENCE_HASHTAGS}}\nThe desired tone/vibe of the post is: {{POST_TONE_HASHTAGS}}\n\nPlease suggest 5-7 relevant hashtags for this social media post. Include a mix of popular, niche, and potentially branded hashtags if applicable.",
    placeholders: {
      POST_TOPIC_HASHTAGS: {
        guidance: "What is the main subject or theme of your social media post?",
        examples: [
          "'our new range of sustainable fashion t-shirts'",
          "'a healthy breakfast recipe'",
          "'tips for remote work productivity'"
        ]
      },
      SOCIAL_PLATFORM_HASHTAGS: {
        guidance: "Which social media platform is this post intended for primarily?",
        examples: [
          "'Instagram'",
          "'Twitter/X'",
          "'LinkedIn'",
          "'Pinterest'"
        ]
      },
      AUDIENCE_HASHTAGS: {
        guidance: "Who are you trying to reach with this post?",
        examples: [
          "'eco-conscious shoppers'",
          "'foodies looking for quick meal ideas'",
          "'freelancers and remote workers'"
        ]
      },
      POST_TONE_HASHTAGS: {
        guidance: "What is the overall feeling or style of your post?",
        examples: [
          "'fun and trendy'",
          "'informative and helpful'",
          "'inspirational and motivational'"
        ]
      }
    }
  },
  // --- ENABLER PROMPTS FOR CONTENT IDEATION & CREATION ---
  {
    id: 'enabler_content_calendar',
    title: '4-Week Content Calendar Outline (Intermediate)',
    tier: 'Enabler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Senior Content Strategist.\nMy business operates in the {{INDUSTRY_NAME}} industry. Our main marketing goal for this month is: {{MARKETING_GOAL_MONTH}}. Our target audience is: {{TARGET_AUDIENCE_CALENDAR}}. The key themes, products, or campaigns to focus on this month are: {{MONTHLY_THEMES_PRODUCTS}}.\n\nPlease outline a 4-week content calendar. For each week, suggest a main content theme, 2-3 content ideas (with format suggestions), and a brief note on how each supports the marketing goal.",
    placeholders: {
      INDUSTRY_NAME: {
        guidance: "What industry does your business operate in?",
        examples: ["'real estate'", "'health & wellness'", "'B2B SaaS'"],
      },
      MARKETING_GOAL_MONTH: {
        guidance: "What is your primary marketing goal for this month?",
        examples: ["'increase webinar sign-ups'", "'launch new product'", "'boost brand awareness'"],
      },
      TARGET_AUDIENCE_CALENDAR: {
        guidance: "Who is your main target audience for this calendar?",
        examples: ["'first-time home buyers'", "'busy professionals seeking stress relief'", "'IT managers in finance'"],
      },
      MONTHLY_THEMES_PRODUCTS: {
        guidance: "List any key themes, products, or campaigns to focus on this month.",
        examples: ["'Spring Savings campaign, new eBook launch'", "'Mental Health Awareness Month'", "'Feature update: SecureSync'"],
      },
    },
  },
  {
    id: 'enabler_content_persona',
    title: 'Develop Detailed Customer Persona (Intermediate)',
    tier: 'Enabler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as an experienced Market Researcher.\nI need to develop a detailed customer persona for the ideal buyer of our {{PRODUCT_SERVICE_DESCRIPTION}}. The target audience is: {{TARGET_AUDIENCE_PERSONA}}. The main problem this persona wants to solve is: {{PROBLEM_SOLVED}}.\n\nPlease provide a detailed persona including: name, demographics, job/role, key goals, pain points, preferred content types, and where they seek information online.",
    placeholders: {
      PRODUCT_SERVICE_DESCRIPTION: {
        guidance: "Briefly describe your product or service.",
        examples: ["'AI-powered CRM platform'", "'organic skincare line'", "'virtual event planning service'"],
      },
      TARGET_AUDIENCE_PERSONA: {
        guidance: "Who is the main target audience for this persona?",
        examples: ["'small business owners'", "'millennial women interested in wellness'", "'HR managers at tech companies'"],
      },
      PROBLEM_SOLVED: {
        guidance: "What is the main problem this persona is trying to solve?",
        examples: ["'streamlining customer communications'", "'finding natural skincare for sensitive skin'", "'hosting engaging virtual events'"],
      },
    },
  },
  {
    id: 'enabler_content_ab_ad_copy',
    title: 'A/B Test Ad Copy Variations (Intermediate)',
    tier: 'Enabler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Performance Marketing Specialist.\nWe are creating an ad for our {{PRODUCT_SERVICE_AD}}. The target audience is: {{TARGET_AUDIENCE_AD}}. The ad platform is: {{AD_PLATFORM}}. The key benefit to highlight is: {{KEY_BENEFIT_AD}}. The call to action is: {{CALL_TO_ACTION_AD}}.\n\nPlease generate two distinct ad copy variations for A/B testing. Each should be tailored to the platform and audience, and clearly communicate the benefit and call to action.",
    placeholders: {
      PRODUCT_SERVICE_AD: {
        guidance: "What is the product or service being advertised?",
        examples: ["'EcoBrew Travel Mug'", "'SecureCloud Pro'", "'Spring Fitness Challenge'"],
      },
      TARGET_AUDIENCE_AD: {
        guidance: "Who is the main audience for this ad?",
        examples: ["'busy commuters'", "'small business owners needing secure backups'", "'fitness enthusiasts'"],
      },
      AD_PLATFORM: {
        guidance: "Which ad platform will this run on?",
        examples: ["'Facebook'", "'Instagram Stories'", "'LinkedIn'", "'Google Search'"],
      },
      KEY_BENEFIT_AD: {
        guidance: "What is the #1 benefit to emphasize in the ad?",
        examples: ["'keeps drinks hot for 12 hours'", "'automated daily encrypted backups'", "'personalized coaching and progress tracking'"],
      },
      CALL_TO_ACTION_AD: {
        guidance: "What is the main call to action for this ad?",
        examples: ["'Shop now'", "'Start your free trial'", "'Join the challenge'"],
      },
    },
  },
  // --- FINAL ENABLER PROMPTS FOR CONTENT IDEATION & CREATION ---
  {
    id: 'enabler_content_keyword_blog_outline',
    title: 'SEO Blog Post Outline (Intermediate)',
    tier: 'Enabler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as an SEO Content Specialist.\nI need to create a blog post outline optimized for the primary keyword: \"{{TARGET_KEYWORD}}\". The industry is: {{INDUSTRY_FOR_SEO}}. The target audience is: {{TARGET_AUDIENCE_SEO_BLOG}}. (Optional) A secondary keyword to include is: {{SECONDARY_KEYWORD_OPTIONAL}}. The call to action for this blog post is: {{BLOG_CTA}}.\n\nPlease generate a detailed outline with suggested H2/H3 headings, a brief description for each section, and recommendations for integrating the keywords and CTA.",
    placeholders: {
      TARGET_KEYWORD: {
        guidance: "What is the primary keyword you want to rank for?",
        examples: ["'AI marketing automation'", "'first home buyer tips'", "'employee wellness programs'"],
      },
      INDUSTRY_FOR_SEO: {
        guidance: "What industry is this blog post for?",
        examples: ["'real estate'", "'health & wellness'", "'B2B SaaS'"],
      },
      TARGET_AUDIENCE_SEO_BLOG: {
        guidance: "Who is the main target audience for this blog post?",
        examples: ["'first-time home buyers'", "'HR managers'", "'busy professionals'"],
      },
      SECONDARY_KEYWORD_OPTIONAL: {
        guidance: "(Optional) Is there a secondary keyword to include?",
        examples: ["'mortgage pre-approval'", "'mental health at work'", "'SaaS onboarding best practices'"],
      },
      BLOG_CTA: {
        guidance: "What is the call to action for this blog post?",
        examples: ["'Download our free checklist'", "'Book a consultation'", "'Sign up for our newsletter'"],
      },
    },
  },
  {
    id: 'enabler_content_email_nurture',
    title: '3-Email Nurture Sequence (Intermediate)',
    tier: 'Enabler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as an Email Marketing Automation Specialist.\nWe need a 3-email nurture sequence for leads who have just downloaded our whitepaper titled: \"{{WHITEPAPER_TITLE}}\". The whitepaper topic is: {{WHITEPAPER_TOPIC}}. The goal of this sequence is: {{SEQUENCE_GOAL}}. The product/service we want to introduce is: {{PRODUCT_SERVICE_NURTURE}}. The target audience is: {{TARGET_AUDIENCE_NURTURE}}. The brand voice/tone should be: {{BRAND_VOICE_NURTURE}}.\n\nPlease write a brief outline for each email (subject, main message, CTA), ensuring the sequence builds trust and moves the lead closer to the goal.",
    placeholders: {
      WHITEPAPER_TITLE: {
        guidance: "What is the title of the whitepaper the lead downloaded?",
        examples: ["'The Ultimate Guide to AI in Marketing'", "'2024 Home Buyer Checklist'", "'Employee Wellness Trends'"],
      },
      WHITEPAPER_TOPIC: {
        guidance: "What is the main topic of the whitepaper?",
        examples: ["'AI marketing strategies'", "'first home buying process'", "'corporate wellness programs'"],
      },
      SEQUENCE_GOAL: {
        guidance: "What is the main goal of this nurture sequence?",
        examples: ["'book a sales call'", "'request a product demo'", "'sign up for a webinar'"],
      },
      PRODUCT_SERVICE_NURTURE: {
        guidance: "What product or service do you want to introduce in the sequence?",
        examples: ["'AI-powered CRM'", "'First Home Buyer Coaching'", "'Wellness Platform Subscription'"],
      },
      TARGET_AUDIENCE_NURTURE: {
        guidance: "Who is the main target audience for this sequence?",
        examples: ["'marketing managers at mid-sized companies'", "'first-time home buyers'", "'HR leaders in tech'"],
      },
      BRAND_VOICE_NURTURE: {
        guidance: "What brand voice or tone should the emails use?",
        examples: ["'friendly and expert'", "'reassuring and practical'", "'innovative and inspiring'"],
      },
    },
  },
  {
    id: 'enabler_content_rewrite_vp',
    title: 'Refine Value Proposition (Intermediate)',
    tier: 'Enabler',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Brand Strategist and Copywriter.\nWe need to refine our current value proposition.\nOur product/service is: {{PRODUCT_SERVICE_FOR_VP}}. The target audience is: {{TARGET_AUDIENCE_VP}}. The main pain points we solve are: {{PAIN_POINTS_SOLVED}}. Our main competitor types are: {{COMPETITOR_TYPES}}. Our key differentiators are: {{DIFFERENTIATORS}}. Our current value proposition is: {{OLD_VALUE_PROPOSITION}}.\n\nPlease rewrite the value proposition to be more compelling, clear, and differentiated. Provide a short rationale for your changes.",
    placeholders: {
      PRODUCT_SERVICE_FOR_VP: {
        guidance: "Briefly describe your product or service.",
        examples: ["'AI-powered CRM platform'", "'organic skincare line'", "'virtual event planning service'"],
      },
      TARGET_AUDIENCE_VP: {
        guidance: "Who is the main target audience for this value proposition?",
        examples: ["'small business owners'", "'millennial women interested in wellness'", "'HR managers at tech companies'"],
      },
      PAIN_POINTS_SOLVED: {
        guidance: "What are the main pain points your product/service solves?",
        examples: ["'streamlining customer communications'", "'finding natural skincare for sensitive skin'", "'hosting engaging virtual events'"],
      },
      COMPETITOR_TYPES: {
        guidance: "What types of competitors do you face?",
        examples: ["'legacy CRM providers'", "'mass-market skincare brands'", "'DIY event platforms'"],
      },
      DIFFERENTIATORS: {
        guidance: "What are your key differentiators?",
        examples: ["'AI-driven personalization'", "'100% organic ingredients'", "'full-service event management'"],
      },
      OLD_VALUE_PROPOSITION: {
        guidance: "What is your current value proposition? Paste it here.",
        examples: ["'Our CRM helps you manage leads efficiently.'", "'Natural skincare for every woman.'", "'We make virtual events easy.'"],
      },
    },
  },
  // --- LEADER PROMPTS FOR CONTENT IDEATION & CREATION ---
  {
    id: 'leader_content_3month_strategy',
    title: 'Develop 3-Month Marketing Strategy (Advanced)',
    tier: 'Leader',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Chief Marketing Officer (CMO) with deep expertise in strategic planning and AI-driven marketing.\nWe are planning the launch of our new: {{PRODUCT_SERVICE_TO_LAUNCH}}. The niche/target audience is: {{NICHE_TARGET_AUDIENCE}}. The primary business goal for this launch is: {{BUSINESS_GOAL_LAUNCH}}. The available budget level is: {{BUDGET_LEVEL}}. (Optional) Known competitors to consider: {{KNOWN_COMPETITORS_OPTIONAL}}.\n\nPlease develop a high-level 3-month marketing strategy. Include: key phases, major campaign themes, recommended channels, high-impact content types, and a brief rationale for each. Highlight where AI can be leveraged for efficiency or insight.",
    placeholders: {
      PRODUCT_SERVICE_TO_LAUNCH: {
        guidance: "What is the product or service being launched?",
        examples: ["'AI-powered CRM platform'", "'organic skincare line'", "'virtual event planning service'"],
      },
      NICHE_TARGET_AUDIENCE: {
        guidance: "Who is the specific/niche target audience for this launch?",
        examples: ["'B2B SaaS founders in fintech'", "'millennial women interested in wellness'", "'HR managers at tech companies'"],
      },
      BUSINESS_GOAL_LAUNCH: {
        guidance: "What is the primary business goal for this launch?",
        examples: ["'generate 500 qualified leads'", "'achieve $100k in sales'", "'build brand authority in a new market segment'"],
      },
      BUDGET_LEVEL: {
        guidance: "What is the available budget level? (e.g., low, medium, high)",
        examples: ["'low'", "'medium'", "'high'"],
      },
      KNOWN_COMPETITORS_OPTIONAL: {
        guidance: "(Optional) List any known competitors to consider.",
        examples: ["'HubSpot, Salesforce'", "'Lush, The Ordinary'", "'Hopin, Eventbrite'"],
      },
    },
  },
  {
    id: 'leader_content_campaign_concept',
    title: 'Multi-Channel Campaign Concept (Advanced)',
    tier: 'Leader',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as an award-winning Creative Director for a top advertising agency.\nWe need a compelling multi-channel campaign concept to promote our: {{PRODUCT_SERVICE_CAMPAIGN}}. The season/event/timing for this campaign is: {{SEASON_EVENT_TIMING}}. The target audience is: {{TARGET_AUDIENCE_CAMPAIGN}}. The core campaign message is: {{CORE_CAMPAIGN_MESSAGE}}. The brand personality to convey is: {{BRAND_PERSONALITY}}.\n\nPlease develop a big-picture campaign concept. Include: the central creative idea, suggested taglines, recommended channels, and a brief outline of how the concept adapts across 3+ channels. Explain how the campaign will stand out and drive engagement.",
    placeholders: {
      PRODUCT_SERVICE_CAMPAIGN: {
        guidance: "What is the product or service being promoted?",
        examples: ["'AI-powered CRM platform'", "'organic skincare line'", "'virtual event planning service'"],
      },
      SEASON_EVENT_TIMING: {
        guidance: "What is the season, event, or timing for this campaign?",
        examples: ["'Spring 2024'", "'Back to School'", "'End-of-year holiday season'"],
      },
      TARGET_AUDIENCE_CAMPAIGN: {
        guidance: "Who is the main target audience for this campaign?",
        examples: ["'small business owners'", "'millennial women interested in wellness'", "'HR managers at tech companies'"],
      },
      CORE_CAMPAIGN_MESSAGE: {
        guidance: "What is the core message or theme for this campaign?",
        examples: ["'Empowering growth with AI'", "'Beauty rooted in nature'", "'Seamless virtual experiences'"],
      },
      BRAND_PERSONALITY: {
        guidance: "What brand personality or tone should the campaign convey?",
        examples: ["'innovative and approachable'", "'luxurious yet accessible'", "'fun and energetic'"],
      },
    },
  },
  // --- FINAL LEADER PROMPTS FOR CONTENT IDEATION & CREATION ---
  {
    id: 'leader_content_sales_data_analysis',
    title: 'Sales Data Analysis for Strategic Insights (Advanced)',
    tier: 'Leader',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Senior Data Analyst specializing in sales and marketing intelligence.\nWe need to analyze our sales data for the past {{TIME_PERIOD_SALES_DATA}}. The available data points are: {{AVAILABLE_SALES_DATA_POINTS}}. The main objective of this analysis is: {{ANALYSIS_OBJECTIVE}}. The industry context is: {{INDUSTRY_FOR_SALES_ANALYSIS}}.\n\nPlease provide a strategic analysis including: key trends, actionable insights, and 2-3 data-driven recommendations for content or campaign strategy. Highlight any opportunities for AI-driven optimization.",
    placeholders: {
      TIME_PERIOD_SALES_DATA: {
        guidance: "What is the time period for the sales data (e.g., Q1 2024, last 12 months)?",
        examples: ["'Q1 2024'", "'last 12 months'", "'calendar year 2023'"],
      },
      AVAILABLE_SALES_DATA_POINTS: {
        guidance: "List the available sales data points (e.g., revenue, lead source, conversion rate, etc.).",
        examples: ["'monthly revenue, lead source, conversion rate, average deal size'", "'product category, region, sales rep performance'"],
      },
      ANALYSIS_OBJECTIVE: {
        guidance: "What is the main objective of this analysis?",
        examples: ["'identify top-performing channels'", "'find bottlenecks in the sales funnel'", "'uncover new content opportunities'"],
      },
      INDUSTRY_FOR_SALES_ANALYSIS: {
        guidance: "What is the industry context for this analysis?",
        examples: ["'B2B SaaS'", "'real estate'", "'health & wellness'"],
      },
    },
  },
  {
    id: 'leader_content_lead_gen_funnel',
    title: 'Design AI-Enhanced Lead Gen Funnel (Advanced)',
    tier: 'Leader',
    category: 'Content Ideation & Creation',
    fullText:
      "Act as a Growth Marketing Architect with expertise in full-funnel strategy and AI optimization.\nWe need to design a comprehensive lead generation funnel for our: {{PRODUCT_SERVICE_FUNNEL}}. The ideal customer profile (ICP) is: {{ICP_DESCRIPTION_FUNNEL}}. The main goal of the funnel is: {{FUNNEL_GOAL}}. (Optional) The typical sales cycle length is: {{SALES_CYCLE_LENGTH_OPTIONAL}}.\n\nPlease outline the funnel stages, recommended content/campaigns for each stage, and where AI can be leveraged for targeting, personalization, or automation. Include 2-3 advanced tactics for maximizing lead quality and conversion.",
    placeholders: {
      PRODUCT_SERVICE_FUNNEL: {
        guidance: "What is the product or service for this lead gen funnel?",
        examples: ["'AI-powered CRM platform'", "'organic skincare line'", "'virtual event planning service'"],
      },
      ICP_DESCRIPTION_FUNNEL: {
        guidance: "Describe the ideal customer profile (ICP) for this funnel.",
        examples: ["'mid-sized B2B SaaS companies in fintech'", "'millennial women interested in wellness'", "'HR managers at tech companies'"],
      },
      FUNNEL_GOAL: {
        guidance: "What is the main goal of this funnel?",
        examples: ["'generate 1,000 qualified leads per quarter'", "'increase demo bookings by 30%'", "'grow email list with high-intent subscribers'"],
      },
      SALES_CYCLE_LENGTH_OPTIONAL: {
        guidance: "(Optional) What is the typical sales cycle length?",
        examples: ["'30 days'", "'3-6 months'", "'short (impulse purchase)'"],
      },
    },
  },
  {
    id: 'dabbler_market_research_competitors',
    title: 'Identify Top Competitors (Beginner)',
    tier: 'Dabbler',
    category: 'Market Research',
    fullText:
      "Act as a Market Research Assistant.\nMy business offers: {{PRODUCT_SERVICE_TYPE_COMPETITOR_RESEARCH}}\nThe industry or niche is: {{INDUSTRY_NICHE_COMPETITOR_RESEARCH}}\n(Optional) The geographic market is: {{GEOGRAPHIC_MARKET_OPTIONAL}}\n\nPlease identify the top 3-5 competitors in this space. For each, provide a brief description and what makes them a strong competitor.",
    placeholders: {
      PRODUCT_SERVICE_TYPE_COMPETITOR_RESEARCH: {
        guidance: "Briefly describe your product or service. Be specific about what you offer.",
        examples: [
          "'cloud-based accounting software for freelancers'",
          "'organic pet food for dogs'",
          "'boutique digital marketing agency'"
        ]
      },
      INDUSTRY_NICHE_COMPETITOR_RESEARCH: {
        guidance: "What is the main industry or niche?",
        examples: [
          "'financial technology'",
          "'pet nutrition'",
          "'digital marketing for small businesses'"
        ]
      },
      GEOGRAPHIC_MARKET_OPTIONAL: {
        guidance: "(Optional) What is the main geographic market? (e.g., country, region, city)",
        examples: [
          "'Australia'",
          "'North America'",
          "'Sydney metro area'"
        ]
      }
    }
  },
  {
    id: 'dabbler_market_research_pain_points',
    title: 'Discover Audience Pain Points (Beginner)',
    tier: 'Dabbler',
    category: 'Market Research',
    fullText:
      "Act as a Customer Insights Analyst.\nMy target audience is: {{TARGET_AUDIENCE_PAIN_POINTS}}\nTheir main goal or problem is: {{AUDIENCE_GOAL_OR_PROBLEM}}\nMy product/service area or context is: {{MY_PRODUCT_SERVICE_AREA_CONTEXT}}\n\nPlease list 5-7 common pain points, frustrations, or unmet needs this audience experiences related to their goal/problem. Suggest 1-2 ways my product/service could address these pain points.",
    placeholders: {
      TARGET_AUDIENCE_PAIN_POINTS: {
        guidance: "Describe your target audience in detail (demographics, role, interests, etc.).",
        examples: [
          "'small business owners with 1-10 employees'",
          "'millennial parents interested in healthy eating'",
          "'IT managers in mid-sized companies'"
        ]
      },
      AUDIENCE_GOAL_OR_PROBLEM: {
        guidance: "What is the main goal or problem this audience has?",
        examples: [
          "'streamlining their accounting process'",
          "'finding quick, healthy meal options for kids'",
          "'keeping company data secure'"
        ]
      },
      MY_PRODUCT_SERVICE_AREA_CONTEXT: {
        guidance: "Briefly describe your product/service area or the context for these insights.",
        examples: [
          "'cloud-based accounting software'",
          "'organic meal delivery service'",
          "'cybersecurity consulting'"
        ]
      }
    }
  },
  {
    id: 'dabbler_market_research_competitor_features',
    title: "List Competitor's Key Features (Beginner)",
    tier: 'Dabbler',
    category: 'Market Research',
    fullText:
      "Act as a Competitive Intelligence Analyst.\nI need to understand the key features of a competitor's product/service.\nThe competitor's product/service name is: {{COMPETITOR_PRODUCT_NAME}}\n(Optional) The competitor's website is: {{COMPETITOR_WEBSITE_OPTIONAL}}\nThe industry is: {{COMPETITOR_INDUSTRY}}\n\nPlease list the main features, benefits, and any unique selling points of this competitor's offering. Highlight anything that stands out compared to typical products/services in this industry.",
    placeholders: {
      COMPETITOR_PRODUCT_NAME: {
        guidance: "What is the name of the competitor's product or service?",
        examples: [
          "'Xero'",
          "'Blue Buffalo Life Protection Formula'",
          "'HubSpot Marketing Hub'"
        ]
      },
      COMPETITOR_WEBSITE_OPTIONAL: {
        guidance: "(Optional) What is the competitor's website?",
        examples: [
          "'xero.com'",
          "'bluebuffalo.com'",
          "'hubspot.com'"
        ]
      },
      COMPETITOR_INDUSTRY: {
        guidance: "What is the main industry for this competitor?",
        examples: [
          "'accounting software'",
          "'pet food'",
          "'marketing automation'"
        ]
      }
    }
  },
];

export default function LearningHubPage() {
  const [activeSection, setActiveSection] = useState('Checklists');
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userTier, setUserTier] = useState<UserTier>('Dabbler');
  
  // Add mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  const reportId = searchParams?.get('reportId');
  
  // Define the selectedChecklistTitle state here at the top level
  const [selectedChecklistTitle, setSelectedChecklistTitle] = useState<string | null>(null);
  const currentUserTier = userTier;
  
  // Handle section from URL query parameter (for navigation from course pages)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sectionParam = urlParams.get('section');
      
      if (sectionParam) {
        // Only set if it's a valid section
        const validSections = ['Checklists', 'Prompt Library', 'Templates', 'Mini Courses'];
        if (validSections.includes(sectionParam)) {
          setActiveSection(sectionParam);
        }
      }
      
      setIsClient(true);
    }
  }, []);
  
  // Set user tier from query parameters if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tierParam = urlParams.get('tier');
      
      if (tierParam) {
        // Capitalize the first letter
        const formattedTier = tierParam.charAt(0).toUpperCase() + tierParam.slice(1).toLowerCase();
        // Only set if it's a valid tier
        if (['Leader', 'Enabler', 'Dabbler'].includes(formattedTier)) {
          setUserTier(formattedTier as UserTier);
        }
      }
    }
  }, []);
  
  // Load user name from storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to get user name from all possible storage locations
      const storedName = 
        sessionStorage.getItem('scorecardUserName') || 
        sessionStorage.getItem('scorecardLeadName') || 
        localStorage.getItem('scorecardUserName') || 
        localStorage.getItem('scorecardLeadName');
      
      // Only update if we found a valid name that's not "User"
      if (storedName && storedName.trim() !== '' && storedName.toLowerCase() !== 'user') {
        console.log("Learning Hub: Found user name in storage:", storedName);
        setUserName(storedName);
      }
    }
  }, []);

  // Define the header component
  const TopNavigationHeader = () => (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-sg-dark-teal/10 hover:bg-sg-dark-teal/20 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-6 relative flex flex-col justify-center">
            <span className={`absolute block w-6 h-0.5 bg-sg-dark-teal transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
            <span className={`absolute block w-6 h-0.5 bg-sg-dark-teal transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`absolute block w-6 h-0.5 bg-sg-dark-teal transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
          </div>
        </button>

        {/* Logo/Title */}
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl font-bold text-sg-dark-teal">AI Learning Hub</h1>
        </div>

        {/* Back to Report Link - Desktop */}
        <div className="hidden sm:block">
          <Link 
            href={`/scorecard/results?reportId=${reportId}`}
            className="flex items-center gap-2 text-sg-dark-teal hover:text-sg-bright-green transition-colors font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Report
          </Link>
        </div>
      </div>
    </div>
  );
  
  // --- Prompt Library State ---
  const [selectedPromptTier, setSelectedPromptTier] = useState<'All' | 'Dabbler' | 'Enabler' | 'Leader'>('All');
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('All');
  const [selectedPromptDetail, setSelectedPromptDetail] = useState<any | null>(null);
  // State for dynamic placeholders
  const [customizedPromptValues, setCustomizedPromptValues] = useState<Record<string, string>>({});

  // Fix: Always run this effect at the top level, not inside a render function
  useEffect(() => {
    setCustomizedPromptValues({});
  }, [selectedPromptDetail]);

  // --- Prompt Library Render Logic ---
  const renderPromptLibraryContent = () => {
    // Filter prompts
    const filteredPrompts = samplePrompts.filter(p => {
      const tierMatch = selectedPromptTier === 'All' || p.tier === selectedPromptTier;
      const catMatch = selectedPromptCategory === 'All' || p.category === selectedPromptCategory;
      return tierMatch && catMatch;
    });

    // Prompt Detail View
    if (selectedPromptDetail) {
      const parsed = parsePromptText(selectedPromptDetail.fullText);
      return (
        <div className="w-full max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl p-3 sm:p-6 lg:p-8 relative animate-fade-in">
          <button
            className="inline-flex items-center gap-2 bg-[#68F6C8] text-[#004851] font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#68F6C8] mb-4 sm:mb-6 lg:mb-8 transition-colors text-sm sm:text-base"
            onClick={() => setSelectedPromptDetail(null)}
            type="button"
            aria-label="Back to Prompts"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Prompts
          </button>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#004851] mb-3 sm:mb-4 lg:mb-6 leading-tight">{selectedPromptDetail.title}</h2>
          <div className="mb-3 sm:mb-4 lg:mb-6 flex flex-wrap gap-2">
            <span className="inline-block bg-[#68F6C8]/20 text-[#004851] font-semibold rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">{selectedPromptDetail.tier}</span>
            <span className="inline-block bg-[#004851]/10 text-[#004851] font-semibold rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">{selectedPromptDetail.category}</span>
          </div>
          <div className="mb-6 sm:mb-8">
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-gray-800 font-mono text-sm sm:text-base min-h-[120px] leading-relaxed break-words overflow-x-auto">
              {parsed.map((part: any, idx: number) => {
                if (part.type === 'text') return <span key={idx}>{part.value}</span>;
                if (part.type === 'placeholder' && part.key && selectedPromptDetail.placeholders[part.key]) {
                  const meta = selectedPromptDetail.placeholders[part.key];
                  return (
                    <InteractivePlaceholder
                      key={part.key}
                      variableKey={part.key}
                      value={customizedPromptValues[part.key] || ''}
                      guidance={meta.guidance}
                      examples={meta.examples}
                      onUpdate={val => setCustomizedPromptValues(v => ({ ...v, [part.key!]: val }))}
                    />
                  );
                }
                // Fallback for unknown placeholder
                return <span key={idx} className="bg-red-100 text-red-700 px-1 rounded">{part.value}</span>;
              })}
            </div>
          </div>
          <CopyPromptButton promptText={buildFinalPrompt(selectedPromptDetail.fullText, customizedPromptValues)} promptId={selectedPromptDetail.id} />
        </div>
      );
    }

    // Prompt List View
    return (
      <div className="w-full max-w-5xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6 sm:mb-8 bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow border border-gray-100">
          {/* Tier Filter */}
          <div className="flex flex-col gap-2 items-start w-full">
            <label htmlFor="prompt-tier-select" className="text-[#004851] font-semibold text-sm sm:text-base">Tier:</label>
            <select
              id="prompt-tier-select"
              value={selectedPromptTier}
              onChange={e => setSelectedPromptTier(e.target.value as any)}
              className="w-full p-2 sm:p-3 rounded-lg border border-[#68F6C8] bg-white text-[#004851] font-semibold focus:ring-2 focus:ring-[#68F6C8] focus:outline-none shadow-sm text-sm sm:text-base"
            >
              <option value="All">All Tiers</option>
              <option value="Dabbler">Dabbler</option>
              <option value="Enabler">Enabler</option>
              <option value="Leader">Leader</option>
            </select>
          </div>
          {/* Category Filter */}
          <div className="flex flex-col gap-2 items-start w-full">
            <label htmlFor="prompt-category-select" className="text-[#004851] font-semibold text-sm sm:text-base">Category:</label>
            <select
              id="prompt-category-select"
              value={selectedPromptCategory}
              onChange={e => setSelectedPromptCategory(e.target.value)}
              className="w-full p-2 sm:p-3 rounded-lg border border-[#68F6C8] bg-white text-[#004851] font-semibold focus:ring-2 focus:ring-[#68F6C8] focus:outline-none shadow-sm text-sm sm:text-base"
            >
              {promptCategories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Prompt List */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {filteredPrompts.length === 0 ? (
            <div className="text-center text-gray-500 py-6 sm:py-8 lg:py-12 bg-white rounded-xl border border-gray-100 shadow text-sm sm:text-base">No prompts found for the selected filters.</div>
          ) : (
            filteredPrompts.map(prompt => (
              <button
                key={prompt.id}
                className="w-full text-left bg-white border border-[#68F6C8] rounded-lg p-3 sm:px-5 sm:py-4 shadow-sm hover:bg-[#68F6C8]/10 hover:border-[#004851] transition-colors font-semibold text-[#004851] focus:outline-none focus:ring-2 focus:ring-[#68F6C8]"
                onClick={() => setSelectedPromptDetail(prompt)}
              >
                <div className="flex flex-col gap-2 sm:gap-3">
                  <span className="font-bold text-[#004851] text-sm sm:text-lg leading-tight">{prompt.title}</span>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <span className="inline-block bg-[#68F6C8]/20 text-[#004851] font-semibold rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">{prompt.tier}</span>
                    <span className="inline-block bg-[#004851]/10 text-[#004851] font-semibold rounded px-2 sm:px-3 py-1 text-xs sm:text-sm">{prompt.category}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  // --- Copy Prompt Button ---
  function CopyPromptButton({ promptText, promptId }: { promptText: string; promptId: string }) {
    const [copied, setCopied] = useState(false);
    return (
      <button
        className={`inline-flex items-center gap-2 bg-[#004851] text-white font-semibold py-2 sm:py-3 px-4 sm:px-5 rounded-lg shadow hover:bg-[#68F6C8] hover:text-[#004851] focus:outline-none focus:ring-2 focus:ring-[#68F6C8] transition-colors text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start ${copied ? 'opacity-80' : ''}`}
        onClick={async () => {
          await navigator.clipboard.writeText(promptText);
          setCopied(true);
          handlePromptCopy(promptId);
          setTimeout(() => setCopied(false), 1200);
        }}
        type="button"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></svg>
        {copied ? 'Copied!' : 'Copy Prompt'}
      </button>
    );
  }

  // --- Progress calculation ---
  function calculateProgress(tier: UserTier) {
    const items = trackableItems[tier] || [];
    let completed = 0;
    for (const item of items) {
      if (item.type === 'checklist') {
        if (localStorage.getItem('SG_progress_' + item.id + '_viewed') === 'true') completed++;
      } else if (item.type === 'prompt') {
        if (localStorage.getItem('SG_progress_' + item.id + '_copied') === 'true') completed++;
      }
    }
    return items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
  }

  // --- On mount and tier change, update progress and tip ---
  useEffect(() => {
    setProgressPercent(calculateProgress(currentUserTier));
    setTipText(getTipOfTheDay());
  }, [currentUserTier]);

  // --- Helper to update progress after interaction ---
  function updateProgressBar() {
    setProgressPercent(calculateProgress(currentUserTier));
  }

  // --- Checklist view tracking ---
  function handleChecklistView(title: string) {
    try {
      localStorage.setItem('SG_progress_' + title + '_viewed', 'true');
    } catch {}
    updateProgressBar();
    setSelectedChecklistTitle(title);
  }

  // --- Prompt copy tracking ---
  function handlePromptCopy(promptId: string) {
    try {
      localStorage.setItem('SG_progress_' + promptId + '_copied', 'true');
    } catch {}
    updateProgressBar();
  }

  const [progressPercent, setProgressPercent] = useState(0);
  const [tipText, setTipText] = useState(tips[0]);

  // Move renderChecklistsContent inside the component
  const renderChecklistsContent = () => {
    if (selectedChecklistTitle) {
      // Use tieredChecklists for the first four checklists
      if (tieredChecklists[selectedChecklistTitle] && tieredChecklists[selectedChecklistTitle][currentUserTier]) {
        const tierContent = tieredChecklists[selectedChecklistTitle][currentUserTier];
        return (
          <KillerChecklistDisplay
            checklistTitle={tierContent.checklistTitle}
            introduction={tierContent.introduction}
            items={tierContent.items}
            onBack={() => setSelectedChecklistTitle(null)}
          />
        );
      }
      // Default: placeholder for other checklists
      return (
        <div className="w-full">
          <button
            className="mb-6 text-[#004851] hover:underline flex items-center gap-1 text-sm font-semibold"
            onClick={() => setSelectedChecklistTitle(null)}
          >
            ← Back to All Checklists
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#004851] mb-4">{selectedChecklistTitle}</h2>
          <div className="bg-[#f8faf9] border border-gray-200 rounded-lg p-6 text-gray-700 max-w-2xl">
            <p>
              Detailed steps for '{selectedChecklistTitle}' will appear here. This checklist will guide you through the process step-by-step.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#004851] mb-2">AI Implementation Checklists</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl">
          Select a checklist below to view step-by-step guidance for your AI initiatives.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          {checklistTitles.map((title) => (
            <li key={title}>
              <button
                className="w-full text-left bg-white border border-[#68F6C8] rounded-lg px-4 sm:px-5 py-3 sm:py-4 shadow-sm hover:bg-[#68F6C8] hover:text-[#004851] transition-colors font-semibold text-[#004851] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#68F6C8]"
                onClick={() => handleChecklistView(title)}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderPlaceholderContent = (section: string) => (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#004851] mb-4">{section}</h2>
      <div className="bg-[#f8faf9] border border-gray-200 rounded-lg p-6 text-gray-700 max-w-2xl">
        <p>{section} - Content Coming Soon!</p>
      </div>
    </div>
  );

  // Add a new render function for Mini Courses
  const renderMiniCoursesContent = () => {
    return (
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-sg-dark-teal mb-2">AI Mini Courses</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl">
          Select a course below to start learning how to effectively implement AI in your business.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {miniCourses.map((course) => (
            <MiniCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    );
  };

  // Add a new render function for Templates
  const renderTemplatesContent = () => {
    return (
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-sg-dark-teal mb-2">AI Templates</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl">
          Select a template below to view its details and download for your AI projects.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    );
  };

  // Main content area logic
  let mainContent;
  if (activeSection === 'Checklists') {
    mainContent = renderChecklistsContent();
  } else if (activeSection === 'Prompt Library') {
    mainContent = renderPromptLibraryContent();
  } else if (activeSection === 'Templates') {
    mainContent = renderTemplatesContent();
  } else if (activeSection === 'Mini Courses') {
    mainContent = renderMiniCoursesContent();
  } else {
    mainContent = renderPlaceholderContent(activeSection);
  }

  // Helper: Parse prompt text and return an array of {type, value, key?}
  function parsePromptText(text: string) {
    const regex = /\{\{([A-Z0-9_]+)\}\}/g;
    const result: Array<{ type: 'text' | 'placeholder'; value: string; key?: string }> = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text))) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }
      result.push({ type: 'placeholder', value: match[0], key: match[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      result.push({ type: 'text', value: text.slice(lastIndex) });
    }
    return result;
  }

  // Helper: Build the final prompt string for copying
  function buildFinalPrompt(text: string, values: Record<string, string>) {
    return text.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) =>
      values[key] !== undefined && values[key] !== '' ? values[key] : `{{${key}}}`
    );
  }

  return (
    <main className="flex min-h-screen font-plus-jakarta">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="fixed left-0 top-0 h-full w-80 bg-sg-dark-teal text-white p-6 overflow-auto transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarNav
              userName={userName}
              tier={userTier}
              activeSection={activeSection}
              onSectionChange={(section) => {
                setActiveSection(section);
                setIsMobileMenuOpen(false); // Close mobile menu when section changes
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block sidebar w-[300px] bg-sg-dark-teal text-white p-6 h-full min-h-screen relative overflow-auto">
        <SidebarNav
          userName={userName}
          tier={userTier}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </aside>

      {/* Main content area */}
      <div className="flex-1 bg-sg-light-mint overflow-auto flex flex-col">
        {/* Persistent Top Navigation */}
        <TopNavigationHeader />
        
        {/* Content area */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-sg-dark-teal">
              Social Garden AI Learning Hub
            </h1>
            <p className="text-base sm:text-lg text-sg-dark-teal/80 mb-6 max-w-3xl">
              Explore resources, templates, and tools to help you implement AI effectively in your business.
            </p>

            {/* Section content */}
            <div className="overflow-visible mb-10">
              {mainContent}
            </div>

            {/* Action button */}
            <div className="max-w-4xl mx-auto mt-20 mb-10 text-center">
              <p className="text-sg-dark-teal/70 mb-4 text-base sm:text-lg">Need personalized AI guidance?</p>
              <button
                className="bg-sg-bright-green hover:bg-sg-bright-green/80 text-white font-bold py-3 px-6 sm:px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                onClick={() => window.location.href='/'}
              >
                Return to AI Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
