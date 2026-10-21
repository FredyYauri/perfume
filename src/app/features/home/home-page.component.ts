import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DecantInfoSectionComponent } from '../../shared/components/decant-info-section/decant-info-section.component';
import { TrustSectionComponent } from '../../shared/components/trust-section/trust-section.component';
import { StudioComponent } from '../catalog/components/studio/studio.component';
import { HeroComponent } from './components/hero/hero.component';
import { MoodsComponent } from './components/moods/moods.component';
import { ReviewsComponent } from './components/reviews/reviews.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    MoodsComponent,
    StudioComponent,
    DecantInfoSectionComponent,
    TrustSectionComponent,
    ReviewsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-moods />
    <app-studio />
    <app-decant-info-section />
    <app-trust-section />
    @defer (on viewport) {
      <app-reviews />
    } @placeholder {
      <div class="reviews-placeholder"></div>
    }
  `,
  styles: `
    .reviews-placeholder {
      min-height: 700px;
      background: var(--navy);
    }
  `,
})
export class HomePageComponent {}
