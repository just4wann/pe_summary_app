import type { ClearValueType } from '../types';

export class Function {
  public static useClear<T extends keyof ClearValueType>(value: ClearValueType, fields: T[]) {
    fields.forEach((field) => {
      if (typeof value[field] == 'string') {
        value[field] = '' as ClearValueType[T];
      } else if (typeof value[field] == 'object') {
        value[field]['name'] = '';
        value[field]['code'] = '';
      }
    });
  }
}
