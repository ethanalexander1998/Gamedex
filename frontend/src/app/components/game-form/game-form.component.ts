import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GameService, Game, RawgResult } from '../../services/game.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-game-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.scss'
})
export class GameFormComponent implements OnInit {
  isEdit = false;
  gameId = '';
  loading = false;
  submitting = false;
  error = '';

  statuses: Game['status'][] = ['Plan to Play', 'Playing', 'Completed', 'Dropped'];

  form: Game = {
    title: '',
    platform: '',
    genre: '',
    status: 'Plan to Play',
    score: null,
    notes: '',
    releaseYear: null
  };

  // search
  searchQuery = '';
  searchResults: RawgResult[] = [];
  searching = false;
  showResults = false;
  selectedCover: string | null = null;

  private search$ = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.gameId;

    if (this.isEdit) {
      this.loading = true;
      this.gameService.getOne(this.gameId).subscribe({
        next: game => { this.form = { ...game }; this.loading = false; },
        error: () => { this.error = 'Could not load game.'; this.loading = false; }
      });
    }

    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q.trim()) { this.searchResults = []; this.showResults = false; return []; }
        this.searching = true;
        return this.gameService.searchRawg(q);
      })
    ).subscribe({
      next: results => {
        this.searchResults = results;
        this.showResults = results.length > 0;
        this.searching = false;
      },
      error: () => { this.searching = false; }
    });
  }

  onSearchInput() {
    this.search$.next(this.searchQuery);
  }

  pickResult(r: RawgResult) {
    this.form.title = r.title;
    this.form.platform = r.platform;
    this.form.genre = r.genre;
    this.form.cover = r.cover;
    this.form.rawgId = r.rawgId;
    this.form.releaseYear = r.released ? parseInt(r.released.split('-')[0], 10) : null;
    this.selectedCover = r.cover;
    this.searchQuery = '';
    this.searchResults = [];
    this.showResults = false;
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.showResults = false;
  }

  submit() {
    if (!this.form.title.trim()) { this.error = 'Title is required.'; return; }

    const scoreNum = this.form.score != null ? Number(this.form.score) : null;
    if (scoreNum !== null && (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10)) {
      this.error = 'Score must be between 0 and 10.';
      return;
    }

    this.error = '';
    this.submitting = true;
    const payload = { ...this.form, score: scoreNum };

    const req = this.isEdit
      ? this.gameService.update(this.gameId, payload)
      : this.gameService.create(payload);

    req.subscribe({
      next: game => this.router.navigate(['/games', game._id]),
      error: err => {
        this.error = err.error?.error ?? 'Save failed.';
        this.submitting = false;
      }
    });
  }

  get requiresScore(): boolean {
    return this.form.status === 'Completed';
  }
}
