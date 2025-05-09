import { ArticleCard } from './components/ArticleCard/ArticleCard';
import { type Article } from './types/Article';
import './App.css';

function App() {
  const articles: Article[] = [
    {
      id: '1',
      title: 'Breaking: AI Revolution in Healthcare',
      date: '2024-03-20',
      description: 'New AI algorithms are transforming how doctors diagnose diseases, with accuracy rates exceeding human capabilities in several key areas.',
      imageUrl: 'https://picsum.photos/800/400?random=1',
      articleUrl: 'https://example.com/ai-healthcare',
      author: 'John Doe'
    },
    {
      id: '2',
      title: 'Space Tourism Takes Off',
      date: '2024-03-19',
      description: 'Private space companies announce plans for regular civilian flights to low Earth orbit starting next year.',
      imageUrl: 'https://picsum.photos/800/400?random=2',
      articleUrl: 'https://example.com/space-tourism',
      author: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Climate Change: Breakthrough in Green Energy',
      date: '2024-03-18',
      description: 'Scientists develop new solar panel technology that doubles current efficiency rates, promising cheaper clean energy.',
      imageUrl: 'https://picsum.photos/800/400?random=3',
      articleUrl: 'https://example.com/green-energy',
      author: 'Mike Johnson'
    },
    {
      id: '4',
      title: 'Tech Giants Announce Metaverse Coalition',
      date: '2024-03-17',
      description: 'Major technology companies join forces to develop unified standards for the emerging metaverse platform.',
      imageUrl: 'https://picsum.photos/800/400?random=4',
      articleUrl: 'https://example.com/metaverse',
      author: 'Sarah Wilson'
    },
    {
      id: '5',
      title: 'Revolutionary Electric Car Battery',
      date: '2024-03-16',
      description: 'New battery technology promises 1000-mile range and 5-minute charging time for electric vehicles.',
      imageUrl: 'https://picsum.photos/800/400?random=5',
      articleUrl: 'https://example.com/ev-battery',
      author: 'Robert Chen'
    },
    {
      id: '6',
      title: 'Global Internet Coverage Milestone',
      date: '2024-03-15',
      description: 'Satellite internet constellation achieves worldwide coverage, bringing high-speed internet to remote areas.',
      imageUrl: 'https://picsum.photos/800/400?random=6',
      articleUrl: 'https://example.com/global-internet',
      author: 'Emma Davis'
    }
  ];

  return (
    <div className="app">
      <h1 className="newspaper-header">Daily News</h1>
      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default App;
