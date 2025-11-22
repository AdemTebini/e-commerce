import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  readonly tips = [
    'Utilisez le menu produits pour ajouter ou modifier des articles',
    'Consultez la section commandes pour suivre les livraisons',
    'Gérez les utilisateurs depuis la page dédiée quand nécessaire',
    'Vérifiez régulièrement le stock pour éviter les ruptures',
    'Analysez les tendances de vente pour optimiser votre inventaire'
  ];

  loadDashboard(): void {
    // Refresh dashboard data
    console.log('Dashboard refreshed');
  }
}
