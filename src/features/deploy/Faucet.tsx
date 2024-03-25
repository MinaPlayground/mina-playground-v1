import { FC } from "react";
import Button from "@/components/button/Button";
import { useFaucetRequestMutation } from "@/services/minaPlayground";
import { KeyIcon } from "@/icons/DeployIcons";

export const Faucet: FC<FaucetProps> = ({ publicKey }) => {
  const [faucetRequest, { isLoading, isSuccess, isError, data }] =
    useFaucetRequestMutation();

  const onFaucetClick = async () => {
    faucetRequest({
      body: { address: publicKey },
    });
  };

  if (isError) {
    return (
      <div className="alert alert-error">
        <KeyIcon />
        <span className="text-sm">
          Something went from while requesting the faucet. Please try again or
          use another wallet address.
        </span>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="alert alert-success">
        <KeyIcon />
        <span className="text-sm">
          Success. Testnet Mina will arrive at your address when the next block
          is produced (~3 min).
          <br />
          <a
            className="underline"
            href={`https://minascan.io/berkeley/tx/${data.message.paymentID}`}
            target="_blank"
          >
            View your transaction
          </a>
        </span>
      </div>
    );
  }

  return (
    <div className="alert mb-2 bg-gray-300 text-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-current shrink-0 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-sm">
        Make sure to use the faucet if your address does not have any funds
      </span>
      <div>
        <Button isLoading={isLoading} onClick={onFaucetClick}>
          Faucet
        </Button>
      </div>
    </div>
  );
};

interface FaucetProps {
  publicKey: string;
}
