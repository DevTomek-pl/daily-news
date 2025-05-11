import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BookmarkService } from '../BookmarkService';
import type { Article } from '../../types/Article';

describe('BookmarkService', () => {
    const mockArticle: Article = {
        title: 'Test Article',
        description: 'Test Description',
        articleUrl: 'https://example.com/article',
        imageUrl: 'https://example.com/image.jpg',
        source: 'Test Source',
        category: 'Technology',
        publishedAt: '2025-05-11'
    };

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should return empty array when no bookmarks exist', () => {
        const bookmarks = BookmarkService.getBookmarks();
        expect(bookmarks).toEqual([]);
    });

    it('should add a bookmark', () => {
        BookmarkService.addBookmark(mockArticle);
        const bookmarks = BookmarkService.getBookmarks();
        
        expect(bookmarks).toHaveLength(1);
        expect(bookmarks[0]).toEqual(mockArticle);
    });

    it('should not add duplicate bookmark', () => {
        BookmarkService.addBookmark(mockArticle);
        BookmarkService.addBookmark(mockArticle);
        
        const bookmarks = BookmarkService.getBookmarks();
        expect(bookmarks).toHaveLength(1);
    });

    it('should remove a bookmark', () => {
        BookmarkService.addBookmark(mockArticle);
        BookmarkService.removeBookmark(mockArticle);
        
        const bookmarks = BookmarkService.getBookmarks();
        expect(bookmarks).toHaveLength(0);
    });

    it('should check if article is bookmarked', () => {
        expect(BookmarkService.isBookmarked(mockArticle)).toBe(false);
        
        BookmarkService.addBookmark(mockArticle);
        expect(BookmarkService.isBookmarked(mockArticle)).toBe(true);
        
        BookmarkService.removeBookmark(mockArticle);
        expect(BookmarkService.isBookmarked(mockArticle)).toBe(false);
    });

    it('should handle multiple bookmarks', () => {
        const mockArticle2 = {
            ...mockArticle,
            articleUrl: 'https://example.com/article2',
            title: 'Test Article 2'
        };

        BookmarkService.addBookmark(mockArticle);
        BookmarkService.addBookmark(mockArticle2);

        const bookmarks = BookmarkService.getBookmarks();
        expect(bookmarks).toHaveLength(2);
        expect(bookmarks).toContainEqual(mockArticle);
        expect(bookmarks).toContainEqual(mockArticle2);
    });
});
