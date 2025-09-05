import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-page">
      <h1>Bienvenue dans votre Galerie de Peintures</h1>
      <p>Découvrez notre collection d'œuvres d'art uniques</p>
    </div>
  `,
  styles: [`
    .home-page {
      text-align: center;
      padding: 40px;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      font-size: 18px;
    }
  `]
})
export class HomeComponent {} 