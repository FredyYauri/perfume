import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { SelectionService } from '../../../core/services';
import { ReplayAnimationDirective } from '../../directives/replay-animation.directive';
import { PricePipe } from '../../pipes/price.pipe';
import { IconComponent } from '../../ui/icon/icon.component';
import { SelectionSummaryComponent } from '../selection-summary/selection-summary.component';

let nextPanelId = 0;

/**
 * Tarjeta "Tu selección" con cabecera azul noche. `expanded` controla si se ve el detalle:
 * en escritorio pliega el panel; en la bandeja móvil lo despliega hacia arriba.
 */
@Component({
  selector: 'app-selection-panel',
  imports: [SelectionSummaryComponent, IconComponent, PricePipe, ReplayAnimationDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selection-panel.component.html',
  styleUrl: './selection-panel.component.scss',
})
export class SelectionPanelComponent {
  readonly expanded = model(true);
  /** `tray` muestra el total en la cabecera (bandeja inferior de móvil/tablet). */
  readonly mode = input<'aside' | 'tray'>('aside');

  protected readonly selection = inject(SelectionService);
  protected readonly bodyId = `selection-panel-body-${nextPanelId++}`;
  protected readonly sheetLabel = computed(
    () =>
      `Ficha Nº ${String(this.selection.sheetNumber()).padStart(4, '0')} · ${this.selection.itemCount()} muestra${this.selection.itemCount() === 1 ? '' : 's'}`,
  );
}
