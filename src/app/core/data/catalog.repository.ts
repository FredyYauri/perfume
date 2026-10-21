import { Observable } from 'rxjs';
import { Category, DiscountRule, OlfactoryProfile, Perfume } from '../models';

/**
 * Contrato de acceso a datos del catálogo. Los servicios dependen de esta abstracción,
 * así que migrar a una API REST, Firebase o Supabase solo requiere una nueva implementación
 * registrada en `app.config.ts`.
 */
export abstract class CatalogRepository {
  abstract getPerfumes(): Observable<Perfume[]>;
  abstract getCategories(): Observable<Category[]>;
  abstract getOlfactoryProfiles(): Observable<OlfactoryProfile[]>;
  abstract getDiscountRules(): Observable<DiscountRule[]>;
}
