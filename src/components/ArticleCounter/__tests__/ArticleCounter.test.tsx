import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleCounter } from '../ArticleCounter';

describe('ArticleCounter', () => {
  it('renders the visible and total count correctly', () => {
    render(<ArticleCounter visibleCount={20} totalCount={100} />);
    
    expect(screen.getByText('20/100')).toBeDefined();
  });

  it('handles zero counts', () => {
    render(<ArticleCounter visibleCount={0} totalCount={0} />);
    
    expect(screen.getByText('0/0')).toBeDefined();
  });

  it('handles equal counts', () => {
    render(<ArticleCounter visibleCount={50} totalCount={50} />);
    
    expect(screen.getByText('50/50')).toBeDefined();
  });
});
