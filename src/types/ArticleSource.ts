export interface ArticleSourceConfig {
  name: string;
  category: string;
  baseUrl: string;
  dateFormat?: string;
  useCorsProxy?: boolean;
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
  };
}

