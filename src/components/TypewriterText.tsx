import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
    
    // Initial delay
    timeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping && currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
    } else if (isTyping && currentIndex >= text.length) {
      setIsTyping(false);
      if (onComplete) onComplete();
    }
    
    return () => clearTimeout(timeout);
  }, [isTyping, currentIndex, text, speed, onComplete]);
  
  return (
    <span className={className}>
      {displayText}
      <span className="typing-cursor">|</span>
    </span>
  );
};

export default TypewriterText;
