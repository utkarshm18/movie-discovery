import { Injectable, signal, computed } from '@angular/core';
import { FavoriteMovie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'movie_favorites';
  private favorites = signal<FavoriteMovie[]>(this.loadFromStorage());

  favoriteMovies = computed(() => this.favorites());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): FavoriteMovie[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
      return [];
    }
  }

  private saveToStorage(favorites: FavoriteMovie[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  }

  addFavorite(movie: { imdbID: string; Title: string; Year: string; Poster: string }): void {
    const current = this.favorites();
    if (!this.isFavorite(movie.imdbID)) {
      const favorite: FavoriteMovie = {
        ...movie,
        addedAt: Date.now()
      };
      const updated = [...current, favorite];
      this.favorites.set(updated);
      this.saveToStorage(updated);
    }
  }

  removeFavorite(imdbID: string): void {
    const current = this.favorites();
    const updated = current.filter(fav => fav.imdbID !== imdbID);
    this.favorites.set(updated);
    this.saveToStorage(updated);
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites().some(fav => fav.imdbID === imdbID);
  }

  toggleFavorite(movie: { imdbID: string; Title: string; Year: string; Poster: string }): void {
    if (this.isFavorite(movie.imdbID)) {
      this.removeFavorite(movie.imdbID);
    } else {
      this.addFavorite(movie);
    }
  }
}

