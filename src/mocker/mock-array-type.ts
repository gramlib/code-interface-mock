import * as ts from "typescript";
import {MockType} from "@/mocker/mock-type";
import {IMockType} from "@/mocker/IMockType";
import MockJs from 'mockjs';

export function createMockArrayType(genericType: ts.TypeNode) {
  return new MockArrayType(new MockType(genericType.getText()));
}

export class MockArrayType implements IMockType{
  constructor(private generic: MockType) {
  }

  mock(): any {
    const n = MockJs.Random.natural(1, 3);
    const arr = Array.apply(null,{length:n});
    return arr.map(() => {
      return this.generic.mock();
    });
  }
}
