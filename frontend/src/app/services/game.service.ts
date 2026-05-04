import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RawgResult {
  rawgId: number;
  title: string;
  platform: string;
  genre: string;
  cover: string | null;
  released: string | null;
  rating: number | null;
}

export interface Game {
  _id?: string;
  title: string;
  platform?: string;
  genre?: string;
  status: 'Plan to Play' | 'Playing' | 'Completed' | 'Dropped';
  score?: number | null;
  notes?: string;
  cover?: string | null;
  rawgId?: number | null;
  releaseYear?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameStats {
  total: number;
  completionRate: number;
  avgScore: number | null;
  byStatus: Record<string, number>;
  byPlatform: [string, number][];
  byGenre: [string, number][];
}

export interface Recommendation {
  _id: string;
  basedOn: string;
  basedOnTitle: string;
  rawgId: number;
  title: string;
  genre?: string;
  platform?: string;
  cover?: string | null;
  reason?: string;
  dismissed: boolean;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private api = '/api/games';

  constructor(private http: HttpClient) {}

  getAll(status?: string, search?: string, platform?: string, genre?: string): Observable<Game[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
    if (platform) params = params.set('platform', platform);
    if (genre) params = params.set('genre', genre);
    return this.http.get<Game[]>(this.api, { params });
  }

  getOne(id: string): Observable<Game> {
    return this.http.get<Game>(`${this.api}/${id}`);
  }

  create(game: Game): Observable<Game> {
    return this.http.post<Game>(this.api, game);
  }

  update(id: string, game: Partial<Game>): Observable<Game> {
    return this.http.put<Game>(`${this.api}/${id}`, game);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }

  searchRawg(q: string): Observable<RawgResult[]> {
    return this.http.get<RawgResult[]>('/api/search', { params: { q } });
  }

  getRecommendations(): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>('/api/recommendations');
  }

  generateRecommendations(): Observable<Recommendation[]> {
    return this.http.post<Recommendation[]>('/api/recommendations/generate', {});
  }

  dismissRecommendation(id: string): Observable<Recommendation> {
    return this.http.put<Recommendation>(`/api/recommendations/${id}/dismiss`, {});
  }

  getStats(): Observable<GameStats> {
    return this.http.get<GameStats>('/api/stats');
  }
}
