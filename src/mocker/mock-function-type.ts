import {IMockType} from "@/mocker/IMockType";

export function createFunctionType(params: string[]) {
  return new MockFunctionType(params);
}

export class MockFunctionType implements IMockType{
  constructor(private params: string[]) {
  }

  mock() {
    // eslint-disable-next-line no-eval
    return eval(`\
(${this.params.join(',')}) => {
}
`);
  }
}
