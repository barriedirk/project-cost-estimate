import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { REGEX } from '@constants';
import { OnChange } from '@decorators';

type RegexMask =
  | 'Custom'
  | 'HourMin'
  | 'Money2D'
  | 'Money3D'
  | 'Percentage'
  | 'Integer'
  | 'Phone'
  | 'PositiveNegativeInteger'
  | 'AlphaNumericWithSpaces';

@Directive({
  standalone: true,
  selector: 'input[type=text][dthmRegexMask],input[type=number][dthmRegexMask]',
})
export class RegexMaskDirective implements OnInit {
  @OnChange(function (this: RegexMaskDirective, value, change) {
    if (!!value && change && !change.firstChange) this.setRegex();
  })
  @Input('dthmRegexMask')
  regexMask: RegexMask | undefined;

  @OnChange(function (this: RegexMaskDirective, value, change) {
    if (!!value && change && !change.firstChange) this.setRegex();
  })
  @Input('dthmRegexMaskCustom')
  customRegex: RegExp | undefined;

  @Input('dthmRegexMaskIgnoreDecimals') ignoreDecimals? = false;

  regex: RegExp | undefined;

  constructor(
    @Optional() private ngControl: NgControl,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    if (this.regexMask !== 'Percentage' && this.ignoreDecimals === true) {
      console.warn(
        `dthmRegexMask: Use 'Percentage' to work properly with 'dthmRegexMaskIgnoreDecimals'.`
      );
    }

    this.setRegex();
  }

  private setRegex() {
    let regex: RegExp | undefined;

    if (!this.regexMask) return;

    switch (this.regexMask) {
      case 'HourMin':
        regex = REGEX.HOUR_MIN;
        break;
      case 'Money2D':
        regex = REGEX.MONEY_2D;
        break;
      case 'Money3D':
        regex = REGEX.MONEY_3D;
        break;
      case 'Percentage':
        regex = REGEX.PERCENTAGE;

        if (this.ignoreDecimals) {
          const value = this.elementRef.nativeElement.value;

          if (!Number.isNaN(value) && value.includes('.')) {
            const choppedValue = value.split('.')[0];

            if (this.ngControl && this.ngControl.control)
              this.ngControl.control.setValue(choppedValue, {
                emitEvent: true,
              });
            else this.elementRef.nativeElement.value = choppedValue;
          }
        }
        break;
      case 'Integer':
        regex = REGEX.WHOLE_NUMBERS;
        break;
      case 'Phone':
        regex = REGEX.PHONE_NUMBER;
        break;
      case 'PositiveNegativeInteger':
        regex = REGEX.INTEGER_NUMBERS;
        break;
      case 'AlphaNumericWithSpaces':
        regex = REGEX.ALPHA_NUMERIC_WITH_SPACES;
        break;
      default:
        if (this.customRegex) regex = this.customRegex;
        break;
    }

    if (regex) this.regex = regex;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const text = String.fromCharCode(event.charCode);

    this.validateText(event, text);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const text = clipboardData.getData('text/plain');

      this.validateText(event, text);
    }
  }

  private validateText(event: KeyboardEvent | ClipboardEvent, text: string) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    const start = input.selectionStart ?? undefined;
    const end = input.selectionEnd ?? undefined;
    const output = [
      inputValue.slice(0, start),
      text,
      inputValue.slice(end),
    ].join('');

    if (this.regex && !this.regex.test(output)) {
      event.preventDefault();
    }
  }
}
