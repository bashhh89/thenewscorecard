/**
 * HTML Generator for AI Efficiency Scorecard (V6)
 * This utility generates a complete HTML document based on the ScoreCardData structure
 */

import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

interface AnswerHistoryEntry {
  question: string;
  answer: string;
  phaseName?: string;
  reasoningText?: string;
  answerType?: string;
  options?: string[] | null;
  index?: number;
  answerSource?: string;
}

interface ScoreCardData {
  UserInformation: {
    Industry: string;
    UserName: string;
    CompanyName: string;
    Email: string;
  };
  ScoreInformation: {
    AITier: string;
    FinalScore: number | null;
    ReportID: string;
  };
  QuestionAnswerHistory: AnswerHistoryEntry[];
  FullReportMarkdown: string;
}

interface DynamicSection {
  title: string;
  content: string;
}

interface GroupedQuestions {
  phaseName: string;
  questions: AnswerHistoryEntry[];
}

/**
 * Converts markdown to HTML elements
 * This is an enhanced parser for the specific markdown used in the scorecard
 */
function parseMarkdown(markdown: string): string {
  if (!markdown) return '';

  console.log('PARSE_MARKDOWN: Processing markdown of length:', markdown.length);

  let html = markdown;

  // Handle code blocks first to prevent internal markdown parsing
  html = html.replace(/```[\s\S]*?```/g, (match) => {
      return `<pre><code>${match.substring(3, match.length - 3).trim()}</code></pre>`;
  });

  // Headers - ensure they are on their own lines after replacement
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>\n');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>\n');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>\n');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>\n');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>\n');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>\n');

  // Bold text (two patterns)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic text (two patterns)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Process lists with proper nesting
  // This implementation has been enhanced to handle nested lists properly
  const lines = html.split('\n');
  const processedLines: string[] = [];
  
  // Stack to keep track of list nesting
  type ListContext = { type: 'ul' | 'ol', indent: number };
  const listStack: ListContext[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimRight(); // Keep left indentation
    const trimmedLine = line.trim();
    
    // Check for unordered list items (*, -, +)
    const ulMatch = line.match(/^(\s*)([-*+])\s+(.*)/);
    // Check for ordered list items (1., 2., etc)
    const olMatch = line.match(/^(\s*)(\d+)\.?\s+(.*)/);
    
    if (ulMatch || olMatch) {
      // We found a list item
      const match = ulMatch || olMatch;
      if (!match) continue; // TypeScript guard
      
      const [, indent, marker, content] = match;
      const indentLevel = indent.length;
      const listType: 'ul' | 'ol' = ulMatch ? 'ul' : 'ol';
      
      // Handle list nesting based on indentation
      if (listStack.length === 0) {
        // Start a new list
        processedLines.push(`<${listType}>`);
        listStack.push({ type: listType, indent: indentLevel });
      } else {
        const currentList = listStack[listStack.length - 1];
        
        if (indentLevel > currentList.indent) {
          // Deeper indentation = start a new nested list
          processedLines.push(`<${listType}>`);
          listStack.push({ type: listType, indent: indentLevel });
        } else if (indentLevel < currentList.indent) {
          // Less indentation = close nested lists until we reach correct level
          while (listStack.length > 0 && indentLevel < listStack[listStack.length - 1].indent) {
            const popped = listStack.pop();
            processedLines.push(`</${popped?.type}>`);
          }
          
          // If we closed all lists but need a new one at this level
          if (listStack.length === 0) {
            processedLines.push(`<${listType}>`);
            listStack.push({ type: listType, indent: indentLevel });
          } else if (listStack[listStack.length - 1].type !== listType) {
            // If the list type changed at this indentation level
            const currentIndent = listStack[listStack.length - 1].indent;
            listStack.pop();
            processedLines.push(`</${listStack[listStack.length - 1].type}>`);
            processedLines.push(`<${listType}>`);
            listStack.push({ type: listType, indent: currentIndent });
          }
        } else if (listStack[listStack.length - 1].type !== listType) {
          // Same indentation but different list type = close previous list and start new one
          listStack.pop();
          processedLines.push(`</${listStack[listStack.length - 1].type}>`);
          processedLines.push(`<${listType}>`);
          listStack.push({ type: listType, indent: indentLevel });
        }
      }
      
      // Add the list item with its content
      const value = olMatch ? ` value="${olMatch[2]}"` : '';
      processedLines.push(`<li${value}>${content}`);
      
      // If this is the last line or the next line isn't a continuation, close the list item
      if (i === lines.length - 1 || 
          i < lines.length - 1 && !isListContinuation(lines[i + 1], indentLevel)) {
        processedLines.push('</li>');
      }
    } else if (listStack.length > 0) {
      // Not a list item, but we're inside a list
      const lastIndent = listStack[listStack.length - 1].indent;
      
      if (trimmedLine === '') {
        // Empty line - close any open list items and keep the empty line
        processedLines.push('</li>');
        while (listStack.length > 0) {
          const list = listStack.pop();
          processedLines.push(`</${list?.type}>`);
        }
        processedLines.push('');
      } else if (line.match(new RegExp(`^\\s{${lastIndent + 2},}\\S`))) {
        // This is a continuation of the previous list item (more indented)
        // Append to the previous line instead of adding a new one
        if (processedLines[processedLines.length - 1] === '</li>') {
          // If we already closed the list item, reopen it
          processedLines.pop();
        }
        processedLines[processedLines.length - 1] += ' ' + trimmedLine;
      } else {
        // Not indented enough to be a continuation, close all lists
        // Close any open list items
        if (processedLines[processedLines.length - 1] !== '</li>') {
          processedLines.push('</li>');
        }
        
        // Close all open lists
        while (listStack.length > 0) {
          const list = listStack.pop();
          processedLines.push(`</${list?.type}>`);
        }
        
        // Add the line
        processedLines.push(line);
      }
    } else {
      // Not in a list, just add the line
      processedLines.push(line);
    }
  }
  
  // Close any remaining open lists
  if (listStack.length > 0) {
    // Close any open list item
    if (processedLines[processedLines.length - 1] !== '</li>') {
      processedLines.push('</li>');
    }
    
    // Close all open lists
    while (listStack.length > 0) {
      const list = listStack.pop();
      processedLines.push(`</${list?.type}>`);
    }
  }

  html = processedLines.join('\n');

  // Paragraphs: Wrap lines not inside block elements with <p> tags
  // Split content by empty lines (paragraph breaks)
  const paragraphs = html.split(/\n{2,}/g);
  const formattedParagraphs = paragraphs.map(paragraph => {
    paragraph = paragraph.trim();
    if (!paragraph) return '';
    
    // Skip wrapping if already a HTML block element
    if (paragraph.startsWith('<') && 
        (paragraph.startsWith('<h') || 
         paragraph.startsWith('<p') || 
         paragraph.startsWith('<ul') || 
         paragraph.startsWith('<ol') || 
         paragraph.startsWith('<pre') || 
         paragraph.startsWith('<div') ||
         paragraph.startsWith('<table'))) {
      return paragraph;
    }
    
    // Wrap in paragraph tags
    return `<p>${paragraph}</p>`;
  });

  html = formattedParagraphs.join('\n\n');

  // Basic handling for horizontal rules
  html = html.replace(/^-{3,}\s*$/gim, '<hr>');

  // Check for any markdown that might not have been properly processed
  const markdownRemains = html.match(/[\*_\[\]#]/g);
  if (markdownRemains && markdownRemains.length > 10) {
    console.warn('PARSE_MARKDOWN: Possible unprocessed markdown remains:', markdownRemains.length, 'instances');
  }

  // Return the processed HTML
  return html.trim();
}

/**
 * Helper function to determine if a line is a continuation of a list item
 */
function isListContinuation(line: string, previousIndent: number): boolean {
  const trimStart = line.trimStart();
  
  // Empty line
  if (trimStart === '') return false;
  
  // New list item
  if (trimStart.match(/^[-*+]\s/) || trimStart.match(/^\d+\.\s/)) return false;
  
  // Indented continuation
  const currentIndent = line.length - trimStart.length;
  return currentIndent >= previousIndent;
}

/**
 * Extracts sections from the markdown content
 */
function extractSections(markdownContent: string): Record<string, string> {
  const sections: Record<string, string> = {
    introText: '',
    strengths: '',
    weaknesses: '',
    strategicPlan: '',
    resources: '',
    benchmarks: '',
    learningPath: '',
    overallTier: ''
  };
  
  // Ensure we have content to process
  if (!markdownContent) {
    console.warn('No markdown content provided for section extraction');
    return sections;
  }
  
  console.log('EXTRACT_SECTIONS: Processing markdown content of length:', markdownContent.length);
  
  // Extract the overall intro text (before any headers)
  const introMatch = markdownContent.match(/^([\s\S]*?)(?=##|$)/i);
  if (introMatch) {
    sections.introText = parseMarkdown(introMatch[1].trim());
  }
  
  // Extract overall tier section with all subsections intact
  const overallTierMatch = markdownContent.match(/## Overall Tier(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i);
  if (overallTierMatch) {
    console.log('EXTRACT_SECTIONS: Found Overall Tier section of length:', overallTierMatch[1].length);
    sections.overallTier = parseMarkdown(overallTierMatch[1].trim());
  }
    // Extract key findings section with multiple pattern attempts
  const keyFindingsPatterns = [
    // Standard format
    /## Key Findings(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    // Flexible whitespace
    /## Key\s+Findings(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    // No space after ##
    /##Key Findings(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    // Alternate formats
    /## Key Analysis(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    /## Summary Findings(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i
  ];

  let keyFindingsContent = null;
  let keyFindingsMatch = null;
  for (const pattern of keyFindingsPatterns) {
    keyFindingsMatch = markdownContent.match(pattern);
    if (keyFindingsMatch) {
      keyFindingsContent = keyFindingsMatch[1].trim();
      console.log('EXTRACT_SECTIONS: Found Key Findings section of length:', keyFindingsContent.length);
      // Store the full key findings section for reference
      sections.keyFindings = parseMarkdown(keyFindingsContent);
      break;
    }
  }

  // If no Key Findings section was found, warn about it
  if (!keyFindingsContent) {
    console.warn('EXTRACT_SECTIONS: Could not find Key Findings section with any pattern');
  }

  // Extract strengths and weaknesses with multiple patterns
  const sectionPatterns = {
    strengths: [
      // Bold format
      /\*\*Strengths:\*\*\n?([\s\S]*?)(?=\*\*(?:Weaknesses|Challenges):|## Strategic|## Action|##)/i,
      // Header format
      /### Strengths\n?([\s\S]*?)(?=### (?:Weaknesses|Challenges)|## Strategic|## Action|##)/i,
      // Simple text format
      /\nStrengths:\n([\s\S]*?)(?=\n(?:Weaknesses|Challenges):|## Strategic|## Action|##)/i,
      // Alternative bold format
      /__Strengths:__\n?([\s\S]*?)(?=__(?:Weaknesses|Challenges):__|## Strategic|## Action|##)/i,
      // Fallback - any content between Strengths and next section
      /\bStrengths[:\s]*\n([\s\S]*?)(?=\s*(?:Weaknesses|Challenges|Strategic|Action)\b|##)/i
    ],
    weaknesses: [
      // Bold format
      /\*\*(?:Weaknesses|Challenges):\*\*\n?([\s\S]*?)(?=## Strategic|## Action|##)/i,
      // Header format
      /### (?:Weaknesses|Challenges)\n?([\s\S]*?)(?=## Strategic|## Action|##)/i,
      // Simple text format
      /\n(?:Weaknesses|Challenges):\n([\s\S]*?)(?=## Strategic|## Action|##)/i,
      // Alternative bold format
      /__(?:Weaknesses|Challenges):__\n?([\s\S]*?)(?=## Strategic|## Action|##)/i,
      // Fallback format
      /\b(?:Weaknesses|Challenges)[:\s]*\n([\s\S]*?)(?=## Strategic|## Action|##)/i
    ]
  };

  // Extract strengths
  for (const pattern of sectionPatterns.strengths) {
    const strengthsMatch = markdownContent.match(pattern);
    if (strengthsMatch) {
      const content = strengthsMatch[1].trim();
      if (content) {
        sections.strengths = parseMarkdown(content);
        console.log('EXTRACT_SECTIONS: Found Strengths section of length:', content.length);
        break;
      }
    }
  }

  // Extract weaknesses
  for (const pattern of sectionPatterns.weaknesses) {
    const weaknessesMatch = markdownContent.match(pattern);
    if (weaknessesMatch) {
      const content = weaknessesMatch[1].trim();
      if (content) {
        sections.weaknesses = parseMarkdown(content);
        console.log('EXTRACT_SECTIONS: Found Weaknesses section of length:', content.length);
        break;
      }
    }
  }

  // Log any missing sections
  if (!sections.strengths) {
    console.warn('EXTRACT_SECTIONS: Could not find Strengths section with any pattern');
  }
  if (!sections.weaknesses) {
    console.warn('EXTRACT_SECTIONS: Could not find Weaknesses section with any pattern');
  }
  
  // Extract strategic plan section with any subsections
  const strategicPlanMatch = markdownContent.match(/## Strategic Action Plan(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i);
  if (strategicPlanMatch) {
    console.log('EXTRACT_SECTIONS: Found Strategic Plan section of length:', strategicPlanMatch[1].length);
    sections.strategicPlan = parseMarkdown(strategicPlanMatch[1].trim());
  } else {
    // Try alternate format
    const altStrategicPlanMatch = markdownContent.match(/## Action Plan(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i);
    if (altStrategicPlanMatch) {
      console.log('EXTRACT_SECTIONS: Found Strategic Plan section (alt) of length:', altStrategicPlanMatch[1].length);
      sections.strategicPlan = parseMarkdown(altStrategicPlanMatch[1].trim());
    }
  }
  
  // Extract getting started & resources section with all subsections intact
  const resourcesMatch = markdownContent.match(/## Getting Started (?:&|\+|and) Resources(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i);
  if (resourcesMatch) {
    const resourcesContent = resourcesMatch[1].trim();
    console.log('EXTRACT_SECTIONS: Found Resources section of length:', resourcesContent.length);
    console.log('EXTRACT_SECTIONS: Resources content preview:', 
      resourcesContent.substring(0, 200) + '...'
    );
    
    // Check for sub-headings in resources to ensure they're preserved
    const subheadings = resourcesContent.match(/###\s+.*?(?=\n)/g);
    if (subheadings) {
      console.log('EXTRACT_SECTIONS: Found Resources subheadings:', subheadings.join(', '));
    }
    
    sections.resources = parseMarkdown(resourcesContent);
  } else {
    // Try alternative heading format
    const altResourcesMatch = markdownContent.match(/## Resources(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i);
    if (altResourcesMatch) {
      console.log('EXTRACT_SECTIONS: Found Resources section (alt) of length:', altResourcesMatch[1].length);
      sections.resources = parseMarkdown(altResourcesMatch[1].trim());
    } else {
      // As a last resort, try to look for the required subsections directly and construct a resource section
      console.warn('EXTRACT_SECTIONS: Could not find Resources section, attempting to construct from subsections');
      let constructedResources = '';
      
      // Look for meeting agenda
      const agendaMatch = markdownContent.match(/### Sample AI Goal-Setting Meeting Agenda\n?([\s\S]*?)(?=###|##|$)/i);
      if (agendaMatch) {
        constructedResources += `<h3>Sample AI Goal-Setting Meeting Agenda</h3>\n${parseMarkdown(agendaMatch[1].trim())}\n\n`;
      }
      
      // Look for example prompts
      const promptsMatch = markdownContent.match(/### Example Prompts[^\n]*\n?([\s\S]*?)(?=###|##|$)/i);
      if (promptsMatch) {
        constructedResources += `<h3>Example Prompts</h3>\n${parseMarkdown(promptsMatch[1].trim())}\n\n`;
      }
      
      // Look for data audit process
      const auditMatch = markdownContent.match(/### Basic AI Data Audit[^\n]*\n?([\s\S]*?)(?=###|##|$)/i);
      if (auditMatch) {
        constructedResources += `<h3>Basic AI Data Audit Process</h3>\n${parseMarkdown(auditMatch[1].trim())}\n\n`;
      }
      
      if (constructedResources) {
        console.log('EXTRACT_SECTIONS: Constructed Resources section from subsections');
        sections.resources = constructedResources;
      }
    }
  }
  
  // Extract benchmarks section with all subsections and formatting
  const benchmarksMatch = markdownContent.match(/## Illustrative Benchmarks(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i);
  if (benchmarksMatch) {
    console.log('EXTRACT_SECTIONS: Found Benchmarks section of length:', benchmarksMatch[1].length);
    
    // Check for tier subsections
    const hasDabblerSection = benchmarksMatch[1].includes("Dabbler Tier");
    const hasEnablerSection = benchmarksMatch[1].includes("Enabler Tier");
    const hasLeaderSection = benchmarksMatch[1].includes("Leader Tier");
    
    console.log(`EXTRACT_SECTIONS: Benchmark tiers found - Dabbler: ${hasDabblerSection}, Enabler: ${hasEnablerSection}, Leader: ${hasLeaderSection}`);
    
    // If we're missing tier sections, log a warning
    if (!hasDabblerSection || !hasEnablerSection || !hasLeaderSection) {
      console.warn('EXTRACT_SECTIONS: Benchmark section is missing one or more tier sections');
    }
    
    sections.benchmarks = parseMarkdown(benchmarksMatch[1].trim());
  } else {
    console.warn('EXTRACT_SECTIONS: Could not find Benchmarks section');
    
    // Try to construct a benchmarks section from fragments
    let constructedBenchmarks = '';
    
    // Look for any benchmark tiers directly
    const dabblerMatch = markdownContent.match(/### Dabbler Tier[^\n]*\n?([\s\S]*?)(?=### |##|$)/i);
    const enablerMatch = markdownContent.match(/### Enabler Tier[^\n]*\n?([\s\S]*?)(?=### |##|$)/i);
    const leaderMatch = markdownContent.match(/### Leader Tier[^\n]*\n?([\s\S]*?)(?=### |##|$)/i);
    
    if (dabblerMatch) {
      constructedBenchmarks += `<h3>Dabbler Tier Organizations</h3>\n${parseMarkdown(dabblerMatch[1].trim())}\n\n`;
    }
    
    if (enablerMatch) {
      constructedBenchmarks += `<h3>Enabler Tier Organizations</h3>\n${parseMarkdown(enablerMatch[1].trim())}\n\n`;
    }
    
    if (leaderMatch) {
      constructedBenchmarks += `<h3>Leader Tier Organizations</h3>\n${parseMarkdown(leaderMatch[1].trim())}\n\n`;
    }
    
    if (constructedBenchmarks) {
      console.log('EXTRACT_SECTIONS: Constructed Benchmarks section from tier subsections');
      sections.benchmarks = constructedBenchmarks;
    }
  }
  
  // Extract learning path - try multiple variations of the heading
  const pathVariations = [
    /## Your Personalized AI Learning Path(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    /## Personalized AI Learning Path(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    /## Learning Path(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    /## Next Steps(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i,
    /## Recommended Learning Path(?:[^\n]*)?\n?([\s\S]*?)(?=\n##|$)/i
  ];
  
  for (const pattern of pathVariations) {
    const learningPathMatch = markdownContent.match(pattern);
    if (learningPathMatch) {
      console.log('EXTRACT_SECTIONS: Found Learning Path section of length:', learningPathMatch[1].length);
      sections.learningPath = parseMarkdown(learningPathMatch[1].trim());
      break;
    }
  }
  
  if (!sections.learningPath) {
    console.warn('EXTRACT_SECTIONS: Could not find Learning Path section');
    // Add a fallback learning path if it's missing completely
    sections.learningPath = `<p>Based on your assessment results, we recommend focusing on the following areas:</p>
                            <ul>
                              <li><strong>Understanding AI Fundamentals</strong> - Start with building a solid foundation in AI concepts and terminology</li>
                              <li><strong>Exploring Use Cases</strong> - Research specific applications of AI in your industry</li>
                              <li><strong>Data Readiness</strong> - Prepare your organization's data for effective AI implementation</li>
                            </ul>`;
  }
  
  // Debug check for section content
  Object.entries(sections).forEach(([key, value]) => {
    if (!value || value.length === 0) {
      console.warn(`EXTRACT_SECTIONS: Missing or empty section: ${key}`);
    } else if (value.length < 50) { // Arbitrary threshold for "too short"
      console.warn(`EXTRACT_SECTIONS: Section ${key} may be too short (${value.length} chars)`);
    }
  });
  
  return sections;
}

/**
 * Extracts dynamic sections from markdown content
 */
function extractDynamicSections(markdownContent: string): DynamicSection[] {
  const dynamicSections: DynamicSection[] = [];
  
  // Split the markdown into sections by h2 headers
  const allSections = markdownContent.split(/^## /gm);
  
  // Skip the first item (intro text) and process the rest
  for (let i = 1; i < allSections.length; i++) {
    const section = allSections[i];
    const titleMatch = section.match(/^(.*?)$/m);
    
    if (titleMatch) {
      const title = titleMatch[1].trim();
      
      // Skip sections that are already handled specifically
      if (
        title === 'Key Findings' || 
        title.includes('Strategic Action Plan') || 
        title.includes('Getting Started & Resources')
      ) {
        continue;
      }
      
      // Extract content (everything after the title)
      const content = section.substring(section.indexOf('\n')).trim();
      
      dynamicSections.push({
        title,
        content: parseMarkdown(content)
      });
    }
  }
  
  return dynamicSections;
}

/**
 * Groups questions by their phase name
 */
function groupQuestionsByPhase(questionAnswerHistory: AnswerHistoryEntry[]): GroupedQuestions[] {
  if (!questionAnswerHistory || !Array.isArray(questionAnswerHistory)) {
    console.warn('No question answer history provided or empty array');
    return [];
  }
  
  if (questionAnswerHistory.length === 0) {
    console.warn('Question answer history array is empty');
    return [];
  }
  
  console.log(`DEBUG - groupQuestionsByPhase processing ${questionAnswerHistory.length} items`);
  
  const groupedMap: Record<string, AnswerHistoryEntry[]> = {};
  
  // Define standard phase names and their order
  const standardPhases = [
    'Strategy & Goals',
    'Data Readiness',
    'Technology & Tools',
    'Team Skills & Process',
    'Governance & Measurement',
    'Implementation & Adoption'
  ];
  
  // First pass: group questions by phase
  questionAnswerHistory.forEach((item, idx) => {
    if (!item) {
      console.warn(`Skipping null or undefined item at index ${idx}`);
      return;
    }
    
    // Use the provided phase name or default to 'General Assessment'
    const phase = item.phaseName || 'General Assessment';
    if (!groupedMap[phase]) {
      groupedMap[phase] = [];
    }
    groupedMap[phase].push(item);
  });
  
  // Sort questions within each phase by index if available
  Object.keys(groupedMap).forEach(phaseName => {
    groupedMap[phaseName].sort((a, b) => {
      // If both items have an index, sort by index
      if (a.index !== undefined && b.index !== undefined) {
        return a.index - b.index;
      }
      // Otherwise keep original order
      return 0;
    });
  });
  
  // Convert to array format and sort phases by standard order
  const groupedPhases = Object.entries(groupedMap).map(([phaseName, questions]) => ({
    phaseName,
    questions
  }));
  
  // Sort phases by standard order
  groupedPhases.sort((a, b) => {
    const indexA = standardPhases.indexOf(a.phaseName);
    const indexB = standardPhases.indexOf(b.phaseName);
    
    // If both phases are in the standard list, sort by their order
    if (indexA >= 0 && indexB >= 0) {
      return indexA - indexB;
    }
    
    // If only one phase is in the standard list, prioritize it
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;
    
    // Otherwise, sort alphabetically
    return a.phaseName.localeCompare(b.phaseName);
  });
  
  console.log(`DEBUG - Grouped into ${groupedPhases.length} phases`);
  
  return groupedPhases;
}

/**
 * Formats the answer based on its type
 */
function formatAnswer(item: AnswerHistoryEntry): string {
  if (!item || !item.answer) {
    return 'No answer provided';
  }

  if (item.answerType === 'scale' && item.options && Array.isArray(item.options)) {
    // For scale questions, show both the numeric value and the text option
    const index = parseInt(item.answer);
    if (!isNaN(index) && index >= 0 && index < item.options.length) {
      return `<div class="scale-answer"><span class="scale-value">${escapeHtml(item.answer)}</span>: <span class="scale-text">${escapeHtml(item.options[index])}</span></div>`;
    }
    return `<div class="scale-answer">Level ${escapeHtml(item.answer)}</div>`;
  } else if (item.answerType === 'text' || item.answerType === 'textarea') {
    // Format multiline text with line breaks preserved
    return item.answer.split('\n')
      .map(line => escapeHtml(line))
      .join('<br>');
  } else if (item.answerType === 'checkbox' || item.answerType === 'multiselect') {
    // For multi-select/checkbox, render as a list
    const selections = item.answer.split('|').map(s => s.trim()).filter(Boolean);
    if (selections.length > 0) {
      return `<ul class="answer-list">${selections.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`;
    }
  } else if (item.answerType === 'radio' || item.answerType === 'select') {
    // For single-select, just show the selection
    return escapeHtml(item.answer);
  }
  
  // Default fallback for any other type or missing answerType
  return escapeHtml(item.answer);
}

/**
 * Formats options array for display
 */
function formatOptions(options: string[] | null): string {
  if (!options || !Array.isArray(options) || options.length === 0) {
    return '';
  }
  
  // For scalar ranges like 1-5 scales
  if (options.length >= 2 && 
      !isNaN(Number(options[0])) && 
      !isNaN(Number(options[options.length - 1]))) {
    return `${options[0]} - ${options[options.length - 1]}: ${options.join(', ')}`;
  }
  
  // For text options, join with commas
  return options.join(', ');
}

/**
 * Helper function to escape HTML special characters
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Replaces template placeholders with actual data
 * This function now primarily handles simple placeholders and dynamic sections
 * Q&A section HTML is pre-generated in generateScorecardHTML
 */
function replacePlaceholders(template: string, data: any): string {
  let html = template;

  // Generate Q&A HTML directly here
  let qaHtml = '';
  if (data.QuestionAnswerHistory && Array.isArray(data.QuestionAnswerHistory) && data.QuestionAnswerHistory.length > 0) {
    console.log(`Q&A GENERATOR - Processing ${data.QuestionAnswerHistory.length} Q&A entries`);
    
    // Group Q&A by phase
    const phaseGroups: { [key: string]: AnswerHistoryEntry[] } = {};
    data.QuestionAnswerHistory.forEach((qa: AnswerHistoryEntry) => {
      const phase = qa.phaseName || 'General';
      if (!phaseGroups[phase]) {
        phaseGroups[phase] = [];
      }
      phaseGroups[phase].push(qa);
    });
    
    // Generate HTML for each phase
    Object.entries(phaseGroups).forEach(([phaseName, questions]) => {
      qaHtml += `<div class="qa-phase"><h3 class="phase-title">${escapeHtml(phaseName)}</h3>`;
      
      questions.forEach((qa) => {
        qaHtml += `
          <div class="qa-item">
            <div class="qa-question">${escapeHtml(qa.question || '')}</div>
            <div class="qa-answer">${escapeHtml(qa.answer || '')}</div>
            ${qa.reasoningText ? `<div class="qa-reasoning">${escapeHtml(qa.reasoningText)}</div>` : ''}
            <div class="qa-meta">
              ${qa.answerType ? `
                <div class="qa-meta-item">
                  <span class="meta-label">Type:</span>
                  <span>${escapeHtml(qa.answerType)}</span>
                </div>` : ''}
              ${qa.options && qa.options.length > 0 ? `
                <div class="qa-meta-item">
                  <span class="meta-label">Options:</span>
                  <span>${escapeHtml(qa.options.join(', '))}</span>
                </div>` : ''}
              ${qa.answerSource ? `
                <div class="qa-meta-item">
                  <span class="meta-label">Source:</span>
                  <span>${escapeHtml(qa.answerSource)}</span>
                </div>` : ''}
            </div>
          </div>
        `;
      });
      
      qaHtml += `</div>`;
    });
    
    console.log(`Q&A GENERATOR - Generated ${qaHtml.length} characters of Q&A HTML`);
  } else {
    console.log('Q&A GENERATOR - No Q&A data found, generating empty Q&A section');
    qaHtml = '<p>No Q&A data available.</p>';
  }
  
  // Replace the Q&A section in the template
  const qaTemplateRegex = /\{\{#each groupedQuestionsByPhase\}\}[\s\S]*?\{\{\/each\}\}/g;
  if (html.match(qaTemplateRegex)) {
    html = html.replace(qaTemplateRegex, qaHtml);
    console.log('Q&A GENERATOR - Successfully replaced Q&A template with generated HTML');
  } else {
    console.warn('Q&A GENERATOR - Warning: Could not find Q&A template section');
  }

  // Special handling for company name
  let companyName = 'Company Not Provided';
  if (data.UserInformation && data.UserInformation.CompanyName) {
    companyName = data.UserInformation.CompanyName.trim();
  }
  html = html.replace(/\[Client Company Name\]/g, companyName);
  
  // Special handling for final score
  let finalScore = 'Score Not Available';
  if (data.ScoreInformation && data.ScoreInformation.FinalScore !== null && data.ScoreInformation.FinalScore !== undefined) {
    finalScore = `${data.ScoreInformation.FinalScore}/100`;
  }
  
  // Add final score to overall tier section if not already included
  if (data.sections && data.sections.overallTier) {
    if (!data.sections.overallTier.includes('Final Score')) {
      const tierHtml = data.sections.overallTier;
      const enhancedTierHtml = tierHtml + 
        `<div class="score-display"><strong>Final Score:</strong> ${finalScore}</div>`;
      data.sections.overallTier = enhancedTierHtml;
    }
  }
  
  // Replace simple variables with double curly braces
  html = html.replace(/{{([^{}]+)}}/g, (match, key) => {
    const keys = key.trim().split('.');
    let value = data;

    for (const k of keys) {
      if (value && typeof value === 'object' && value[k] !== undefined) {
        value = value[k];
      } else {
        // If any key in the path is not found, return an empty string
        return '';
      }
    }

    // Specific handling for FinalScore
    if (keys.length === 2 && keys[0] === 'ScoreInformation' && keys[1] === 'FinalScore') {
      return finalScore;
    }
    
    // Specific handling for CompanyName
    if (keys.length === 2 && keys[0] === 'UserInformation' && keys[1] === 'CompanyName') {
      return companyName;
    }
    
    // Ensure boolean false is rendered, otherwise convert to string
    return value !== null && value !== undefined ? String(value) : '';
  });

  // Handle dynamic sections loop - keep this as it matches the template structure
  if (data.dynamicSections && data.dynamicSections.length > 0) {
    const sectionRegex = /{{#each dynamicSections}}([\s\S]*?){{\/each}}/g;
    const sectionMatch = sectionRegex.exec(html);

    if (sectionMatch && sectionMatch[1]) {
      // We found the section template
      const sectionTemplate = sectionMatch[1];
      let sectionsHtml = '';

      // Populate each section
      for (const section of data.dynamicSections) {
        const parsedContent = section.content; // Content is already parsed to HTML
        let sectionHtml = sectionTemplate
          .replace(/{{title}}/g, section.title)
          .replace(/{{content}}/g, parsedContent);

        sectionsHtml += sectionHtml;
      }

      // Replace the entire section template with the populated sections
      html = html.replace(sectionRegex, sectionsHtml);
    } else {
      console.warn('Dynamic sections #each block found in template but regex failed to match.');
      // Optionally remove the block to avoid leaving template syntax
      html = html.replace(/{{#each dynamicSections}}[\s\S]*?{{\/each}}/g, '');
    }
  } else {
    // Remove the entire each block if no dynamic sections
    html = html.replace(/{{#each dynamicSections}}[\s\S]*?{{\/each}}/g, '');
  }

  // Remove any remaining unprocessed placeholders
  html = html.replace(/{{.*?}}/g, '');

  return html;
}

/**
 * Helper function to escape regular expression characters in strings
 * Used to safely insert user content into regex patterns
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Main function to generate HTML from ScoreCardData
 */
async function generateScorecardHTML(reportData: ScoreCardData): Promise<string> {
  try {
    // Validate the input data
    if (!reportData) {
      throw new Error('Report data is required');
    }

    // Log the incoming data for debugging
    console.log('DEBUG - generateScorecardHTML input:', {
      UserName: reportData.UserInformation?.UserName,
      CompanyName: reportData.UserInformation?.CompanyName,
      Industry: reportData.UserInformation?.Industry,
      Email: reportData.UserInformation?.Email,
      AITier: reportData.ScoreInformation?.AITier,
      FinalScore: reportData.ScoreInformation?.FinalScore,
      ReportID: reportData.ScoreInformation?.ReportID
    });

    // Detailed logging for important fields
    if (!reportData.UserInformation?.CompanyName || reportData.UserInformation.CompanyName.trim() === '') {
      console.warn('DEBUG - WARNING: CompanyName is missing or empty');
    }
    if (reportData.ScoreInformation?.FinalScore === null || reportData.ScoreInformation?.FinalScore === undefined) {
      console.warn('DEBUG - WARNING: FinalScore is null or undefined');
    }
    if (!reportData.UserInformation?.UserName || reportData.UserInformation.UserName.trim() === '') {
      console.warn('DEBUG - WARNING: UserName is missing or empty');
    } else {
      console.log('DEBUG - UserName found:', reportData.UserInformation.UserName);
    }

    // Log the complete original data structure for debugging (excluding potentially large markdown/Q&A)
    console.log('ORIGINAL DATA - EXACT VALUES (Summary):', JSON.stringify({
      UserName: reportData.UserInformation?.UserName,
      CompanyName: reportData.UserInformation?.CompanyName,
      Industry: reportData.UserInformation?.Industry,
      Email: reportData.UserInformation?.Email,
      AITier: reportData.ScoreInformation?.AITier,
      FinalScore: reportData.ScoreInformation?.FinalScore,
      ReportID: reportData.ScoreInformation?.ReportID,
      QuestionAnswerHistoryCount: reportData.QuestionAnswerHistory?.length || 0,
      FullReportMarkdownLength: reportData.FullReportMarkdown?.length || 0
    }));


    // Ensure UserInformation and its fields exist
    if (!reportData.UserInformation) {
      console.warn('DEBUG - Creating empty UserInformation object');
      reportData.UserInformation = {
        Industry: '',
        UserName: '',
        CompanyName: '',
        Email: ''
      };
    } else {
      // Make sure UserName is properly initialized (not undefined or null)
      if (!reportData.UserInformation.UserName) {
        console.log('DEBUG - Setting empty UserName to empty string instead of null/undefined');
        reportData.UserInformation.UserName = '';
      } else if (typeof reportData.UserInformation.UserName === 'string') {
        reportData.UserInformation.UserName = reportData.UserInformation.UserName.trim();
        console.log('DEBUG - Trimmed UserName:', reportData.UserInformation.UserName);
      }
    }
    // No data modifications, preserve all original values

    // Ensure ScoreInformation and its fields exist
    if (!reportData.ScoreInformation) {
      reportData.ScoreInformation = {
        AITier: 'Default',
        FinalScore: null,
        ReportID: ''
      };
    }

    // Log raw data for Q&A and Markdown for detailed debugging if needed
    console.log('DEBUG - Raw QuestionAnswerHistory data:', reportData.QuestionAnswerHistory);
    console.log('DEBUG - FullReportMarkdown preview (' + (reportData.FullReportMarkdown?.length || 0) + ' chars):', reportData.FullReportMarkdown?.substring(0, 500) + '...');


    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'app/api/generate-scorecard-report-v6/template-v3.html');
    let template = await fsPromises.readFile(templatePath, 'utf8');

    // Extract sections from markdown
    const sections = extractSections(reportData.FullReportMarkdown || '');
    console.log('DEBUG - Extracted sections from markdown:', Object.keys(sections).filter(key => sections[key]).join(', '));

    // Extract dynamic sections
    const dynamicSections = extractDynamicSections(reportData.FullReportMarkdown || '');
    console.log(`DEBUG - Extracted ${dynamicSections.length} dynamic sections`);

    // Group Q&A by phase
    const groupedQuestionsByPhase = groupQuestionsByPhase(reportData.QuestionAnswerHistory);
    console.log(`DEBUG - Grouped Q&A into ${groupedQuestionsByPhase.length} phases`);
    
    groupedQuestionsByPhase.forEach(phase => {
      console.log(`DEBUG - Phase "${phase.phaseName}" has ${phase.questions.length} questions`);
    });
    console.log('DEBUG - Grouped Q&A:', groupedQuestionsByPhase); // Log the structure


    // --- Manually construct Q&A HTML ---
    // Note: We no longer generate Q&A HTML here as this is now handled directly in replacePlaceholders
    console.log("DEBUG - Q&A HTML will be generated during template replacement");
    
    // Prepare data for template
    const templateData = {
      UserInformation: reportData.UserInformation,
      ScoreInformation: reportData.ScoreInformation,
      ReportDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      CurrentYear: new Date().getFullYear(),
      introText: sections.introText,
      sections,
      dynamicSections,
      QuestionAnswerHistory: reportData.QuestionAnswerHistory,
    };

    // Additional User placeholder replacement in all sections before template processing
    const userName = reportData.UserInformation?.UserName;
    if (userName && userName.trim() !== '' && userName !== 'Not Provided') {
      console.log('SCORECARD_GENERATOR: Applying additional User placeholder replacement for:', userName);
      
      // Replace User placeholders in all section content
      Object.keys(templateData.sections).forEach(sectionKey => {
        if (templateData.sections[sectionKey]) {
          templateData.sections[sectionKey] = templateData.sections[sectionKey]
            .replace(/\bUser\b/g, userName)
            .replace(/\bUser's\b/g, `${userName}'s`);
        }
      });
      
      // Replace User placeholders in dynamic sections
      templateData.dynamicSections.forEach(section => {
        section.content = section.content
          .replace(/\bUser\b/g, userName)
          .replace(/\bUser's\b/g, `${userName}'s`);
      });
    }

    // Log the template data structure to ensure Q&A data is properly included
    console.log('DEBUG - Template data structure for Q&A:',
      templateData.QuestionAnswerHistory ? 'Q&A data included' : 'No Q&A data included'
    );
    console.log('DEBUG - REPORT DATA KEYS:', Object.keys(reportData).join(', '));
    console.log('DEBUG - FULLREPORTMARKDOWN EXISTS:', !!reportData.FullReportMarkdown);
    console.log('DEBUG - FULLREPORTMARKDOWN LENGTH:', reportData.FullReportMarkdown?.length || 0);
     console.log('DEBUG - FULLREPORTMARKDOWN PREVIEW:', reportData.FullReportMarkdown?.substring(0, 200) + '...');


    // Replace placeholders in the template
    let html = replacePlaceholders(template, templateData);

    // Clean up any unprocessed template syntax (optional, but good practice)
    // Ensure this cleanup doesn't remove valid HTML that might look like placeholders
    html = cleanupUnprocessedTemplates(html);
     console.log("DEBUG - HTML BEFORE FINAL CLEANUP (first 500 chars):", html.substring(0, 500) + "...");
     console.log("DEBUG - HTML CONTAINS FULLREPORTMARKDOWN CONTENT:", html.includes(sections.introText) || Object.values(sections).some(content => content && html.includes(content)) || dynamicSections.some(section => html.includes(section.content)));
    console.log("DEBUG - HTML CONTAINS Q&A CONTENT:", html.includes("qa-question") && html.includes("qa-answer"));

    html = cleanHtmlOutput(html);

    // Remove all redundant whitespace in the HTML output for cleaner rendering and performance
    html = html.replace(/\s+/g, ' ').trim();

    // Final safety check: Remove any remaining template variables that were unprocessed
    // This is for safety to ensure no {{placeholders}} remain in the output document
    // cleanedHtml = cleanedHtml.replace(/{{(?!#)(?!\/)(?!>).*?}}/g, ''); // Avoid removing handlebars-like comments or block helpers if they were expected

    // Return the fully processed HTML document
    return html;

  } catch (error) {
    console.error('Error generating scorecard HTML:', error);
    // Return a simple error HTML page
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error Generating Report</title>
  <style>
    body { font-family: sans-serif; color: #333; margin: 20px; }
    h1 { color: red; }
  </style>
</head>
<body>
  <h1>Error Generating Report</h1>
  <p>An error occurred while generating the HTML report. Please try again later or contact support.</p>
  <p>Details: ${error instanceof Error ? error.message : String(error)}</p>
</body>
</html>`;
  }
}

/**
 * Cleans up any unprocessed Handlebars templates in the HTML
 */
function cleanupUnprocessedTemplates(html: string): string {
  console.log('CLEANUP_TEMPLATES: Removing unprocessed template syntax');
  
  // Remove specific handlebars syntax markers but preserve content
  let cleanedHtml = html.replace('{{qaContentStart}}', '');
  cleanedHtml = cleanedHtml.replace('{{qaContentEnd}}', '');
  
  // Remove remaining template syntax but log them for debugging
  const remainingTemplates = cleanedHtml.match(/\{\{[^}]*\}\}/g);
  if (remainingTemplates && remainingTemplates.length > 0) {
    console.log('CLEANUP_TEMPLATES: Found remaining template variables:', remainingTemplates.map(t => t.substring(0, 30)).join(', '));
    cleanedHtml = cleanedHtml.replace(/\{\{[^}]*\}\}/g, '');
  } else {
    console.log('CLEANUP_TEMPLATES: No remaining template variables found');
  }

  return cleanedHtml;
}

/**
 * Cleans up the HTML output by removing empty elements and fixing formatting issues
 */
function cleanHtmlOutput(html: string): string {
  console.log('CLEANUP_HTML: Starting HTML cleanup');
  
  let cleanedHtml = html;
  
  // Remove empty elements but preserve structure
  let prevHtml;
  let iterations = 0;
  const maxIterations = 5; // Prevent infinite loops
  
  do {
    prevHtml = cleanedHtml;
    
    // Remove completely empty divs but be careful not to remove containers with significant whitespace
    cleanedHtml = cleanedHtml.replace(/<div[^>]*>\s*?<\/div>/g, '');
    cleanedHtml = cleanedHtml.replace(/<span[^>]*>\s*?<\/span>/g, '');
    
    // Don't remove list items even if empty to preserve list structure
    // cleanedHtml = cleanedHtml.replace(/<li>\s*<\/li>/g, '');
    
    iterations++;
  } while (cleanedHtml !== prevHtml && iterations < maxIterations);
  
  console.log(`CLEANUP_HTML: Removed empty elements in ${iterations} iterations`);
  
  // Fix issues with list nesting
  cleanedHtml = fixNestedLists(cleanedHtml);
  
  // Remove excess whitespace between elements but preserve formatted content
  cleanedHtml = cleanedHtml.replace(/>\s{2,}</g, '> <');
  
  console.log('CLEANUP_HTML: HTML cleanup completed');
  return cleanedHtml;
}

/**
 * Fix issues with list nesting to ensure proper HTML structure
 */
function fixNestedLists(html: string): string {
  console.log('FIX_LISTS: Checking for list structure issues');
  
  let fixedHtml = html;
  
  // Fix common issues with nested list structures
  
  // 1. Unclosed list items before a nested list
  fixedHtml = fixedHtml.replace(/<li>([^<]*)<(ul|ol)>/g, '<li>$1</li><$2>');
  
  // 2. Fix list items that contain raw text followed by a nested list (should wrap text in p)
  fixedHtml = fixedHtml.replace(/<li>([^<]+)<(ul|ol)>/g, '<li><p>$1</p><$2>');
  
  // 3. Close any list items that might be left open
  const openListItems = (fixedHtml.match(/<li>/g) || []).length;
  const closeListItems = (fixedHtml.match(/<\/li>/g) || []).length;
  
  if (openListItems > closeListItems) {
    console.log(`FIX_LISTS: Found ${openListItems - closeListItems} unclosed list items`);
  }
  
  // 4. Ensure all lists have proper open/close tags
  const openUL = (fixedHtml.match(/<ul[^>]*>/g) || []).length;
  const closeUL = (fixedHtml.match(/<\/ul>/g) || []).length;
  const openOL = (fixedHtml.match(/<ol[^>]*>/g) || []).length;
  const closeOL = (fixedHtml.match(/<\/ol>/g) || []).length;
  
  if (openUL !== closeUL || openOL !== closeOL) {
    console.log(`FIX_LISTS: List tag mismatch - UL: ${openUL}/${closeUL}, OL: ${openOL}/${closeOL}`);
  }
  
  return fixedHtml;
}

// Export the main function for use in other modules
export { generateScorecardHTML };