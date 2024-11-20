import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Feature, Project } from '@app/interfaces';
import { inject } from '@angular/core';
import { PROJECT_STATE } from './project-state';

type keyProject = 'project' | 'skeleton';

const updateOrder = ({
  key,
  project,
  fromIndex,
  toIndex,
}: {
  key: 'project' | 'skeleton';
  project: Project;
  fromIndex: number;
  toIndex: number;
}): Project => {
  const formerProject = structuredClone(project);
  const { features } = formerProject;
  const el = features[fromIndex];

  features.splice(fromIndex, 1);
  features.splice(toIndex, 0, el);

  features.forEach((item, idx) => (item.order = idx));

  const newProject = { ...formerProject, features };

  localStorage.setItem(key, JSON.stringify(newProject));

  return newProject;
};

const removeFeature = (
  project: Project,
  idFeature: string,
  key: keyProject
): Project => {
  const newProjectRaw = structuredClone(project);
  const features = newProjectRaw.features.filter(
    (feature) => feature.id !== idFeature
  );
  const newProject = { ...newProjectRaw, features };

  localStorage.setItem(key, JSON.stringify(newProject));

  return newProject;
};

const addFeature = (
  project: Project,
  feature: Feature,
  key: keyProject
): Project => {
  const newProjectRaw = structuredClone(project);
  const features = [...newProjectRaw.features, feature];
  const newProject = { ...newProjectRaw, features };

  localStorage.setItem(key, JSON.stringify(newProject));

  return newProject;
};

const updateFeature = (project: Project, feature: Feature, key: keyProject) => {
  const newProjectRaw = structuredClone(project);
  const features = newProjectRaw.features.map((curr) =>
    curr.id === feature.id ? feature : curr
  );
  const newProject = { ...newProjectRaw, features };

  localStorage.setItem(key, JSON.stringify(newProject));

  return newProject;
};

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(PROJECT_STATE)),
  withMethods((store) => ({
    isLoading: () => store.isLoading(),
    skeleton: () => store.skeleton(),
    project: () => store.project(),
    updateProject: (values: Omit<Project, 'features'>) => {
      patchState(store, { isLoading: true });

      const formerProject = structuredClone(store.project());
      const project = { ...formerProject, ...values };

      localStorage.setItem('project', JSON.stringify(project));

      patchState(store, {
        project,
        isLoading: false,
      });
    },
    selectedFeature: (id: string, selected: boolean) => {
      patchState(store, { isLoading: true });

      const newProject = structuredClone(store.project());
      const newFeatures = newProject.features.map((feature) => {
        if (feature.id !== id) return feature;

        return { ...feature, selected };
      });

      patchState(store, { project: { ...newProject, features: newFeatures } });

      localStorage.setItem(
        'project',
        JSON.stringify({ ...newProject, features: newFeatures })
      );

      patchState(store, { isLoading: false });
    },
    updateFeature: (feature: Feature) => {
      patchState(store, { isLoading: true });
      const project = updateFeature(store.project(), feature, 'project');
      const skeleton = updateFeature(store.skeleton(), feature, 'skeleton');

      patchState(store, {
        project,
        skeleton,
        isLoading: false,
      });
    },
    addFeature: (feature: Feature) => {
      patchState(store, { isLoading: true });
      const project = addFeature(store.project(), feature, 'project');
      const skeleton = addFeature(store.skeleton(), feature, 'skeleton');

      patchState(store, {
        project,
        skeleton,
        isLoading: false,
      });
    },
    removeFeature: (idFeature: string) => {
      patchState(store, { isLoading: true });

      const project = removeFeature(store.project(), idFeature, 'project');
      const skeleton = removeFeature(store.skeleton(), idFeature, 'skeleton');

      patchState(store, {
        project,
        skeleton,
        isLoading: false,
      });
    },
    updateFeatureOrder: (fromIndex: number, toIndex: number) => {
      patchState(store, { isLoading: true });

      const project = updateOrder({
        key: 'project',
        project: store.project(),
        fromIndex,
        toIndex,
      });

      const skeleton = updateOrder({
        key: 'skeleton',
        project: store.skeleton(),
        fromIndex,
        toIndex,
      });

      patchState(store, { isLoading: false, project, skeleton });
    },
  }))
);
