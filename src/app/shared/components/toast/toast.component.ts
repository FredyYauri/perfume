import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastType } from '../../../core/models';
import { ToastService } from '../../../core/services';
import { IconComponent, IconName } from '../../ui/icon/icon.component';

const TOAST_ICONS: Readonly<Record<ToastType, IconName>> = {
  success: 'check',
  info: 'info',
  error: 'alert',
};

@Component({
  selector: 'app-toast',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" [attr.role]="toast.type === 'error' ? 'alert' : 'status'">
          <app-icon class="toast__icon" [name]="icons[toast.type]" [size]="16" [strokeWidth]="2" />
          <p class="toast__message">{{ toast.message }}</p>
          <button
            type="button"
            class="toast__close"
            aria-label="Cerrar notificación"
            (click)="toastService.dismiss(toast.id)"
          >
            <app-icon name="close" [size]="14" />
          </button>
        </div>
      }
    </div>
  `,
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly icons = TOAST_ICONS;
}
