import { Component, EventEmitter, Output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text"
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
          (keyup.enter)="performSearch()"
          placeholder="Search for movies..."
          class="search-input"
          [attr.aria-label]="'Search movies'"
        />
        <button 
          *ngIf="searchTerm()"
          (click)="clearSearch()"
          class="clear-btn"
          aria-label="Clear search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div *ngIf="recentSearches().length > 0" class="recent-searches">
        <p class="recent-title">Recent Searches:</p>
        <div class="recent-tags">
          <button 
            *ngFor="let term of recentSearches()" 
            (click)="selectRecent(term)"
            class="recent-tag"
          >
            {{ term }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      color: #999;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      background: rgba(42, 42, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #fff;
      font-size: 1rem;
      transition: border-color 0.3s ease, background 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #e50914;
      background: rgba(42, 42, 42, 1);
    }

    .search-input::placeholder {
      color: #999;
    }

    .clear-btn {
      position: absolute;
      right: 0.5rem;
      background: transparent;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.3s ease;
    }

    .clear-btn:hover {
      color: #fff;
    }

    .recent-searches {
      margin-top: 1rem;
      padding: 0.5rem 0;
    }

    .recent-title {
      font-size: 0.85rem;
      color: #999;
      margin-bottom: 0.5rem;
    }

    .recent-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .recent-tag {
      padding: 0.25rem 0.75rem;
      background: rgba(42, 42, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      color: #fff;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    .recent-tag:hover {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
    }

    @media (max-width: 768px) {
      .search-input {
        font-size: 0.9rem;
        padding: 0.65rem 0.85rem 0.65rem 2.5rem;
      }

      .search-icon {
        left: 0.75rem;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  private router = inject(Router);
  searchTerm = signal('');
  recentSearches = signal<string[]>(this.loadRecentSearches());

  constructor() {
    effect(() => {
      if (this.searchTerm()) {
        this.saveRecentSearch(this.searchTerm());
      }
    });
  }

  private loadRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem('recent_searches');
      return stored ? JSON.parse(stored).slice(0, 5) : [];
    } catch {
      return [];
    }
  }

  private saveRecentSearch(term: string): void {
    if (!term.trim()) return;
    
    const recent = this.recentSearches();
    const filtered = recent.filter(s => s.toLowerCase() !== term.toLowerCase());
    const updated = [term, ...filtered].slice(0, 5);
    this.recentSearches.set(updated);
    
    try {
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }

  onSearch(): void {
    // Real-time search can be handled here if needed
  }

  performSearch(): void {
    const term = this.searchTerm().trim();
    if (term) {
      this.search.emit(term);
      this.router.navigate(['/search'], { queryParams: { q: term } });
    }
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.search.emit('');
  }

  selectRecent(term: string): void {
    this.searchTerm.set(term);
    this.performSearch();
  }
}

