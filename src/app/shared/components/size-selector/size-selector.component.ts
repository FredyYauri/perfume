import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FORMAT_OPTIONS, UI_TEXTS } from '../../../core/config';
import { PricePipe } from '../../pipes/price.pipe';
import { IconComponent } from '../../ui/icon/icon.component';

export interface SizeChoice {
  readonly ml: number;
  /** Precio a mostrar (el exacto o el "desde"). */
  readonly price?: number;
  readonly disabled?: boolean;
}

/** Nivel de líquido de la mini ampolla por formato. */
const VIAL_LEVEL: Readonly<Record<number, number>> = { 3: 14, 5: 26, 10: 40 };

/**
 * Selector de formato (ml). Tres variantes del diseño:
 * - `cards`: tarjetas grandes del paso "Elige tu formato".
 * - `pills`: botones medianos (ficha de producto).
 * - `mini`: segmentado compacto (ítems del panel "Tu selección").
 */
@Component({
  selector: 'app-size-selector',
  imports: [PricePipe, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './size-selector.component.html',
  styleUrl: './size-selector.component.scss',
})
export class SizeSelectorComponent {
  readonly options = input.required<readonly SizeChoice[]>();
  readonly selectedMl = model<number | null>(null);
  readonly variant = input<'cards' | 'pills' | 'mini'>('pills');
  readonly label = input('Formato');
  /** En `cards`, el precio se muestra como "Desde S/ …". */
  readonly priceIsFrom = input(false);

  protected readonly outOfStock = UI_TEXTS.outOfStock;
  protected readonly items = computed(() =>
    this.options().map((option) => ({
      ...option,
      caption: FORMAT_OPTIONS.find((format) => format.ml === option.ml)?.label ?? '',
      level: VIAL_LEVEL[option.ml] ?? 26,
    })),
  );

  protected select(ml: number, disabled?: boolean): void {
    if (!disabled) {
      this.selectedMl.set(ml);
    }
  }
}
