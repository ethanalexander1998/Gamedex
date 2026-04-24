import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService, Game } from '../../services/game.service';

@Component({
  selector: 'app-game-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.scss'
})
export class GameDetailComponent implements OnInit {
  game: Game | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.gameService.getOne(id).subscribe({
      next: game => { this.game = game; this.loading = false; },
      error: () => { this.error = 'Game not found.'; this.loading = false; }
    });
  }

  delete() {
    if (!this.game?._id || !confirm('Delete this game?')) return;
    this.gameService.delete(this.game._id).subscribe(() => this.router.navigate(['/dashboard']));
  }

  statusClass(status: string): string {
    return status.toLowerCase().replace(/ /g, '-');
  }
}
