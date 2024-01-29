import { Field, Circuit, Bool, Provable } from "o1js";

const a = new Field(1);
const b = new Field(2);
const foo = Bool(true);

const x = Circuit.if(new Bool(foo), a, b);
Provable.log("x is now:", x);
