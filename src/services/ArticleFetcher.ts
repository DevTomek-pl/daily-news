import type { Article } from '../types/Article';
import type { ArticleSourceConfig } from '../types/ArticleSource';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Enable the customParseFormat plugin
dayjs.extend(customParseFormat);

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
    const rawDate = dateEl?.getAttribute('datetime') || dateEl?.textContent || '';
    
    // Format date using the dateFormat from config if available
    const formattedDate = this.parseDate(rawDate);

    return {
      id: articleUrl,
      title,
      description: element.querySelector(selectors.description)?.textContent?.trim() || '',
      imageUrl: this.parsedTransformers.imageUrl ? this.parsedTransformers.imageUrl(imageUrl) : imageUrl,
      date: formattedDate,
      articleUrl,
      sourceName: this.config.name
    };
  }

  /**
   * Parse the date string using the configured date format
   * @param rawDate The raw date string from the article
   * @returns ISO formatted date string
   */
  private parseDate(rawDate: string): string {
    // Default to current date if parsing fails
    if (!rawDate) {
      return new Date().toISOString();
    }

    try {
      const cleanDate = rawDate.trim();
      
      // If a specific date format is specified in config
      if (this.config.dateFormat) {
        return this.parseDateWithFormat(cleanDate, this.config.dateFormat);
      } 
      
      // Try standard date parsing if no format specified
      return this.parseDateStandard(cleanDate);
    } catch (err) {
      console.warn(`Failed to parse date for ${this.config.name}: "${rawDate}"`, err);
      return new Date().toISOString();
    }
  }

  /**
   * Parse a date string with a specific format
   */
  private parseDateWithFormat(dateString: string, format: string): string {
    // Handle special case for Polish dates with 'r.' suffix
    if (format.includes("'r.'")) {
      return this.parsePolishDate(dateString, format);
    }
    
    // Standard format parsing
    const parsedDate = dayjs(dateString, format);
    
    if (parsedDate.isValid()) {
      return parsedDate.toISOString();
    }
    
    console.warn(`Invalid date for ${this.config.name}: "${dateString}" with format "${format}"`);
    return new Date().toISOString();
  }

  /**
   * Parse Polish date format with 'r.' suffix
   */
  private parsePolishDate(dateString: string, format: string): string {
    // Remove the 'r.' suffix from the date string
    const processedDate = dateString.replace(' r.', '');
    // Remove the 'r.' suffix from the format
    const processedFormat = format.replace(" 'r.'", "");
    
    const parsedDate = dayjs(processedDate, processedFormat);
    
    if (parsedDate.isValid()) {
      return parsedDate.toISOString();
    }
    
    console.warn(`Invalid Polish date for ${this.config.name}: "${dateString}" with format "${format}"`);
    return new Date().toISOString();
  }

  /**
   * Parse a date string using standard JavaScript Date
   */
  private parseDateStandard(dateString: string): string {
    const standardDate = new Date(dateString);
    
    if (!isNaN(standardDate.getTime())) {
      return standardDate.toISOString();
    }
    
    console.warn(`Invalid standard date for ${this.config.name}: "${dateString}"`);
    return new Date().toISOString();
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

