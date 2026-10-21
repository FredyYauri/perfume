/** Textos reutilizables de la interfaz. */
export const UI_TEXTS = {
  orderButton: 'Realizar pedido',
  searchPlaceholder: 'Busca por nombre, marca o sensación',
  emptyResultsTitle: 'No encontramos fragancias con estos filtros.',
  emptyResultsMessage:
    'Prueba con menos filtros o busca una sensación distinta: “fresco”, “vainilla”, “noche”.',
  emptySelectionTitle: 'Aún no agregaste fragancias a tu selección.',
  emptySelectionMessage: 'Empieza por una que te represente.',
  emptyFavoritesTitle: 'Todavía no guardas favoritos.',
  emptyFavoritesMessage: 'Toca el corazón en cualquier fragancia para tenerla siempre a mano.',
  loadErrorTitle: 'No pudimos cargar el catálogo.',
  loadErrorMessage: 'Revisa tu conexión e inténtalo nuevamente.',
  outOfStock: 'Agotado',
  shippingNote: 'Envíos a todo el Perú. Costo y entrega se coordinan por WhatsApp.',
  orderNote: 'Precios en soles. Te llevamos a WhatsApp con tu pedido listo; no cobramos en la web.',
  toasts: {
    added: (name: string, ml: number) => `${name} · ${ml} ml se añadió a tu selección.`,
    removed: (name: string) => `${name} salió de tu selección.`,
    cleared: 'Tu selección quedó vacía.',
    formatChanged: (ml: number) => `Tu set ahora está en formato ${ml} ml.`,
    emptyOrder: 'Agrega al menos una fragancia antes de realizar el pedido.',
    whatsappOpened: 'Abrimos WhatsApp con tu pedido. ¡Gracias!',
    stockLimit: 'Alcanzaste el stock disponible para esta presentación.',
    favoriteAdded: 'Guardado en favoritos.',
    favoriteRemoved: 'Quitado de favoritos.',
  },
  whatsapp: {
    greeting: 'Mucho gusto, me gustaría realizar el siguiente pedido:',
    closing:
      'Quedo atento(a) a la confirmación de disponibilidad y método de entrega. Muchas gracias.',
  },
} as const;
