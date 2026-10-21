import { ChangeDetectionStrategy, Component } from '@angular/core';
import { REVIEWS } from '../../../../core/config';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-reviews',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  protected readonly reviews = REVIEWS.map((review) => ({
    ...review,
    stars: [1, 2, 3, 4, 5].map((n) => n <= review.rating),
  }));
}
