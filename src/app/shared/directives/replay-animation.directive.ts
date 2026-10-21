import { Directive, ElementRef, effect, inject, input } from '@angular/core';

/**
 * Vuelve a reproducir una animación CSS cada vez que cambia `appReplayAnimation`
 * (p. ej. el contador de la selección al agregar un perfume).
 */
@Directive({ selector: '[appReplayAnimation]' })
export class ReplayAnimationDirective {
  readonly appReplayAnimation = input<unknown>();
  /** Clase que contiene la animación. */
  readonly replayClass = input('is-replaying');

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private firstRun = true;

  constructor() {
    effect(() => {
      this.appReplayAnimation();
      const className = this.replayClass();
      if (this.firstRun) {
        this.firstRun = false;
        return;
      }
      this.element.classList.remove(className);
      void this.element.offsetWidth; // fuerza reflow para reiniciar la animación
      this.element.classList.add(className);
    });
  }
}
