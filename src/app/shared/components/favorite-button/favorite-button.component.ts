import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UI_TEXTS } from '../../../core/config';
import { FavoritesService, ToastService } from '../../../core/services';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-favorite-button',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="icb fav"
      [class.on]="isFavorite()"
      [attr.aria-pressed]="isFavorite()"
      [attr.aria-label]="ariaLabel()"
      (click)="toggle($event)"
    >
      <app-icon name="heart" [filled]="isFavorite()" />
    </button>
  `,
  styles: `
    .fav {
      background: rgb(251 250 247 / 90%);
      border-color: transparent;
    }
    .fav.on {
      color: var(--acc2);
      animation: pop 0.32s var(--ease);
    }
    @keyframes pop {
      50% {
        transform: scale(1.18);
      }
    }
  `,
})
export class FavoriteButtonComponent {
  readonly perfumeId = input.required<string>();
  readonly perfumeName = input('');

  private readonly favorites = inject(FavoritesService);
  private readonly toast = inject(ToastService);

  protected readonly isFavorite = computed(() => this.favorites.isFavorite(this.perfumeId()));
  protected readonly ariaLabel = computed(() =>
    `${this.isFavorite() ? 'Quitar de favoritos' : 'Guardar en favoritos'} ${this.perfumeName()}`.trim(),
  );

  protected toggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const added = this.favorites.toggle(this.perfumeId());
    this.toast.info(added ? UI_TEXTS.toasts.favoriteAdded : UI_TEXTS.toasts.favoriteRemoved);
  }
}
