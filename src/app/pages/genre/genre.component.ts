import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieListComponent, LoadingSpinnerComponent],
  template: `
    <div class="genre-container">
      <div class="breadcrumb">
        <a routerLink="/home">Home</a>
        <span class="separator">/</span>
        <span>{{ genreName() }}</span>
      </div>

      <div class="header">
        <h1>{{ genreName() }} Movies</h1>
      </div>

      <div *ngIf="loading()" class="loading-wrapper">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="error() && !loading()" class="error-message">
        <p>{{ error() }}</p>
      </div>

      <div *ngIf="!loading() && !error()">
        <app-movie-list 
          [movies]="movies()"
          [title]="''"
          [loading]="loading()"
        ></app-movie-list>

        <div *ngIf="hasMore()" class="load-more-container">
          <button 
            (click)="loadMore()"
            [disabled]="loadingMore()"
            class="load-more-btn"
          >
            {{ loadingMore() ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .genre-container {
      padding: 2rem 0;
      min-height: calc(100vh - 80px);
    }

    .breadcrumb {
      margin-bottom: 1rem;
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

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
      text-transform: capitalize;
    }

    .loading-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      color: #e50914;
    }

    .load-more-container {
      display: flex;
      justify-content: center;
      margin-top: 3rem;
    }

    .load-more-btn {
      padding: 0.75rem 2rem;
      background: rgba(42, 42, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .load-more-btn:hover:not(:disabled) {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
    }

    .load-more-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .genre-container {
        padding: 1rem 0;
      }

      .header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class GenreComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  
  genreName = signal('');
  movies = signal<Movie[]>([]);
  loading = signal(true);
  loadingMore = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalResults = signal(0);

  ngOnInit(): void {
    const genre = this.route.snapshot.paramMap.get('genreName');
    if (genre) {
      this.genreName.set(genre);
      this.loadMovies(genre, 1);
    } else {
      this.error.set('Invalid genre');
      this.loading.set(false);
    }
  }

  private loadMovies(genre: string, page: number, append: boolean = false): void {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
    }
    
    this.error.set(null);

    this.movieService.searchByGenre(genre.toLowerCase(), page).subscribe({
      next: (response) => {
        const newMovies = response.Search || [];
        if (append) {
          this.movies.update(movies => [...movies, ...newMovies]);
        } else {
          this.movies.set(newMovies);
        }
        this.totalResults.set(parseInt(response.totalResults || '0', 10));
        this.currentPage.set(page);
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load movies');
        this.loading.set(false);
        this.loadingMore.set(false);
      }
    });
  }

  hasMore(): boolean {
    return this.movies().length < this.totalResults();
  }

  loadMore(): void {
    const genre = this.genreName();
    const nextPage = this.currentPage() + 1;
    this.loadMovies(genre, nextPage, true);
  }
}


