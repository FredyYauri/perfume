import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DECANT_FAQ } from '../../core/config';
import { DecantInfoSectionComponent } from '../../shared/components/decant-info-section/decant-info-section.component';
import { TrustSectionComponent } from '../../shared/components/trust-section/trust-section.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-about-page',
  imports: [RouterLink, DecantInfoSectionComponent, TrustSectionComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="visually-hidden">Cómo funciona</h1>
    <app-decant-info-section anchor="como-funciona" />
    <app-trust-section />
    <section id="preguntas" class="wrap faq" aria-labelledby="faq-title">
      <div class="section-head">
        <div>
          <p class="flabel flabel--accent">Ayuda</p>
          <h2 id="faq-title" class="section-title">Preguntas frecuentes</h2>
        </div>
        <a class="btn-main" routerLink="/" fragment="crea">
          Crear mi selección <app-icon name="arrowRight" />
        </a>
      </div>
      @for (item of faq; track item.question) {
        <details class="faq__item">
          <summary>
            <span class="serif">{{ item.question }}</span>
            <app-icon name="plus" />
          </summary>
          <p>{{ item.answer }}</p>
        </details>
      }
    </section>
  `,
  styles: `
    .faq {
      padding-top: 96px;
      padding-bottom: 104px;
    }
    .faq__item {
      border-top: 1px solid var(--line);
    }
    .faq__item:last-child {
      border-bottom: 1px solid var(--line);
    }
    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 22px 0;
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary .serif {
      font-size: 28px;
      line-height: 1.1;
    }
    summary app-icon {
      transition: transform 0.25s var(--ease);
    }
    details[open] summary app-icon {
      transform: rotate(45deg);
    }
    details p {
      max-width: 720px;
      padding-bottom: 24px;
      color: var(--ink-2);
      line-height: 1.6;
    }
  `,
})
export class AboutPageComponent {
  protected readonly faq = DECANT_FAQ;
}
