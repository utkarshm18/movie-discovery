import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.model';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="movie-list-container">
      <h2 *ngIf="title" class="section-title">{{ title }}</h2>
      <div class="movie-grid" [class.horizontal]="horizontal">
        <app-movie-card 
          *ngFor="let movie of movies" 
          [movie]="movie"
        ></app-movie-card>
      </div>
      <div *ngIf="movies.length === 0 && !loading" class="empty-state">
        <p>No movies found</p>
      </div>
    </div>
  `,
  styles: [`
    .movie-list-container {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #fff;
    }

    .movie-grid {
      display: grid;
      gap: 1rem;
    }

    .movie-grid:not(.horizontal) {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .movie-grid.horizontal {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 1rem;
      padding-bottom: 1rem;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }

    .movie-grid.horizontal app-movie-card {
      flex: 0 0 150px;
      width: 150px;
    }

    .movie-grid.horizontal::-webkit-scrollbar {
      height: 8px;
    }

    .movie-grid.horizontal::-webkit-scrollbar-track {
      background: #1a1a1a;
      border-radius: 4px;
    }

    .movie-grid.horizontal::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 4px;
    }

    .movie-grid.horizontal::-webkit-scrollbar-thumb:hover {
      background: #444;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    @media (max-width: 768px) {
      .movie-grid:not(.horizontal) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.75rem;
      }

      .movie-grid.horizontal app-movie-card {
        flex: 0 0 120px;
        width: 120px;
      }

      .section-title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];
  @Input() title: string = '';
  @Input() horizontal: boolean = false;
  @Input() loading: boolean = false;
}

