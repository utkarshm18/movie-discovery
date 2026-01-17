import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      min-height: 200px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(229, 9, 20, 0.1);
      border-top-color: #e50914;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      margin-top: 1rem;
      color: #fff;
      font-size: 1rem;
    }
  `]
})
export class LoadingSpinnerComponent {}


