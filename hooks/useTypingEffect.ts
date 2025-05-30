import { useState, useEffect } from 'react';

/**
 * A custom hook that creates a typing effect for text.
 * @param text - The text to be typed out character by character
 * @param speed - The typing speed in milliseconds per character (default: 50)
 * @returns The text that has been typed out so far
 */
export const useTypingEffect = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    if (!text) return;

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        const nextChar = text.charAt(currentIndex);
        
        setDisplayedText(prev => prev + nextChar);
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
}; 