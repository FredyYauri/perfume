import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Placeholders animados con la misma grilla que la galería. */
@Component({
  selector: 'app-loading-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', 'aria-busy': 'true' },
  template: `
    <span class="visually-hidden">Cargando fragancias…</span>
    <div class="gallery" [class.gallery--detail]="variant() === 'detail'" aria-hidden="true">
      @for (item of items(); track item) {
        <div class="skel">
          <span class="skbar" style="bottom: 70px; width: 40%"></span>
          <span class="skbar" style="bottom: 46px; width: 70%; height: 14px"></span>
          <span class="skbar" style="bottom: 22px; width: 55%"></span>
        </div>
      }
    </div>
  `,
  styleUrl: './loading-skeleton.component.scss',
})
export class LoadingSkeletonComponent {
  readonly count = input(6);
  readonly variant = input<'cards' | 'detail'>('cards');

  protected readonly items = computed(() =>
    Array.from({ length: this.variant() === 'detail' ? 1 : this.count() }, (_, i) => i),
  );
}
