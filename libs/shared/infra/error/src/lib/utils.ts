export function wrapError(error: Error, message: string): Error {
  const wrappedError = new Error(`${message}\n${error.message}`);
  return wrappedError;
}
