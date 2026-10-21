import { Injectable, signal } from '@angular/core';

/** Estado de UI compartido entre el header y los paneles (drawer de selección, menú móvil). */
@Injectable({ providedIn: 'root' })
export class UiStateService {
  readonly selectionDrawerOpen = signal(false);
  readonly mobileMenuOpen = signal(false);

  openSelectionDrawer(): void {
    this.mobileMenuOpen.set(false);
    this.selectionDrawerOpen.set(true);
  }

  closeSelectionDrawer(): void {
    this.selectionDrawerOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
