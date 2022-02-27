import {Token} from "./Token";
import {Tag} from "./Tag";
export class Word extends Token {// static variables can also be initialized
    
    lexeme:String = "";
    
    constructor (s:String,tag: Number) { super(tag); this.lexeme = s;}
    public  toString():String { return this.lexeme}; 
    
    static fetch: Word = new Word( "FETCH", Tag.FETCH );
    static create: Word = new Word( "CREATE" , Tag. CREATE);
    static update: Word = new Word( "UPDATE", Tag.UPDATE );
    static delete: Word = new Word( "DELETE", Tag.DELETE ); 
    static crash: Word = new Word( "CRASH", Tag.CRASH );
     
}