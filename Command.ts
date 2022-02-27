import { LeftHandSideExpression } from "typescript";

export interface Command{
    FETCH : Lexer.Fetch;
    INS : Lexer.Insert;
    UPD : Lexer.Update;
    DEL : Lexer.Delete; 
    JOIN : Lexer.Join;//Do a merge/deepmerge
}