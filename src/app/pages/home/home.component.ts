import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieListComponent, LoadingSpinnerComponent],
  template: `
    <div class="home-container">
      <section *ngFor="let category of categories" class="category-section">
        <app-movie-list
          [movies]="categoryMovies(category)"
          [title]="category"
          [horizontal]="true"
          [loading]="loadingCategories().includes(category)"
        ></app-movie-list>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem 0;
    }

    .category-section {
      margin-bottom: 3rem;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 1rem 0;
      }

      .category-section {
        margin-bottom: 2rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);
  categories = ['Action', 'Drama', 'Comedy', 'Thriller'];
  categoryData = signal<Record<string, Movie[]>>({});
  loadingCategories = signal<string[]>([]);

  categoryMovies = (category: string): Movie[] => {
    return this.categoryData()[category] || [];
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categories.forEach(category => {
      this.loadingCategories.update(cats => [...cats, category]);
      
      this.movieService.searchByGenre(category.toLowerCase(), 1).subscribe({
        next: (response) => {
          const movies = response.Search || [];
          this.categoryData.update(data => ({
            ...data,
            [category]: movies.slice(0, 10)
          }));
          this.loadingCategories.update(cats => cats.filter(c => c !== category));
        },
        error: (error) => {
          console.error(`Error loading ${category}:`, error);
          this.loadingCategories.update(cats => cats.filter(c => c !== category));
        }
      });
    });
  }
}


