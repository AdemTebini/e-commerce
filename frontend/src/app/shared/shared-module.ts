import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AlertComponent } from './components/alert/alert.component';
import { PricePipe } from './pipes/price.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedRoutingModule,
    ProductCardComponent,
    SpinnerComponent,
    AlertComponent,
    PricePipe,
    TruncatePipe,
  ],
  exports: [
    ProductCardComponent,
    SpinnerComponent,
    AlertComponent,
    PricePipe,
    TruncatePipe,
  ],
})
export class SharedModule {}
