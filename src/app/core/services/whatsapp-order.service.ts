import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { UI_TEXTS, WHATSAPP_CONFIG } from '../config';
import { CartItem, OrderSummary, WhatsAppOrder } from '../models';
import { formatPrice } from '../utils';
import { SelectionService } from './selection.service';
import { ToastService } from './toast.service';

/** Construye el mensaje del pedido y abre WhatsApp con él precargado. */
@Injectable({ providedIn: 'root' })
export class WhatsAppOrderService {
  private readonly selection = inject(SelectionService);
  private readonly toast = inject(ToastService);
  private readonly window = inject(DOCUMENT).defaultView;

  buildMessage(summary: OrderSummary): string {
    const items = summary.items.map((item) => this.formatItem(item)).join('\n\n');
    return [
      UI_TEXTS.whatsapp.greeting,
      '',
      items,
      '',
      `Subtotal: ${formatPrice(summary.subtotal)}`,
      `Descuento: ${formatPrice(summary.discount)}`,
      `Total estimado: ${formatPrice(summary.total)}`,
      '',
      UI_TEXTS.whatsapp.closing,
    ].join('\n');
  }

  buildOrder(summary: OrderSummary): WhatsAppOrder {
    const message = this.buildMessage(summary);
    const phoneNumber = WHATSAPP_CONFIG.phoneNumber;
    return {
      phoneNumber,
      message,
      url: `${WHATSAPP_CONFIG.baseUrl}${phoneNumber}?text=${encodeURIComponent(message)}`,
    };
  }

  /** Abre WhatsApp con la selección actual. Devuelve `false` si la selección está vacía. */
  placeOrder(): boolean {
    const summary = this.selection.summary();
    if (summary.items.length === 0) {
      this.toast.error(UI_TEXTS.toasts.emptyOrder);
      return false;
    }
    const { url } = this.buildOrder(summary);
    this.window?.open(url, '_blank', 'noopener,noreferrer');
    this.toast.success(UI_TEXTS.toasts.whatsappOpened);
    return true;
  }

  private formatItem(item: CartItem): string {
    return [
      `- ${item.brand} ${item.name}`,
      `  Presentación: ${item.ml} ml`,
      `  Cantidad: ${item.quantity}`,
      `  Precio: ${formatPrice(item.unitPrice * item.quantity)}`,
    ].join('\n');
  }
}
