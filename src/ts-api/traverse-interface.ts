import ts from "typescript";
import {createFunctionType} from "@/mocker/mock-function-type";
import {createMockType} from "@/mocker/mock-type";
import {createMockArrayType} from "@/mocker/mock-array-type";
import {IMockType} from "@/mocker/IMockType";
import {gather} from "@/ts-api/gather-types";

export function traverseInterface(node: ts.InterfaceDeclaration) {
  const interfaceName = node.name.getText();
  const properties: Record<string, IMockType> = {};
  const {members} = node;

  // 继承
  let HeritageData = {};
  if (node.heritageClauses) {
    node.heritageClauses[0].types.forEach(it => {
      const refName = it.expression.getText();
      const interDeclare = gather.collectTypes[refName];
      if (interDeclare) {
        const { mockProperties } = traverseInterface(interDeclare);
        HeritageData = Object.assign(HeritageData, mockProperties);
      }
    });
  }

  members.forEach(it => {
    if (it.kind === ts.SyntaxKind.PropertySignature) {
      const { propertyName, propertyType } = parsePropertySignature(it as ts.PropertySignature);
      properties[propertyName] = propertyType;
    } else if (it.kind === ts.SyntaxKind.MethodSignature) {
      const { propertyName, propertyType } = parseMethodSignature(it as ts.MethodSignature);
      properties[propertyName] = propertyType;
    }
  })

  const mockProperties = {};
  Object.keys(properties).forEach(key => {
    mockProperties[key] = properties[key].mock();
  });
  const merged = Object.assign(HeritageData, mockProperties);

  return {
    interfaceName,
    mockProperties: merged
  }
}

function parsePropertySignature(node: ts.PropertySignature) {
  const propertyName = node.name.getText();
  const propertyType = processType(node.type);

  return {
    propertyName,
    propertyType
  }
}

function parseMethodSignature(node: ts.MethodSignature) {
  const propertyName = node.name.getText();
  const propertyType = processFunctionType(node);

  return {
    propertyName,
    propertyType
  }
}

function processFunctionType(node: ts.FunctionTypeNode | ts.MethodSignature) {
  const { parameters } = node;
  const params = parameters.map(it => {
    return  it.name.getText();
  });
  return createFunctionType(params);
}

function processType(type: ts.TypeNode) {
  if (type.kind === ts.SyntaxKind.FunctionType) {
    return processFunctionType(type as ts.FunctionTypeNode);
  } else if (type.kind === ts.SyntaxKind.TypeReference) {
    const t = type as ts.TypeReferenceNode;
    if (t.typeName.getText() === 'Array') {
      return createMockArrayType(t.typeArguments[0]);
    } else if (t.typeName.getText() === 'Function') {
      return createFunctionType([]);
    }else {
      return createMockType(t);
    }
  } else if (type.kind === ts.SyntaxKind.ArrayType){
    return createMockArrayType((type as ts.ArrayTypeNode).elementType);
  } else {
    return createMockType(type);
  }
}



