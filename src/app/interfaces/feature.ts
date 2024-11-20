export interface Feature {
  id: string;
  order: number;
  editMode?: boolean;
  canRemove: boolean;
  selected: boolean;
  hours: number;
  description: string;
  largeDescription: string;
  subFeatures?: Feature[];
}
