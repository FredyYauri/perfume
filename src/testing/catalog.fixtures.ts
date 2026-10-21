import { Observable, of } from 'rxjs';
import { CatalogRepository } from '../app/core/data/catalog.repository';
import { CartItem, Category, DiscountRule, OlfactoryProfile, Perfume } from '../app/core/models';

export const DISCOUNT_RULES: DiscountRule[] = [
  {
    id: 'set-descubrimiento',
    label: 'Set descubrimiento',
    description: '10% desde 3 decants',
    minItems: 3,
    percentage: 10,
    active: true,
  },
];

export function cartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    key: 'dior-sauvage-edp-5',
    perfumeId: 'dior-sauvage-edp',
    brand: 'Dior',
    name: 'Sauvage EDP',
    ml: 5,
    unitPrice: 45,
    quantity: 1,
    maxQuantity: 10,
    background: '#ddd',
    liquid: '#333',
    ...overrides,
  };
}

/** Repositorio en memoria para pruebas: sirve también de ejemplo de implementación alternativa. */
export class InMemoryCatalogRepository extends CatalogRepository {
  constructor(
    private readonly perfumes: Perfume[] = [],
    private readonly rules: DiscountRule[] = DISCOUNT_RULES,
  ) {
    super();
  }

  getPerfumes(): Observable<Perfume[]> {
    return of(this.perfumes);
  }
  getCategories(): Observable<Category[]> {
    return of([]);
  }
  getOlfactoryProfiles(): Observable<OlfactoryProfile[]> {
    return of([]);
  }
  getDiscountRules(): Observable<DiscountRule[]> {
    return of(this.rules);
  }
}
