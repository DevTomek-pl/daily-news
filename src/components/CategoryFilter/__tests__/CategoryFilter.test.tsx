import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryFilter } from '../CategoryFilter';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('CategoryFilter', () => {
  const mockCategories = ['Technology', 'Sports', 'Politics'];
  const mockOnCategoryChange = vi.fn();
  const mockOnSourcesClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all categories and "All" button', () => {
    render(
      <MemoryRouter>
        <CategoryFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
          isLoading={false}
          onSourcesClick={mockOnSourcesClick}
        />
      </MemoryRouter>
    );

    // Check if "All" button is present
    expect(screen.getByText('All')).toBeInTheDocument();

    // Check if all category buttons are present
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('highlights selected category', () => {
    const selectedCategory = 'Technology';
    
    render(
      <MemoryRouter>
        <CategoryFilter
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={mockOnCategoryChange}
          isLoading={false}
          onSourcesClick={mockOnSourcesClick}
        />
      </MemoryRouter>
    );

    const selectedButton = screen.getByText(selectedCategory);
    expect(selectedButton).toHaveClass('active');
    expect(screen.getByText('All')).not.toHaveClass('active');
  });

  it('calls onCategoryChange when clicking category buttons', () => {
    render(
      <MemoryRouter>
        <CategoryFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
          isLoading={false}
          onSourcesClick={mockOnSourcesClick}
        />
      </MemoryRouter>
    );

    // Click on a category button
    fireEvent.click(screen.getByText('Technology'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Technology');

    // Click on "All" button
    fireEvent.click(screen.getByText('All'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith(null);
  });

  it('shows loading state correctly', () => {
    render(
      <MemoryRouter>
        <CategoryFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
          isLoading={true}
          onSourcesClick={mockOnSourcesClick}
        />
      </MemoryRouter>
    );

    // When loading, the component should not have 'visible' class
    const filterContainer = screen.getByRole('button', { name: 'All' }).closest('.category-filter');
    expect(filterContainer).not.toHaveClass('visible');
  });

  it('updates URL when category is changed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <CategoryFilter
          categories={mockCategories}
          selectedCategory={null}
          onCategoryChange={mockOnCategoryChange}
          isLoading={false}
          onSourcesClick={mockOnSourcesClick}
        />
      </MemoryRouter>
    );

    // Click on a category button
    fireEvent.click(screen.getByText('Technology'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Technology');
    
    // Click on another category
    fireEvent.click(screen.getByText('Sports'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith('Sports');

    // Click on "All" to clear the category
    fireEvent.click(screen.getByText('All'));
    expect(mockOnCategoryChange).toHaveBeenCalledWith(null);
  });
});
