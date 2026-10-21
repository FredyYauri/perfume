import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MOODS } from '../../../../core/config';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

/** "¿Qué quieres sentir hoy?": cada sensación abre el estudio con sus perfiles filtrados. */
@Component({
  selector: 'app-moods',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './moods.component.html',
  styleUrl: './moods.component.scss',
})
export class MoodsComponent {
  protected readonly moods = MOODS.map((mood) => ({
    ...mood,
    queryParams: { perfil: mood.profiles.join(',') },
  }));
}
