import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FavoritesService } from './services/favorites.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, SearchBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);
  
  favoritesCount = computed(() => this.favoritesService.favoriteMovies().length);
  
  genres = ['Action', 'Drama', 'Comedy', 'Thriller'];

  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }
}
