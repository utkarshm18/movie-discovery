import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieListComponent],
  template: `
    <div class="favorites-container">
      <div class="header">
        <h1>My Favorites</h1>
        <p *ngIf="favorites().length > 0" class="count">{{ favorites().length }} movie(s)</p>
      </div>

      <div *ngIf="favorites().length === 0" class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <h2>No favorites yet</h2>
        <p>Start adding movies to your favorites to see them here.</p>
        <a routerLink="/home" class="browse-btn">Browse Movies</a>
      </div>

      <app-movie-list 
        *ngIf="favorites().length > 0"
        [movies]="favoriteMovies()"
        title=""
      ></app-movie-list>
    </div>
  `,
  styles: [`
    .favorites-container {
      padding: 2rem 0;
      min-height: calc(100vh - 80px);
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 0.5rem 0;
    }

    .count {
      color: #999;
      font-size: 0.9rem;
      margin: 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
      min-height: 400px;
    }

    .empty-icon {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .empty-state h2 {
      font-size: 1.5rem;
      color: #fff;
      margin: 0 0 0.75rem 0;
    }

    .empty-state p {
      color: #999;
      font-size: 1rem;
      margin: 0 0 2rem 0;
    }

    .browse-btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #e50914;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 1rem;
      transition: background 0.3s ease;
    }

    .browse-btn:hover {
      background: #f40612;
    }

    @media (max-width: 768px) {
      .favorites-container {
        padding: 1rem 0;
      }

      .header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  favorites = this.favoritesService.favoriteMovies;
  
  favoriteMovies = computed(() => 
    this.favorites().map(fav => ({
      Title: fav.Title,
      Year: fav.Year,
      imdbID: fav.imdbID,
      Type: 'movie',
      Poster: fav.Poster
    } as Movie))
  );
}


