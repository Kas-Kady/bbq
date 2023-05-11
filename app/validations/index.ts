import invariant from 'tiny-invariant';

export function isDefined(value: any): asserts value is string {
  invariant(typeof value === 'string', 'Value is not defined');
}
