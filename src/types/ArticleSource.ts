export interface ArticleSourceConfig {
  name: string;
  baseUrl: string;
  selectors: {
    container: string;
    title: string;
    description: string;
    image: string;
    date: string;
    link: string;
  };
  transformers?: {
    articleUrl?: string;
    imageUrl?: string;
    date?: string;
  };
}
