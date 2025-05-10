import { useEffect, useRef } from 'react';
import './SourceToggle.css';
import sourceConfigs from '../../config/sources.json';

interface SourceToggleProps {
  isOpen: boolean;
  onClose: () => void;
  enabledSources: Set<string>;
  onSourceToggle: (sourceName: string) => void;
}

export const SourceToggle = ({ 
  isOpen, 
  onClose, 
  enabledSources, 
  onSourceToggle 
}: SourceToggleProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="source-toggle-overlay">
      <div className="source-toggle-panel" ref={panelRef}>
        <div className="source-toggle-header">
          <h2>News Sources</h2>
          <button className="close-button" onClick={onClose} aria-label="Close panel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="source-toggle-content">
          {sourceConfigs.sources.map(source => (
            <label key={source.name} className="source-toggle-item">
              <input
                type="checkbox"
                checked={enabledSources.has(source.name)}
                onChange={() => onSourceToggle(source.name)}
              />
              <span className="source-name">{source.name}</span>
              <span className={`source-category category-${source.category.toLowerCase()}`}>
                {source.category}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
