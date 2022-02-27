import {Lexer} from "../Lexer/Lexer";
import {Env}  from "../Symbols/Env";
import {Token} from "../Lexer/Token";
import {Stmt} from "../Inter/Stmt";
import {Tag} from "../Lexer/Tag";
import {Id} from "../Inter/Id";
import { Expr } from "../Inter/Expr";
import {Word} from "../Lexer/Word";
import {Seq} from "../Inter/Seq";
import {Set} from "../Inter/Set";
import {SetElem} from "../Inter/SetElem";

export class Parser 
{
private lex:Lexer; // lexical analyzer for this parser
private look:Token; // lookahead token
 top:Env = null; // current or top symbol table
used:Number = 0; // storage used for declarations
public constructor(l:Lexer) {this.lex = l; this.move();}
move():void {this.look = this.lex.scan();}
error(s:String):void { throw new Error("near line "+Lexer.line+": "+s); }
match(t:any):void{
if ( this.look.tag == t ) {this.move()}
else {this.error("syntax error")
}
}

program():void
{ // program -> block
   let s:Stmt = this.block() ;
    let begin = s.newLabel() ; let after = s.newLabel() ;
     s.emitLabel(begin); s.gen(begin, after); s.emitLabel(after);
}

 block():Stmt
 {// block -> ( decls stmts 3
 this.match('{'); let savedEnv:Env = this.top; this.top = new Env(this.top);
this.decls(); 
let s:Stmt = this.stmts();
this.match('}'); this.top = savedEnv;
return s;
 }
decls():void
{
while( this.look.tag == Tag.BASIC ) 
{ // D -> type ID ;
let p:any = this.type();
let tok:any = this.look; this.match(Tag.ID); this.match(';');
let id:Id = new Id(tok, p, this.used);
this.top.put( tok, id);
this.used = this.used + p.width;
}
}
type():any
{
let p:any = this.look; // expect look.tag == Tag.BASIC
this.match(Tag.BASIC) ;
if( this.look.tag != '[' ) return p; // T -> basic
else return this.dims(p) ; // return array type
}

dims(p:Type):Type
{
this.match('['); let tok:any = this.look; this.match(Tag.NUM);this.match(']');
if( this.look.tag == '[' )
p = this.dims(p) ;
return new Array(tok.value, p);
}
stmts():Stmt 
{
    if ( this.look.tag == '}' ) return Stmt.Null;
    else return new Seq(this.stmt(), this.stmts()) ;
}
 
stmt():Stmt
{
let x:Expr;let s:Stmt; let s1:Stmt; let s2:Stmt;
let savedstmt:Stmt ; // save enclosing loop for breaks
switch( this.look.tag ) {
case ';':
this.move () ;
return Stmt.Null;
case Tag.IF:
this.match(Tag.IF); this.match('('); x = this.bool(); this.match(')');
s1 = this.stmt() ;
if ( this.look.tag != Tag.ELSE ) return new If (x, s1) ;
this.match(Tag.ELSE);
s2 = this.stmt() ;
return new Else(x, s1, s2);
case Tag. WHILE:
let whilenode:While = new While();
savedstmt = Stmt.Enclosing; Stmt.Enclosing = whilenode;
this.match(Tag.WHILE); this.match('('); x = this.bool(); this.match(')');
s1 = this.stmt();
whilenode.init (x, s1) ;
Stmt.Enclosing = savedstmt; // reset Stmt.Enclosing
return whilenode;
case Tag.DO:
let donode:Do = new Do();
savedstmt = Stmt.Enclosing; Stmt.Enclosing = donode;
this.match(Tag.DO) ;
s1 = this.stmt();
this.match(Tag.WHILE); this.match('('); x = this.bool(); this.match(')'); this.match(';');
donode.init (s1, x) ;
Stmt.Enclosing = savedstmt; // reset Stmt.Enclosing
return donode;
case Tag.BREAK:
this.match(Tag.BREAK); this.match(';');
return new Break() ;
case '{':
return this.block();
default :
return this.assign() ;
}
}
assign():Stmt 
{
 let stmt:any; let t:Token|Real|Num = this.look;
 this.match(Tag . ID) ;
 let id:Id = this.top.get(t);
 if ( id === null ) 
 {this.error(t . toString() + " undeclared")} 
  if ( this.look.tag == '=' )
  { // S -> id = E ;
    this.move(); stmt = new Set(id, this.bool());
  }
  else { //S->L=E;
    let x:Access = this.offset(id);
    this.match('=') ; stmt = new SetElem(x, this.bool()) ;
  }
   this.match(';');
  return stmt;
  }
  bool():Expr
  {
        let x:Expr = this.join();
        while( this.look.tag == Tag.OR ) {
        let tok:Token|Real|Num = this.look; this.move(); x = new Or(tok, x, this.join());
        }
        return x;
    }
join():Expr 
{
 let x:Expr = this.equality();
        while( this.look.tag == Tag.AND ) {
        let tok:Token|Real|Num = this.look; this.move() ; x = new And(tok, x, this.equality()) ;
        }
        return x;
    }
 equality():Expr
 {
        let x:Expr = this.rel() ;
        while( this.look.tag == Tag .EQ || this.look. tag == Tag.NE ) {
        let tok:Token|Num|Real = this.look; this.move(); x = new Rel(tok, x, this.rel());
 }
        return x;
}
 rel():Expr
 {
    let x:Expr = this.expr();
            switch( this.look.tag ) 
            {
                case '<': 
                case Tag.LE: 
                case Tag.GE: case '>':
                let tok:Token|Num|Real = this.look; this.move() ; return new Rel(tok, x, this.expr()) ;
                default :
                return x;
            }
        }
  expr():Expr
  {
      let x:Expr = this.term() ;
                while( this.look.tag == '+' || this.look.tag == '-' ) {
                let tok:Token|Real|Num = this.look; this.move(); x = new Arith(tok, x, this.term());
  }
                return x;
             }
  
  term():Expr
  {
                let x:Expr = this.unary() ;
                while(this.look.tag == '*' || this.look.tag == '/' ) {
                let tok:Token|Real|Num = this.look; this.move(); x = new Arith(tok, x, this.unary());
                }
                return x;
            }
  unary():Expr
  {
                if(this.look.tag == '-' ) 
                {
                this.move(); return new Unary(Word.minus, this.unary());
                }
                else if( this.look.tag == '!' ) {
                let tok:Token|Real|Num = this.look; this.move() ; return new Not (tok, this.unary()) ;
  }
                else return this.factor() ;
}
 
 factor():Expr 
{
                    let x:Expr = null;
                    switch( this.look.tag )
                    {
                    case '(':
                    this.move(); let x = this.bool(); this.match(')');
                    return x;
                    case Tag.NUM:
                    x = new Constant(this.look, Type.Int); this.move(); return x;
                    case Tag.REAL:
                    x = new Constant(this.look, Type.Float); this.move(); return x;
                    case Tag.TRUE:
                    x = Constant.True; this.move(); return x;
                    case Tag.FALSE :
                    x = Constant .False; this.move(); return x;
                    default :
                    this.error("syntax error") ;
                    return x;
                    case Tag.ID:
                    let s:String = this.look.toString();
                    let id:Id = this.top.get(this.look) ;
                    if( id == null ) this.error(this.look.toString() + " undeclared");
                    this.move() ;
                    if ( this.look.tag != '[' ) {return id}
                    else {return this.offset (id)}
                    }
                }
                
offset(a:Id):Access
{ // I -> [El I [El I
let  i:Expr; let w:Expr;let t1:Expr ;let t2; let loc:Expr; // inherit id
let type:Type = a.type;
this.match('['); i = this.bool(); this.match(']'); // first index, I -> [ E 1
type = Array.ofType ;//to see if this changes behaviour
w = new IntegerConstant(type.width);//to see if this changes behaviour
t1 = new Arith(new Token('*'), i, w);
loc = t1;
while( this.look.tag == ' [')
{ // multi-dimensional I -> [ E I I
 this.match('['); i = this.bool(); this.match(']');
 type = Array.ofType ;//to see if this changes behaviour
 w = new IntegerConstant(type.width);//to see if this changes behaviour
t1 = new Arith(new Token('*'), i, w);
t2 = new Arith(new Token('+'), loc, t1);
loc = t2;
}
return new Access(a, loc, type) ;
}
}
