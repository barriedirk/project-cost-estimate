import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { PrintService } from '@app/services/print.service';
import { GlobalStore } from '@app/store';

@Component({
  selector: 'app-draft-project',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './draft-project.component.html',
  styleUrl: './draft-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftProjectComponent implements OnInit {
  printService = inject(PrintService);

  storeProject = inject(GlobalStore).project;

  totalHours = computed(() => {
    const features = this.storeProject().features;

    const totalHours = features
      .filter((feature) => feature.selected)
      .reduce((acc, curr) => acc + Number(curr.selected ? curr.hours : 0), 0);

    return totalHours;
  });

  ngOnInit() {
    this.printService.onDataReady();
  }
}
