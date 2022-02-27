export class Token {
    tag: any;
     constructor(t : any) { this.tag = t; }
     public toString(): String {return "" + String(this.tag);}
     }