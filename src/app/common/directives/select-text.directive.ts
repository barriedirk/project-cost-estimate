import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[dthmSelectText]',
})
export class SelectTextDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('focus', [])
  onFocus() {
    try {
      this.elementRef.nativeElement.select();
    } catch (e) {
      console.error(e);
    }
  }
}
