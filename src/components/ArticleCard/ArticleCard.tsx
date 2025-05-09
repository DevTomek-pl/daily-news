import { type Article } from '../../types/Article';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div className="article-card">
      <img src={article.imageUrl} alt={article.title} className="article-image" />
      <div className="article-content">
        <h2 className="article-title">{article.title}</h2>
        <div className="article-meta">
          <span className="article-date">{article.date}</span>
          <span className="article-author">By {article.author}</span>
        </div>
        <p className="article-description">{article.description}</p>
        <a href={article.articleUrl} className="article-link" target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
    </div>
  );
};
