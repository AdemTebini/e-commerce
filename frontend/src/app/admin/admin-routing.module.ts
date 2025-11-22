import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../services/admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminUsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products-module').then(m => m.ProductsModule)
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders-module').then(m => m.OrdersModule)
      },
      {
        path: 'users',
        component: AdminUsersComponent
      },

      // /admin → redirect إلى /admin/dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
