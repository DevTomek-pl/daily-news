import { useEffect, useState } from 'react';
import './CategoryFilter.css';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  isLoading: boolean;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading
}: CategoryFilterProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Add a small delay for a smooth entrance after loading
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className={`category-filter ${isVisible ? 'visible' : ''}`}>
      <div className="filter-content">
        <button
          className={`category-button ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
