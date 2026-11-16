import { describe, it, expect } from 'vitest';

describe('request error handling', () => {
  it('should identify AbortError', () => {
    const error = new DOMException('Aborted', 'AbortError');

    expect(error.name).toBe('AbortError');
  });

  it('should identify TimeoutError', () => {
    const error = new DOMException('Timeout', 'TimeoutError');

    expect(error.name).toBe('TimeoutError');
  });
});
