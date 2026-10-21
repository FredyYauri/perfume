/** Identidad de la tienda: nombre, textos de marca e imágenes generales. */
export const BRAND_CONFIG = {
  name: 'ESENCIA LAB',
  /** El logotipo se compone de dos partes con pesos distintos: ESENCIA + LAB. */
  logoPrimary: 'ESENCIA',
  logoSecondary: 'LAB',
  tagline: 'Fragancias originales para descubrir sin límites.',
  country: 'Perú',
  currencySymbol: 'S/',
  locale: 'es-PE',
  social: {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
  },
  images: {
    perfumePlaceholder: 'assets/images/placeholders/perfume-placeholder.webp',
    logo: 'assets/images/icons/logo.svg',
  },
} as const;
