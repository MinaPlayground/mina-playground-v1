import { Private } from "../src/Private";
import {
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  Poseidon,
} from "snarkyjs";

let proofsEnabled = false;

describe("Private", () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Private;

  beforeAll(async () => {
    if (proofsEnabled) await Private.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Private(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
      zkApp.initState(Field(100), Field(150));
    });
    await txn.prove();
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it("generates and deploys the `Private` smart contract and checks the Poseidon hash", async () => {
    await localDeploy();
    const x = zkApp.x.get();
    expect(x).toEqual(Poseidon.hash([Field(100), Field(150)]));
  });

  it("correctly increments a secret on the `Private` smart contract using a Poseidon hash", async () => {
    await localDeploy();

    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.incrementSecret(Field(100), Field(150));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const x = zkApp.x.get();
    expect(x).toEqual(Poseidon.hash([Field(100), Field(151)]));
  });
});
