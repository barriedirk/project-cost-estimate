/**
 * Provides a @OnChange decorator that can be easily used to listen to changes of class properties.
 * Important for the callback on the decorator:
 *  - Do not use arrow functions
 *  - Do not refer to a class method
 *
 * @author zhaosiyang
 * @see https://github.com/zhaosiyang/property-watch-decorator
 */
export interface SimpleChange<T> {
  firstChange: boolean;
  previousValue: T;
  currentValue: T;
  isFirstChange: () => boolean;
}

export function OnChange<T>(
  callback: (value: T, simpleChange?: SimpleChange<T>) => void
) {
  const cachedValueKey = Symbol();
  const isFirstChangeKey = Symbol();
  return (target: any, key: PropertyKey) => {
    Object.defineProperty(target, key, {
      set: function (value) {
        // change status of "isFirstChange"
        if (this[isFirstChangeKey] === undefined) {
          this[isFirstChangeKey] = true;
        } else {
          this[isFirstChangeKey] = false;
        }
        // No operation if new value is same as old value
        if (!this[isFirstChangeKey] && this[cachedValueKey] === value) {
          return;
        }
        const oldValue = this[cachedValueKey];
        this[cachedValueKey] = value;
        const simpleChange: SimpleChange<T> = {
          firstChange: this[isFirstChangeKey],
          previousValue: oldValue,
          currentValue: this[cachedValueKey],
          isFirstChange: () => this[isFirstChangeKey],
        };
        callback.call(this, this[cachedValueKey], simpleChange);
      },
      get: function () {
        return this[cachedValueKey];
      },
    });
  };
}
