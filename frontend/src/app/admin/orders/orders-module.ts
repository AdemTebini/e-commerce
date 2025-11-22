import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing-module';
import { OrdersListComponent } from './list/list';
import { OrderDetailComponent } from './detail/detail';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    OrdersListComponent,
    OrderDetailComponent
  ]
})
export class OrdersModule {}
