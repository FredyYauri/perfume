# ESENCIA LAB · Decants de perfumes originales

Tienda en Angular para vender decants (3, 5 y 10 ml) de perfumes originales. El cliente arma su selección y el pedido se envía por WhatsApp con un mensaje ya redactado. No hay pagos ni checkout: la venta se coordina por chat.

## Requisitos

- **Node.js 22.22.3 o superior** (lo exige Angular 22). Recomendado: Node 24 LTS.
- npm 10+

## Instalación y uso

```bash
npm install
npm start            # servidor de desarrollo en http://localhost:4200
npm run build        # build de producción en dist/perfume/browser
npm test             # pruebas unitarias (Vitest)
```

### Publicar en Vercel con GitHub Actions

El despliegue lo hace el workflow `.github/workflows/deploy.yml`:

- **Pull request a `main`:** corre las pruebas y el build, sin publicar.
- **Push a `main`:** prueba, compila y publica en producción.
- **Manual:** en la pestaña **Actions** → *Desplegar en Vercel* → **Run workflow**, eliges `production` o `preview`.

`vercel.json` desactiva los despliegues automáticos propios de Vercel (`git.deploymentEnabled: false`) para que solo publique GitHub Actions y no haya despliegues duplicados.

Configuración inicial (una sola vez):

1. Crea el proyecto en Vercel: en [vercel.com/new](https://vercel.com/new) importa el repo, o en tu PC ejecuta `npx vercel link`.
2. Crea un token en [vercel.com/account/tokens](https://vercel.com/account/tokens).
3. Copia el **Team ID** (Vercel → Settings del equipo o cuenta) y el **Project ID** (proyecto → Settings → General). Con `vercel link` también aparecen en `.vercel/project.json` como `orgId` y `projectId`.
4. En GitHub: **Settings → Secrets and variables → Actions → New repository secret**, crea:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. Ve a **Actions → Desplegar en Vercel → Run workflow**. Al terminar, el resumen del job muestra la URL publicada.

Para otro hosting estático, sube `dist/perfume/browser` y redirige las rutas desconocidas a `index.html` para que funcionen enlaces como `/perfume/dior-sauvage-edp`.

> El `.gitignore` actual ignora `package-lock.json`. Se recomienda versionarlo para que todos instalen exactamente las mismas versiones.

## Qué cambiar primero

| Qué | Dónde |
| --- | --- |
| Número de WhatsApp | `src/app/core/config/whatsapp.config.ts` (formato internacional sin `+`, hoy `51937564407`) |
| Perfumes, precios y stock | `src/assets/data/perfumes.json` |
| Colecciones | `src/assets/data/categories.json` |
| Perfiles olfativos | `src/assets/data/olfactory-profiles.json` |
| Descuentos por combo | `src/assets/data/discount-rules.json` |
| Nombre de marca, redes, moneda | `src/app/core/config/brand.config.ts` |
| Textos de la interfaz y del mensaje | `src/app/core/config/ui-texts.ts` |
| Textos de portada, reseñas, FAQ | `src/app/core/config/content.config.ts` |
| Formatos, orden y opciones del catálogo | `src/app/core/config/catalog.config.ts` |
| Colores y tipografías | `src/styles/_tokens.scss` |

### Imágenes

Las imágenes viven en `src/assets/images/` (`perfumes`, `categories`, `banners`, `icons`, `placeholders`), en formato WebP. Cada perfume indica su foto en el campo opcional `image` del JSON; ningún componente tiene rutas de imagen escritas a mano.

Los perfumes con `image` muestran su foto; los que no la tienen muestran un frasco ilustrado en SVG con su paleta (campo `palette`). Para agregar una foto: guárdala como `src/assets/images/perfumes/<id>.webp` (idealmente 600×660, producto centrado sobre fondo blanco) y añade `"image": "assets/images/perfumes/<id>.webp"` a ese perfume. Si una foto falla, se muestra `placeholders/perfume-placeholder.webp`.

### Stock

Cada tamaño tiene su `stock`. Con `0` el formato aparece como agotado y no se puede agregar. La cantidad máxima por línea está limitada por ese stock.

## Pedido por WhatsApp

`WhatsAppOrderService` arma el mensaje y abre `https://wa.me/<número>?text=<mensaje>` (codificado con `encodeURIComponent`). Si la selección está vacía, no abre WhatsApp y muestra un aviso. Ejemplo de mensaje:

```
Mucho gusto, me gustaría realizar el siguiente pedido:

- Dior Sauvage EDP
  Presentación: 5 ml
  Cantidad: 2
  Precio: S/ 90.00

Subtotal: S/ 90.00
Descuento: S/ 0.00
Total estimado: S/ 90.00

Quedo atento(a) a la confirmación de disponibilidad y método de entrega. Muchas gracias.
```

El precio de cada línea es precio unitario × cantidad.

## Persistencia

La selección, el formato elegido, el número de ficha y los favoritos se guardan en `localStorage`. Las claves están centralizadas en `src/app/core/config/storage-keys.config.ts` (con sufijo de versión, para poder cambiar el esquema sin romper datos viejos). El botón "Limpiar selección" la vacía.

## Arquitectura

```
src/app/
  core/
    config/      configuración y textos (WhatsApp, marca, catálogo, claves de storage)
    data/        CatalogRepository (contrato) y JsonCatalogRepository (implementación actual)
    guards/      perfumeExistsGuard
    models/      Perfume, PerfumeSize, Category, FilterState, CartItem, OrderSummary, WhatsAppOrder, DiscountRule…
    services/    PerfumeService, SelectionService, FavoritesService, DiscountService,
                 WhatsAppOrderService, ToastService, StorageService
    utils/       filtros, precios, texto
  layout/        header, footer, barra de anuncios, bandeja móvil de selección
  shared/        componentes reutilizables (tarjeta, selector de tamaño, resumen, toast, estados vacíos…)
  features/      páginas: inicio, catálogo, detalle, mi selección, favoritos, nosotros
```

- Componentes standalone con `ChangeDetection.OnPush`, estado con Signals, Reactive Forms tipados para los filtros y rutas con carga diferida.
- Los filtros se reflejan en la URL (`?perfil=dulce,ambar`, `?coleccion=nicho`, `?q=vainilla`), así que se pueden compartir enlaces.

### Migrar a una API

Los servicios no leen los JSON directamente: dependen de la clase abstracta `CatalogRepository`. Para usar una API REST, Firebase o Supabase:

1. Crea una clase que extienda `CatalogRepository` e implemente `getPerfumes`, `getCategories`, `getOlfactoryProfiles` y `getDiscountRules` (devolviendo `Observable` con los mismos modelos).
2. Regístrala en `src/app/app.config.ts`:
   ```ts
   { provide: CatalogRepository, useClass: ApiCatalogRepository }
   ```

No hace falta tocar componentes ni servicios. `src/testing/catalog.fixtures.ts` tiene un `InMemoryCatalogRepository` que sirve de ejemplo.
