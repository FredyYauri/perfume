import { Pipe, PipeTransform } from '@angular/core';
import { formatPrice } from '../../core/utils';

/** 45 → "S/ 45.00". Usa el mismo formato que el mensaje de WhatsApp. */
@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatPrice(value ?? 0);
  }
}
