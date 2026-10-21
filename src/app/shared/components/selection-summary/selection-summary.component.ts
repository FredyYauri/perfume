import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CATALOG_CONFIG, UI_TEXTS } from '../../../core/config';
import {
  DiscountService,
  PerfumeService,
  SelectionService,
  WhatsAppOrderService,
} from '../../../core/services';
import { isSizeAvailable } from '../../../core/utils';
import { PricePipe } from '../../pipes/price.pipe';
import { IconComponent } from '../../ui/icon/icon.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { SelectionItemComponent } from '../selection-item/selection-item.component';
import { SizeChoice } from '../size-selector/size-selector.component';

/**
 * Cuerpo del panel "Tu selección": visor del set, muestras, descuentos, totales y
 * el botón "Realizar pedido". Se usa en el estudio, la bandeja móvil y la página de selección.
 */
@Component({
  selector: 'app-selection-summary',
  imports: [SelectionItemComponent, EmptyStateComponent, IconComponent, PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selection-summary.component.html',
  styleUrl: './selection-summary.component.scss',
})
export class SelectionSummaryComponent {
  protected readonly selection = inject(SelectionService);
  private readonly perfumeService = inject(PerfumeService);
  private readonly discounts = inject(DiscountService);
  private readonly whatsAppOrder = inject(WhatsAppOrderService);

  protected readonly texts = UI_TEXTS;
  protected readonly summary = this.selection.summary;

  /** Primera regla de descuento: marca la casilla objetivo del visor. */
  private readonly goalRule = computed(() => this.discounts.rules()[0] ?? null);

  protected readonly slots = computed(() => {
    const colors = this.summary().items.flatMap((item) =>
      Array.from({ length: item.quantity }, () => item.liquid),
    );
    const goal = this.goalRule()?.minItems ?? 0;
    return Array.from({ length: CATALOG_CONFIG.selectionSlots }, (_, index) => ({
      index,
      color: index < colors.length ? colors[index] : null,
      isGoal: index + 1 === goal,
      label:
        index + 1 === goal
          ? `${goal} · −${this.goalRule()?.percentage}%`
          : index === 0 || index === CATALOG_CONFIG.selectionSlots - 1
            ? `${index + 1}`
            : '',
    }));
  });

  protected readonly slotsLabel = computed(() => {
    const { itemCount } = this.summary();
    const goal = this.goalRule();
    return goal
      ? `${itemCount} de ${goal.minItems} decants para desbloquear ${goal.percentage}% de descuento`
      : `${itemCount} decants en tu set`;
  });

  protected readonly discountMessage = computed(() => {
    const { appliedRule, nextRule, itemsToNextRule } = this.summary();
    const missing = itemsToNextRule === 1 ? 'una fragancia más' : `${itemsToNextRule} fragancias más`;
    if (appliedRule && nextRule) {
      return `${appliedRule.percentage}% desbloqueado. Añade ${missing} y sube a ${nextRule.percentage}%.`;
    }
    if (appliedRule) {
      return `Descuento de ${appliedRule.percentage}% desbloqueado en tu set.`;
    }
    return nextRule ? `Añade ${missing} y desbloquea ${nextRule.percentage}% de descuento.` : '';
  });

  /** Formatos de cada perfume para el mini selector (marcando los agotados). */
  protected readonly sizesByPerfume = computed(() => {
    const result = new Map<string, readonly SizeChoice[]>();
    for (const perfume of this.perfumeService.perfumes()) {
      result.set(
        perfume.id,
        perfume.sizes.map((size) => ({ ml: size.ml, disabled: !isSizeAvailable(size) })),
      );
    }
    return result;
  });

  protected placeOrder(): void {
    this.whatsAppOrder.placeOrder();
  }
}
