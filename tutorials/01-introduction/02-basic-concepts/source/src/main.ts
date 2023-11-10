import { Field, Bool, UInt64, UInt32, Provable } from "o1js";

const sum = Field(1).add(3); // adds 3 to the Field which has a value of 1
const bool = Bool(true); // accepts true or false
const int32 = new UInt32(1234); // accepts a Field - useful for constraining numbers to 32 bits
const int64 = new UInt64(12345); // accepts a Field - useful for constraining numbers to 64 bits
