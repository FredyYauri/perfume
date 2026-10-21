/**
 * Origen de los datos. Hoy apunta a JSON locales; para migrar a una API REST basta con
 * cambiar estas rutas o reemplazar el proveedor de `CatalogRepository` (ver `core/data`).
 */
export const DATA_SOURCE_CONFIG = {
  perfumesUrl: 'assets/data/perfumes.json',
  categoriesUrl: 'assets/data/categories.json',
  olfactoryProfilesUrl: 'assets/data/olfactory-profiles.json',
  discountRulesUrl: 'assets/data/discount-rules.json',
} as const;
