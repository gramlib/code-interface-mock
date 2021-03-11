import ts from "typescript";
import {gather} from "@/ts-api/gather-types";
import {processFile} from "@/ts-api/process-file";

export function mockInter(sourceFile: ts.SourceFile,) {
  gather.clear();
  gather.gatherTypes(sourceFile);

  const collectInterfaceMock = processFile(sourceFile);
  return collectInterfaceMock;
}
