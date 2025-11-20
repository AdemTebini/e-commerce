import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add';
import { ListComponent } from './list/list';
import { EditComponent } from './edit/edit';

const routes: Routes = [
  { path: '', component: ListComponent },         // /admin/products
  { path: 'add', component: AddComponent },       // /admin/products/add
  { path: 'edit/:id', component: EditComponent }  // /admin/products/edit/5
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
