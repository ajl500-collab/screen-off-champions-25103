import { useState, useCallback } from 'react';

interface ConfettiState {
  isExploding: boolean;
  triggerAt: number;
}

export const useConfetti = () => {
  const [confetti, setConfetti] = useState<ConfettiState>({
    isExploding: false,
    triggerAt: 0
  });

  const celebrate = useCallback(() => {
    setConfetti({ isExploding: true, triggerAt: Date.now() });
    
    // Reset after animation completes
    setTimeout(() => {
      setConfetti({ isExploding: false, triggerAt: Date.now() });
    }, 2000);
  }, []);

  return {
    isExploding: confetti.isExploding,
    celebrate
  };
};
