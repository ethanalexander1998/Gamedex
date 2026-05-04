import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService, Game } from '../../services/game.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  games: Game[] = [];
  filtered: Game[] = [];
  loading = true;
  error = '';

  statusFilter = '';
  platformFilter = '';
  genreFilter = '';
  sortBy = 'newest';
  searchQuery = '';
  searchTimeout: any;

  statuses = ['Plan to Play', 'Playing', 'Completed', 'Dropped'];
  String = String;

  get platforms(): string[] {
    return [...new Set(this.games.map(g => g.platform).filter(Boolean) as string[])].sort();
  }

  get genres(): string[] {
    return [...new Set(this.games.map(g => g.genre).filter(Boolean) as string[])].sort();
  }

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.gameService.getAll(
      this.statusFilter || undefined,
      this.searchQuery.trim() || undefined,
      this.platformFilter || undefined,
      this.genreFilter || undefined
    ).subscribe({
      next: games => {
        this.games = games;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load games. Is the backend running?';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let list = [...this.games];
    if (this.sortBy === 'score') list.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    else if (this.sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    this.filtered = list;
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.load(), 300);
  }

  onFilterChange() {
    this.load();
  }

  delete(id: string) {
    if (!confirm('Delete this game?')) return;
    this.gameService.delete(id).subscribe(() => {
      this.games = this.games.filter(g => g._id !== id);
      this.applyFilters();
    });
  }

  statusClass(status: string): string {
    return status.toLowerCase().replace(/ /g, '-');
  }

  get counts() {
    return this.statuses.reduce((acc, s) => {
      acc[s] = this.games.filter(g => g.status === s).length;
      return acc;
    }, {} as Record<string, number>);
  }
}
