/**
 * Elemento de la selección. Guarda una copia de los datos mostrados para que la
 * selección persistida siga siendo legible aunque el catálogo aún no haya cargado.
 */
export interface CartItem {
  /** Clave única: `${perfumeId}-${ml}`. */
  readonly key: string;
  readonly perfumeId: string;
  readonly brand: string;
  readonly name: string;
  readonly ml: number;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly maxQuantity: number;
  /** Colores para la miniatura ilustrada. */
  readonly background: string;
  readonly liquid: string;
}
