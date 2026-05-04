import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService, GameStats } from '../../services/game.service';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, RouterLink],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  stats: GameStats | null = null;
  loading = true;
  error = '';

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getStats().subscribe({
      next: stats => { this.stats = stats; this.loading = false; },
      error: () => { this.error = 'Failed to load stats. Is the backend running?'; this.loading = false; }
    });
  }

  barWidth(count: number, max: number): string {
    return `${Math.max(4, Math.round((count / max) * 100))}%`;
  }

  maxOf(entries: [string, number][]): number {
    return entries.length > 0 ? entries[0][1] : 1;
  }

  statusClass(status: string): string {
    return status.toLowerCase().replace(/ /g, '-');
  }
}
