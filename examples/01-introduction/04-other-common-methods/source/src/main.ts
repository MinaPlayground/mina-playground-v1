import {
  Field,
  Poseidon,
  PrivateKey,
  PublicKey,
  Signature,
  Provable,
} from "o1js";

const x = Field(1);
const hash = Poseidon.hash([x]); // takes array of Fields, returns Field
const privKey = PrivateKey.random(); // create a private key
const pubKey = PublicKey.fromPrivateKey(privKey); // derive public key
const msg = [hash];
const sig = Signature.create(privKey, msg); // sign a message
const isVerified = sig.verify(pubKey, msg); // Bool(true)
Provable.log("is signature verified:", isVerified); // should be true
