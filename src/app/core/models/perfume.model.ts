export type Gender = 'male' | 'female' | 'unisex';

/** Id de colección/categoría (ver `assets/data/categories.json`). */
export type PerfumeCategoryId = string;

export type CardLayout = 'regular' | 'tall' | 'wide';

export interface PerfumeSize {
  /** Volumen del decant en mililitros. */
  readonly ml: number;
  /** Precio en soles (S/). */
  readonly price: number;
  readonly stock: number;
}

/** Colores usados para la ilustración del frasco y el fondo de la tarjeta. */
export interface PerfumePalette {
  readonly background: string;
  readonly primary: string;
  readonly secondary: string;
  readonly liquid: string;
}

export interface Perfume {
  readonly id: string;
  readonly brand: string;
  readonly name: string;
  readonly description: string;
  readonly category: PerfumeCategoryId;
  readonly gender: Gender;
  /** Descripción legible de la familia, p. ej. "Dulce · Amaderado". */
  readonly olfactoryFamily: string;
  /** Ids de perfiles olfativos (ver `assets/data/olfactory-profiles.json`). */
  readonly olfactoryProfiles: readonly string[];
  /** Notas en orden de pirámide: salida, corazón, fondo. */
  readonly notes: readonly string[];
  readonly occasions: readonly string[];
  readonly intensity: string;
  readonly sizes: readonly PerfumeSize[];
  /** Foto del producto (WebP en `assets/images/perfumes`). Sin foto se dibuja el frasco ilustrado. */
  readonly image?: string;
  readonly tags: readonly string[];
  readonly rating: number;
  readonly reviewsCount: number;
  readonly popularity: number;
  /** Menor = más reciente. */
  readonly releaseRank: number;
  /** Orden editorial ("Curaduría"). */
  readonly curationOrder: number;
  readonly cardLayout: CardLayout;
  readonly palette: PerfumePalette;
  readonly active: boolean;
}
