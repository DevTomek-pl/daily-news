import { useEffect, useState, useMemo } from 'react';
import { ArticleCard } from './components/ArticleCard/ArticleCard';
import { CategoryFilter } from './components/CategoryFilter/CategoryFilter';
import type { Article } from './types/Article';
import { ArticleFetcher } from './services/ArticleFetcher';
import sourceConfigs from './config/sources.json';
import './App.css';
import { ScrollToTopArrow } from './components/ScrollToTopArrow';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        
        const allArticles: Article[] = [];
        
        for (const sourceConfig of sourceConfigs.sources) {
          const fetcher = new ArticleFetcher(sourceConfig);
          const sourceArticles = await fetcher.fetchArticles();
          allArticles.push(...sourceArticles);
        }

        const sortedArticles = allArticles.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setArticles(sortedArticles);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(articles.map(article => article.category));
    return Array.from(uniqueCategories);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return articles;
    return articles.filter(article => article.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <div className="app">
      <h1 className="newspaper-header">Daily News</h1>
      {isLoading && <div className="loading">Loading articles...</div>}
      {error && <div className="error">{error}</div>}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isLoading={isLoading}
      />
      <div className="articles-grid">
        {filteredArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <ScrollToTopArrow />
    </div>
  );
}

export default App;
