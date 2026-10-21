import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HERO_CONTENT } from '../../../../core/config';
import { PerfumeService } from '../../../../core/services';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly content = HERO_CONTENT;
  protected readonly perfumeService = inject(PerfumeService);
}
