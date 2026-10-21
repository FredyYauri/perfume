import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="empty" [class.empty--compact]="compact()" [attr.role]="tone() === 'error' ? 'alert' : 'status'">
      @if (tone() === 'error') {
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          <circle cx="32" cy="32" r="28" />
          <path d="M32 18v18M32 44h.01" stroke-width="2" stroke-linecap="round" />
        </svg>
      } @else if (compact()) {
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          <rect x="16" y="14" width="12" height="26" rx="5" />
          <rect x="18" y="6" width="8" height="8" rx="1.5" />
          <path d="M16 26h12" />
        </svg>
      } @else {
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          <circle cx="32" cy="32" r="28" />
          <path d="M32 16c6 9 10 14 10 19a10 10 0 0 1-20 0c0-5 4-10 10-19z" />
        </svg>
      }
      <p class="empty__title serif">{{ title() }}</p>
      @if (message()) {
        <p class="empty__message">{{ message() }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
      padding: 80px 24px;
      border-radius: var(--radius-xl);
      border: 1px dashed rgb(24 32 44 / 22%);
      color: var(--ink);
    }
    svg {
      color: rgb(24 32 44 / 50%);
    }
    .empty__title {
      font-size: 30px;
      line-height: 1.15;
      max-width: 22ch;
    }
    .empty__message {
      color: var(--ink-2);
      max-width: 380px;
    }
    .empty--compact {
      gap: 10px;
      padding: 26px 8px;
      border: 0;
      border-radius: var(--radius-md);
      background: var(--sand-2);
    }
    .empty--compact .empty__title {
      font-size: 20px;
      line-height: 1.25;
    }
    .empty--compact .empty__message {
      font-size: 14px;
      color: var(--ink-3);
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input('');
  readonly tone = input<'neutral' | 'error'>('neutral');
  /** Versión reducida para el panel de selección. */
  readonly compact = input(false);
}
