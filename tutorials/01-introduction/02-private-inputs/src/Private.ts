import { Field, SmartContract, state, State, method, Poseidon } from "snarkyjs";

export class Private extends SmartContract {
  @state(Field) x = State<Field>();
}
