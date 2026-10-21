import type { MockInstance } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { WHATSAPP_CONFIG } from '../config';
import { CatalogRepository } from '../data/catalog.repository';
import { OrderSummary } from '../models';
import { InMemoryCatalogRepository, cartItem } from '../../../testing/catalog.fixtures';
import { ToastService } from './toast.service';
import { WhatsAppOrderService } from './whatsapp-order.service';

const SUMMARY: OrderSummary = {
  items: [cartItem({ quantity: 2 }), cartItem({ brand: 'Afnan', name: '9PM', ml: 10, unitPrice: 30 })],
  itemCount: 3,
  subtotal: 120,
  discount: 12,
  total: 108,
  appliedRule: null,
  nextRule: null,
  itemsToNextRule: 0,
};

describe('WhatsAppOrderService', () => {
  let service: WhatsAppOrderService;
  let open: MockInstance<Window['open']>;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: CatalogRepository, useValue: new InMemoryCatalogRepository() }],
    });
    open = vi.spyOn(TestBed.inject(DOCUMENT).defaultView!, 'open').mockImplementation(() => null);
    service = TestBed.inject(WhatsAppOrderService);
  });

  it('genera el mensaje con el formato acordado', () => {
    expect(service.buildMessage(SUMMARY)).toBe(
      [
        'Mucho gusto, me gustaría realizar el siguiente pedido:',
        '',
        '- Dior Sauvage EDP',
        '  Presentación: 5 ml',
        '  Cantidad: 2',
        '  Precio: S/ 90.00',
        '',
        '- Afnan 9PM',
        '  Presentación: 10 ml',
        '  Cantidad: 1',
        '  Precio: S/ 30.00',
        '',
        'Subtotal: S/ 120.00',
        'Descuento: S/ 12.00',
        'Total estimado: S/ 108.00',
        '',
        'Quedo atento(a) a la confirmación de disponibilidad y método de entrega. Muchas gracias.',
      ].join('\n'),
    );
  });

  it('codifica el mensaje en la URL de WhatsApp', () => {
    const order = service.buildOrder(SUMMARY);
    expect(order.url).toBe(
      `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(order.message)}`,
    );
  });

  it('no abre WhatsApp si la selección está vacía y avisa con un toast', () => {
    const toast = TestBed.inject(ToastService);
    const error = vi.spyOn(toast, 'error');
    expect(service.placeOrder()).toBe(false);
    expect(open).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalled();
  });
});
