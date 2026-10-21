import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UI_TEXTS } from '../../core/config';
import { FavoritesService, PerfumeService, SelectionService } from '../../core/services';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton.component';
import { PerfumeCardComponent } from '../../shared/components/perfume-card/perfume-card.component';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterLink, PerfumeCardComponent, EmptyStateComponent, LoadingSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="wrap page" aria-labelledby="favorites-title">
      <div class="section-head">
        <div>
          <p class="flabel flabel--accent">Tu archivo olfativo</p>
          <h1 id="favorites-title" class="section-title">Favoritos</h1>
        </div>
        <p>Las fragancias que guardaste para probar después. Precios en formato {{ selection.format() }} ml.</p>
      </div>

      @if (perfumeService.isLoading()) {
        <app-loading-skeleton [count]="4" />
      } @else if (perfumeService.hasError()) {
        <app-empty-state tone="error" [title]="texts.loadErrorTitle" [message]="texts.loadErrorMessage">
          <button type="button" class="chip on" (click)="perfumeService.retry()">Reintentar</button>
        </app-empty-state>
      } @else if (favorites().length === 0) {
        <app-empty-state [title]="texts.emptyFavoritesTitle" [message]="texts.emptyFavoritesMessage">
          <a class="btn-main" routerLink="/" fragment="crea">Explorar fragancias</a>
        </app-empty-state>
      } @else {
        <div class="gallery">
          @for (perfume of favorites(); track perfume.id) {
            <app-perfume-card [perfume]="perfume" [ml]="selection.format()" [allowWide]="false" />
          }
        </div>
      }
    </section>
  `,
  styles: `
    .page {
      padding-top: 48px;
      padding-bottom: 104px;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      grid-auto-rows: 176px;
      grid-auto-flow: dense;
      gap: 16px;
    }
    @media (max-width: 520px) {
      .gallery {
        grid-auto-rows: auto;
      }
    }
  `,
})
export class FavoritesPageComponent {
  protected readonly perfumeService = inject(PerfumeService);
  protected readonly selection = inject(SelectionService);
  private readonly favoritesService = inject(FavoritesService);
  protected readonly texts = UI_TEXTS;

  protected readonly favorites = computed(() =>
    this.favoritesService
      .ids()
      .map((id) => this.perfumeService.getById(id))
      .filter((perfume) => perfume !== undefined),
  );

  constructor() {
    void this.perfumeService.load();
  }
}
