import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Movie } from '../../models/movie.model';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MovieListComponent,
    LoadingSpinnerComponent,
    SearchBarComponent
  ],
  template: `
    <div class="search-page-container">
      <div class="search-header">
        <app-search-bar (search)="onSearch($event)"></app-search-bar>
      </div>

      <div *ngIf="loading()" class="loading-wrapper">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="error() && !loading()" class="error-message">
        <p>{{ error() }}</p>
      </div>

      <div *ngIf="!loading() && !error() && movies().length > 0" class="results">
        <div class="results-header">
          <h2>Search Results</h2>
          <p class="results-count">{{ totalResults() }} results found</p>
        </div>

        <app-movie-list [movies]="movies()"></app-movie-list>

        <div *ngIf="totalPages() > 1" class="pagination">
          <button 
            (click)="goToPage(currentPage() - 1)"
            [disabled]="currentPage() === 1"
            class="page-btn"
          >
            Previous
          </button>
          
          <div class="page-info">
            Page {{ currentPage() }} of {{ totalPages() }}
          </div>
          
          <button 
            (click)="goToPage(currentPage() + 1)"
            [disabled]="currentPage() >= totalPages()"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>

      <div *ngIf="!loading() && !error() && movies().length === 0 && searchQuery()" class="no-results">
        <h2>No results found</h2>
        <p>Try searching for a different movie title.</p>
      </div>

      <div *ngIf="!searchQuery()" class="empty-state">
        <h2>Search for Movies</h2>
        <p>Enter a movie title in the search bar above to get started.</p>
      </div>
    </div>
  `,
  styles: [`
    .search-page-container {
      padding: 2rem 0;
      min-height: calc(100vh - 80px);
    }

    .search-header {
      margin-bottom: 2rem;
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

    .results-header {
      margin-bottom: 1.5rem;
    }

    .results-header h2 {
      font-size: 1.5rem;
      color: #fff;
      margin: 0 0 0.5rem 0;
    }

    .results-count {
      color: #999;
      font-size: 0.9rem;
      margin: 0;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 3rem;
    }

    .page-btn {
      padding: 0.75rem 1.5rem;
      background: rgba(42, 42, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-btn:hover:not(:disabled) {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #999;
      font-size: 0.9rem;
    }

    .no-results,
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .no-results h2,
    .empty-state h2 {
      font-size: 1.5rem;
      color: #fff;
      margin-bottom: 1rem;
    }

    .no-results p,
    .empty-state p {
      color: #999;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .search-page-container {
        padding: 1rem 0;
      }

      .pagination {
        flex-direction: column;
        gap: 0.75rem;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  
  private searchSubject = new Subject<string>();
  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal('');
  currentPage = signal(1);
  totalResults = signal(0);
  
  totalPages = computed(() => Math.ceil(this.totalResults() / 10));

  ngOnInit(): void {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
      if (!query.trim()) {
        this.movies.set([]);
        this.totalResults.set(0);
        this.loading.set(false);
        return of({ Search: [], totalResults: '0', Response: 'True' });
      }
        
        this.loading.set(true);
        this.error.set(null);
        return this.movieService.searchMovies(query, this.currentPage());
      })
    ).subscribe({
      next: (response) => {
        this.movies.set(response.Search || []);
        this.totalResults.set(parseInt(response.totalResults || '0', 10));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to search movies');
        this.movies.set([]);
        this.totalResults.set(0);
        this.loading.set(false);
      }
    });

    // Check for query params
    this.route.queryParams.subscribe(params => {
      const query = params['q'] || '';
      if (query) {
        this.searchQuery.set(query);
        this.currentPage.set(parseInt(params['page'] || '1', 10));
        this.performSearch(query);
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.router.navigate(['/search'], { 
      queryParams: { q: query, page: 1 },
      replaceUrl: true
    });
    this.performSearch(query);
  }

  private performSearch(query: string): void {
    if (query.trim()) {
      this.searchSubject.next(query);
    } else {
      this.movies.set([]);
      this.totalResults.set(0);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      const query = this.searchQuery();
      this.router.navigate(['/search'], { 
        queryParams: { q: query, page },
        replaceUrl: false
      });
      this.performSearch(query);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

