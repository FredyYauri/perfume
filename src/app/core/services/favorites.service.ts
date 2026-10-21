import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { STORAGE_KEYS } from '../config';
import { StorageService } from './storage.service';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(StorageService);
  private readonly idsState = signal<readonly string[]>(
    this.storage.read(STORAGE_KEYS.favorites, isStringArray, []),
  );
  private readonly idSet = computed(() => new Set(this.idsState()));

  readonly ids = this.idsState.asReadonly();
  readonly count = computed(() => this.idsState().length);

  constructor() {
    effect(() => this.storage.write(STORAGE_KEYS.favorites, this.idsState()));
  }

  isFavorite(id: string): boolean {
    return this.idSet().has(id);
  }

  /** Alterna el favorito y devuelve el nuevo estado. */
  toggle(id: string): boolean {
    const willBeFavorite = !this.isFavorite(id);
    this.idsState.update((ids) =>
      willBeFavorite ? [...ids, id] : ids.filter((favoriteId) => favoriteId !== id),
    );
    return willBeFavorite;
  }
}
