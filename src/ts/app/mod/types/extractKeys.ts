// Utility type for extracting keys from nested objects.
type ExtractKeys<T> = {
  [K in keyof T]: keyof T[K];
}[keyof T];