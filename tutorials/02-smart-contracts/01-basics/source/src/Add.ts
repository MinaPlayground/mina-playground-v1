import { Field, SmartContract, state, State, method } from "snarkyjs";

export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method update() {
    const currentState = this.num.getAndAssertEquals();
  }
}
