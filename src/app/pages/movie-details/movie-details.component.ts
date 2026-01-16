import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { FavoritesService } from '../../services/favorites.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { MovieDetails } from '../../models/movie.model';
import { RuntimePipe } from '../../pipes/runtime.pipe';
import { RatingPipe } from '../../pipes/rating.pipe';
import { LazyLoadDirective } from '../../directives/lazy-load.directive';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    RuntimePipe,
    RatingPipe,
    LazyLoadDirective
  ],
  template: `
    <div class="movie-details-container">
      <div *ngIf="loading()" class="loading-wrapper">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="error()" class="error-container">
        <h2>Movie Not Found</h2>
        <p>{{ error() }}</p>
        <a routerLink="/home" class="back-btn">Back to Home</a>
      </div>

      <div *ngIf="movie() && !loading()" class="movie-details">
        <div class="breadcrumb">
          <a routerLink="/home">Home</a>
          <span class="separator">/</span>
          <span>Movie Details</span>
        </div>

        <div class="hero-section">
          <div class="poster-wrapper">
            <img 
              [src]="fallbackPoster"
              [data-src]="movie()!.Poster !== 'N/A' ? movie()!.Poster : fallbackPoster"
              [alt]="movie()!.Title"
              appLazyLoad
              class="poster-image"
            />
          </div>

          <div class="details-content">
            <h1 class="title">{{ movie()!.Title }}</h1>
            
            <div class="meta-info">
              <span class="year">{{ movie()!.Year }}</span>
              <span class="separator">•</span>
              <span class="rated">{{ movie()!.Rated }}</span>
              <span class="separator">•</span>
              <span class="runtime">{{ movie()!.Runtime | runtime }}</span>
              <span class="separator">•</span>
              <span class="rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#e50914">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ movie()!.imdbRating | rating }}
              </span>
            </div>

            <div class="action-buttons">
              <button 
                (click)="toggleFavorite()"
                [class.active]="isFavorite()"
                class="favorite-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path 
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                    [attr.fill]="isFavorite() ? 'currentColor' : 'none'"
                  />
                </svg>
                {{ isFavorite() ? 'Remove from Favorites' : 'Add to Favorites' }}
              </button>
            </div>

            <div class="plot">
              <h3>Plot</h3>
              <p>{{ movie()!.Plot }}</p>
            </div>

            <div class="info-grid">
              <div class="info-item" *ngIf="movie()!.Genre !== 'N/A'">
                <span class="label">Genre:</span>
                <span class="value">{{ movie()!.Genre }}</span>
              </div>
              
              <div class="info-item" *ngIf="movie()!.Director !== 'N/A'">
                <span class="label">Director:</span>
                <span class="value">{{ movie()!.Director }}</span>
              </div>
              
              <div class="info-item" *ngIf="movie()!.Writer !== 'N/A'">
                <span class="label">Writer:</span>
                <span class="value">{{ movie()!.Writer }}</span>
              </div>
              
              <div class="info-item" *ngIf="movie()!.Actors !== 'N/A'">
                <span class="label">Actors:</span>
                <span class="value">{{ movie()!.Actors }}</span>
              </div>
              
              <div class="info-item" *ngIf="movie()!.Released !== 'N/A'">
                <span class="label">Released:</span>
                <span class="value">{{ movie()!.Released }}</span>
              </div>
              
              <div class="info-item" *ngIf="movie()!.Language !== 'N/A'">
                <span class="label">Language:</span>
                <span class="value">{{ movie()!.Language }}</span>
              </div>
              
              <div class="info-item" *ngIf="movie()!.Country !== 'N/A'">
                <span class="label">Country:</span>
                <span class="value">{{ movie()!.Country }}</span>
              </div>
              
              <div class="info-item" *ngIf="movie()!.BoxOffice && movie()!.BoxOffice !== 'N/A'">
                <span class="label">Box Office:</span>
                <span class="value">{{ movie()!.BoxOffice }}</span>
              </div>
            </div>

            <div *ngIf="movie()!.Awards && movie()!.Awards !== 'N/A'" class="awards">
              <h3>Awards</h3>
              <p>{{ movie()!.Awards }}</p>
            </div>

            <div *ngIf="movie()!.Ratings && movie()!.Ratings.length > 0" class="ratings">
              <h3>Ratings</h3>
              <div class="ratings-list">
                <div *ngFor="let rating of movie()!.Ratings" class="rating-item">
                  <span class="source">{{ rating.Source }}:</span>
                  <span class="rating-value">{{ rating.Value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-details-container {
      min-height: calc(100vh - 80px);
      padding: 2rem 0;
    }

    .loading-wrapper,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
    }

    .error-container h2 {
      color: #e50914;
      margin-bottom: 1rem;
    }

    .error-container p {
      color: #999;
      margin-bottom: 2rem;
    }

    .back-btn {
      padding: 0.75rem 1.5rem;
      background: #e50914;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s ease;
    }

    .back-btn:hover {
      background: #f40612;
    }

    .breadcrumb {
      margin-bottom: 2rem;
      color: #999;
      font-size: 0.9rem;
    }

    .breadcrumb a {
      color: #e50914;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .separator {
      margin: 0 0.5rem;
    }

    .hero-section {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .poster-wrapper {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .poster-image {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    }

    .details-content {
      color: #fff;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      color: #fff;
    }

    .meta-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      color: #999;
      font-size: 0.95rem;
    }

    .meta-info .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #fff;
    }

    .action-buttons {
      margin-bottom: 2rem;
    }

    .favorite-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(42, 42, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .favorite-btn:hover {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
    }

    .favorite-btn.active {
      background: #e50914;
      border-color: #e50914;
    }

    .plot {
      margin-bottom: 2rem;
    }

    .plot h3,
    .awards h3,
    .ratings h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: #fff;
    }

    .plot p {
      line-height: 1.6;
      color: #ccc;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item .label {
      font-size: 0.85rem;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item .value {
      color: #fff;
      font-size: 0.95rem;
    }

    .awards {
      margin-bottom: 2rem;
    }

    .awards p {
      color: #ccc;
      line-height: 1.6;
    }

    .ratings-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .rating-item {
      display: flex;
      gap: 0.5rem;
    }

    .rating-item .source {
      color: #999;
      font-weight: 600;
      min-width: 100px;
    }

    .rating-item .rating-value {
      color: #fff;
    }

    @media (max-width: 1024px) {
      .hero-section {
        grid-template-columns: 250px 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .movie-details-container {
        padding: 1rem 0;
      }

      .hero-section {
        grid-template-columns: 1fr;
      }

      .poster-wrapper {
        position: static;
        max-width: 250px;
        margin: 0 auto 1.5rem;
      }

      .title {
        font-size: 1.75rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private favoritesService = inject(FavoritesService);
  
  movie = signal<MovieDetails | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  fallbackPoster = 'https://via.placeholder.com/300x450?text=No+Image';

  ngOnInit(): void {
    const imdbId = this.route.snapshot.paramMap.get('imdbId');
    if (imdbId) {
      this.loadMovie(imdbId);
    } else {
      this.error.set('Invalid movie ID');
      this.loading.set(false);
    }
  }

  private loadMovie(imdbId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.movieService.getMovieById(imdbId).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load movie details');
        this.loading.set(false);
      }
    });
  }

  isFavorite(): boolean {
    const movie = this.movie();
    return movie ? this.favoritesService.isFavorite(movie.imdbID) : false;
  }

  toggleFavorite(): void {
    const movie = this.movie();
    if (movie) {
      this.favoritesService.toggleFavorite({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster
      });
    }
  }
}

