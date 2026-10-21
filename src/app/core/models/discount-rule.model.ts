export interface DiscountRule {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Cantidad mínima de decants (sumando cantidades) para activar la regla. */
  readonly minItems: number;
  /** Porcentaje de descuento sobre el subtotal. */
  readonly percentage: number;
  readonly active: boolean;
}
