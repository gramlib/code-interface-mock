import * as ts from "typescript";

interface Refs {
  [key:string]: ts.InterfaceDeclaration;
}

class Gather {
  collectTypes: Refs = {};

  gatherTypes(sourceFile: ts.SourceFile | ts.ModuleBlock) {
    const {statements} = sourceFile;
    statements.forEach(statement => {
      if (statement.kind === ts.SyntaxKind.InterfaceDeclaration) {
        const t = statement as ts.InterfaceDeclaration;
        this.collectTypes[t.name.getText()] = t;
      }
    });
  }

  clear() {
    this.collectTypes = {};
  }
}

export const gather = new Gather();
