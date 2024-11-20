import { InjectionToken } from '@angular/core';
import { initialData } from './initial-data';
import { Project } from '@app/interfaces';

export type ProjectState = {
  skeleton: Project;
  project: Project;
  isLoading: boolean;
};

export const PROJECT_STATE = new InjectionToken<ProjectState>('ProjectState', {
  factory: () => {
    const skeletonRaw = localStorage.getItem('skeleton');
    const projectRaw = localStorage.getItem('project');

    const skeleton = skeletonRaw ? JSON.parse(skeletonRaw) : initialData;
    const project = projectRaw ? JSON.parse(projectRaw) : initialData;

    if (!skeletonRaw)
      localStorage.setItem('skeleton', JSON.stringify(initialData));

    if (!projectRaw)
      localStorage.setItem('project', JSON.stringify(initialData));

    return {
      skeleton,
      project,
      isLoading: false,
    };
  },
});
