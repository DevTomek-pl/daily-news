import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { ArticleCard } from './components/ArticleCard/ArticleCard';
import { CategoryFilter } from './components/CategoryFilter/CategoryFilter';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import type { Article } from './types/Article';
import { ArticleFetcher } from './services/ArticleFetcher';
import sourceConfigs from './config/sources.json';
import './App.css';
import { ScrollToTopArrow } from './components/ScrollToTopArrow';

const ARTICLES_PER_PAGE = 12;

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleArticles, setVisibleArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

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
        setVisibleArticles(sortedArticles.slice(0, ARTICLES_PER_PAGE));
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

  const loadMoreArticles = useCallback(() => {
    const nextPage = page + 1;
    const start = (page - 1) * ARTICLES_PER_PAGE;
    const end = nextPage * ARTICLES_PER_PAGE;
    
    const additionalArticles = filteredArticles.slice(start, end);
    setVisibleArticles(prev => [...prev, ...additionalArticles]);
    setPage(nextPage);
    setHasMore(end < filteredArticles.length);
  }, [page, filteredArticles]);

  useEffect(() => {
    // Reset pagination when category changes
    setPage(1);
    setVisibleArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
    setHasMore(ARTICLES_PER_PAGE < filteredArticles.length);
  }, [selectedCategory, filteredArticles]);

  useEffect(() => {
    const currentObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreArticles();
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );

    if (loadingRef.current) {
      currentObserver.observe(loadingRef.current);
    }

    observer.current = currentObserver;

    return () => {
      if (currentObserver && loadingRef.current) {
        currentObserver.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, isLoading, loadMoreArticles]);

  return (
    <div className="app">
      <ProgressBar isVisible={isLoading} />
      <h1 className="newspaper-header">Daily News</h1>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isLoading={isLoading}
      />
      <div className="articles-grid">
        {visibleArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {hasMore && (
        <div ref={loadingRef} className="loading-more">
          Loading more articles...
        </div>
      )}
      {error && <div className="error">{error}</div>}
      <ScrollToTopArrow />
    </div>
  );
}

export default App;
