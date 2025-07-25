import { computed, Directive, effect, HostBinding, inject, input, linkedSignal, signal } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { ClassValue } from 'clsx';
import { FormControlName } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'hlm-error',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmErrorDirective {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  private readonly targetMatched = signal(true);
  protected readonly _computedClass = computed(() => hlm('hidden text-destructive text-sm font-medium', this.userClass(), !this.targetMatched() ? 'hidden' : 'block'));

  constructor() {
    effect(() => {
      console.log(this._computedClass());
    });
  }

  show() {
    console.count('show')
    this.targetMatched.set(true);
  }

  hide() {
    console.count('hide')
    this.targetMatched.set(false);
  }
}
