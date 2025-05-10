import './ProgressBar.css';

interface ProgressBarProps {
  isVisible: boolean;
  label?: string;
  progress?: number;
  hasError?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  isVisible, 
  label, 
  progress = 0,
  hasError = false 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`progress-bar-container ${hasError ? 'has-error' : ''}`}>
      {label && <div className="progress-bar-label">{label}</div>}
      <div className="progress-bar">
        <div 
          className={`progress-bar-fill ${hasError ? 'error' : ''}`} 
          style={{ width: hasError ? '100%' : `${progress}%` }} 
        />
      </div>
    </div>
  );
};
