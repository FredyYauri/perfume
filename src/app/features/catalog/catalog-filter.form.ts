import { FormControl, FormGroup } from '@angular/forms';
import { FilterState, Gender, SortOption } from '../../core/models';
import { DEFAULT_FILTER_STATE } from '../../core/utils';

/** Formulario reactivo tipado de búsqueda + filtros del estudio. */
export type CatalogFilterForm = FormGroup<{
  search: FormControl<string>;
  category: FormControl<string | null>;
  profiles: FormControl<string[]>;
  occasions: FormControl<string[]>;
  intensity: FormControl<string | null>;
  genders: FormControl<Gender[]>;
  brands: FormControl<string[]>;
  onlyInStock: FormControl<boolean>;
  sort: FormControl<SortOption>;
}>;

export type CatalogFilterValue = Omit<FilterState, 'sizeMl'>;

export function createCatalogFilterForm(): CatalogFilterForm {
  const d = DEFAULT_FILTER_STATE;
  return new FormGroup({
    search: new FormControl(d.search, { nonNullable: true }),
    category: new FormControl<string | null>(d.category),
    profiles: new FormControl<string[]>([...d.profiles], { nonNullable: true }),
    occasions: new FormControl<string[]>([...d.occasions], { nonNullable: true }),
    intensity: new FormControl<string | null>(d.intensity),
    genders: new FormControl<Gender[]>([...d.genders], { nonNullable: true }),
    brands: new FormControl<string[]>([...d.brands], { nonNullable: true }),
    onlyInStock: new FormControl(d.onlyInStock, { nonNullable: true }),
    sort: new FormControl<SortOption>(d.sort, { nonNullable: true }),
  });
}

/** Restablece los filtros conservando búsqueda y orden. */
export function resetFilters(form: CatalogFilterForm): void {
  form.patchValue({
    category: null,
    profiles: [],
    occasions: [],
    intensity: null,
    genders: [],
    brands: [],
    onlyInStock: false,
  });
}
