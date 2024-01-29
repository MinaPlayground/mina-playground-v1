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
  Poseidon,
} from "o1js";

class HelloWorld extends SmartContract {
  @state(Field) x = State<Field>();

  init() {
    super.init();
    this.x.set(Poseidon.hash([Field(1)]));
  }

  @method incrementSecret(secret: Field) {
    const x = this.x.get();
    this.x.assertEquals(x);

    Poseidon.hash([secret]).assertEquals(x);
    this.x.set(Poseidon.hash([secret.add(1)]));
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
  zkAppInstance.incrementSecret(Field(1));
});
await txn1.prove();
const transaction = await txn1.sign([senderKey]).send();
Provable.log(transaction);

const txn2 = await Mina.transaction(senderAccount, () => {
  zkAppInstance.incrementSecret(Field(2));
});
await txn2.prove();
const transaction2 = await txn2.sign([senderKey]).send();
Provable.log(transaction2);
