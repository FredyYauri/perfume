import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PerfumeService } from '../services';

/**
 * Espera a que el catálogo cargue y redirige al catálogo si el perfume no existe.
 * Si la carga falla, deja pasar para que la página muestre el estado de error con reintento.
 */
export const perfumeExistsGuard: CanActivateFn = async (route) => {
  const perfumeService = inject(PerfumeService);
  const router = inject(Router);
  await perfumeService.load();
  if (perfumeService.hasError()) {
    return true;
  }
  const id = route.paramMap.get('id') ?? '';
  return perfumeService.getById(id) ? true : router.createUrlTree(['/catalogo']);
};
