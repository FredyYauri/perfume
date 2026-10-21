import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UiStateService } from '../../core/services';
import { SelectionPanelComponent } from '../../shared/components/selection-panel/selection-panel.component';
import { BodyScrollLockDirective } from '../../shared/directives/body-scroll-lock.directive';

/**
 * Selección siempre accesible:
 * - Móvil/tablet (< 1100 px): bandeja fija inferior que se despliega hacia arriba.
 * - Escritorio: panel flotante que abre el botón "Selección" del header.
 */
@Component({
  selector: 'app-mobile-selection-drawer',
  imports: [SelectionPanelComponent, BodyScrollLockDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="scrim"
      [class.open]="ui.selectionDrawerOpen()"
      tabindex="-1"
      aria-label="Cerrar tu selección"
      (click)="ui.closeSelectionDrawer()"
    ></button>
    <div
      class="drawer"
      role="dialog"
      aria-label="Tu selección"
      [attr.aria-modal]="ui.selectionDrawerOpen()"
      [class.open]="ui.selectionDrawerOpen()"
      [appBodyScrollLock]="ui.selectionDrawerOpen()"
    >
      <app-selection-panel
        mode="tray"
        [expanded]="ui.selectionDrawerOpen()"
        (expandedChange)="$event ? ui.openSelectionDrawer() : ui.closeSelectionDrawer()"
      />
    </div>
  `,
  styleUrl: './mobile-selection-drawer.component.scss',
  host: { '(document:keydown.escape)': 'ui.closeSelectionDrawer()' },
})
export class MobileSelectionDrawerComponent {
  protected readonly ui = inject(UiStateService);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.ui.closeSelectionDrawer());
  }
}
