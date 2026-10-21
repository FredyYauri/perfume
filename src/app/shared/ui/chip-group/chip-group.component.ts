import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ChipOption<T> {
  readonly value: T;
  readonly label: string;
  /** Punto de color (perfiles olfativos). */
  readonly color?: string;
  /** Barras de intensidad iluminadas (1-3). */
  readonly level?: number;
}

/**
 * Grupo de chips compatible con Reactive Forms. Con `multiple` el valor es un arreglo;
 * sin él, el valor es la opción elegida o `null` (un segundo clic la deselecciona).
 */
@Component({
  selector: 'app-chip-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChipGroupComponent), multi: true },
  ],
  template: `
    <div class="chips" role="group" [attr.aria-label]="label()">
      @for (option of options(); track option.value) {
        @let on = isSelected(option.value);
        <button
          type="button"
          class="chip"
          [class.on]="on && appearance() === 'fill'"
          [class.ring]="on && appearance() === 'ring'"
          [attr.aria-pressed]="on"
          [disabled]="disabled()"
          (click)="toggle(option.value)"
          (blur)="onTouched()"
        >
          @if (option.color) {
            <span class="dot" [style.background]="option.color"></span>
          }
          @if (option.level) {
            <span class="bars" aria-hidden="true">
              <i class="f"></i><i [class.f]="option.level >= 2"></i><i [class.f]="option.level >= 3"></i>
            </span>
          }
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex: none;
      box-shadow: 0 0 0 2px rgb(255 255 255 / 70%);
    }
  `,
})
export class ChipGroupComponent<T> implements ControlValueAccessor {
  readonly options = input.required<readonly ChipOption<T>[]>();
  readonly label = input.required<string>();
  readonly multiple = input(true);
  /** `fill` rellena con el color de marca; `ring` solo resalta el borde (diseño "Momento"). */
  readonly appearance = input<'fill' | 'ring'>('fill');

  private readonly selected = signal<readonly T[]>([]);
  protected readonly disabled = signal(false);

  private onChange: (value: readonly T[] | T | null) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected isSelected(value: T): boolean {
    return this.selected().includes(value);
  }

  protected toggle(value: T): void {
    const wasSelected = this.isSelected(value);
    if (this.multiple()) {
      const next = wasSelected
        ? this.selected().filter((item) => item !== value)
        : [...this.selected(), value];
      this.selected.set(next);
      this.onChange(next);
    } else {
      this.selected.set(wasSelected ? [] : [value]);
      this.onChange(wasSelected ? null : value);
    }
  }

  writeValue(value: readonly T[] | T | null): void {
    if (Array.isArray(value)) {
      this.selected.set(value);
    } else {
      this.selected.set(value == null ? [] : [value as T]);
    }
  }

  registerOnChange(fn: (value: readonly T[] | T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
