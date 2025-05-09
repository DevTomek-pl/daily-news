import { useEffect, useState } from 'react';
import { ArticleCard } from './components/ArticleCard/ArticleCard';
import type { Article } from './types/Article';
import { fetchXDAArticles } from './services/xdaArticleService';
import './App.css';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const xdaArticles = await fetchXDAArticles();
        setArticles(xdaArticles);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  return (
    <div className="app">
      <h1 className="newspaper-header">Daily News</h1>
      {isLoading && <div className="loading">Loading articles...</div>}
      {error && <div className="error">{error}</div>}
      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default App;
