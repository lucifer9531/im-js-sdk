import { isClient } from '../utils/judgment';

export interface Pausable {
  isActive: boolean;
  pause: Fn;
  resume: Fn;
}

export interface IntervalFnOptions {
  immediate?: boolean;
}

export function useHeartBreak(cb: Fn, interval = 1000, options: IntervalFnOptions = {}): Pausable {
  const { immediate = true } = options;

  let timer: any = null;
  let isActive = false;

  function clean() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function pause() {
    isActive = false;
    clean();
  }

  function resume() {
    if (interval <= 0) return;
    isActive = true;
    clean();
    timer = setInterval(cb, interval);
  }

  if (immediate && isClient) resume();

  return {
    isActive,
    pause,
    resume,
  };
}
