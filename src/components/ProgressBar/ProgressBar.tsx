import './ProgressBar.css';

interface ProgressBarProps {
  isVisible: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" />
    </div>
  );
};
