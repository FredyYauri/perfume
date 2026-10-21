import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GENDER_LABELS, INTENSITY_LEVELS } from '../../../../core/config';
import { Category, FilterOptions, Gender, OlfactoryProfile } from '../../../../core/models';
import { BodyScrollLockDirective } from '../../../../shared/directives/body-scroll-lock.directive';
import { ChipGroupComponent, ChipOption } from '../../../../shared/ui/chip-group/chip-group.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { CatalogFilterForm } from '../../catalog-filter.form';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';

/** Panel lateral de filtros. En móvil se convierte en un cajón deslizable. */
@Component({
  selector: 'app-filter-panel',
  imports: [
    ReactiveFormsModule,
    CategoryFilterComponent,
    ChipGroupComponent,
    IconComponent,
    BodyScrollLockDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
  host: { '(document:keydown.escape)': 'close.emit()' },
})
export class FilterPanelComponent {
  readonly form = input.required<CatalogFilterForm>();
  readonly categories = input.required<readonly Category[]>();
  readonly categoryCounts = input<ReadonlyMap<string, number>>(new Map());
  readonly profiles = input.required<readonly OlfactoryProfile[]>();
  readonly options = input.required<FilterOptions>();
  readonly activeCount = input(0);
  /** Estado del cajón en móvil. */
  readonly open = input(false);
  readonly close = output<void>();
  readonly clear = output<void>();

  protected readonly profileOptions = computed<ChipOption<string>[]>(() =>
    this.profiles().map((profile) => ({
      value: profile.id,
      label: profile.name,
      color: profile.color,
    })),
  );
  protected readonly occasionOptions = computed<ChipOption<string>[]>(() =>
    this.options().occasions.map((occasion) => ({ value: occasion, label: occasion })),
  );
  protected readonly intensityOptions = computed<ChipOption<string>[]>(() =>
    this.options().intensities.map((intensity) => ({
      value: intensity,
      label: intensity,
      level: INTENSITY_LEVELS[intensity] ?? 2,
    })),
  );
  protected readonly genderOptions = computed<ChipOption<Gender>[]>(() =>
    this.options().genders.map((gender) => ({ value: gender, label: GENDER_LABELS[gender] })),
  );
  protected readonly brandOptions = computed<ChipOption<string>[]>(() =>
    this.options().brands.map((brand) => ({ value: brand, label: brand })),
  );
}
