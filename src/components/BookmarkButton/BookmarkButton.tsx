import React from 'react';
import type { Article } from '../../types/Article';
import { BookmarkService } from '../../services/BookmarkService';
import './BookmarkButton.css';

interface BookmarkButtonProps {
    article: Article;
    onBookmarkChange?: () => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ article, onBookmarkChange }) => {
    const [isBookmarked, setIsBookmarked] = React.useState(() => 
        BookmarkService.isBookmarked(article)
    );

    const toggleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isBookmarked) {
            BookmarkService.removeBookmark(article);
        } else {
            BookmarkService.addBookmark(article);
        }
        
        setIsBookmarked(!isBookmarked);
        onBookmarkChange?.();
    };

    return (
        <button 
            className={`bookmark-button ${isBookmarked ? 'active' : ''}`}
            onClick={toggleBookmark}
            title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
            {isBookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3v18h18V3H3zm15 15H6V6h12v12z"/>
                    <path d="M8 8h8v8H8z"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3v18h18V3H3zm15 15H6V6h12v12zm-2-2H8V8h8v8z"/>
                </svg>
            )}
        </button>
    );
};
