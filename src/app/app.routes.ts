import { Routes } from '@angular/router';
import { perfumeExistsGuard } from './core/guards/perfume-exists.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'catalogo',
    title: 'Catálogo',
    loadComponent: () =>
      import('./features/catalog/catalog-page.component').then((m) => m.CatalogPageComponent),
  },
  {
    path: 'perfume/:id',
    title: 'Perfil olfativo',
    canActivate: [perfumeExistsGuard],
    loadComponent: () =>
      import('./features/product-detail/product-detail-page.component').then(
        (m) => m.ProductDetailPageComponent,
      ),
  },
  {
    path: 'mi-seleccion',
    title: 'Mi selección',
    loadComponent: () =>
      import('./features/selection/selection-page.component').then(
        (m) => m.SelectionPageComponent,
      ),
  },
  {
    path: 'favoritos',
    title: 'Favoritos',
    loadComponent: () =>
      import('./features/favorites/favorites-page.component').then(
        (m) => m.FavoritesPageComponent,
      ),
  },
  {
    path: 'nosotros',
    title: 'Cómo funciona',
    loadComponent: () =>
      import('./features/about/about-page.component').then((m) => m.AboutPageComponent),
  },
  { path: '**', redirectTo: '' },
];
