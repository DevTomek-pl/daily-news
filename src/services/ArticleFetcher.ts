import type { Article } from '../types/Article';
import type { ArticleSourceConfig } from '../types/ArticleSource';

export class ArticleFetcher {
  private readonly config: ArticleSourceConfig;
  private parsedTransformers: Record<string, ((value: string) => string) | undefined>;

  constructor(config: ArticleSourceConfig) {
    this.config = config;
    this.parsedTransformers = this.parseTransformers(config.transformers || {});
  }

  private parseTransformers(transformers: Record<string, string | undefined>): Record<string, ((value: string) => string) | undefined> {
    const parsed: Record<string, ((value: string) => string) | undefined> = {};
    
    for (const [key, transformer] of Object.entries(transformers)) {
      if (transformer) {
        try {
          // Create a function from the transformer string
          parsed[key] = new Function('url', `return ${transformer}`) as (value: string) => string;
        } catch (error) {
          console.error(`Error parsing transformer for ${key}:`, error);
          parsed[key] = undefined;
        }
      }
    }
    
    return parsed;
  }

  async fetchArticles(): Promise<Article[]> {
    try {
      const response = await fetch(this.config.baseUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      
      const container = doc.querySelector(this.config.selectors.container);
      if (!container) throw new Error('Article container not found');

      const articleElements = Array.from(container.children);
      
      return articleElements
        .map(element => this.parseArticle(element))
        .filter(article => this.isValidArticle(article));
    } catch (error) {
      console.error(`Error fetching articles from ${this.config.name}:`, error);
      return this.getFallbackArticle();
    }
  }

  private parseArticle(element: Element): Article {
    const { selectors } = this.config;
    
    const title = element.querySelector(selectors.title)?.textContent?.trim() || '';
    const rawUrl = element.querySelector(selectors.link)?.getAttribute('href') || '';
    const articleUrl = this.parsedTransformers.articleUrl ? this.parsedTransformers.articleUrl(rawUrl) : rawUrl;
    
    const rawImage = element.querySelector(selectors.image);
    const imageUrl = rawImage?.getAttribute('src') || rawImage?.getAttribute('data-src') || '';
    
    const dateEl = element.querySelector(selectors.date);
    const date = dateEl?.getAttribute('datetime') || dateEl?.textContent || new Date().toISOString();

    return {
      id: articleUrl,
      title,
      description: element.querySelector(selectors.description)?.textContent?.trim() || '',
      imageUrl: this.parsedTransformers.imageUrl ? this.parsedTransformers.imageUrl(imageUrl) : imageUrl,
      date: this.parsedTransformers.date ? this.parsedTransformers.date(date) : date,
      articleUrl,
      sourceName: this.config.name
    };
  }

  private isValidArticle(article: Article): boolean {
    return Boolean(
      article.title &&
      article.articleUrl &&
      !article.articleUrl.includes('#') &&
      article.articleUrl !== this.config.baseUrl
    );
  }

  private getFallbackArticle(): Article[] {
    return [{
      id: 'fallback',
      title: `${this.config.name} - Temporary Unavailable`,
      date: new Date().toISOString(),
      description: 'Unable to fetch articles at this time. Please try again later.',
      imageUrl: 'https://picsum.photos/800/400',
      articleUrl: this.config.baseUrl,
      sourceName: this.config.name
    }];
  }
}

