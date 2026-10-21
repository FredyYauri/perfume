import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/** Trazos SVG (24x24, estilo lineal) del diseño. Centralizados para no repetir SVG en plantillas. */
const ICONS = {
  bag: '<path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  alert: '<path d="M12 4 3 20h18L12 4Z"/><path d="M12 10v4M12 17h.01"/>',
  arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronUp: '<path d="m6 15 6-6 6 6"/>',
  star: '<path d="M12 3l2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.6 6.4 20l1.5-6.3L3 9.5 9.4 9z"/>',
  drop: '<path d="M12 3c3 4.5 5 7.4 5 10a5 5 0 0 1-10 0c0-2.6 2-5.5 5-10z"/>',
  badge: '<circle cx="12" cy="10" r="6"/><path d="M9 10.2l2 2 4-4"/><path d="M9 15.5L8 22l4-2 4 2-1-6.5"/>',
  box: '<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
  seal: '<path d="M12 2.5l2 1.6 2.5-.3.8 2.4 2.2 1.2-.6 2.4 1.2 2.2-1.8 1.7v2.5l-2.4.6-1.2 2.2-2.4-.7L12 20l-2-1.6-2.5.3-.8-2.4-2.2-1.2.6-2.4L3.9 10.5l1.8-1.7V6.3l2.4-.6 1.2-2.2 2.4.7z"/><path d="M8.8 11.5l2.4 2.4 4.2-4.8"/>',
  atomizer: '<rect x="9.5" y="2" width="5" height="3.5" rx="1"/><path d="M8.5 5.5h7V8h-7zM9 8v2c-1.8.6-3 2.4-3 4.2v5.6A1.8 1.8 0 0 0 7.8 21.6h8.4a1.8 1.8 0 0 0 1.8-1.8v-5.6c0-1.8-1.2-3.6-3-4.2V8"/><path d="M8.5 15.5h7"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="0.8" fill="currentColor"/>',
  tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.5 2.5 2.4 4.2 5 4.5"/>',
  whatsapp: '<path d="M5 19l1.2-3.6A7.5 7.5 0 1 1 9 18.2z"/><path d="M9.5 9.5c.3 2.2 2.3 4.4 4.8 5l1-1.2-1.8-.9-.8.7a3.6 3.6 0 0 1-1.9-1.9l.7-.8-.9-1.8z"/>',
} as const;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-icon', 'aria-hidden': 'true' },
  template: `<svg
    viewBox="0 0 24 24"
    [attr.width]="size()"
    [attr.height]="size()"
    [attr.fill]="filled() ? 'currentColor' : 'none'"
    stroke="currentColor"
    [attr.stroke-width]="strokeWidth()"
    stroke-linecap="round"
    stroke-linejoin="round"
    [innerHTML]="paths()"
  ></svg>`,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  readonly strokeWidth = input(1.5);
  readonly filled = input(false);

  private readonly sanitizer = inject(DomSanitizer);

  // Los trazos son constantes internas (no datos de usuario), por eso es seguro confiar en ellos.
  protected readonly paths = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()]),
  );
}
