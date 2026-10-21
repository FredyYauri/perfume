import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CATALOG_CONFIG, STORAGE_KEYS, UI_TEXTS } from '../config';
import { CartItem, OrderSummary, Perfume, PerfumeSize } from '../models';
import { buildSelectionKey, getPerfumeDisplayName, getSize, isSizeAvailable } from '../utils';
import { DiscountService } from './discount.service';
import { PerfumeService } from './perfume.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

const isCartItemArray = (value: unknown): value is CartItem[] =>
  Array.isArray(value) &&
  value.every(
    (item: Partial<CartItem> | null) =>
      !!item &&
      typeof item.key === 'string' &&
      typeof item.perfumeId === 'string' &&
      typeof item.brand === 'string' &&
      typeof item.name === 'string' &&
      typeof item.ml === 'number' &&
      typeof item.unitPrice === 'number' &&
      typeof item.quantity === 'number' &&
      typeof item.maxQuantity === 'number' &&
      typeof item.background === 'string' &&
      typeof item.liquid === 'string',
  );

const isNumber = (value: unknown): value is number => typeof value === 'number';

function toCartItem(perfume: Perfume, size: PerfumeSize, quantity: number): CartItem {
  return {
    key: buildSelectionKey(perfume.id, size.ml),
    perfumeId: perfume.id,
    brand: perfume.brand,
    name: perfume.name,
    ml: size.ml,
    unitPrice: size.price,
    quantity: Math.min(quantity, size.stock),
    maxQuantity: size.stock,
    background: perfume.palette.background,
    liquid: perfume.palette.liquid,
  };
}

/**
 * Gestiona la selección (carrito) y el formato elegido en el estudio.
 * Todo se persiste en localStorage para sobrevivir recargas y nuevas visitas.
 */
@Injectable({ providedIn: 'root' })
export class SelectionService {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);
  private readonly discounts = inject(DiscountService);
  private readonly perfumeService = inject(PerfumeService);

  private readonly itemsState = signal<readonly CartItem[]>(
    this.storage.read(STORAGE_KEYS.selection, isCartItemArray, []),
  );
  private readonly storedFormat = this.storage.read<number | null>(
    STORAGE_KEYS.format,
    (value): value is number | null => value === null || isNumber(value),
    null,
  );
  private readonly formatState = signal<number>(
    this.storedFormat ?? CATALOG_CONFIG.defaultFormatMl,
  );

  readonly items = this.itemsState.asReadonly();
  /** Formato (ml) con el que se añaden los perfumes desde el estudio. */
  readonly format = this.formatState.asReadonly();
  /** `true` cuando el usuario ya eligió formato alguna vez (paso 01 completado). */
  readonly formatChosen = signal(this.storedFormat !== null);
  /** Número de "ficha" decorativo del panel, estable entre visitas. */
  readonly sheetNumber = signal(
    this.storage.read(STORAGE_KEYS.sheetNumber, isNumber, Math.floor(100 + Math.random() * 900)),
  );

  readonly isEmpty = computed(() => this.itemsState().length === 0);
  readonly summary = computed<OrderSummary>(() => this.discounts.summarize(this.itemsState()));
  readonly itemCount = computed(() => this.summary().itemCount);
  /** Cambia en cada alta para animar indicadores (badge del header, bandeja móvil). */
  readonly lastChange = signal(0);

  constructor() {
    effect(() => this.storage.write(STORAGE_KEYS.selection, this.itemsState()));
    effect(() => {
      if (this.formatChosen()) {
        this.storage.write(STORAGE_KEYS.format, this.formatState());
      }
    });
    effect(() => this.storage.write(STORAGE_KEYS.sheetNumber, this.sheetNumber()));
    // Cuando el catálogo carga, sincroniza precios/stock guardados con los datos vigentes.
    effect(() => {
      if (this.perfumeService.status() === 'loaded') {
        this.reconcile(this.perfumeService.perfumes());
      }
    });
  }

  has(perfumeId: string, ml: number): boolean {
    const key = buildSelectionKey(perfumeId, ml);
    return this.itemsState().some((item) => item.key === key);
  }

  quantityOf(perfumeId: string, ml: number): number {
    const key = buildSelectionKey(perfumeId, ml);
    return this.itemsState().find((item) => item.key === key)?.quantity ?? 0;
  }

  /** Agrega una presentación respetando el stock. Devuelve `true` si se agregó algo. */
  add(perfume: Perfume, ml: number, quantity = 1): boolean {
    const size = getSize(perfume, ml);
    const current = this.quantityOf(perfume.id, ml);
    if (!isSizeAvailable(size)) {
      this.toast.error(UI_TEXTS.outOfStock);
      return false;
    }
    const nextQuantity = Math.min(current + quantity, size.stock);
    if (nextQuantity <= current) {
      this.toast.error(UI_TEXTS.toasts.stockLimit);
      return false;
    }

    const item = toCartItem(perfume, size, nextQuantity);
    this.itemsState.update((items) =>
      current > 0
        ? items.map((existing) => (existing.key === item.key ? item : existing))
        : [...items, item],
    );
    this.lastChange.update((value) => value + 1);
    this.toast.success(UI_TEXTS.toasts.added(getPerfumeDisplayName(perfume), ml));
    if (nextQuantity < current + quantity) {
      this.toast.info(UI_TEXTS.toasts.stockLimit);
    }
    return true;
  }

  /** Agrega o quita el perfume en el formato indicado (botón +/✓ de las tarjetas). */
  toggle(perfume: Perfume, ml: number): void {
    if (this.has(perfume.id, ml)) {
      this.remove(buildSelectionKey(perfume.id, ml));
    } else {
      this.add(perfume, ml);
    }
  }

  updateQuantity(key: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(key);
      return;
    }
    this.itemsState.update((items) =>
      items.map((item) =>
        item.key === key ? { ...item, quantity: Math.min(quantity, item.maxQuantity) } : item,
      ),
    );
  }

  /** Cambia el formato de una muestra concreta (mini selector del panel). */
  changeSize(key: string, ml: number): void {
    const item = this.itemsState().find((existing) => existing.key === key);
    const perfume = item ? this.perfumeService.getById(item.perfumeId) : undefined;
    const size = perfume ? getSize(perfume, ml) : null;
    if (!item || !perfume || item.ml === ml) {
      return;
    }
    if (!isSizeAvailable(size)) {
      this.toast.error(`${UI_TEXTS.outOfStock}: ${perfume.name} · ${ml} ml`);
      return;
    }
    this.itemsState.update((items) => this.moveItem(items, item, perfume, size));
  }

  /** Paso 01: cambia el formato del estudio y actualiza el set (si hay stock). */
  setFormat(ml: number): void {
    this.formatChosen.set(true);
    if (this.formatState() === ml) {
      return;
    }
    this.formatState.set(ml);
    const perfumes = new Map(this.perfumeService.perfumes().map((p) => [p.id, p]));
    let items = this.itemsState();
    for (const item of items) {
      const perfume = perfumes.get(item.perfumeId);
      const size = perfume ? getSize(perfume, ml) : null;
      if (perfume && isSizeAvailable(size) && item.ml !== ml) {
        items = this.moveItem(items, item, perfume, size);
      }
    }
    if (items !== this.itemsState()) {
      this.itemsState.set(items);
      this.toast.info(UI_TEXTS.toasts.formatChanged(ml));
    }
  }

  remove(key: string): void {
    const item = this.itemsState().find((existing) => existing.key === key);
    if (!item) {
      return;
    }
    this.itemsState.update((items) => items.filter((existing) => existing.key !== key));
    this.toast.info(UI_TEXTS.toasts.removed(getPerfumeDisplayName(item)));
  }

  clear(): void {
    if (this.isEmpty()) {
      return;
    }
    this.itemsState.set([]);
    this.toast.info(UI_TEXTS.toasts.cleared);
  }

  /** Mueve una muestra a otro formato, fusionándola si ese formato ya estaba en el set. */
  private moveItem(
    items: readonly CartItem[],
    item: CartItem,
    perfume: Perfume,
    size: PerfumeSize,
  ): readonly CartItem[] {
    const targetKey = buildSelectionKey(perfume.id, size.ml);
    const existing = items.find((candidate) => candidate.key === targetKey);
    const moved = toCartItem(perfume, size, item.quantity + (existing?.quantity ?? 0));
    return items
      .filter((candidate) => candidate.key !== targetKey)
      .map((candidate) => (candidate.key === item.key ? moved : candidate));
  }

  private reconcile(perfumes: readonly Perfume[]): void {
    const byId = new Map(perfumes.map((perfume) => [perfume.id, perfume]));
    const current = this.itemsState();
    const next = current.flatMap((item): CartItem[] => {
      const perfume = byId.get(item.perfumeId);
      const size = perfume ? getSize(perfume, item.ml) : null;
      return perfume && isSizeAvailable(size) ? [toCartItem(perfume, size, item.quantity)] : [];
    });
    const changed =
      next.length !== current.length ||
      next.some((item, index) =>
        (Object.keys(item) as (keyof CartItem)[]).some((key) => item[key] !== current[index][key]),
      );
    if (changed) {
      this.itemsState.set(next);
    }
  }
}
