import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Perfume } from '../../../core/models';
import { ImgFallbackDirective } from '../../directives/img-fallback.directive';

/** Altura del líquido en el frasco según el formato (en unidades del viewBox). */
const LIQUID_HEIGHT: Readonly<Record<number, number>> = { 3: 48, 5: 76, 10: 104 };

/**
 * Ilustración del atomizador con la paleta del perfume (estilo del diseño).
 * Si el perfume tiene foto (`image` en el JSON), muestra la foto en su lugar.
 */
@Component({
  selector: 'app-perfume-art',
  imports: [ImgFallbackDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.background]': 'perfume().palette.background' },
  template: `
    @if (perfume().image; as image) {
      <img
        class="photo"
        [src]="image"
        [alt]="perfume().brand + ' ' + perfume().name"
        width="600"
        height="660"
        [attr.loading]="eager() ? 'eager' : 'lazy'"
        decoding="async"
        appImgFallback
      />
    } @else {
      <svg
        class="art"
        viewBox="0 0 200 220"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        [attr.focusable]="false"
      >
        <circle cx="150" cy="62" r="56" [attr.fill]="perfume().palette.primary" opacity="0.6" />
        <circle cx="48" cy="172" r="66" [attr.fill]="perfume().palette.secondary" opacity="0.28" />
        <circle cx="100" cy="116" r="86" fill="none" stroke="#18202C" stroke-opacity="0.12" stroke-width="0.6" />
        <path d="M14 116H58" stroke="#18202C" stroke-opacity="0.25" stroke-width="0.6" />
        <circle cx="58" cy="116" r="2" fill="#18202C" fill-opacity="0.45" />
        <ellipse cx="100" cy="200" rx="30" ry="4" fill="#18202C" opacity="0.16" />
        <rect x="96" y="34" width="8" height="10" fill="#2A3444" />
        <rect x="91" y="42" width="18" height="14" rx="2" fill="#2A3444" />
        <rect x="86" y="55" width="28" height="14" rx="3" fill="#1C2533" />
        <rect x="80" y="68" width="40" height="130" rx="12" fill="#FFFFFF" fill-opacity="0.55" stroke="#18202C" stroke-opacity="0.22" />
        <rect class="liquid" x="83" [attr.y]="194 - liquidHeight()" width="34" [attr.height]="liquidHeight()" rx="10" [attr.fill]="perfume().palette.liquid" opacity="0.88" />
        <rect x="86" y="76" width="4" height="114" rx="2" fill="#FFFFFF" opacity="0.7" />
        <rect x="89" y="120" width="24" height="32" fill="#FBFAF7" />
        <text x="101" y="141" font-family="Instrument Serif, Georgia, serif" font-size="13" text-anchor="middle" fill="#18202C">{{ ml() }}</text>
      </svg>
    }
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      overflow: hidden;
    }
    .art,
    .photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s var(--ease);
    }
    /* Las fotos vienen sobre fondo blanco: el blend lo funde con el color de la tarjeta. */
    .photo {
      object-fit: contain;
      padding: 8% 10%;
      mix-blend-mode: multiply;
    }
    .liquid {
      transition:
        y 0.5s var(--ease),
        height 0.5s var(--ease);
    }
  `,
})
export class PerfumeArtComponent {
  readonly perfume = input.required<Perfume>();
  /** Formato a representar (cambia el nivel de líquido y la etiqueta). */
  readonly ml = input(5);
  readonly eager = input(false);

  protected readonly liquidHeight = computed(() => LIQUID_HEIGHT[this.ml()] ?? 76);
}
