import { TestBed } from '@angular/core/testing';
import { CatalogRepository } from '../data/catalog.repository';
import { InMemoryCatalogRepository, cartItem } from '../../../testing/catalog.fixtures';
import { DiscountService } from './discount.service';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: CatalogRepository, useValue: new InMemoryCatalogRepository() }],
    });
    service = TestBed.inject(DiscountService);
    await Promise.resolve();
  });

  it('no aplica descuento con menos de 3 decants', () => {
    const summary = service.summarize([cartItem({ quantity: 2 })]);
    expect(summary.subtotal).toBe(90);
    expect(summary.discount).toBe(0);
    expect(summary.total).toBe(90);
    expect(summary.itemsToNextRule).toBe(1);
  });

  it('aplica 10% desde 3 decants sumando cantidades', () => {
    const summary = service.summarize([
      cartItem({ quantity: 2 }),
      cartItem({ key: 'afnan-9pm-5', unitPrice: 15 }),
    ]);
    expect(summary.itemCount).toBe(3);
    expect(summary.subtotal).toBe(105);
    expect(summary.discount).toBe(10.5);
    expect(summary.total).toBe(94.5);
    expect(summary.appliedRule?.id).toBe('set-descubrimiento');
  });
});
