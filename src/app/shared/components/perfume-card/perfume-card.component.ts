import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INTENSITY_LEVELS, TAG_STYLES, UI_TEXTS } from '../../../core/config';
import { Perfume } from '../../../core/models';
import { SelectionService } from '../../../core/services';
import { getPerfumeDisplayName, getSize, isPerfumeAvailable, isSizeAvailable } from '../../../core/utils';
import { PricePipe } from '../../pipes/price.pipe';
import { IconComponent } from '../../ui/icon/icon.component';
import { PerfumeArtComponent } from '../../ui/perfume-art/perfume-art.component';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';

@Component({
  selector: 'app-perfume-card',
  imports: [RouterLink, FavoriteButtonComponent, PerfumeArtComponent, IconComponent, PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfume-card.component.html',
  styleUrl: './perfume-card.component.scss',
  host: {
    class: 'pcard-host',
  },
})
export class PerfumeCardComponent {
  readonly perfume = input.required<Perfume>();
  /** Formato activo del estudio: define precio, nivel del frasco y lo que agrega el botón. */
  readonly ml = input.required<number>();
  readonly eager = input(false);

  private readonly selection = inject(SelectionService);

  protected readonly displayName = computed(() => getPerfumeDisplayName(this.perfume()));
  protected readonly size = computed(() => getSize(this.perfume(), this.ml()));
  protected readonly isAvailable = computed(() => isSizeAvailable(this.size()));
  protected readonly inSelection = computed(() =>
    this.selection.has(this.perfume().id, this.ml()),
  );
  protected readonly tag = computed(() => {
    if (!this.isAvailable()) {
      const text = isPerfumeAvailable(this.perfume())
        ? `${UI_TEXTS.outOfStock} en ${this.ml()} ml`
        : UI_TEXTS.outOfStock;
      return { text, style: 'out' };
    }
    const text = this.perfume().tags[0];
    return text ? { text, style: TAG_STYLES[text] ?? '' } : null;
  });
  protected readonly intensityLevel = computed(
    () => INTENSITY_LEVELS[this.perfume().intensity] ?? 2,
  );
  protected readonly addLabel = computed(() => {
    const name = this.displayName();
    if (!this.isAvailable()) {
      return `${name} en ${this.ml()} ml: ${UI_TEXTS.outOfStock}`;
    }
    return this.inSelection()
      ? `Quitar ${name} de tu selección`
      : `Añadir ${name} en ${this.ml()} ml`;
  });

  protected toggle(): void {
    if (this.isAvailable() || this.inSelection()) {
      this.selection.toggle(this.perfume(), this.ml());
    }
  }
}
