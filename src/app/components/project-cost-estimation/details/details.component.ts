import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalStore } from '@store';
import { Project, Feature } from '@app/interfaces';
import { RegexMaskDirective, SelectTextDirective } from '@directives';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { SvgIconComponent } from '@app/common/icon/svg-icon.component';

type ProjectOmitType = Omit<Project, 'features'>;
type ProjectControls = { [key in keyof ProjectOmitType]: AbstractControl };
type ProjectFormGroup = FormGroup & {
  value: ProjectOmitType;
  controls: ProjectControls;
};

type FeatureControls = { [key in keyof Feature]: AbstractControl };
type FeatureFormGroup = FormGroup & {
  value: Feature;
  controls: FeatureControls;
};

@Component({
  selector: 'pce-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RegexMaskDirective,
    SelectTextDirective,
    CdkDropList,
    CdkDrag,
    SvgIconComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  projectForm: ProjectFormGroup;
  featuresForm: FormGroup;

  featureIndex = signal<number>(0);
  featureIdToRemove = signal<string>('');
  featureToRemove = signal<string>('');

  store = inject(GlobalStore);
  fb = inject(FormBuilder);

  @ViewChild('removeFeatureDialog')
  dialogToRemoveFeature!: ElementRef;

  constructor() {
    const {
      company,
      projectName,
      description,
      priceByHour,
      igvPercent,
      features,
    } = this.store.project();

    this.projectForm = this.projectFormInitialize({
      company,
      projectName,
      description,
      priceByHour,
      igvPercent,
    });
    this.featuresForm = this.featuresFormArrayInitialize(features);

    this.projectForm.markAllAsTouched();
    this.projectForm.updateValueAndValidity();

    this.projectForm.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(700),
        distinctUntilChanged(),
        filter(() => this.projectForm.valid),
      )
      .subscribe({
        next: (values) => {
          if (this.projectForm.valid) this.store.updateProject(values);
        },
      });
  }

  get featureList() {
    return this.featuresForm.get('modules') as FormArray<FeatureFormGroup>;
  }

  addEmptyFeature() {
    const modules = this.featureList;

    const maxOrder = modules.controls.reduce(
      (previous, current: FeatureFormGroup) => {
        const order = current.controls.order.value;

        return previous > order ? previous : order;
      },
      0,
    );
    const nextOrder = maxOrder + 1;
    const newFeature: Feature = {
      id: crypto.randomUUID(),
      order: nextOrder,
      editMode: false,
      canRemove: true,
      selected: false,
      hours: 10,
      description: `Description ${nextOrder}`,
      largeDescription: `Large description ${nextOrder}`,
    };
    const newModule = this.moduleFormInitialize({
      ...newFeature,
      editMode: true,
    });

    this.featureList.push(newModule);
    this.store.addFeature(newFeature);
  }

  projectFormInitialize({
    company,
    projectName,
    description,
    priceByHour,
    igvPercent,
  }: Omit<Project, 'features'>): ProjectFormGroup {
    return new FormGroup({
      company: new FormControl<string>(company ?? '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40),
      ]),
      projectName: new FormControl<string>(projectName ?? '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40),
      ]),
      description: new FormControl<string>(description ?? '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(1000),
      ]),
      priceByHour: new FormControl<number>(priceByHour ?? 0, [
        Validators.required,
        Validators.min(10),
        Validators.max(200),
      ]),
      igvPercent: new FormControl<number>(igvPercent ?? 0, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
    } as ProjectControls) as ProjectFormGroup;
  }

  featuresFormArrayInitialize(features: Feature[]) {
    const featureList = features.map(
      (
        {
          id,
          order,
          editMode,
          canRemove,
          selected,
          hours,
          description,
          largeDescription,
        },
        index,
      ) =>
        this.moduleFormInitialize({
          id,
          order,
          editMode,
          canRemove,
          selected,
          hours,
          description,
          largeDescription,
        }),
    );

    return this.fb.group({
      modules: this.fb.array(featureList),
    });
  }

  moduleFormInitialize({
    id,
    order,
    editMode,
    canRemove,
    selected,
    hours,
    description,
    largeDescription,
  }: Feature): FeatureFormGroup {
    return new FormGroup({
      id: new FormControl<string>(id),
      order: new FormControl<number>(order),
      editMode: new FormControl<boolean>(!!editMode),
      canRemove: new FormControl<boolean>(canRemove),
      selected: new FormControl<boolean>(selected),
      hours: new FormControl<number>(hours, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      description: new FormControl<string>(description, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      largeDescription: new FormControl<string>(largeDescription, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
    } as FeatureControls) as FeatureFormGroup;
  }

  onRemoveFeature(idToRemove: string, index: number) {
    this.store.removeFeature(idToRemove);
    this.featureList.removeAt(index);
    this.dialogToRemoveFeature.nativeElement.close();
  }

  onClose() {
    this.dialogToRemoveFeature.nativeElement.close();
  }

  onChangeEditModule(index: number, editMode: boolean) {
    const { controls: featureControls, value: formValue } =
      this.featureList.at(index);

    if (featureControls) {
      featureControls.editMode!.setValue(editMode);

      if (!editMode)
        this.store.updateFeature({ ...formValue, editMode } as Feature);
    }
  }

  onAddRemoveFeatureProject(index: number) {
    const { controls: featureControl } = this.featureList.at(index);
    const idFeature = featureControl.id.value;
    const selected = featureControl.selected.value;

    this.store.selectedFeature(idFeature, selected);
  }

  onShowDialogToRemoveFeature({
    index,
    id,
    description,
  }: {
    index: number;
    id: string;
    description: string;
  }) {
    this.featureIndex.set(index);
    this.featureIdToRemove.set(id);
    this.featureToRemove.set(description);

    this.dialogToRemoveFeature.nativeElement.showModal();
  }

  onCheckIfFeatureIsValid(index: number) {
    const { description, largeDescription, hours } =
      this.featureList.at(index).controls;

    const isValid = description.valid && largeDescription.valid && hours.valid;

    return isValid;
  }

  drop(event: CdkDragDrop<FeatureFormGroup[]>) {
    this.store.updateFeatureOrder(event.previousIndex, event.currentIndex);
    moveItemInArray(
      this.featureList.controls,
      event.previousIndex,
      event.currentIndex,
    );
  }
}
