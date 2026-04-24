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
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private api = '/api/games';

  constructor(private http: HttpClient) {}

  getAll(status?: string, search?: string): Observable<Game[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);
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
}
