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

  return (
    <div className="article-card">
      <div className="article-image-wrapper">
        <span className="article-source">{article.sourceName}</span>
        <img src={article.imageUrl} alt={article.title} className="article-image" />
      </div>
      <div className="article-content">
        <div className="article-meta">
          <span className="article-date">{formatDate(article.date)}</span>
        </div>
        <h2 className="article-title">{article.title}</h2>
        <p className="article-description">{article.description}</p>
        <a href={article.articleUrl} className="article-link" target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
    </div>
  );
};
