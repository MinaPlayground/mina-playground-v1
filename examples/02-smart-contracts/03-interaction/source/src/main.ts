import {
  SmartContract,
  PrivateKey,
  PublicKey,
  Field,
  Mina,
  AccountUpdate,
  Provable,
} from "o1js";

class HelloWorld extends SmartContract {}

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
const transaction = await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();
Provable.log(transaction);
