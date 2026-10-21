import { BRAND_CONFIG } from '../config';

/** Redondea a 2 decimales evitando errores de coma flotante. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Formatea un monto: 45 → "45.00". */
export function formatAmount(value: number): string {
  return roundMoney(value).toFixed(2);
}

/** Formatea un monto con símbolo de moneda: 45 → "S/ 45.00". */
export function formatPrice(value: number): string {
  return `${BRAND_CONFIG.currencySymbol} ${formatAmount(value)}`;
}
