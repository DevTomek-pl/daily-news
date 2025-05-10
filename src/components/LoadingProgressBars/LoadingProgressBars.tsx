import { useState, useEffect } from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './LoadingProgressBars.css';

export interface SourceLoadingStatus {
  name: string;
  isLoading: boolean;
  progress: number;
  hasError: boolean;
  errorMessage?: string;
}

interface LoadingProgressBarsProps {
  sources: SourceLoadingStatus[];
}

export const LoadingProgressBars: React.FC<LoadingProgressBarsProps> = ({ sources }) => {
  const isAnySourceLoading = sources.some(source => source.isLoading);
  const hasErrors = sources.some(source => source.hasError);
  
  const [isVisible, setIsVisible] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  
  useEffect(() => {
    if (!isAnySourceLoading) {
      // Ustaw różne czasy ukrywania w zależności od tego czy są błędy
      const hideDelay = hasErrors ? 5000 : 2000; // 5 sekund dla błędów, 2 sekundy dla sukcesu
      
      // Rozpocznij animację znikania
      setIsHiding(true);
      
      // Ukryj komponent po animacji
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
      
      return () => clearTimeout(timer);
    } else {
      setIsHiding(false);
      setIsVisible(true);
    }
  }, [isAnySourceLoading, hasErrors]);

  // Pokaż ponownie, jeśli zaczyna się nowe ładowanie
  useEffect(() => {
    if (isAnySourceLoading) {
      setIsVisible(true);
      setIsHiding(false);
    }
  }, [isAnySourceLoading]);

  if (!isVisible) return null;

  return (
    <div className={`loading-progress-bars ${isHiding ? 'hiding' : ''}`}>
      {sources.map(source => {
        const label = source.hasError 
          ? `${source.name} - ${source.errorMessage || 'Error loading articles'}`
          : source.isLoading 
            ? `${source.name} - Loading articles...`
            : `${source.name} - Completed`;

        return (
          <ProgressBar
            key={source.name}
            isVisible={true}
            label={label}
            progress={source.progress}
            hasError={source.hasError}
          />
        );
      })}
    </div>
  );
};
