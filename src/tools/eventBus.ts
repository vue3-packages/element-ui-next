/**
 * publish / subscribe
 */
interface IEventBus {
  _cache: {
    [key: string]: ((...params: unknown[]) => void)[];
  };
  on: (type: string, callback: (...params: unknown[]) => void) => IEventBus;
  emit: (type: string, ...params: unknown[]) => IEventBus;
  off: (type: string, callback: (...params: unknown[]) => void) => IEventBus;
}

class EventBus {
  _cache = {};
  constructor() {
    this._cache = {};
  }
  on(type: string, callback: (...params: unknown[]) => void): IEventBus {
    const fns = (this._cache[type] = this._cache[type] || []);
    if (fns.indexOf(callback) === -1) {
      fns.push(callback);
    }
    return this;
  }
  emit(type: string, ...params: unknown[]): IEventBus {
    const fns = this._cache[type];
    if (Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn(...params);
      });
    }
    return this;
  }
  off(type: string, callback: (...params: unknown[]) => void): IEventBus {
    const fns = this._cache[type];
    if (Array.isArray(fns)) {
      if (callback) {
        const index = fns.indexOf(callback);
        if (index !== -1) {
          fns.splice(index, 1);
        }
      } else {
        fns.length = 0;
      }
    }
    return this;
  }
}
export { EventBus, IEventBus };
export default new EventBus();
