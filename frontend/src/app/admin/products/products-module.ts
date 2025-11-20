import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing-module';
import { AddComponent } from './add/add';
import { EditComponent } from './edit/edit';
import { ListComponent } from './list/list';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ProductsRoutingModule,
    AddComponent,
    EditComponent,
    ListComponent
  ]
})
export class ProductsModule {}