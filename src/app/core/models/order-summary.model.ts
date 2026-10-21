import { CartItem } from './cart-item.model';
import { DiscountRule } from './discount-rule.model';

export interface OrderSummary {
  readonly items: readonly CartItem[];
  readonly itemCount: number;
  readonly subtotal: number;
  readonly discount: number;
  readonly total: number;
  readonly appliedRule: DiscountRule | null;
  readonly nextRule: DiscountRule | null;
  /** Decants que faltan para alcanzar `nextRule` (0 si no hay siguiente regla). */
  readonly itemsToNextRule: number;
}
