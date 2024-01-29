import { Field, Provable } from "o1js";

let x = Field(1);
x = x.add(2); // x is now 3 since 1 + 2 = 3
x = x.sub(1); // x is now 2 since 3 - 1 = 2
x = x.mul(2); // x is now 4 since 2 * 2 = 4
x = x.div(2); // x is now 2 since 4 / 2 = 2
Provable.log("x is now:", x); // should be 2

let b = x.equals(3); // b is false since x is equal to 2
b = x.greaterThan(2); // b is false since x is not greater than 2
Provable.log("b is now:", b); // should be false

let c = b.not();
let d = b.not().or(b);
let e = b.not().and(b);
Provable.log("c is now:", c); // should be true
Provable.log("d is now:", d); // should be true
Provable.log("e is now:", e); // should be false
