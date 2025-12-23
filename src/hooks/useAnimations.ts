import { useState, useEffect } from 'react';

// Custom hook for animated counter
export const useAnimatedCounter = (targetValue: number, duration: number = 1000) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = currentValue;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
      
      setCurrentValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      // Cleanup if needed
    };
  }, [targetValue, duration]);

  return currentValue;
};

// Custom hook for scroll animations
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const element = document.querySelector('.animate-on-scroll');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return isVisible;
};

// Custom hook for typing animation
export const useTypingAnimation = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayText('');

    const typeWriter = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, speed);
      }
    };

    typeWriter();

    return () => {
      // Cleanup if needed
    };
  }, [text, speed]);

  return displayText;
};

// Particle animation for celebration effects
export const createParticles = (element: HTMLElement, color: string) => {
  const particleCount = 20;
  const particles: HTMLElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1000';
    
    const rect = element.getBoundingClientRect();
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    document.body.appendChild(particle);
    particles.push(particle);

    // Animate particle
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 100 + Math.random() * 50;
    const duration = 800 + Math.random() * 400;
    
    particle.animate([
      { 
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1
      },
      { 
        transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0)`,
        opacity: 0
      }
    ], {
      duration,
      easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
    }).onfinish = () => {
      particle.remove();
    };
  }

  return particles;
};