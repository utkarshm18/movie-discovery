# Movie Discovery Application

A modern, responsive Angular application for discovering movies using the OMDb API. Built with Angular 18, featuring standalone components, signals for state management, and a Netflix-inspired UI.

## Features

### Core Features
- 🏠 **Home Page** - Browse movies by categories (Action, Drama, Comedy, Thriller) with horizontal scrolling
- 🔍 **Search** - Real-time movie search with debouncing, pagination, and recent searches
- 🎬 **Movie Details** - Comprehensive movie information including plot, ratings, cast, and more
- ⭐ **Favorites** - Save your favorite movies locally with localStorage persistence
- 🎭 **Genre Browsing** - Filter movies by genre with load-more functionality
- 📱 **Fully Responsive** - Mobile-first design that works on all devices

### Technical Features
- ✅ Standalone Angular components
- ✅ Reactive forms with RxJS operators (debounceTime, distinctUntilChanged, switchMap)
- ✅ Angular Signals for state management
- ✅ Custom pipes (Runtime formatter, Rating formatter)
- ✅ Custom directives (Lazy image loading)
- ✅ HTTP Interceptor for API requests
- ✅ Request caching to minimize API calls
- ✅ Error handling and loading states
- ✅ SCSS styling with CSS variables
- ✅ Modern UI inspired by Netflix/Disney+

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- OMDb API Key (free at [omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-discovery
```

2. Install dependencies:
```bash
npm install
```

3. Configure your OMDb API key:
   - Get your free API key from [OMDb API](http://www.omdbapi.com/apikey.aspx)
   - Open `src/environments/environment.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```typescript
   export const environment = {
     production: false,
     omdbApiKey: 'your-actual-api-key-here',
     omdbApiUrl: 'https://www.omdbapi.com/'
   };
   ```

## Development

Run the development server:
```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

## Build

Build the project for production:
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── loading-spinner/
│   │   ├── movie-card/
│   │   ├── movie-list/
│   │   └── search-bar/
│   ├── directives/          # Custom directives
│   │   └── lazy-load.directive.ts
│   ├── interceptors/        # HTTP interceptors
│   │   └── api.interceptor.ts
│   ├── models/              # TypeScript interfaces
│   │   └── movie.model.ts
│   ├── pages/               # Page components
│   │   ├── favorites/
│   │   ├── genre/
│   │   ├── home/
│   │   ├── movie-details/
│   │   └── search/
│   ├── pipes/               # Custom pipes
│   │   ├── rating.pipe.ts
│   │   └── runtime.pipe.ts
│   ├── services/            # Services
│   │   ├── favorites.service.ts
│   │   └── movie.service.ts
│   ├── app.component.*      # Root component
│   ├── app.config.ts        # App configuration
│   └── app.routes.ts        # Route definitions
├── environments/            # Environment configuration
└── styles.scss              # Global styles
```

## Key Components

### MovieCardComponent
Reusable card component for displaying movie posters with hover effects and favorite toggle.

### MovieListComponent
Flexible list component that supports both grid and horizontal scrolling layouts.

### SearchBarComponent
Search input with debouncing, recent searches, and real-time suggestions.

### LoadingSpinnerComponent
Animated loading indicator for async operations.

## Services

### MovieService
Handles all OMDb API interactions including:
- Movie search
- Movie details by ID or title
- Genre-based search
- Request caching

### FavoritesService
Manages favorite movies with:
- localStorage persistence
- Angular Signals for reactive state
- Add/remove/toggle functionality

## Custom Pipes & Directives

### RuntimePipe
Converts runtime from "120 min" to "2h 0m" format.

### RatingPipe
Formats IMDb ratings as "X/10".

### LazyLoadDirective
Implements lazy loading for images using Intersection Observer API.

## Routes

- `/home` - Home page with movie categories
- `/movie/:imdbId` - Movie details page
- `/search` - Search page with results and pagination
- `/favorites` - User's favorite movies
- `/genre/:genreName` - Genre-specific movie listings

## Deployment

The application can be deployed to various platforms:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder to Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## API Usage

This application uses the OMDb API:
- **Base URL**: `https://www.omdbapi.com/`
- **Documentation**: [omdbapi.com](http://www.omdbapi.com/)
- **API Key**: Required (free tier available)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- **Angular 18** - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **SCSS** - Styling
- **OMDb API** - Movie data source

## License

This project is open source and available under the MIT License.

## Acknowledgments

- OMDb API for providing movie data
- Angular team for the excellent framework
- Netflix/Disney+ for UI design inspiration

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

Made with ❤️ using Angular
