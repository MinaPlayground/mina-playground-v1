import { Field, Provable } from "o1js";

let x = new Field(1); // x = 1

const addOneAndDouble = (x: Field): Field => {
  return x.add(1).mul(2);
};

const y = addOneAndDouble(x);
const isEqual = y.equals(4);
Provable.log("y is:", y);
Provable.log("y is equal to 4:", isEqual);
