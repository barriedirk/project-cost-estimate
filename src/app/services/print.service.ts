import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { WA_WINDOW } from '@ng-web-apis/common';
import { NavigateService, PrintParam } from './navigate.service';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  isPrinting = signal<boolean>(false);

  windowRef = inject(WA_WINDOW);
  navigateTo = inject(NavigateService);

  projectDraft(): WritableSignal<boolean> {
    this.isPrinting.set(true);

    this.navigateTo.print(PrintParam.Draft);

    return this.isPrinting;
  }

  onDataReady() {
    setTimeout(() => {
      this.windowRef.print();

      this.resetPrintRoute();
    });
  }

  private resetPrintRoute() {
    this.isPrinting.set(false);

    this.navigateTo.printReset();
  }
}
