# Daily News

A modern news aggregator application built with React 19, TypeScript, and Vite that fetches and displays articles from various sources in real-time.

## Features

- 📰 Aggregates news from multiple sources
- 🔍 Category-based article filtering
- 📱 Responsive design
- ⚡ Fast loading with Vite
- 🔄 Auto-refresh functionality
- ↑ Scroll to top button
- ⚙️ Configurable news sources
- 🎨 Modern and clean UI
- 📋 Article cards with rich previews

## Prerequisites

- Node.js (version 18 or higher)
- npm (version 9 or higher) or yarn

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

To preview the production build locally:
```bash
npm run preview
```

## Project Structure

- `src/` - Source code directory
  - `components/` - Reusable React components
    - `ArticleCard/` - Article display component
    - `CategoryFilter/` - Category filtering component
    - `ConfigModal/` - Configuration modal
    - `ProgressBar/` - Loading progress indicator
    - `ScrollToTopArrow/` - Scroll to top functionality
    - `SourceToggle/` - News source toggle
    - `ThemeToggle/` - Light/dark theme switcher
  - `services/` - Service classes for data fetching
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `config/` - Configuration files
  - `contexts/` - React context providers
  - `pages/` - Page components
  - `assets/` - Static assets

## Configuration

News sources can be configured in `src/config/sources.json`. Each source requires:

- `name`: Source name
- `baseUrl`: URL to fetch articles from
- `category`: News category
- `selectors`: DOM selectors for article elements
- `dateFormat`: Date format used by the source (optional)
- `transformers`: URL transformation functions (optional)

## Tech Stack

- React 19.1.0
- TypeScript 5.8
- Vite 6.3
- Day.js for date handling
- ESLint 9 for code quality
- GitHub Pages for deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://react.dev/) (v19)
- Bundled with [Vite](https://vitejs.dev/) (v6)
- Uses [TypeScript](https://www.typescriptlang.org/) (v5.8) for type safety
- Styled with CSS modules for component-scoped styling
