import { VECTOR } from '../constants';

export default class Vector extends Array {
  constructor(of, ...items) {
    super(items);
    this.type = VECTOR;
    this.of = of;
  }
}
