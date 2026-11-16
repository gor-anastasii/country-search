// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fn: T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delay: number,
): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    // TODO: implement debounce
    void args;
  };
}
