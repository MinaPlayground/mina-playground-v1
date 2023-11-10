import {
  Field,
  Poseidon,
  PrivateKey,
  PublicKey,
  Signature,
  Provable,
} from "o1js";

let x = new Field(4); // x = 4
x = x.add(3); // x = 7
x = x.sub(1); // x = 6
x = x.mul(3); // x = 18
x = x.div(2); // x = 9
x = x.square(); // x = 81

let b = x.equals(8); // b = Bool(false)
b = x.greaterThan(8); // b = Bool(true)
b = b.not().or(b).and(b); // b = Bool(true)
b.toBoolean(); // true

const hash = Poseidon.hash([x]); // takes array of Fields, returns Field

const privKey = PrivateKey.random(); // create a private key
const pubKey = PublicKey.fromPrivateKey(privKey); // derive public key
const msg = [hash];
const sig = Signature.create(privKey, msg); // sign a message
const isVerified = sig.verify(pubKey, msg); // Bool(true)
