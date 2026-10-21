import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-quantity-stepper',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stepper" role="group" [attr.aria-label]="label()">
      <button
        type="button"
        class="stepper__btn"
        [disabled]="!canDecrease()"
        [attr.aria-label]="'Disminuir ' + label()"
        (click)="change(-1)"
      >
        <app-icon name="minus" [size]="14" />
      </button>
      <output class="stepper__value" aria-live="polite">{{ value() }}</output>
      <button
        type="button"
        class="stepper__btn"
        [disabled]="!canIncrease()"
        [attr.aria-label]="'Aumentar ' + label()"
        (click)="change(1)"
      >
        <app-icon name="plus" [size]="14" />
      </button>
    </div>
  `,
  styleUrl: './quantity-stepper.component.scss',
})
export class QuantityStepperComponent {
  readonly value = model(1);
  readonly min = input(1);
  readonly max = input(99);
  readonly label = input('cantidad');

  protected readonly canDecrease = computed(() => this.value() > this.min());
  protected readonly canIncrease = computed(() => this.value() < this.max());

  protected change(delta: number): void {
    const next = Math.min(this.max(), Math.max(this.min(), this.value() + delta));
    this.value.set(next);
  }
}
