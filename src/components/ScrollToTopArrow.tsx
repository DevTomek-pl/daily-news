import { useEffect, useState } from 'react';

export function ScrollToTopArrow() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-top-arrow${showScrollTop ? ' visible' : ''}`}
      onClick={handleScrollTop}
      aria-label="Scroll to top"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill="#fff" stroke="#1a1a1a" strokeWidth="2"/>
        <path d="M24 34V14" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
        <path d="M16 22l8-8 8 8" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
