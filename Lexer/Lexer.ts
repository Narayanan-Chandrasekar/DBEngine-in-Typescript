import {Tag} from "./Tag";
import {Token} from "./Token";
import {Word} from "./Word";
import { exit } from "process";

const fs = require('fs');

export class Lexer
{
static line = 1;
static seek = 0;
peek:string = '';
readable: any;
words : Map<Word["lexeme"], Tag> = new Map();
reserve(w: Word):void {
    this.words.set(w.lexeme,w);
}   
constructor()
{
    this.reserve( new Word("fetch", Tag.FETCH));
    this.reserve( new Word("create", Tag.CREATE));
    this.reserve( new Word("update", Tag.UPDATE));
    this.reserve( new Word("delete", Tag.DELETE));
    this.reserve( new Word("crash", Tag.CRASH));
    this.readable  = fs.readFileSync('C:\\Users\\CHNARAY\\Desktop\\DBprogram.txt',{encoding:'utf8'});
    
}
readPeek():void
{
   
        this.peek = this.readable[Lexer.seek];
        Lexer.seek++;
        
}

readch(c?:String):Boolean{
   if(c!==undefined)
   {
    this.readPeek();
    if(this.peek != c) return false;
    this.peek = ' ';
    return true;
   } else {
   
   }
}

scan():Token
{
    for(;;this.readPeek())
    {
        if(this.peek == 'X')exit;
        if(this.peek == '' || this.peek == '\t' || this.peek === '\r' || this.peek === ' ')continue;
        else if( this.peek == '\n') Lexer.line++;
        else break;
    }
   
    if ( this.peek.match(/[a-zA-Z]/))
    {
    let b :string = '';
        while( this.peek.match(/[a-zA-Z]/) )
            {
            b = b + this.peek;
            this.readPeek() ;
            } 
    let w:Word = this.words.get(b);
    if ( w != null ) return w;
    w = new Word(b, Tag.ID);
    this.words.set(b, w);
    return w;
    }
let token: Token = new Token(this.peek); this.peek='';
return token;

}

}
