import { useEffect, useState, useRef, useMemo } from 'react';
import { ArticleCard } from './components/ArticleCard/ArticleCard';
import { CategoryFilter } from './components/CategoryFilter/CategoryFilter';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { SourceToggle } from './components/SourceToggle/SourceToggle';
import { BookmarksPage } from './pages/BookmarksPage';
import type { Article } from './types/Article';
import { ArticleFetcher } from './services/ArticleFetcher';
import sourceConfigs from './config/sources.json';
import './App.css';
import { ScrollToTopArrow } from './components/ScrollToTopArrow/ScrollToTopArrow';
import { LoadingProgressBars } from './components/LoadingProgressBars/LoadingProgressBars';
import type { SourceLoadingStatus } from './components/LoadingProgressBars/LoadingProgressBars';

const ARTICLES_PER_PAGE = 12;

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'bookmarks'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') === 'bookmarks' ? 'bookmarks' : 'home';
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleArticles, setVisibleArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
  });
  const [enabledSources, setEnabledSources] = useState<Set<string>>(() => {
    const params = new URLSearchParams(window.location.search);
    const disabledSourcesParam = params.get('disabledSources');
    const disabledSources = disabledSourcesParam ? disabledSourcesParam.split(',') : [];
    const allSources = new Set(sourceConfigs.sources.map(source => source.name));
    disabledSources.forEach(source => allSources.delete(source));
    return allSources;
  });
  const [isSourcePanelOpen, setIsSourcePanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sourceStatus, setSourceStatus] = useState<SourceLoadingStatus[]>([]);
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (!isLoading && hasMore) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const currentArticles = filterArticles(articles, selectedCategory, enabledSources);
            const nextArticles = currentArticles.slice(
              visibleArticles.length,
              visibleArticles.length + ARTICLES_PER_PAGE
            );
            
            if (nextArticles.length > 0) {
              setVisibleArticles(prev => [...prev, ...nextArticles]);
            }
            
            setHasMore(visibleArticles.length + nextArticles.length < currentArticles.length);
          }
        },
        { threshold: 0.1 }
      );

      if (loadingRef.current) {
        observer.current.observe(loadingRef.current);
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, hasMore, articles, selectedCategory, enabledSources, visibleArticles]);

  const categories = useMemo(() => {
    const categorySet = new Set(articles.map(article => article.category));
    return Array.from(categorySet).sort();
  }, [articles]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const initialSourceStatus: SourceLoadingStatus[] = sourceConfigs.sources.map(source => ({
          name: source.name,
          isLoading: true,
          progress: 0,
          hasError: false
        }));
        setSourceStatus(initialSourceStatus);
        
        const fetchPromises = sourceConfigs.sources.map(async (sourceConfig, index) => {
          try {
            const fetcher = new ArticleFetcher(sourceConfig);
            const sourceArticles = await fetcher.fetchArticles();
            setSourceStatus(prev => prev.map((status, idx) => 
              idx === index ? { ...status, isLoading: false, progress: 100 } : status
            ));
            return sourceArticles;
          } catch (err) {
            console.error(`Error loading articles from ${sourceConfig.name}:`, err);
            setSourceStatus(prev => prev.map((status, idx) => 
              idx === index ? { 
                ...status, 
                isLoading: false, 
                hasError: true,
                errorMessage: err instanceof Error ? err.message : 'Unknown error occurred'
              } : status
            ));
            return [];
          }
        });
        
        const articlesArrays = await Promise.all(fetchPromises);
        const sortedArticles = articlesArrays
          .flat()
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setArticles(sortedArticles);
        
        // Filtruj artykuły zgodnie z parametrami URL
        const filteredArticles = filterArticles(sortedArticles, selectedCategory, enabledSources);
        setVisibleArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
        setHasMore(filteredArticles.length > ARTICLES_PER_PAGE);

      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentPage === 'bookmarks') {
      params.set('page', 'bookmarks');
    } else {
      params.delete('page');
    }
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [currentPage]);

  // Update URL when category or enabled sources change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (currentPage === 'bookmarks') {
      params.set('page', 'bookmarks');
    } else {
      params.delete('page');
    }

    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    const allSources = sourceConfigs.sources.map(source => source.name);
    const disabledSources = allSources.filter(source => !enabledSources.has(source));
    if (disabledSources.length > 0) {
      params.set('disabledSources', disabledSources.join(','));
    } else {
      params.delete('disabledSources');
    }

    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [currentPage, selectedCategory, enabledSources]);

  // Handle navigation changes
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      const pageParam = params.get('page');
      const disabledSourcesParam = params.get('disabledSources');

      setCurrentPage(pageParam === 'bookmarks' ? 'bookmarks' : 'home');
      setSelectedCategory(categoryParam);

      const allSources = new Set(sourceConfigs.sources.map(source => source.name));
      if (disabledSourcesParam) {
        disabledSourcesParam.split(',').forEach(source => allSources.delete(source));
      }
      setEnabledSources(allSources);

      // Aktualizuj widoczne artykuły zgodnie z nowymi filtrami
      const filtered = filterArticles(articles, categoryParam, allSources);
      setVisibleArticles(filtered.slice(0, ARTICLES_PER_PAGE));
      setHasMore(filtered.length > ARTICLES_PER_PAGE);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    const filtered = filterArticles(articles, category, enabledSources);
    setVisibleArticles(filtered.slice(0, ARTICLES_PER_PAGE));
    setHasMore(filtered.length > ARTICLES_PER_PAGE);

    // Reset intersection observer
    if (observer.current) {
      observer.current.disconnect();
    }
  };

  const handleSourceToggle = (sourceName: string) => {
    setEnabledSources(prev => {
      const newSources = new Set(prev);
      if (newSources.has(sourceName)) {
        newSources.delete(sourceName);
      } else {
        newSources.add(sourceName);
      }

      // Inside the callback, we have access to the new sources
      const filtered = filterArticles(articles, selectedCategory, newSources);
      setVisibleArticles(filtered.slice(0, ARTICLES_PER_PAGE));
      setHasMore(filtered.length > ARTICLES_PER_PAGE);

      return newSources;
    });

    // Reset intersection observer
    if (observer.current) {
      observer.current.disconnect();
    }
  };

  const filterArticles = (
    articles: Article[],
    category: string | null,
    enabledSources: Set<string>
  ): Article[] => {
    return articles.filter(article => {
      const categoryMatch = !category || article.category === category;
      const sourceMatch = enabledSources.has(article.sourceName);
      return categoryMatch && sourceMatch;
    });
  };

  const renderNavigation = () => (
    <nav className="main-navigation">
      <button 
        className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentPage('home')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L4 9v12h16V9l-8-6zm6 16h-3v-6H9v6H6v-9l6-4.5 6 4.5v9z"/>
        </svg>
        Home
      </button>
      <button 
        className={`nav-button ${currentPage === 'bookmarks' ? 'active' : ''}`}
        onClick={() => setCurrentPage('bookmarks')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
        Bookmarks
      </button>
    </nav>
  );

  return (
    <div className="app">
      {renderNavigation()}
      {currentPage === 'home' ? (
        <>
          <div className="filters">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              isLoading={isLoading}
              onSourcesClick={() => setIsSourcePanelOpen(!isSourcePanelOpen)}
            />
          </div>

          {isSourcePanelOpen && (
            <SourceToggle
              isOpen={isSourcePanelOpen}
              onClose={() => setIsSourcePanelOpen(false)}
              enabledSources={enabledSources}
              onSourceToggle={handleSourceToggle}
            />
          )}

          {isLoading && <LoadingProgressBars sources={sourceStatus} />}

          {error && <div className="error-message">{error}</div>}

          <div className="articles-grid">
            {visibleArticles.map(article => (
              <ArticleCard 
                key={article.articleUrl} 
                article={article}
                onBookmarkChange={() => {
                  // Only refresh visible articles if we're not on the home page
                  if (currentPage !== 'home') {
                    const filtered = filterArticles(articles, selectedCategory, enabledSources);
                    setVisibleArticles(filtered.slice(0, ARTICLES_PER_PAGE));
                  }
                }}
              />
            ))}
          </div>

          {!isLoading && hasMore && (
            <div ref={loadingRef} className="loading-more">
              <ProgressBar isVisible={true} />
            </div>
          )}

          <ScrollToTopArrow />
        </>
      ) : (
        <BookmarksPage />
      )}
    </div>
  );
}

export default App;
