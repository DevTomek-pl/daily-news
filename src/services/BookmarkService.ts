import type { Article } from '../types/Article';

const BOOKMARKS_KEY = 'daily-news-bookmarks';

export class BookmarkService {
    static getBookmarks(): Article[] {
        const bookmarksJson = localStorage.getItem(BOOKMARKS_KEY);
        return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    }

    static addBookmark(article: Article): void {
        const bookmarks = this.getBookmarks();
        if (!this.isBookmarked(article)) {
            bookmarks.push(article);
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        }
    }

    static removeBookmark(article: Article): void {
        const bookmarks = this.getBookmarks();
        const updatedBookmarks = bookmarks.filter(
            (bookmark) => bookmark.url !== article.url
        );
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    }

    static isBookmarked(article: Article): boolean {
        const bookmarks = this.getBookmarks();
        return bookmarks.some((bookmark) => bookmark.url === article.url);
    }
}
