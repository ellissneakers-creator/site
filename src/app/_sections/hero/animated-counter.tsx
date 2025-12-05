"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  text: string;
}

export function AnimatedCounterText({ text }: AnimatedCounterProps) {
  // Extract number and percentage from text like "Reduce shopper skepticism by 47%"
  const match = text.match(/(\d+)(%)/);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const hasPercentage = !!match;

  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (hasAnimated || !hasPercentage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, hasPercentage]);

  const animateCount = () => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = targetNumber / steps;
    let current = 0;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
  };

  // If no percentage found, just return the text as-is
  if (!hasPercentage) {
    return (
      <p className="text-text-tertiary dark:text-dark-text-tertiary text-sm tracking-tight">
        {text}
      </p>
    );
  }

  // Replace the number in the text with the animated count
  const parts = text.split(/(\d+%)/);
  
  return (
    <p 
      ref={ref}
      className="text-text-tertiary dark:text-dark-text-tertiary text-sm tracking-tight"
    >
      {parts.map((part, index) => {
        if (part.match(/\d+%/)) {
          return <span key={index}>{count}%</span>;
        }
        return part;
      })}
    </p>
  );
}

