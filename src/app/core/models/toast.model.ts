export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  readonly id: number;
  readonly type: ToastType;
  readonly message: string;
}
