import ts from "typescript";
import {traverseInterface} from "@/ts-api/traverse-interface";

export function processFile(sourceFile: ts.SourceFile) {
  const collectInterfaceMock = {};

  const processNode = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
      const {interfaceName, mockProperties} = traverseInterface(node as ts.InterfaceDeclaration);
      collectInterfaceMock[interfaceName] = mockProperties;
    } else {
      // ignore
    }

    ts.forEachChild(node, processNode);
  };

  processNode(sourceFile);

  return collectInterfaceMock;
}
