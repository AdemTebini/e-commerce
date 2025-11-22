import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-client-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="side-nav side-nav--client">
      <p class="side-nav__title">Espace client</p>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        Tous les produits
      </a>
      <a routerLink="/orders" routerLinkActive="active">
        Commandes
      </a>
      <a routerLink="/cart" routerLinkActive="active">
        Panier
      </a>
    </nav>
  `,
  styleUrls: ['./client-side-nav.component.scss']
})
export class ClientSideNavComponent {}
