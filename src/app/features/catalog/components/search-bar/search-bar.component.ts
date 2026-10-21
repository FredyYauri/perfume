import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UI_TEXTS } from '../../../../core/config';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="search">
      <app-icon name="search" />
      <span class="visually-hidden">Buscar fragancias</span>
      <input type="search" [formControl]="control()" [placeholder]="placeholder()" autocomplete="off" enterkeyhint="search" />
      @if (control().value) {
        <button type="button" class="search__clear" aria-label="Borrar búsqueda" (click)="control().setValue('')">
          <app-icon name="close" [size]="14" />
        </button>
      }
    </label>
  `,
  styles: `
    :host {
      display: block;
      flex: 1 1 320px;
    }
    .search {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 52px;
      padding: 0 8px 0 18px;
      border-radius: var(--radius-pill);
      background: var(--paper);
      border: 1px solid rgb(24 32 44 / 14%);
      color: var(--ink-2);
      transition:
        border-color 0.2s,
        box-shadow 0.2s;
    }
    .search:focus-within {
      border-color: var(--acc);
      box-shadow: 0 0 0 4px rgb(var(--acc-rgb) / 12%);
    }
    input {
      flex: 1;
      min-width: 0;
      height: 48px;
      border: 0;
      background: transparent;
      font-size: 15px;
      color: var(--ink);
      outline: none;
    }
    input::placeholder {
      color: var(--ink-4);
    }
    input::-webkit-search-cancel-button {
      display: none;
    }
    .search__clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      background: var(--sand-3);
      cursor: pointer;
    }
  `,
})
export class SearchBarComponent {
  readonly control = input.required<FormControl<string>>();
  readonly placeholder = input<string>(UI_TEXTS.searchPlaceholder);
}
