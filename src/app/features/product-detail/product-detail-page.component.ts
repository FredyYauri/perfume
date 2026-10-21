import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GENDER_LABELS, INTENSITY_LEVELS, UI_TEXTS } from '../../core/config';
import { PerfumeService, SelectionService } from '../../core/services';
import { getDefaultSize, getSize, isSizeAvailable } from '../../core/utils';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { FavoriteButtonComponent } from '../../shared/components/favorite-button/favorite-button.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { PerfumeCardComponent } from '../../shared/components/perfume-card/perfume-card.component';
import {
  SizeChoice,
  SizeSelectorComponent,
} from '../../shared/components/size-selector/size-selector.component';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { PerfumeArtComponent } from '../../shared/ui/perfume-art/perfume-art.component';
import { QuantityStepperComponent } from '../../shared/ui/quantity-stepper/quantity-stepper.component';

const PYRAMID_STAGES = ['Salida', 'Corazón', 'Fondo'];

/** Ficha de producto: perfil olfativo completo, formatos, cantidad y relacionados. */
@Component({
  selector: 'app-product-detail-page',
  imports: [
    RouterLink,
    PerfumeArtComponent,
    SizeSelectorComponent,
    QuantityStepperComponent,
    FavoriteButtonComponent,
    PerfumeCardComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    IconComponent,
    PricePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  /** Parámetro `:id` de la ruta (enlazado con `withComponentInputBinding`). */
  readonly id = input.required<string>();

  protected readonly perfumeService = inject(PerfumeService);
  private readonly selection = inject(SelectionService);
  protected readonly texts = UI_TEXTS;

  protected readonly perfume = computed(() => this.perfumeService.getById(this.id()) ?? null);
  protected readonly selectedMl = linkedSignal(() => {
    const perfume = this.perfume();
    return perfume ? (getDefaultSize(perfume, this.selection.format())?.ml ?? null) : null;
  });
  protected readonly quantity = linkedSignal(() => {
    this.selectedMl();
    return 1;
  });

  protected readonly size = computed(() => {
    const perfume = this.perfume();
    const ml = this.selectedMl();
    return perfume && ml != null ? getSize(perfume, ml) : null;
  });
  protected readonly isAvailable = computed(() => isSizeAvailable(this.size()));
  protected readonly inSelection = computed(() => {
    const perfume = this.perfume();
    const ml = this.selectedMl();
    return perfume && ml != null ? this.selection.quantityOf(perfume.id, ml) : 0;
  });
  protected readonly sizeOptions = computed<SizeChoice[]>(
    () =>
      this.perfume()?.sizes.map((size) => ({
        ml: size.ml,
        price: size.price,
        disabled: !isSizeAvailable(size),
      })) ?? [],
  );
  protected readonly pyramid = computed(
    () =>
      this.perfume()?.notes.map((note, index) => ({
        stage: PYRAMID_STAGES[index] ?? 'Acorde',
        note,
      })) ?? [],
  );
  protected readonly details = computed(() => {
    const perfume = this.perfume();
    if (!perfume) {
      return null;
    }
    return {
      category: this.perfumeService.categoryMap().get(perfume.category)?.name ?? perfume.category,
      gender: GENDER_LABELS[perfume.gender],
      intensityLevel: INTENSITY_LEVELS[perfume.intensity] ?? 2,
    };
  });
  protected readonly related = computed(() => {
    const perfume = this.perfume();
    return perfume ? this.perfumeService.getRelated(perfume) : [];
  });
  protected readonly maxQuantity = computed(() =>
    Math.max(1, (this.size()?.stock ?? 1) - this.inSelection()),
  );
  constructor() {
    void this.perfumeService.load();
  }

  protected add(): void {
    const perfume = this.perfume();
    const ml = this.selectedMl();
    if (perfume && ml != null) {
      this.selection.add(perfume, ml, this.quantity());
    }
  }
}
