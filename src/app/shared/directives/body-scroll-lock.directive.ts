import { DOCUMENT } from '@angular/common';
import { Directive, effect, inject, input } from '@angular/core';

/** Bloquea el scroll del body mientras `appBodyScrollLock` sea verdadero (drawers, menús). */
@Directive({ selector: '[appBodyScrollLock]' })
export class BodyScrollLockDirective {
  readonly appBodyScrollLock = input(false);

  private readonly body = inject(DOCUMENT).body;

  constructor() {
    effect((onCleanup) => {
      if (!this.appBodyScrollLock()) {
        return;
      }
      this.body.classList.add('is-locked');
      onCleanup(() => this.body.classList.remove('is-locked'));
    });
  }
}
