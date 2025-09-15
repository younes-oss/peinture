import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PeinturesComponent } from './pages/peintures/peintures.component';
import { ArtistesComponent } from './pages/artistes/artistes.component';
import { PanierComponent } from './pages/panier/panier.component';
import { CommandesComponent } from './pages/commandes/commandes.component';
import { canActivateArtist } from './guards/artist.guard';
import { canAccessRoute } from './guards/artist-access.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [canAccessRoute] },
  { path: 'peintures', component: PeinturesComponent, canActivate: [canAccessRoute] },
  { path: 'artistes', component: ArtistesComponent, canActivate: [canAccessRoute] },
  { path: 'panier', component: PanierComponent, canActivate: [canAccessRoute] },
  { path: 'commandes', component: CommandesComponent, canActivate: [canAccessRoute] },
  {
    path: 'dashboard/artiste',
    canActivate: [canActivateArtist, canAccessRoute],
    loadComponent: () => import('./pages/dashboard-artiste/dashboard-artiste.component').then(m => m.DashboardArtisteComponent)
  },
  {
    path: 'dashboard/artiste/nouveau',
    canActivate: [canActivateArtist, canAccessRoute],
    loadComponent: () => import('./pages/dashboard-artiste/peinture-form.component').then(m => m.PeintureFormComponent)
  },
  {
    path: 'dashboard/artiste/:id',
    canActivate: [canActivateArtist, canAccessRoute],
    loadComponent: () => import('./pages/dashboard-artiste/peinture-form.component').then(m => m.PeintureFormComponent)
  },
];
