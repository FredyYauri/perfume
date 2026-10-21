import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND_CONFIG } from '../../core/config';
import { FavoritesService, SelectionService, UiStateService } from '../../core/services';
import { BodyScrollLockDirective } from '../../shared/directives/body-scroll-lock.directive';
import { ReplayAnimationDirective } from '../../shared/directives/replay-animation.directive';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { NAV_LINKS } from '../navigation';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconComponent, BodyScrollLockDirective, ReplayAnimationDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: { '(document:keydown.escape)': 'ui.closeMobileMenu()' },
})
export class HeaderComponent {
  protected readonly ui = inject(UiStateService);
  protected readonly selection = inject(SelectionService);
  protected readonly favorites = inject(FavoritesService);
  protected readonly brand = BRAND_CONFIG;
  protected readonly links = NAV_LINKS;
}
