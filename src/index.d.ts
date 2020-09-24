declare module 'react-leaflet';

// This is a monkey patch of the default Object.keys() typing that casts the return type to be a keyof the original object, instead of a string. https://fettblog.eu/typescript-better-object-keys/
type ObjectKeys<T> = T extends object
  ? Array<keyof T>
  : T extends number
  ? []
  : T extends any[] | string
  ? string[]
  : never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}