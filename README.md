# Daily News

A modern news aggregator application built with React, TypeScript, and Vite that fetches and displays articles from various sources.

## Features

- 📰 Aggregates news from multiple sources
- 🔍 Category-based article filtering
- 🌓 Light/Dark theme toggle
- 📱 Responsive design
- ⚡ Fast loading with Vite
- 🔄 Auto-refresh functionality
- ↑ Scroll to top button
- ⚙️ Configurable news sources

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/daily-news.git
cd daily-news
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be available in the `dist` directory.

## Project Structure

- `src/` - Source code directory
  - `components/` - React components
  - `services/` - Service classes for data fetching
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `config/` - Configuration files
  - `contexts/` - React context providers
  - `pages/` - Page components

## Configuration

News sources can be configured in `src/config/sources.json`. Each source requires:

- `name`: Source name
- `baseUrl`: URL to fetch articles from
- `category`: News category
- `selectors`: DOM selectors for article elements
- `dateFormat`: Date format used by the source (optional)
- `transformers`: URL transformation functions (optional)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://react.dev/)
- Bundled with [Vite](https://vitejs.dev/)
- Uses [TypeScript](https://www.typescriptlang.org/) for type safety
