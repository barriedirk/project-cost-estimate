import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrintService } from './services/print.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  printer = inject(PrintService);

  title = 'project-cost-estimate';
}
