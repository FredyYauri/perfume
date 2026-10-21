import type { IconName } from '../../shared/ui/icon/icon.component';

/** Contenido editorial de la tienda. Editar aquí no requiere tocar componentes. */

export const ANNOUNCEMENTS: readonly { readonly icon: IconName; readonly text: string }[] = [
  { icon: 'badge', text: 'Perfumes originales' },
  { icon: 'drop', text: 'Decants preparados con cuidado' },
  { icon: 'box', text: 'Envíos a todo el Perú' },
];

export const HERO_CONTENT = {
  eyebrow: 'Perfumería original en formato inteligente',
  titleStart: 'No necesitas un frasco entero para',
  titleHighlight: 'encontrar',
  titleEnd: 'tu esencia.',
  description:
    'Descubre fragancias originales en formatos pequeños. Prueba, compara y crea una colección que hable de ti.',
  primaryCta: 'Crear mi selección',
  secondaryCta: 'Explorar fragancias',
  formatsStat: '3 · 5 · 10',
  formatsLabel: 'mililitros por decant',
  catalogLabel: 'fragancias en el catálogo',
  badges: {
    original: '100% Original',
    formatsLabel: 'Formatos',
    formats: '3 ml · 5 ml · 10 ml',
    motto: 'Tu aroma, a tu ritmo',
  },
} as const;

export interface Mood {
  readonly id: string;
  readonly title: string;
  readonly notes: string;
  /** Perfiles olfativos que activa en el estudio. */
  readonly profiles: readonly string[];
  readonly theme: 'fresh' | 'sweet' | 'night' | 'chic';
}

export const MOODS: readonly Mood[] = [
  {
    id: 'fresco',
    title: 'Fresco y limpio',
    notes: 'Cítricos · agua · verde',
    profiles: ['citrico', 'acuatico'],
    theme: 'fresh',
  },
  {
    id: 'dulce',
    title: 'Dulce y envolvente',
    notes: 'Vainilla · ámbar · caramelo',
    profiles: ['dulce', 'ambar'],
    theme: 'sweet',
  },
  {
    id: 'nocturno',
    title: 'Intenso y nocturno',
    notes: 'Especias · humo · cuero',
    profiles: ['especiado', 'cuero'],
    theme: 'night',
  },
  {
    id: 'elegante',
    title: 'Elegante y sofisticado',
    notes: 'Iris · madera · almizcle',
    profiles: ['floral', 'amaderado'],
    theme: 'chic',
  },
];

export interface ContentItem {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
}

export const MANIFESTO_IDEAS: readonly { readonly title: string; readonly description: string }[] =
  [
    {
      title: 'Prueba antes de invertir',
      description:
        'Vive la fragancia durante días en tu piel antes de comprar un frasco completo.',
    },
    {
      title: 'Llévala contigo',
      description:
        'Atomizadores ligeros para el bolsillo, el bolso o la maleta. Tu aroma, donde estés.',
    },
    {
      title: 'Descubre sin límites',
      description:
        'Perfumes de diseñador, de nicho y colecciones exclusivas en una sola selección.',
    },
  ];

export const TRUST_ITEMS: readonly ContentItem[] = [
  {
    icon: 'seal',
    title: 'Perfumes originales verificados',
    description: 'Cada decant sale de un frasco auténtico.',
  },
  {
    icon: 'atomizer',
    title: 'Envasado limpio y cuidadoso',
    description: 'Atomizadores nuevos y sellados.',
  },
  {
    icon: 'box',
    title: 'Formatos ideales para descubrir',
    description: '3, 5 y 10 ml para cada ritmo.',
  },
  {
    icon: 'shield',
    title: 'Pedido simple y envíos confiables',
    description: 'Confirmamos todo contigo por WhatsApp antes de enviar.',
  },
];

export interface Review {
  readonly quote: string;
  readonly author: string;
  readonly city: string;
  readonly tried: string;
  readonly rating: number;
  readonly theme: 'navy' | 'ember' | 'moss';
}

/** Reseñas de ejemplo del diseño: reemplazar por testimonios reales. */
export const REVIEWS: readonly Review[] = [
  {
    quote: 'Probé cinco perfumes antes de decidirme. Terminé comprando el frasco del que menos esperaba.',
    author: '[Nombre del cliente]',
    city: 'Lima',
    tried: 'Layton · 5 ml',
    rating: 5,
    theme: 'navy',
  },
  {
    quote: 'El 3 ml cabe en cualquier bolso. Ahora tengo un aroma para la oficina y otro para la noche.',
    author: '[Nombre del cliente]',
    city: 'Arequipa',
    tried: 'Khamrah Qahwa · 3 ml',
    rating: 5,
    theme: 'ember',
  },
  {
    quote: 'Armé mi set de tres y el descuento hizo que probar nicho dejara de ser un lujo lejano.',
    author: '[Nombre del cliente]',
    city: 'Trujillo',
    tried: 'Homme Intense · 10 ml',
    rating: 4,
    theme: 'moss',
  },
];

export const DECANT_FAQ: readonly { readonly question: string; readonly answer: string }[] = [
  {
    question: '¿Qué es un decant?',
    answer:
      'Es una porción de un perfume original trasvasada a un atomizador nuevo. Te permite usar la fragancia varios días antes de comprar el frasco completo.',
  },
  {
    question: '¿Cuántas aplicaciones tiene cada formato?',
    answer: 'Aproximadamente 3 ml ≈ 40 atomizaciones, 5 ml ≈ 70 y 10 ml ≈ 140.',
  },
  {
    question: '¿Cómo pago y recibo mi pedido?',
    answer:
      'No cobramos en la web. Al realizar tu pedido abrimos WhatsApp con el detalle y coordinamos contigo el pago (Yape, Plin, tarjeta o transferencia) y la entrega.',
  },
];

export const PAYMENT_METHODS: readonly string[] = ['Visa', 'Mastercard', 'Yape', 'Plin'];
