import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum PrintParam {
  Draft = 'draft',
  Project = 'project',
}

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  router = inject(Router);

  print(printPath: PrintParam) {
    this.router.navigate(
      [
        '/',
        {
          outlets: {
            print: ['print', printPath],
          },
        },
      ],
      { queryParamsHandling: 'preserve' }
    );
  }

  printReset() {
    this.router.navigate([{ outlets: { print: null } }], {
      queryParamsHandling: 'preserve',
    });
  }
}
