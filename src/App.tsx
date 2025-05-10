import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { ArticleCard } from './components/ArticleCard/ArticleCard';
import { CategoryFilter } from './components/CategoryFilter/CategoryFilter';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { SourceToggle } from './components/SourceToggle/SourceToggle';
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    // Initialize from URL params
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
  });
  const [enabledSources, setEnabledSources] = useState<Set<string>>(() => {
    // Initialize from URL params or default to all sources enabled
    const params = new URLSearchParams(window.location.search);
    const disabledSourcesParam = params.get('disabledSources');
    const disabledSources = disabledSourcesParam ? disabledSourcesParam.split(',') : [];
    const allSources = new Set(sourceConfigs.sources.map(source => source.name));
    
    // Remove disabled sources from the set
    disabledSources.forEach(source => allSources.delete(source));
    return allSources;
  });
  const [isSourcePanelOpen, setIsSourcePanelOpen] = useState(false);
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
    return articles.filter(article => {
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const isSourceEnabled = enabledSources.has(article.sourceName);
      return matchesCategory && isSourceEnabled;
    });
  }, [articles, selectedCategory, enabledSources]);

  const loadMoreArticles = useCallback(() => {
    const nextPage = page + 1;
    const start = (page - 1) * ARTICLES_PER_PAGE;
    const end = nextPage * ARTICLES_PER_PAGE;
    
    const additionalArticles = filteredArticles.slice(start, end);
    setVisibleArticles(prev => [...prev, ...additionalArticles]);
    setPage(nextPage);
    setHasMore(end < filteredArticles.length);
  }, [page, filteredArticles]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Update category parameter
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    
    // Preserve disabled sources parameter
    const allSources = new Set(sourceConfigs.sources.map(source => source.name));
    const disabledSources = Array.from(allSources)
      .filter(source => !enabledSources.has(source));
    
    if (disabledSources.length > 0) {
      params.set('disabledSources', disabledSources.join(','));
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCategory, enabledSources]);

  // Update URL when sources change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Get all source names
    const allSources = new Set(sourceConfigs.sources.map(source => source.name));
    // Find disabled sources
    const disabledSources = Array.from(allSources)
      .filter(source => !enabledSources.has(source));
    
    if (disabledSources.length > 0) {
      params.set('disabledSources', disabledSources.join(','));
    } else {
      params.delete('disabledSources');
    }
    
    // Keep existing category parameter if present
    const category = params.get('category');
    if (category) {
      params.set('category', category);
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [enabledSources]);

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
      <h1 
        className="newspaper-header" 
        onClick={() => {
          window.location.href = "/";
        }}
        style={{ cursor: 'pointer' }}
      >
        Daily News
      </h1>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isLoading={isLoading}
        onSourcesClick={() => setIsSourcePanelOpen(true)}
      />
      <SourceToggle
        isOpen={isSourcePanelOpen}
        onClose={() => setIsSourcePanelOpen(false)}
        enabledSources={enabledSources}
        onSourceToggle={(sourceName) => {
          setEnabledSources(prev => {
            const newSources = new Set(prev);
            if (newSources.has(sourceName)) {
              newSources.delete(sourceName);
            } else {
              newSources.add(sourceName);
            }
            return newSources;
          });
        }}
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
