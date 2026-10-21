import { Perfume, PerfumeSize } from '../models';

export function isSizeAvailable(size: PerfumeSize | null | undefined): size is PerfumeSize {
  return !!size && size.stock > 0;
}

export function isPerfumeAvailable(perfume: Perfume): boolean {
  return perfume.sizes.some(isSizeAvailable);
}

export function getSize(perfume: Perfume, ml: number): PerfumeSize | null {
  return perfume.sizes.find((size) => size.ml === ml) ?? null;
}

/** Precio más bajo entre las presentaciones (prioriza las disponibles). */
export function getStartingPrice(perfume: Perfume): number {
  const available = perfume.sizes.filter(isSizeAvailable);
  const source = available.length ? available : perfume.sizes;
  return Math.min(...source.map((size) => size.price));
}

/** Presentación preferida si hay stock; si no, la primera disponible. */
export function getDefaultSize(perfume: Perfume, preferredMl?: number): PerfumeSize | null {
  const preferred = preferredMl != null ? getSize(perfume, preferredMl) : null;
  return isSizeAvailable(preferred) ? preferred : (perfume.sizes.find(isSizeAvailable) ?? null);
}

export function buildSelectionKey(perfumeId: string, ml: number): string {
  return `${perfumeId}-${ml}`;
}

export function getPerfumeDisplayName(perfume: Pick<Perfume, 'brand' | 'name'>): string {
  return `${perfume.brand} ${perfume.name}`;
}
