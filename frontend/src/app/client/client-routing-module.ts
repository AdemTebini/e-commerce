import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart';
import { ClientProductsComponent } from './products/products';
import { AuthGuard } from '../services/auth.guard';
import { ClientLayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: ClientProductsComponent },
      { path: 'cart', component: CartComponent },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./products/detail/product-detail').then(m => m.ProductDetailComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register').then(m => m.RegisterComponent)
      },
      {
        path: 'checkout',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./checkout/checkout').then(m => m.CheckoutComponent)
      },
      {
        path: 'orders',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./orders/orders').then(m => m.OrdersComponent)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}
