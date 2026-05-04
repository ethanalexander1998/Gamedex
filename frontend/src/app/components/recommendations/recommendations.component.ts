import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, Game, Recommendation } from '../../services/game.service';

@Component({
  selector: 'app-recommendations',
  imports: [CommonModule],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss'
})
export class RecommendationsComponent implements OnInit {
  recommendations: Recommendation[] = [];
  loading = true;
  generating = false;
  adding: Set<string> = new Set();
  added: Set<string> = new Set();
  error = '';

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.getRecommendations().subscribe({
      next: recs => {
        this.recommendations = recs;
        this.loading = false;
        if (recs.length === 0) this.generate();
      },
      error: () => { this.error = 'Failed to load recommendations.'; this.loading = false; }
    });
  }

  generate() {
    this.generating = true;
    this.error = '';
    this.gameService.generateRecommendations().subscribe({
      next: recs => {
        const newIds = new Set(recs.map(r => r._id));
        this.recommendations = [
          ...recs,
          ...this.recommendations.filter(r => !newIds.has(r._id))
        ];
        this.generating = false;
      },
      error: err => {
        this.error = err.error?.error ?? 'Failed to generate recommendations.';
        this.generating = false;
      }
    });
  }

  addToLibrary(rec: Recommendation) {
    this.adding.add(rec._id);
    const game: Game = {
      title: rec.title,
      genre: rec.genre,
      platform: rec.platform,
      cover: rec.cover,
      rawgId: rec.rawgId,
      status: 'Plan to Play'
    };
    this.gameService.create(game).subscribe({
      next: () => { this.adding.delete(rec._id); this.added.add(rec._id); },
      error: () => { this.adding.delete(rec._id); this.error = `Failed to add ${rec.title}.`; }
    });
  }

  dismiss(id: string) {
    this.gameService.dismissRecommendation(id).subscribe(() => {
      this.recommendations = this.recommendations.filter(r => r._id !== id);
    });
  }
}
