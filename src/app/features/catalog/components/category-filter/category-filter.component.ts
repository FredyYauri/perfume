import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Category } from '../../../../core/models';

/** Lista de colecciones (selección única con contador). Compatible con `formControlName`. */
@Component({
  selector: 'app-category-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CategoryFilterComponent), multi: true },
  ],
  template: `
    <div class="colrow" role="group" aria-label="Colección">
      @for (category of categories(); track category.id) {
        @let on = value() === category.id;
        <button
          type="button"
          class="colbtn"
          [class.on]="on"
          [attr.aria-pressed]="on"
          [disabled]="disabled()"
          (click)="pick(category.id)"
        >
          <span>{{ category.name }}</span>
          <span class="cnt">{{ counts().get(category.id) ?? 0 }}</span>
        </button>
      }
    </div>
  `,
  styles: `
    .colrow {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .colbtn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      min-height: 44px;
      padding: 0 14px;
      border-radius: 12px;
      border: 1px solid transparent;
      background: transparent;
      font-size: 15px;
      color: var(--ink);
      cursor: pointer;
      text-align: left;
      transition:
        background 0.2s,
        border-color 0.2s;
    }
    .colbtn:hover {
      background: var(--paper);
      border-color: rgb(24 32 44 / 12%);
    }
    .colbtn.on {
      background: var(--navy);
      color: var(--mist);
    }
    .cnt {
      font-size: 12px;
      color: var(--ink-4);
    }
    .colbtn.on .cnt {
      color: var(--steel-2);
    }
  `,
})
export class CategoryFilterComponent implements ControlValueAccessor {
  readonly categories = input.required<readonly Category[]>();
  readonly counts = input<ReadonlyMap<string, number>>(new Map());

  protected readonly value = signal<string | null>(null);
  protected readonly disabled = signal(false);
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected pick(id: string): void {
    const next = this.value() === id ? null : id;
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  writeValue(value: string | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
