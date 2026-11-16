import { describe, it, expect, vi, afterEach } from 'vitest';
import { debounce } from '../utils/debounce';

describe('debounce', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on repeated calls', () => {
    vi.useFakeTimers();

    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(200);

    debounced();
    vi.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
