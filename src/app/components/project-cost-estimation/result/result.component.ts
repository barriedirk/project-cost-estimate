import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { PrintService } from '@app/services/print.service';
import { GlobalStore } from '@app/store';
import { filter, take } from 'rxjs';

@Component({
  selector: 'pce-result',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent {
  cd = inject(ChangeDetectorRef);
  printService = inject(PrintService);
  project = inject(GlobalStore).project;
  project$ = toObservable(this.project);
  totalHours = computed(() => {
    const features = this.project().features;

    const totalHours = features
      .filter((feature) => feature.selected)
      .reduce((acc, curr) => acc + Number(curr.selected ? curr.hours : 0), 0);

    return totalHours;
  });

  constructor() {
    this.project$.pipe(takeUntilDestroyed()).subscribe({
      next: (value) => {
        console.log('project', value);
      },
    });
  }

  onDraftPrint() {
    toObservable(this.printService.projectDraft())
      .pipe(
        filter((value) => !value),
        take(1)
      )
      .subscribe({ next: () => this.cd.markForCheck() });
  }
}
