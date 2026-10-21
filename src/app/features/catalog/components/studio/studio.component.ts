import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, map, startWith } from 'rxjs';
import { CATALOG_CONFIG, FORMAT_OPTIONS, SORT_OPTIONS } from '../../../../core/config';
import { FilterState, SortOption } from '../../../../core/models';
import { PerfumeService, SelectionService } from '../../../../core/services';
import { countActiveFilters } from '../../../../core/utils';
import { SelectionPanelComponent } from '../../../../shared/components/selection-panel/selection-panel.component';
import {
  SizeChoice,
  SizeSelectorComponent,
} from '../../../../shared/components/size-selector/size-selector.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { CatalogFilterValue, createCatalogFilterForm, resetFilters } from '../../catalog-filter.form';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import { PerfumeCatalogComponent } from '../perfume-catalog/perfume-catalog.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

type StepState = 'done' | 'now' | '';

/**
 * "Estudio de creación": configurador de la selección en tres pasos
 * (formato → perfumes → completar set) con filtros, galería y panel de resumen.
 */
@Component({
  selector: 'app-studio',
  imports: [
    ReactiveFormsModule,
    SizeSelectorComponent,
    FilterPanelComponent,
    SearchBarComponent,
    PerfumeCatalogComponent,
    SelectionPanelComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.scss',
})
export class StudioComponent {
  /** Nivel del título (h1 en la página de catálogo, h2 dentro del inicio). */
  readonly headingLevel = input<1 | 2>(2);

  protected readonly perfumeService = inject(PerfumeService);
  protected readonly selection = inject(SelectionService);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = createCatalogFilterForm();
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly skeletonCount = CATALOG_CONFIG.skeletonCount;
  protected readonly filtersOpen = signal(false);
  protected readonly panelExpanded = signal(true);

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(
      debounceTime(CATALOG_CONFIG.searchDebounceMs),
      startWith(null),
      map((): CatalogFilterValue => this.form.getRawValue()),
    ),
    { initialValue: this.form.getRawValue() },
  );
  /** Orden seleccionado sin esperar al debounce (respuesta inmediata en las pestañas). */
  protected readonly sort = toSignal(this.form.controls.sort.valueChanges, {
    initialValue: this.form.controls.sort.value,
  });

  protected readonly filterState = computed<FilterState>(() => ({
    ...this.formValue(),
    sort: this.sort(),
    sizeMl: this.selection.format(),
  }));
  protected readonly results = computed(() => this.perfumeService.filter(this.filterState()));
  protected readonly activeFilters = computed(() => countActiveFilters(this.filterState()));
  protected readonly resultLabel = computed(() => {
    const count = this.results().length;
    return `${count} fragancia${count === 1 ? '' : 's'} · precios en formato ${this.selection.format()} ml`;
  });

  protected readonly formatOptions = computed<SizeChoice[]>(() =>
    FORMAT_OPTIONS.map((format) => ({
      ml: format.ml,
      price: this.perfumeService.minPriceBySize().get(format.ml),
    })),
  );
  protected readonly formatHint = computed(
    () =>
      `Todos los perfumes que elijas se añadirán en ${this.selection.format()} ml. Si cambias de formato, tu set se actualiza; luego puedes ajustar cada muestra.`,
  );

  protected readonly steps = computed<{ label: string; state: StepState }[]>(() => {
    const { itemCount, appliedRule } = this.selection.summary();
    const formatChosen = this.selection.formatChosen() || itemCount > 0;
    return [
      { label: 'Elige formato', state: formatChosen ? 'done' : 'now' },
      { label: 'Elige tus perfumes', state: itemCount > 0 ? 'done' : formatChosen ? 'now' : '' },
      { label: 'Completa tu set', state: appliedRule ? 'done' : itemCount > 0 ? 'now' : '' },
    ];
  });

  constructor() {
    void this.perfumeService.load();

    // Permite llegar con filtros desde enlaces: ?perfil=dulce,ambar&coleccion=nicho&q=vainilla
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const profiles = params.get('perfil');
      const category = params.get('coleccion');
      const search = params.get('q');
      if (profiles === null && category === null && search === null) {
        return;
      }
      resetFilters(this.form);
      this.form.patchValue({
        profiles: profiles ? profiles.split(',').filter(Boolean) : [],
        category: category || null,
        search: search ?? this.form.controls.search.value,
      });
    });
  }

  protected setFormat(ml: number | null): void {
    if (ml != null) {
      this.selection.setFormat(ml);
    }
  }

  protected setSort(sort: SortOption): void {
    this.form.controls.sort.setValue(sort);
  }

  protected clearFilters(): void {
    resetFilters(this.form);
    this.form.controls.search.setValue('');
  }
}
