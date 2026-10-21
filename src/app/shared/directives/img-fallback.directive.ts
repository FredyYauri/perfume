import { Directive, ElementRef, inject, input } from '@angular/core';
import { BRAND_CONFIG } from '../../core/config';

/** Reemplaza la imagen por un placeholder si no se puede cargar (p. ej. archivo aún no subido). */
@Directive({
  selector: 'img[appImgFallback]',
  host: { '(error)': 'useFallback()' },
})
export class ImgFallbackDirective {
  readonly appImgFallback = input<string>('');

  private readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef);

  protected useFallback(): void {
    const image = this.element.nativeElement;
    const fallback = this.appImgFallback() || BRAND_CONFIG.images.perfumePlaceholder;
    if (!image.src.endsWith(fallback)) {
      image.src = fallback;
    }
  }
}
