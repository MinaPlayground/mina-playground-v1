import {
  SmartContract,
  PrivateKey,
  Field,
  method,
  AccountUpdate,
  Mina,
  state,
  State,
  Provable,
} from "o1js";

class HelloWorld extends SmartContract {
  @state(Field) x = State<Field>();

  @method increment(xPlus1: Field) {
    const x = this.x.get();
    this.x.requireEquals(x);
    x.add(1).assertEquals(xPlus1);
    this.x.set(xPlus1);
  }
}

const useProof = false;
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const zkAppInstance = new HelloWorld(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

const txn1 = await Mina.transaction(senderAccount, () => {
  zkAppInstance.increment(Field(1));
});
await txn1.prove();
const transaction = await txn1.sign([senderKey]).send();
Provable.log(transaction);
