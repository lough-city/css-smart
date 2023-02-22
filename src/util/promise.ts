// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const createPromise = <T = void>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return { promise, resolve, reject };
};
