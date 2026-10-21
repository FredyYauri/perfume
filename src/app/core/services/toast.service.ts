import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models';

const DEFAULT_DURATION_MS = 3500;
const MAX_VISIBLE = 3;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsState = signal<readonly Toast[]>([]);
  private nextId = 1;

  readonly toasts = this.toastsState.asReadonly();

  show(message: string, type: ToastType = 'info', durationMs = DEFAULT_DURATION_MS): void {
    const toast: Toast = { id: this.nextId++, type, message };
    this.toastsState.update((toasts) => [...toasts, toast].slice(-MAX_VISIBLE));
    setTimeout(() => this.dismiss(toast.id), durationMs);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  dismiss(id: number): void {
    this.toastsState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
