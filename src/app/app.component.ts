import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AnnouncementBarComponent } from './layout/announcement-bar/announcement-bar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MobileSelectionDrawerComponent } from './layout/mobile-order-drawer/mobile-selection-drawer.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AnnouncementBarComponent,
    HeaderComponent,
    FooterComponent,
    MobileSelectionDrawerComponent,
    ToastComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <app-announcement-bar />
    <app-header />
    <main id="contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    @if (showSelectionDrawer()) {
      <app-mobile-selection-drawer />
    }
    <app-toast />
  `,
  styles: `
    :host {
      display: block;
    }
    main:focus {
      outline: none;
    }
    /* Espacio para la bandeja fija de "Tu selección" en móvil y tablet. */
    @media (max-width: 1100px) {
      :host {
        padding-bottom: 110px;
      }
    }
  `,
})
export class AppComponent {
  private readonly url = toSignal(
    inject(Router).events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: '/' },
  );

  /** En "Mi selección" el panel ya ocupa la página, así que la bandeja sobra. */
  protected readonly showSelectionDrawer = computed(() => !this.url().startsWith('/mi-seleccion'));
}
