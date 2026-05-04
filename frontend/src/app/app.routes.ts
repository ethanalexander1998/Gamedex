import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GameDetailComponent } from './components/game-detail/game-detail.component';
import { GameFormComponent } from './components/game-form/game-form.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { StatsComponent } from './components/stats/stats.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'games/new', component: GameFormComponent },
  { path: 'games/:id', component: GameDetailComponent },
  { path: 'games/:id/edit', component: GameFormComponent },
  { path: 'recommendations', component: RecommendationsComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: 'dashboard' }
];
