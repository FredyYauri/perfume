import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND_CONFIG, PAYMENT_METHODS, WHATSAPP_CONFIG } from '../../core/config';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { HELP_LINKS, NAV_LINKS } from '../navigation';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly brand = BRAND_CONFIG;
  protected readonly shopLinks = NAV_LINKS;
  protected readonly helpLinks = HELP_LINKS;
  protected readonly payments = PAYMENT_METHODS;
  protected readonly year = new Date().getFullYear();
  protected readonly whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}`;
}
