import { Field, Bool, UInt64, UInt32, Provable } from "o1js";

const sum = Field(1).add(3);
const bool = Bool(true);
const int32 = new UInt32(123);
const int64 = new UInt64(1234);

Provable.log("sum has the value:", sum);
Provable.log("bool has the value:", bool);
Provable.log("int32 has the value:", int32);
Provable.log("int64 has the value", int64);
