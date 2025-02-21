/*
 * @Author: Zhenxiang Chen
 * @Date:   2021-05-22 18:15:39
 * @Last Modified by:   Zhenxiang Chen
 * @Last Modified time: 2021-05-22 18:15:39
 */
import {
  Directive,
  Input,
  HostBinding,
  Optional,
  Host,
  SkipSelf,
  Inject
} from "@angular/core";
import { ControlContainer, FormControl } from "@angular/forms";
import { BootstrapVersion } from "../Enums/BootstrapVersion";
import { BOOTSTRAP_VERSION } from "../Tokens/tokens";

export function controlPath(name: string, parent: ControlContainer): string[] {
  // tslint:disable-next-line:no-non-null-assertion
  return [...parent.path!, name];
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: ".form-control,.form-check-input,.custom-control-input"
})
export class FormControlDirective {
  @Input()
  formControlName: string;
  @Input()
  formControl: string;
  @Input()
  showValid = true;
  @Input()
  showValidWhenEmpty = false;

  @HostBinding("class.is-valid")
  get validClass() {
    if (!this.control || !this.showValid) {
      return false;
    }
    return (
      (this.showValidWhenEmpty
        ? true
        : this.control.value != null && this.control.value != "") &&
      this.bootstrapFour &&
      this.control.valid &&
      (this.control.touched || this.control.dirty)
    );
  }

  @HostBinding("class.is-invalid")
  get invalidClass() {
    if (!this.control) {
      return false;
    }
    return (
      this.bootstrapFour &&
      this.control.invalid &&
      this.control.touched &&
      this.control.dirty
    );
  }

  get path() {
    return controlPath(this.formControlName, this.parent);
  }

  get control(): FormControl {
    return this.formDirective && this.formDirective.getControl(this);
  }

  get formDirective(): any {
    return this.parent ? this.parent.formDirective : null;
  }

  get bootstrapFour() {
    return this.bootstrapVersion === BootstrapVersion.Four;
  }

  constructor(
    // this value might be null, but we union type it as such until
    // this issue is resolved: https://github.com/angular/angular/issues/25544
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer,
    @Inject(BOOTSTRAP_VERSION) private bootstrapVersion: BootstrapVersion
  ) {}
}
