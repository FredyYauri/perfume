import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TRUST_ITEMS } from '../../../core/config';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-trust-section',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="trust-band" aria-label="Garantías">
      <ul class="wrap trust" role="list">
        @for (item of items; track item.title) {
          <li>
            <app-icon class="trust__icon" [name]="item.icon" [size]="40" [strokeWidth]="0.8" />
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .trust-band {
      background: var(--paper);
      border-top: 1px solid var(--line-soft);
      border-bottom: 1px solid var(--line-soft);
    }
    .trust {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
      margin-top: 0;
      margin-bottom: 0;
      list-style: none;
    }
    li {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      padding: 30px 24px;
      border-left: 1px solid var(--line);
    }
    .trust__icon {
      color: var(--acc);
    }
    h3 {
      margin-bottom: 6px;
      font-size: 16px;
      font-weight: 600;
    }
    p {
      font-size: 14px;
      color: var(--ink-3);
      line-height: 1.5;
    }
  `,
})
export class TrustSectionComponent {
  protected readonly items = TRUST_ITEMS;
}
