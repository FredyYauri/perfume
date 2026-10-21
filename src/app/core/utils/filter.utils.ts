import { CATALOG_CONFIG } from '../config/catalog.config';
import {
  FilterOptions,
  FilterState,
  Gender,
  OlfactoryProfile,
  Perfume,
  SortOption,
} from '../models';
import { getSize, isSizeAvailable } from './perfume.utils';
import { normalizeText } from './text.utils';

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  category: null,
  profiles: [],
  occasions: [],
  intensity: null,
  genders: [],
  brands: [],
  sizeMl: CATALOG_CONFIG.defaultFormatMl,
  onlyInStock: false,
  sort: 'curation',
};

const GENDER_ORDER: readonly Gender[] = ['female', 'male', 'unisex'];
const OCCASION_ORDER: readonly string[] = ['Diario', 'Oficina', 'Cita', 'Noche', 'Evento'];
const INTENSITY_ORDER: readonly string[] = ['Suave', 'Equilibrada', 'Intensa'];

function matchesAny<T>(selected: readonly T[], values: readonly T[]): boolean {
  return selected.length === 0 || values.some((value) => selected.includes(value));
}

/** Texto en el que busca el buscador: marca, nombre, notas, perfiles y "sensaciones". */
function searchableText(perfume: Perfume, profiles: ReadonlyMap<string, OlfactoryProfile>): string {
  const profileText = perfume.olfactoryProfiles.map((id) => {
    const profile = profiles.get(id);
    return profile ? `${profile.name} ${profile.mood}` : id;
  });
  return normalizeText(
    [
      perfume.brand,
      perfume.name,
      perfume.olfactoryFamily,
      ...perfume.notes,
      ...perfume.occasions,
      ...perfume.tags,
      ...profileText,
    ].join(' '),
  );
}

function priceFor(perfume: Perfume, ml: number): number {
  return getSize(perfume, ml)?.price ?? Number.POSITIVE_INFINITY;
}

function sorter(sort: SortOption, ml: number): (a: Perfume, b: Perfume) => number {
  switch (sort) {
    case 'popular':
      return (a, b) => b.popularity - a.popularity;
    case 'price':
      return (a, b) => priceFor(a, ml) - priceFor(b, ml) || a.curationOrder - b.curationOrder;
    case 'newest':
      return (a, b) => a.releaseRank - b.releaseRank;
    case 'curation':
    default:
      return (a, b) => a.curationOrder - b.curationOrder;
  }
}

/** Aplica búsqueda, filtros y orden. Función pura: fácil de mover al backend más adelante. */
export function filterPerfumes(
  perfumes: readonly Perfume[],
  state: FilterState,
  profiles: ReadonlyMap<string, OlfactoryProfile> = new Map(),
): Perfume[] {
  const words = normalizeText(state.search).split(/\s+/).filter(Boolean);
  return perfumes
    .filter((perfume) => {
      if (state.category && perfume.category !== state.category) {
        return false;
      }
      if (state.intensity && perfume.intensity !== state.intensity) {
        return false;
      }
      if (
        !matchesAny(state.profiles, perfume.olfactoryProfiles) ||
        !matchesAny(state.occasions, perfume.occasions) ||
        !matchesAny(state.genders, [perfume.gender]) ||
        !matchesAny(state.brands, [perfume.brand])
      ) {
        return false;
      }
      if (state.onlyInStock && !isSizeAvailable(getSize(perfume, state.sizeMl))) {
        return false;
      }
      if (words.length) {
        const haystack = searchableText(perfume, profiles);
        return words.every((word) => haystack.includes(word));
      }
      return true;
    })
    .sort(sorter(state.sort, state.sizeMl));
}

/** Cuenta los filtros activos (sin contar búsqueda, formato ni orden). */
export function countActiveFilters(state: FilterState): number {
  return (
    Number(!!state.category) +
    state.profiles.length +
    state.occasions.length +
    Number(!!state.intensity) +
    state.genders.length +
    state.brands.length +
    Number(state.onlyInStock)
  );
}

function orderBy(values: Iterable<string>, order: readonly string[]): string[] {
  const unique = [...new Set(values)];
  const rank = (value: string) => (order.includes(value) ? order.indexOf(value) : order.length);
  return unique.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, 'es'));
}

export function buildFilterOptions(perfumes: readonly Perfume[]): FilterOptions {
  return {
    brands: orderBy(
      perfumes.map((p) => p.brand),
      [],
    ),
    occasions: orderBy(
      perfumes.flatMap((p) => p.occasions),
      OCCASION_ORDER,
    ),
    intensities: orderBy(
      perfumes.map((p) => p.intensity),
      INTENSITY_ORDER,
    ),
    genders: GENDER_ORDER.filter((gender) => perfumes.some((p) => p.gender === gender)),
    sizes: [...new Set(perfumes.flatMap((p) => p.sizes.map((s) => s.ml)))].sort((a, b) => a - b),
  };
}
