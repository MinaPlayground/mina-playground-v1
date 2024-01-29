import {
  SmartContract,
  PrivateKey,
  PublicKey,
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

  init() {
    super.init();
    this.x.set(Field(10)); // initial state
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
const x = zkAppInstance.x.get();
Provable.log("state after init:", x);
