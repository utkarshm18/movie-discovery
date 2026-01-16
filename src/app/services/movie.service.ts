import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie, MovieDetails, SearchResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiKey = environment.omdbApiKey;
  private apiUrl = environment.omdbApiUrl;
  private cache = new Map<string, Observable<any>>();

  searchMovies(searchTerm: string, page: number = 1, type: string = 'movie'): Observable<SearchResponse> {
    const cacheKey = `search_${searchTerm}_${page}_${type}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('s', searchTerm)
      .set('page', page.toString())
      .set('type', type);

    const request = this.http.get<SearchResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        if (response.Response === 'False') {
          throw new Error(response.Error || 'Movie not found!');
        }
        return response;
      }),
      catchError(error => {
        console.error('Search error:', error);
        throw error;
      }),
      shareReplay(1)
    );

    this.cache.set(cacheKey, request);
    return request;
  }

  getMovieById(imdbId: string): Observable<MovieDetails> {
    const cacheKey = `movie_${imdbId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('i', imdbId)
      .set('plot', 'full');

    const request = this.http.get<MovieDetails>(this.apiUrl, { params }).pipe(
      map(response => {
        if (response.Response === 'False') {
          throw new Error(response.Error || 'Movie not found!');
        }
        return response;
      }),
      catchError(error => {
        console.error('Movie details error:', error);
        throw error;
      }),
      shareReplay(1)
    );

    this.cache.set(cacheKey, request);
    return request;
  }

  getMovieByTitle(title: string, year?: string): Observable<MovieDetails> {
    const cacheKey = `movie_title_${title}_${year || ''}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('t', title)
      .set('plot', 'full');

    if (year) {
      params = params.set('y', year);
    }

    const request = this.http.get<MovieDetails>(this.apiUrl, { params }).pipe(
      map(response => {
        if (response.Response === 'False') {
          throw new Error(response.Error || 'Movie not found!');
        }
        return response;
      }),
      catchError(error => {
        console.error('Movie details error:', error);
        throw error;
      }),
      shareReplay(1)
    );

    this.cache.set(cacheKey, request);
    return request;
  }

  searchByGenre(genre: string, page: number = 1): Observable<SearchResponse> {
    return this.searchMovies(genre, page, 'movie');
  }
}

