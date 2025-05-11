import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarksPage } from '../BookmarksPage';
import { BookmarkService } from '../../services/BookmarkService';
import type { Article } from '../../types/Article';

// Mock BookmarkService
vi.mock('../../services/BookmarkService', () => ({
    BookmarkService: {
        getBookmarks: vi.fn()
    }
}));

// Mock ArticleCard component
vi.mock('../../components/ArticleCard/ArticleCard', () => ({
    ArticleCard: ({ article, onBookmarkChange }: { article: Article, onBookmarkChange: () => void }) => (
        <div data-testid="article-card" onClick={onBookmarkChange}>
            {article.title}
        </div>
    )
}));

describe('BookmarksPage', () => {
    const mockArticles: Article[] = [
        {
            title: 'Test Article 1',
            description: 'Test Description 1',
            articleUrl: 'https://example.com/article1',
            imageUrl: 'https://example.com/image1.jpg',
            source: 'Test Source',
            category: 'Technology',
            publishedAt: '2025-05-11'
        },
        {
            title: 'Test Article 2',
            description: 'Test Description 2',
            articleUrl: 'https://example.com/article2',
            imageUrl: 'https://example.com/image2.jpg',
            source: 'Test Source',
            category: 'Technology',
            publishedAt: '2025-05-11'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays "No bookmarked articles yet" when there are no bookmarks', () => {
        vi.mocked(BookmarkService.getBookmarks).mockReturnValue([]);
        
        render(<BookmarksPage />);
        
        expect(screen.getByText('No bookmarked articles yet.')).toBeInTheDocument();
        expect(screen.queryByTestId('article-card')).not.toBeInTheDocument();
    });

    it('displays bookmarked articles when they exist', () => {
        vi.mocked(BookmarkService.getBookmarks).mockReturnValue(mockArticles);
        
        render(<BookmarksPage />);
        
        expect(screen.queryByText('No bookmarked articles yet.')).not.toBeInTheDocument();
        expect(screen.getAllByTestId('article-card')).toHaveLength(2);
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
        expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });

    it('reloads bookmarks when a bookmark changes', () => {
        vi.mocked(BookmarkService.getBookmarks)
            .mockReturnValueOnce(mockArticles)
            .mockReturnValueOnce([mockArticles[0]]);
        
        render(<BookmarksPage />);
        
        // Initially, both articles should be visible
        expect(screen.getAllByTestId('article-card')).toHaveLength(2);

        // Simulate bookmark change by clicking on the second article
        fireEvent.click(screen.getByText('Test Article 2'));

        // getBookmarks should have been called again
        expect(BookmarkService.getBookmarks).toHaveBeenCalledTimes(2);
    });

    it('displays page title correctly', () => {
        vi.mocked(BookmarkService.getBookmarks).mockReturnValue([]);
        
        render(<BookmarksPage />);
        
        expect(screen.getByText('Bookmarked Articles')).toBeInTheDocument();
    });
});
