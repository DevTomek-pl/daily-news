import type { Article } from '../../types/Article';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleArticleClick = () => {
    window.open(article.articleUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="article-card">
      <div className="article-image-wrapper clickable" onClick={handleArticleClick}>
        <span className="article-source">{article.sourceName}</span>
        <img src={article.imageUrl} alt={article.title} className="article-image" />
        <div className="image-overlay">
          <span className="read-indicator">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
            Read Article
          </span>
        </div>
      </div>
      <div className="article-content">
        <div className="article-meta">
          <span className="article-date">{formatDate(article.date)}</span>
        </div>
        <h2 className="article-title clickable" onClick={handleArticleClick}>
          {article.title}
        </h2>
        <p className="article-description">{article.description}</p>
        <a href={article.articleUrl} className="article-link" target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
    </div>
  );
};

