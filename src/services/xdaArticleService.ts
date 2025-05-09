import type { Article } from '../types/Article';

const XDA_URL = '/api/xda-developers';

export const fetchXDAArticles = async (): Promise<Article[]> => {
  try {
    const response = await fetch(XDA_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Get the container with all articles
    const articleContainer = doc.querySelector('body > main > section.wrapper.w-section-latest > div > div > div.sentinel-home-list');

    if (!articleContainer) {
      throw new Error('Article container not found');
    }

    // Get all article divs (direct children of the container)
    const articleDivs = Array.from(articleContainer.children);

    return articleDivs.map((articleDiv): Article => {
      // Using exact selectors for each element
      const titleEl = articleDiv.querySelector('div > h5 > a');
      const descriptionEl = articleDiv.querySelector('div > p');
      const imageEl = articleDiv.querySelector('a > div > div > figure > picture > img');
      const dateEl = articleDiv.querySelector('div > div.w-display-card-details > div > div.meta_txt.article-date > time');

      const title = titleEl?.textContent?.trim() || '';
      const articleUrl = titleEl?.getAttribute('href') || '';
      const description = descriptionEl?.textContent?.trim() || '';
      const imageUrl = imageEl?.getAttribute('src') || imageEl?.getAttribute('data-src') || '';
      const date = dateEl?.getAttribute('datetime') || new Date().toISOString();

      const articleData = {
        id: articleUrl,
        title,
        date,
        description,
        imageUrl,
        articleUrl: articleUrl.startsWith('http') ? articleUrl : `https://www.xda-developers.com${articleUrl}`,
        author: 'XDA Staff' // Since author selector wasn't provided, using default
      };

      return articleData;
    }).filter(article => 
      article.title && 
      article.articleUrl !== 'https://www.xda-developers.com' && 
      article.articleUrl !== 'https://www.xda-developers.com/' &&
      !article.articleUrl.includes('#')
    );
  } catch (error) {
    console.error('Error fetching XDA articles:', error);
    return [
      {
        id: '1',
        title: 'Test Article',
        date: new Date().toISOString(),
        description: 'This is a test article to verify the component rendering',
        imageUrl: 'https://picsum.photos/800/400',
        articleUrl: 'https://www.xda-developers.com/example-article',
        author: 'Test Author'
      }
    ];
  }
};
