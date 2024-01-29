import { Field, Poseidon } from "o1js";

function knowsPreimage(value: Field) {
  let hash = Poseidon.hash([value]);
  hash.assertEquals(expectedHash);
}

const correctValue = Field(1);
const incorrectValue = Field(2);
const expectedHash = Poseidon.hash([correctValue]);

knowsPreimage(correctValue);
