import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'movie/:imdbId',
    loadComponent: () => import('./pages/movie-details/movie-details.component').then(m => m.MovieDetailsComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'genre/:genreName',
    loadComponent: () => import('./pages/genre/genre.component').then(m => m.GenreComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
