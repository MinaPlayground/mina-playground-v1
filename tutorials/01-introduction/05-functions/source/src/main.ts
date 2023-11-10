import { Field, Provable } from "o1js";

let x = new Field(1); // x = 1

const addOneAndDouble = (x: Field): Field => {
  return x.add(1).mul(2);
};
