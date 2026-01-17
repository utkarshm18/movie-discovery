import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { FavoritesService } from '../../services/favorites.service';
import { LazyLoadDirective } from '../../directives/lazy-load.directive';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LazyLoadDirective],
  template: `
    <div class="movie-card" (mouseenter)="hovered.set(true)" (mouseleave)="hovered.set(false)">
      <div class="poster-container">
        <img 
          [src]="fallbackPoster" 
          [attr.data-src]="movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster"
          [alt]="movie.Title"
          appLazyLoad
          class="poster"
          [class.hovered]="hovered()"
          loading="lazy"
        />
        <div class="overlay" [class.visible]="hovered()">
          <button 
            class="favorite-btn" 
            (click)="toggleFavorite($event)"
            [class.active]="isFavorite()"
            [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                [attr.fill]="isFavorite() ? '#e50914' : 'none'"
                stroke="#fff"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </div>
      <a [routerLink]="['/movie', movie.imdbID]" class="movie-info">
        <h3 class="title">{{ movie.Title }}</h3>
        <p class="year">{{ movie.Year }}</p>
      </a>
    </div>
  `,
  styles: [`
    .movie-card {
      cursor: pointer;
      transition: transform 0.3s ease;
      width: 100%;
    }

    .poster-container {
      position: relative;
      width: 100%;
      padding-bottom: 150%;
      overflow: hidden;
      border-radius: 4px;
      background: #1a1a1a;
    }

    .poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .poster.hovered {
      transform: scale(1.05);
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 10px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .overlay.visible {
      opacity: 1;
      pointer-events: all;
    }

    .favorite-btn {
      background: rgba(42, 42, 42, 0.8);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .favorite-btn:hover {
      background: rgba(229, 9, 20, 0.8);
    }

    .favorite-btn.active {
      background: rgba(229, 9, 20, 0.9);
    }

    .movie-info {
      text-decoration: none;
      color: inherit;
      margin-top: 0.5rem;
      display: block;
    }

    .title {
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .year {
      font-size: 0.8rem;
      color: #999;
      margin: 0;
    }

    @media (max-width: 768px) {
      .title {
        font-size: 0.85rem;
      }
    }
  `]
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  private favoritesService = inject(FavoritesService);
  hovered = signal(false);
  fallbackPoster = 'https://via.placeholder.com/300x450?text=No+Image';

  isFavorite = computed(() => 
    this.favoritesService.isFavorite(this.movie.imdbID)
  );

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.movie);
  }
}


