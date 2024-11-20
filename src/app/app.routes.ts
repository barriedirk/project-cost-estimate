import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/project-cost-estimation',
    pathMatch: 'full',
  },
  {
    path: 'print',
    outlet: 'print',
    loadComponent: () =>
      import('@components/print/print-layout/print-layout.component').then(
        (m) => m.PrintLayoutComponent
      ),
    children: [
      {
        path: 'draft',
        loadComponent: () =>
          import(
            '@components/print/draft-project/draft-project.component'
          ).then((m) => m.DraftProjectComponent),
      },
    ],
  },
  {
    path: 'project-cost-estimation',
    loadComponent: () =>
      import(
        '@components/project-cost-estimation/project-cost-estimation.component'
      ).then((m) => m.ProjectCostEstimationComponent),
  },
];
