import {
  SmartContract,
  PrivateKey,
  PublicKey,
  Field,
  method,
  Provable,
} from "o1js";

class HelloWorld extends SmartContract {
  @method myMethod(x: Field) {
    x.mul(2).assertEquals(5);
  }
}

Provable.log(HelloWorld);
