import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DetailsComponent } from './details/details.component';
import { ResultComponent } from './result/result.component';

@Component({
  selector: 'project-cost-estimation',
  standalone: true,
  imports: [DetailsComponent, ResultComponent],
  templateUrl: './project-cost-estimation.component.html',
  styleUrl: './project-cost-estimation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCostEstimationComponent {}
