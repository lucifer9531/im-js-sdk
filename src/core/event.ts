export default class Event {
  private cache: Map<string | Symbol, Array<(...data: any) => void>>;
  constructor(all = []) {
    this.cache = new Map(all);
  }

  once(type: string | Symbol, handler: Fn) {
    const decor = (...args: any[]) => {
      handler && handler.apply(this, args);
      this.off(type, decor);
    };
    this.on(type, decor);
    return this;
  }

  on(type: string | Symbol, handler: Fn) {
    const handlers = this.cache?.get(type);
    const added = handlers && handlers.push(handler);
    if (!added) {
      this.cache.set(type, [handler]);
    }
  }

  off(type: string | Symbol, handler: Fn) {
    const handlers = this.cache.get(type);
    if (handlers) {
      handlers.splice(handlers.indexOf(handler) >>> 0, 1);
    }
  }

  emit(type: string | Symbol, evt?: any) {
    for (const handler of (this.cache.get(type) || []).slice()) handler(evt);
    for (const handler of (this.cache.get('*') || []).slice()) handler(type, evt);
  }

  clear() {
    this.cache.clear();
  }
}
