import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ANNOUNCEMENTS } from '../../core/config';
import { IconComponent } from '../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-announcement-bar',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <ul class="wrap bar__list" role="list">
        @for (item of items; track item.text; let last = $last) {
          <li><app-icon [name]="item.icon" [size]="14" />{{ item.text }}</li>
          @if (!last) {
            <li class="bar__dot" aria-hidden="true"></li>
          }
        }
      </ul>
    </div>
  `,
  styles: `
    .bar {
      background: var(--navy);
      color: #e3e7ec;
      font-size: 13px;
      letter-spacing: 0.04em;
    }
    .bar__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px 18px;
      min-height: 38px;
      margin-top: 0;
      margin-bottom: 0;
      padding-top: 8px;
      padding-bottom: 8px;
      list-style: none;
      text-align: center;
    }
    li {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .bar__dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--acc2);
    }
  `,
})
export class AnnouncementBarComponent {
  protected readonly items = ANNOUNCEMENTS;
}
