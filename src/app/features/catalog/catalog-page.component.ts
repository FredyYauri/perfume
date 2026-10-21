import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StudioComponent } from './components/studio/studio.component';

/** Página dedicada al catálogo (mismo estudio que el inicio, con URL propia y filtros por query params). */
@Component({
  selector: 'app-catalog-page',
  imports: [StudioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-studio [headingLevel]="1" />`,
})
export class CatalogPageComponent {}
