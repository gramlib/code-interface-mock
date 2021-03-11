import ts from "typescript";

export interface TypeCacheRecord {
  kind: ts.SyntaxKind,
  aliasedTo: ts.SyntaxKind,
  node: ts.Node,
}

export type Output = Record<string | number, {}>;
export type Types = Record<string, TypeCacheRecord>;
