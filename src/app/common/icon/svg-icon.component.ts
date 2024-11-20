import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent {
  cd = inject(ChangeDetectorRef);

  @HostBinding('style.width') width: string = '1rem';

  @HostBinding('style.height') height: string = '1rem';

  @HostBinding('style.display') display: string = 'inline-block';

  @HostBinding('style.mask-image') private _path!: string;

  @Input()
  public set path(filePath: string) {
    console.log('filePath', filePath);
    this._path = `url("${filePath}")`;

    this.cd.markForCheck();
  }
}
