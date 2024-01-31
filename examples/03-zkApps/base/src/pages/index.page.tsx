import "./reactCOIServiceWorker";
import GradientBG from "../components/GradientBG.js";
import styles from "../styles/Home.module.css";
import { useO1js } from "@/hooks/useO1js";
import Setup from "@/components/Setup";
import Faucet from "@/components/Faucet";
import { PublicKey } from "o1js";
import Main from "@/components/Main";

const zkAppKey = "B62qo2Be4Udo5EG1ux9yMJVkXe9Gz945cocN7Bn4W9DSYyeHZr1C3Ea";

export default function Home() {
  const { state, transactionlink, displayText, onSendTransaction, onRefresh } =
    useO1js(zkAppKey, ["num"]);

  const accountExists = state.hasBeenSetup && state.accountExists;
  const accountDoesNotExist = state.hasBeenSetup && !state.accountExists;
  return (
    <GradientBG>
      <div className={styles.main} style={{ padding: 0 }}>
        <div className={styles.center} style={{ padding: 0 }}>
          <Setup
            displayText={displayText}
            transactionLink={transactionlink}
            hasWallet={state.hasWallet}
          />
          {accountExists && (
            <Main
              field={state.fields!["num"]}
              creatingTransaction={state.creatingTransaction}
              onSendTransaction={onSendTransaction}
              onRefresh={onRefresh}
            />
          )}
          {accountDoesNotExist && (
            <Faucet publicKey={state.publicKey as PublicKey} />
          )}
        </div>
      </div>
    </GradientBG>
  );
}
