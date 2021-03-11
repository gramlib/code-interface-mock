import ts from "typescript";
import {IMockType} from "@/mocker/IMockType";
import MockJs from 'mockjs';
import {gather} from "@/ts-api/gather-types";
import {traverseInterface} from "@/ts-api/traverse-interface";

export function createMockType(type: ts.TypeNode) {
  return new MockType(type.getText());
}

export class MockType implements IMockType{
  constructor(private ref:string) {
  }

  mock(): any {
    let result = mockRefMap[this.ref];
    if (!result) {
      const interDeclare = gather.collectTypes[this.ref];
      if (interDeclare) {
        const {mockProperties} = traverseInterface(interDeclare);
        result = mockProperties;
      }
    }

    if (result === undefined) {
      result = {};
    }
    return result;
  }
}

const mockRefMap = {
  get string() {
    return MockJs.Random.csentence(3, 10);
  },
  get number() {
    return MockJs.Random.natural(0, 200000);
  },
  get boolean() {
    return Math.random() > 0.5;
  }
}
