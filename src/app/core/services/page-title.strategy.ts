import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { BRAND_CONFIG } from '../config';

/** Títulos de página: "Sección · ESENCIA LAB". */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} · ${BRAND_CONFIG.name}` : `${BRAND_CONFIG.name} · Decants de perfumes originales`);
  }
}
