import { Routes } from '@angular/router';

export const routes: Routes = [
  // واجهة الكليان (site normal)
  {
    path: '',
    loadChildren: () =>
      import('./client/client-module').then(m => m.ClientModule)
  },

  // واجهة الأدمن
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule)
  },

  // أي route غالط يرجع للواجهة الرئيسية
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
