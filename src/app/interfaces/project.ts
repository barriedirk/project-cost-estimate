import { Feature } from './feature';

export interface Project {
  company: string;
  projectName: string;
  description: string;
  priceByHour: number;
  igvPercent: number;
  features: Feature[];
}
