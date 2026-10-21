import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BRAND_CONFIG, MANIFESTO_IDEAS } from '../../../core/config';

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.', 'v.'];

/** Manifiesto "¿Por qué formatos pequeños?": explica qué es un decant y sus ventajas. */
@Component({
  selector: 'app-decant-info-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './decant-info-section.component.html',
  styleUrl: './decant-info-section.component.scss',
})
export class DecantInfoSectionComponent {
  /** Id del ancla de la sección (para el enlace "Cómo funciona"). */
  readonly anchor = input('formatos');

  protected readonly ideas = MANIFESTO_IDEAS.map((idea, index) => ({
    ...idea,
    numeral: ROMAN[index] ?? `${index + 1}.`,
  }));
  protected readonly brandName = BRAND_CONFIG.name;
}
