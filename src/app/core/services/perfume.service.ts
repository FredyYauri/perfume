import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';
import { CATALOG_CONFIG } from '../config';
import { CatalogRepository } from '../data/catalog.repository';
import { Category, FilterState, OlfactoryProfile, Perfume } from '../models';
import { buildFilterOptions, filterPerfumes } from '../utils';

export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

/** Carga el catálogo desde el repositorio y expone datos derivados como signals. */
@Injectable({ providedIn: 'root' })
export class PerfumeService {
  private readonly repository = inject(CatalogRepository);

  private readonly allPerfumes = signal<readonly Perfume[]>([]);
  private readonly categoriesState = signal<readonly Category[]>([]);
  private readonly profilesState = signal<readonly OlfactoryProfile[]>([]);
  private readonly statusState = signal<LoadStatus>('idle');
  private loadPromise: Promise<void> | null = null;

  readonly status = this.statusState.asReadonly();
  readonly isLoading = computed(() => ['idle', 'loading'].includes(this.statusState()));
  readonly hasError = computed(() => this.statusState() === 'error');

  /** Solo perfumes activos. */
  readonly perfumes = computed(() => this.allPerfumes().filter((perfume) => perfume.active));
  readonly categories = computed(() =>
    [...this.categoriesState()].sort((a, b) => a.order - b.order),
  );
  readonly profiles = this.profilesState.asReadonly();
  readonly profileMap = computed(
    () => new Map(this.profilesState().map((profile) => [profile.id, profile])),
  );
  readonly categoryMap = computed(
    () => new Map(this.categoriesState().map((category) => [category.id, category])),
  );
  readonly filterOptions = computed(() => buildFilterOptions(this.perfumes()));

  /** Cantidad de perfumes por colección (para los contadores del filtro). */
  readonly categoryCounts = computed(() => {
    const counts = new Map<string, number>();
    for (const perfume of this.perfumes()) {
      counts.set(perfume.category, (counts.get(perfume.category) ?? 0) + 1);
    }
    return counts;
  });

  /** Precio mínimo por formato (para "Desde S/ …" en el selector de formato). */
  readonly minPriceBySize = computed(() => {
    const prices = new Map<number, number>();
    for (const size of this.perfumes().flatMap((perfume) => perfume.sizes)) {
      prices.set(size.ml, Math.min(prices.get(size.ml) ?? Infinity, size.price));
    }
    return prices;
  });

  /** Carga los datos una sola vez; llamadas repetidas reutilizan la misma promesa. */
  load(): Promise<void> {
    this.loadPromise ??= this.fetch();
    return this.loadPromise;
  }

  retry(): Promise<void> {
    this.loadPromise = null;
    return this.load();
  }

  filter(state: FilterState): Perfume[] {
    return filterPerfumes(this.perfumes(), state, this.profileMap());
  }

  getById(id: string): Perfume | undefined {
    return this.perfumes().find((perfume) => perfume.id === id);
  }

  getRelated(perfume: Perfume): Perfume[] {
    return this.perfumes()
      .filter((candidate) => candidate.id !== perfume.id)
      .map((candidate) => ({
        candidate,
        score:
          candidate.olfactoryProfiles.filter((id) => perfume.olfactoryProfiles.includes(id))
            .length *
            3 +
          Number(candidate.gender === perfume.gender) +
          Number(candidate.category === perfume.category) +
          candidate.notes.filter((note) => perfume.notes.includes(note)).length,
      }))
      .sort((a, b) => b.score - a.score || b.candidate.popularity - a.candidate.popularity)
      .slice(0, CATALOG_CONFIG.relatedLimit)
      .map(({ candidate }) => candidate);
  }

  private async fetch(): Promise<void> {
    this.statusState.set('loading');
    try {
      const { perfumes, categories, profiles } = await firstValueFrom(
        forkJoin({
          perfumes: this.repository.getPerfumes(),
          categories: this.repository.getCategories(),
          profiles: this.repository.getOlfactoryProfiles(),
        }),
      );
      this.allPerfumes.set(perfumes);
      this.categoriesState.set(categories);
      this.profilesState.set(profiles);
      this.statusState.set('loaded');
    } catch (error) {
      console.error('Error al cargar el catálogo', error);
      this.statusState.set('error');
      this.loadPromise = null;
    }
  }
}
