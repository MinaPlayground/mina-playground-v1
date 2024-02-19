import { FC } from "react";
import styles from "@/styles/Home.module.css";

const Setup: FC<SetupProps> = ({ transactionLink, displayText, hasWallet }) => {
  const renderWalletNotFound = () => {
    const auroLink = "https://www.aurowallet.com/";
    const auroLinkElem = (
      <a href={auroLink} target="_blank" rel="noreferrer">
        Install Auro wallet here
      </a>
    );
    return <div>Could not find a wallet. {auroLinkElem}</div>;
  };

  const walletNotFound = hasWallet === false;

  return (
    <div
      className={styles.start}
      style={{ fontWeight: "bold", fontSize: "1.5rem", paddingBottom: "5rem" }}
    >
      {transactionLink ? (
        <a href={displayText} target="_blank" rel="noreferrer">
          View transaction
        </a>
      ) : (
        displayText
      )}
      {walletNotFound && renderWalletNotFound()}
    </div>
  );
};

interface SetupProps {
  transactionLink: string;
  displayText: string;
  hasWallet: boolean | null;
}

export default Setup;
