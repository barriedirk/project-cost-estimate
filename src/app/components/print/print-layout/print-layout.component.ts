import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-print-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './print-layout.component.html',
  styleUrl: './print-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintLayoutComponent {
  dateTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss', 'en-US');
}
