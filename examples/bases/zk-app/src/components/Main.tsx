import { FC } from "react";
import { Field, PublicKey } from "o1js";
import styles from "@/styles/Home.module.css";

const Main: FC<FaucetProps> = ({
  field,
  creatingTransaction,
  onRefresh,
  onSendTransaction,
}) => {
  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <div className={styles.center} style={{ padding: 0 }}>
        Current state in zkApp: {field.toString()}{" "}
      </div>
      <button
        className={styles.card}
        onClick={onSendTransaction}
        disabled={creatingTransaction}
      >
        Send Transaction
      </button>
      <button className={styles.card} onClick={() => onRefresh("num")}>
        Get Latest State
      </button>
    </div>
  );
};

interface FaucetProps {
  field: Field;
  creatingTransaction: boolean;
  onRefresh(name: string): void;
  onSendTransaction(): void;
}

export default Main;
