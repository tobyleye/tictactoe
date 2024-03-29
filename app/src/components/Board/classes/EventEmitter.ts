export class EventEmitter {
  events: Record<string, (...args: any[]) => void>;

  constructor() {
    this.events = {};
  }

  emit(event: string, ...args: any[]) {
    const eventCb = this.events[event];
    if (eventCb) {
      eventCb(...args);
    }
  }

  on(event: string, cb: any) {
    this.events[event] = cb;
  }

  off(event: string) {
    delete this.events[event];
  }
}
