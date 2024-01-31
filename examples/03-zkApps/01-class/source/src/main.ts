import { SmartContract, PrivateKey, PublicKey, Provable } from "o1js";

class HelloWorld extends SmartContract {}

const zkAppKey = PrivateKey.random();
let zkAppAddress = PublicKey.fromPrivateKey(zkAppKey);
let zkApp = new HelloWorld(zkAppAddress);
Provable.log(zkApp);
