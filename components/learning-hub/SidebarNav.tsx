"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface SidebarLink {
  title: string;
  href: string;
}

const defaultSidebarLinks = [
  { title: 'Checklists', href: '/learning-hub' },
  { title: 'Prompt Library', href: '/learning-hub' },
  { title: 'Templates', href: '/learning-hub' },
  { title: 'Mini Courses', href: '/learning-hub' },
];

const navIcons: Record<string, React.ReactNode> = {
  'Checklists': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  'Prompt Library': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-8-4h8" /></svg>,
  'Templates': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M3 7h18" /></svg>,
  'Recommended Tools': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 21l3-1.5L15 21l-.75-4M4 4l16 16" /></svg>,
  'Mini Courses': <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12V4" /></svg>,
};

const socialLinks = [
  { href: 'https://www.linkedin.com/company/social-garden/', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg> },
  { href: 'https://twitter.com/socialgardenau', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.924 2.204-4.924 4.924 0 .386.044.762.127 1.124-4.09-.205-7.719-2.166-10.148-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.23-.616v.062c0 2.386 1.697 4.374 3.95 4.827-.413.112-.849.172-1.298.172-.318 0-.626-.031-.927-.088.627 1.956 2.444 3.377 4.6 3.417-1.68 1.317-3.797 2.102-6.102 2.102-.396 0-.787-.023-1.175-.069 2.179 1.397 4.768 2.213 7.548 2.213 9.057 0 14.015-7.506 14.015-14.015 0-.213-.005-.425-.014-.636.962-.695 1.797-1.562 2.457-2.549z" /></svg> },
];

// Define tier colors and descriptions for enhanced display
const tierInfo = {
  'Dabbler': {
    color: 'bg-yellow-400',
    description: 'Taking first steps with AI'
  },
  'Enabler': {
    color: 'bg-blue-500',
    description: 'Actively implementing AI solutions'
  },
  'Leader': {
    color: 'bg-green-500',
    description: 'Leading with AI innovation'
  }
};

interface SidebarNavProps {
  userName: string;
  tier: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  links?: SidebarLink[]; // Make links optional
}

export default function SidebarNav({ 
  userName, 
  tier, 
  activeSection, 
  onSectionChange,
  links = defaultSidebarLinks // Default to the predefined links if not provided
}: SidebarNavProps) {
  const user = { name: userName, avatar: '', tier };
  const tierDetails = tierInfo[tier as keyof typeof tierInfo] || { color: 'bg-gray-400', description: 'AI assessment tier' };
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reportId = searchParams?.get('reportId') || 'Aa4kIrBYpxsIo1MO6S2a';
  
  // Determine if we're in a course page (to handle navigation differently)
  const isInCoursePage = pathname && 
    pathname !== '/learning-hub' && 
    pathname.startsWith('/learning-hub/');

  // Handle navigation from sidebar
  const handleNavigation = (section: string, href: string) => {
    // Call the section change function first
    onSectionChange(section);
    
    // If we're in a course page or other deep page, we need to navigate back to learning hub
    if (isInCoursePage) {
      // For all sections, navigate back to learning hub with the section in query params
      router.push(`/learning-hub?section=${encodeURIComponent(section)}&reportId=${reportId}`);
    }
    // If we're already on the learning hub main page, the section change is handled by the parent component
  };
  
  // Safe search params handling
  const currentSearchParams = searchParams ? searchParams.toString() : '';
  
  return (
    <>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none" style={{background: 'radial-gradient(circle at 30% 20%, #20E28F 0%, transparent 60%)'}} />
      {/* Top: User greeting and progress */}
      <div className="z-10 relative">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-sg-bright-green flex items-center justify-center text-sg-dark-teal font-extrabold text-2xl shadow-lg border-4 border-white">
            {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : user.name[0]}
          </div>
          <div>
            <div className="text-white text-lg font-bold leading-tight font-plus-jakarta">Welcome, {user.name}!</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`h-2 w-2 rounded-full ${tierDetails.color} animate-pulse`}></span>
              <span className="text-sg-bright-green text-xs font-semibold font-plus-jakarta">
                {tier} Tier
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced tier display */}
        <div className="mb-8 bg-sg-dark-teal/30 rounded-lg p-3 border border-sg-bright-green/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white font-semibold font-plus-jakarta">Your AI Maturity</span>
            <span className="text-xs text-sg-bright-green font-bold font-plus-jakarta">{tier}</span>
          </div>
          <div className="w-full h-2 bg-sg-bright-green/20 rounded-full">
            <div 
              className={`h-full ${tierDetails.color} rounded-full transition-all duration-500`} 
              style={{
                width: tier === 'Dabbler' ? '33%' : tier === 'Enabler' ? '66%' : '100%'
              }} 
            />
          </div>
          <p className="text-xs text-white/80 mt-2 italic font-plus-jakarta">
            {tierDetails.description}
          </p>
        </div>

        {/* Back to Report Link - Enhanced for visibility */}
        <div className="mb-8 bg-sg-bright-green/10 rounded-lg p-3">
          <Link 
            href={`/scorecard/results?reportId=${reportId}`}
            className="flex items-center gap-2 text-sg-bright-green hover:text-white transition-colors font-semibold text-sm font-plus-jakarta"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Scorecard Report
          </Link>
        </div>

        {/* Tip of the Day */}
        <div className="bg-sg-bright-green/10 border border-sg-bright-green/30 rounded-xl p-4 mb-8 flex items-center gap-3 shadow-sm">
          <div>
            <svg className="w-6 h-6 text-sg-bright-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          </div>
          <div className="text-sg-bright-green text-sm font-semibold font-plus-jakarta">Tip of the Day</div>
        </div>
        <div className="text-white text-sm leading-relaxed mb-8 italic flex items-center gap-2 font-plus-jakarta">
          <svg className="w-4 h-4 text-sg-bright-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
          {'Start small: Pick one process to automate with AI this week.'}
        </div>
        
        {/* Navigation - Enhanced with better hover/active states */}
        <nav className="flex flex-col gap-3 mt-6">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1 pl-2">Learning Hub Sections</h3>
          {links.map((link) => (
            <button
              key={link.title}
              type="button"
              onClick={() => handleNavigation(link.title, link.href)}
              className={
                'flex items-center rounded-lg px-5 py-5 font-semibold text-lg transition-all duration-200 text-left w-full font-plus-jakarta ' +
                (activeSection === link.title
                  ? 'bg-sg-bright-green text-sg-dark-teal font-bold shadow-lg transform scale-105 relative overflow-hidden'
                  : 'text-white bg-transparent hover:bg-sg-bright-green/20 hover:text-sg-bright-green') +
                ' focus:outline-none focus:ring-2 focus:ring-sg-bright-green'
              }
              tabIndex={0}
            >
              {/* Active indicator animation */}
              {activeSection === link.title && (
                <span className="absolute inset-0 bg-white/10 animate-pulse opacity-30"></span>
              )}
              
              {navIcons[link.title] || (
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {link.title}
              
              {/* Add arrow indicator for active section */}
              {activeSection === link.title && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-auto" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Footer: logo, socials, support */}
      <div className="z-10 relative mt-10 pt-8 border-t border-white/20 flex flex-col items-center gap-3">
        {/* Social Garden Logo */}
        <div className="mb-1">
          <div className="relative w-24 h-8 rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-2 shadow-md">
            <img 
              src="/footer-logo.svg" 
              alt="Social Garden" 
              className="h-full w-auto object-contain filter drop-shadow-sm"
            />
          </div>
        </div>
        <div className="flex gap-3 mb-1">
          {socialLinks.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sg-bright-green hover:text-white transition-colors">{s.icon}</a>
          ))}
        </div>
        <a
          href="https://www.socialgarden.com.au/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sg-bright-green text-xs font-semibold hover:underline mb-1 font-plus-jakarta"
        >
          © {new Date().getFullYear()} Social Garden
        </a>
        <a href="mailto:support@socialgarden.com.au" className="text-white text-xs hover:underline font-plus-jakarta">Need help? Contact support</a>
      </div>
    </>
  );
}
