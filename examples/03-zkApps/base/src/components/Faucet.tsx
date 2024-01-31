import { FC } from "react";
import {PublicKey} from "o1js";

const Faucet: FC<FaucetProps> = ({
  publicKey
}) => {
  const faucetLink =
    "https://faucet.minaprotocol.com/?address=" + publicKey.toBase58();
  return (
    <div>
      <span style={{ paddingRight: "1rem" }}>Account does not exist.</span>
      <a href={faucetLink} target="_blank" rel="noreferrer">
        Visit the faucet to fund this fee payer account
      </a>
    </div>
  );
};

interface FaucetProps {
  publicKey: PublicKey;
}

export default Faucet;
