import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DiscountService, PerfumeService, SelectionService } from '../../core/services';
import { SelectionPanelComponent } from '../../shared/components/selection-panel/selection-panel.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';

/** Revisión final del pedido antes de enviarlo por WhatsApp. */
@Component({
  selector: 'app-selection-page',
  imports: [RouterLink, SelectionPanelComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selection-page.component.html',
  styleUrl: './selection-page.component.scss',
})
export class SelectionPageComponent {
  protected readonly selection = inject(SelectionService);
  protected readonly rules = inject(DiscountService).rules;

  constructor() {
    // Carga el catálogo para poder cambiar formatos y validar stock desde esta página.
    void inject(PerfumeService).load();
  }
}
