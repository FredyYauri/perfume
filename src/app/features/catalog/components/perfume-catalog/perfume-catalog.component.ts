import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UI_TEXTS } from '../../../../core/config';
import { Perfume } from '../../../../core/models';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { PerfumeCardComponent } from '../../../../shared/components/perfume-card/perfume-card.component';

/** Galería del catálogo con sus estados: cargando, error, vacío y resultados. */
@Component({
  selector: 'app-perfume-catalog',
  imports: [PerfumeCardComponent, LoadingSkeletonComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-loading-skeleton [count]="skeletonCount()" />
    } @else if (error()) {
      <app-empty-state tone="error" [title]="texts.loadErrorTitle" [message]="texts.loadErrorMessage">
        <button type="button" class="chip on" (click)="retry.emit()">Reintentar</button>
      </app-empty-state>
    } @else if (perfumes().length === 0) {
      <app-empty-state [title]="texts.emptyResultsTitle" [message]="texts.emptyResultsMessage">
        <button type="button" class="chip on" (click)="clearFilters.emit()">Limpiar filtros</button>
      </app-empty-state>
    } @else {
      <div class="gallery">
        @for (perfume of perfumes(); track perfume.id; let index = $index) {
          <app-perfume-card [perfume]="perfume" [ml]="ml()" [eager]="index < 4" />
        }
      </div>
    }
  `,
  styles: `
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
      gap: 16px;
    }
  `,
})
export class PerfumeCatalogComponent {
  readonly perfumes = input.required<readonly Perfume[]>();
  readonly ml = input.required<number>();
  readonly loading = input(false);
  readonly error = input(false);
  readonly skeletonCount = input(6);
  readonly retry = output<void>();
  readonly clearFilters = output<void>();

  protected readonly texts = UI_TEXTS;
}
