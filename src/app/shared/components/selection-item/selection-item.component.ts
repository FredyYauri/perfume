import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../../core/models';
import { PricePipe } from '../../pipes/price.pipe';
import { IconComponent } from '../../ui/icon/icon.component';
import { QuantityStepperComponent } from '../../ui/quantity-stepper/quantity-stepper.component';
import { SizeChoice, SizeSelectorComponent } from '../size-selector/size-selector.component';

@Component({
  selector: 'app-selection-item',
  imports: [RouterLink, SizeSelectorComponent, QuantityStepperComponent, IconComponent, PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="citem">
      <svg class="citem__thumb" width="44" height="56" viewBox="0 0 44 56" aria-hidden="true">
        <rect x="0" y="0" width="44" height="56" rx="12" [attr.fill]="item().background" />
        <rect x="18" y="6" width="8" height="8" rx="1.5" fill="#2A3444" />
        <rect x="15" y="14" width="14" height="36" rx="5" fill="#FFFFFF" fill-opacity="0.6" stroke="#18202C" stroke-opacity="0.25" />
        <rect x="17" y="24" width="10" height="24" rx="4" [attr.fill]="item().liquid" />
      </svg>
      <div class="citem__info">
        <div class="citem__brand">{{ item().brand }}</div>
        <a class="citem__name" [routerLink]="['/perfume', item().perfumeId]">{{ item().name }}</a>
        <div class="citem__controls">
          <app-size-selector
            variant="mini"
            [label]="'Formato de ' + item().name"
            [options]="sizeOptions()"
            [selectedMl]="item().ml"
            (selectedMlChange)="onSize($event)"
          />
          <app-quantity-stepper
            [value]="item().quantity"
            [max]="item().maxQuantity"
            [label]="'cantidad de ' + item().name"
            (valueChange)="quantityChange.emit($event)"
          />
        </div>
      </div>
      <div class="citem__side">
        <span class="citem__price">{{ lineTotal() | price }}</span>
        <button
          type="button"
          class="citem__rm"
          [attr.aria-label]="'Eliminar ' + item().name + ' ' + item().ml + ' ml'"
          (click)="remove.emit()"
        >
          <app-icon name="trash" [size]="16" />
        </button>
      </div>
    </div>
  `,
  styleUrl: './selection-item.component.scss',
})
export class SelectionItemComponent {
  readonly item = input.required<CartItem>();
  /** Formatos disponibles del perfume (si el catálogo aún no cargó, solo el actual). */
  readonly sizes = input<readonly SizeChoice[]>([]);
  readonly sizeChange = output<number>();
  readonly quantityChange = output<number>();
  readonly remove = output<void>();

  protected readonly lineTotal = computed(() => this.item().unitPrice * this.item().quantity);
  protected readonly sizeOptions = computed<readonly SizeChoice[]>(() =>
    this.sizes().length ? this.sizes() : [{ ml: this.item().ml }],
  );

  protected onSize(ml: number | null): void {
    if (ml != null) {
      this.sizeChange.emit(ml);
    }
  }
}
