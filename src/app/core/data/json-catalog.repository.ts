import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DATA_SOURCE_CONFIG } from '../config';
import { Category, DiscountRule, OlfactoryProfile, Perfume } from '../models';
import { CatalogRepository } from './catalog.repository';

/** Implementación que lee los archivos JSON de `src/assets/data/`. */
@Injectable()
export class JsonCatalogRepository extends CatalogRepository {
  private readonly http = inject(HttpClient);

  getPerfumes(): Observable<Perfume[]> {
    return this.http.get<Perfume[]>(DATA_SOURCE_CONFIG.perfumesUrl);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(DATA_SOURCE_CONFIG.categoriesUrl);
  }

  getOlfactoryProfiles(): Observable<OlfactoryProfile[]> {
    return this.http.get<OlfactoryProfile[]>(DATA_SOURCE_CONFIG.olfactoryProfilesUrl);
  }

  getDiscountRules(): Observable<DiscountRule[]> {
    return this.http.get<DiscountRule[]>(DATA_SOURCE_CONFIG.discountRulesUrl);
  }
}
