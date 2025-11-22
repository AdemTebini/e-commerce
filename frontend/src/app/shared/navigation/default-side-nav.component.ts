import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-default-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="side-nav side-nav--default">
      <p class="side-nav__title">Découvrir</p>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        Tous les produits
      </a>
      <a routerLink="/cart" routerLinkActive="active">
        Panier
      </a>
    </nav>
  `,
  styleUrls: ['./default-side-nav.component.scss']
})
export class DefaultSideNavComponent {}
