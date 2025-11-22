import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
  standalone: true,
})
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'TND', locale = 'fr-FR'): string {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '';
    }

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  }
}
