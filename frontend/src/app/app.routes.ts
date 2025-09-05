import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PeinturesComponent } from './pages/peintures/peintures.component';
import { ArtistesComponent } from './pages/artistes/artistes.component';
import { PanierComponent } from './pages/panier/panier.component';
import { CommandesComponent } from './pages/commandes/commandes.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'peintures', component: PeinturesComponent },
  { path: 'artistes', component: ArtistesComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'commandes', component: CommandesComponent },
];
