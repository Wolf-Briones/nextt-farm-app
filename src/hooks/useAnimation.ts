import { useEffect } from 'react';

interface UseAnimationProps {
  isPlaying: boolean;
  setSelectedDate: (date: string | ((prev: string) => string)) => void;
}

export const useAnimation = ({ isPlaying, setSelectedDate }: UseAnimationProps) => {
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSelectedDate((prevDate: string) => {
        const date = new Date(prevDate);
        date.setDate(date.getDate() - 1);
        
        const minDate = new Date();
        minDate.setDate(minDate.getDate() - 30);
        
        if (date < minDate) {
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() - 1);
          return maxDate.toISOString().split('T')[0];
        }
        
        return date.toISOString().split('T')[0];
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isPlaying, setSelectedDate]);
};