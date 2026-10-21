import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CatalogRepository } from '../data/catalog.repository';
import { CartItem, DiscountRule, OrderSummary } from '../models';
import { roundMoney } from '../utils';

/**
 * Calcula descuentos por combo: se aplica la regla de mayor porcentaje cuyo mínimo
 * de decants se cumpla. Las reglas vienen del repositorio (hoy, un JSON).
 */
@Injectable({ providedIn: 'root' })
export class DiscountService {
  private readonly repository = inject(CatalogRepository);
  private readonly rulesState = signal<readonly DiscountRule[]>([]);

  readonly rules = this.rulesState.asReadonly();

  constructor() {
    void this.loadRules();
  }

  summarize(items: readonly CartItem[]): OrderSummary {
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);
    const subtotal = roundMoney(
      items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    );
    const rules = this.rulesState();
    const appliedRule = this.findAppliedRule(rules, itemCount);
    const nextRule = rules.find((rule) => rule.minItems > itemCount) ?? null;
    const discount = appliedRule ? roundMoney((subtotal * appliedRule.percentage) / 100) : 0;

    return {
      items,
      itemCount,
      subtotal,
      discount,
      total: roundMoney(subtotal - discount),
      appliedRule,
      nextRule,
      itemsToNextRule: nextRule ? nextRule.minItems - itemCount : 0,
    };
  }

  private findAppliedRule(rules: readonly DiscountRule[], itemCount: number): DiscountRule | null {
    return rules
      .filter((rule) => itemCount >= rule.minItems)
      .reduce<DiscountRule | null>(
        (best, rule) => (!best || rule.percentage > best.percentage ? rule : best),
        null,
      );
  }

  private async loadRules(): Promise<void> {
    try {
      const rules = await firstValueFrom(this.repository.getDiscountRules());
      this.rulesState.set(
        rules.filter((rule) => rule.active).sort((a, b) => a.minItems - b.minItems),
      );
    } catch (error) {
      // Sin reglas el pedido sigue funcionando, solo sin descuento.
      console.error('Error al cargar las reglas de descuento', error);
    }
  }
}
