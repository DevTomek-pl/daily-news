import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkButton } from '../BookmarkButton';
import { BookmarkService } from '../../../services/BookmarkService';
import type { Article } from '../../../types/Article';

// Mock BookmarkService
vi.mock('../../../services/BookmarkService', () => ({
    BookmarkService: {
        isBookmarked: vi.fn(),
        addBookmark: vi.fn(),
        removeBookmark: vi.fn()
    }
}));

describe('BookmarkButton', () => {
    const mockArticle: Article = {
        title: 'Test Article',
        description: 'Test Description',
        articleUrl: 'https://example.com/article',
        imageUrl: 'https://example.com/image.jpg',
        source: 'Test Source',
        category: 'Technology',
        publishedAt: '2025-05-11'
    };

    const mockOnBookmarkChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders in non-bookmarked state by default', () => {
        vi.mocked(BookmarkService.isBookmarked).mockReturnValue(false);
        
        render(<BookmarkButton article={mockArticle} onBookmarkChange={mockOnBookmarkChange} />);
        
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('active');
        expect(button).toHaveAttribute('title', 'Add to bookmarks');
    });

    it('renders in bookmarked state when article is bookmarked', () => {
        vi.mocked(BookmarkService.isBookmarked).mockReturnValue(true);
        
        render(<BookmarkButton article={mockArticle} onBookmarkChange={mockOnBookmarkChange} />);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('active');
        expect(button).toHaveAttribute('title', 'Remove from bookmarks');
    });

    it('adds bookmark when clicking non-bookmarked button', () => {
        vi.mocked(BookmarkService.isBookmarked).mockReturnValue(false);
        
        render(<BookmarkButton article={mockArticle} onBookmarkChange={mockOnBookmarkChange} />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(BookmarkService.addBookmark).toHaveBeenCalledWith(mockArticle);
        expect(BookmarkService.removeBookmark).not.toHaveBeenCalled();
        expect(mockOnBookmarkChange).toHaveBeenCalled();
    });

    it('removes bookmark when clicking bookmarked button', () => {
        vi.mocked(BookmarkService.isBookmarked).mockReturnValue(true);
        
        render(<BookmarkButton article={mockArticle} onBookmarkChange={mockOnBookmarkChange} />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(BookmarkService.removeBookmark).toHaveBeenCalledWith(mockArticle);
        expect(BookmarkService.addBookmark).not.toHaveBeenCalled();
        expect(mockOnBookmarkChange).toHaveBeenCalled();
    });

    it('prevents event propagation on click', () => {
        vi.mocked(BookmarkService.isBookmarked).mockReturnValue(false);
        
        render(<BookmarkButton article={mockArticle} onBookmarkChange={mockOnBookmarkChange} />);
        
        const button = screen.getByRole('button');
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        });

        // Spy on the event methods
        vi.spyOn(clickEvent, 'preventDefault');
        vi.spyOn(clickEvent, 'stopPropagation');

        // Trigger the click event
        fireEvent(button, clickEvent);

        expect(clickEvent.preventDefault).toHaveBeenCalled();
        expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });
});
