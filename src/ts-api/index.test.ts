import ts from "typescript";
import {mockInter} from "@/ts-api/index";

const filename = 'index.ts';
const filecontent = `\
interface Admin extends User {
   adminRecord: AdminRecord;
}

interface Student extends User {
   schoolRecord: SchoolRecord;
}

interface User {
   firstName: string;
   lastName: string;
   username: string;
   emailAddress: string;
}

interface AdminRecord {
   studentsPassedEachYear: number[];
}

interface SchoolRecord {
   startDate: string;
   endDate: string;
   isActive: boolean;
   grades: number[];
}

export interface ICommonData {
  query: Record<string, string>;
  pushWindow(url: string): void;
  alert(message: string): void;
  onBtnTap: Function;
}
`;

describe('test gather types', () => {
  it('should gather', () => {
    const sourceFile = ts.createSourceFile(filename, filecontent, ts.ScriptTarget.ES2015, true);
    const result = mockInter(sourceFile);
    expect(result).toMatchSnapshot();
  });
})
