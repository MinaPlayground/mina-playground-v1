import { FC, useEffect, useRef, useState } from "react";
import Button from "@/components/button/Button";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  deploySmartContract,
  selectDeploymentMessage,
  selectIsDeploying,
} from "@/features/webcontainer/webcontainerSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import CTAModal from "@/components/modal/CTAModal";
import { KeyIcon } from "@/icons/DeployIcons";
import SelectList from "@/components/select/SelectList";
import { wrap } from "comlink";

const DeployModal: FC<DeployModalProps> = ({
  isVisible,
  close,
  results,
  path,
}) => {
  const isDeploying = useAppSelector(selectIsDeploying);
  const deploymentMessage = useAppSelector(selectDeploymentMessage);
  const dispatch = useAppDispatch();
  const [keys, setKeys] = useState({ publicKey: "", privateKey: "" });
  const snarkyWorker = useRef<any>();

  useEffect(() => {
    return () => snarkyWorker.current?.terminate();
  }, []);

  const deployProject = async () => {
    const compiledPath = `build/${path.replace(".ts", ".js")}`;
    dispatch(
      deploySmartContract({ path: compiledPath, feePayerKey: keys.privateKey })
    );
  };

  const generateKeys = async (customKeyValue?: string) => {
    if (!snarkyWorker.current) {
      snarkyWorker.current = new Worker(
        new URL("../../webworkers/worker.ts", import.meta.url)
      );
    }
    const generateKeys = wrap(snarkyWorker.current);
    // @ts-ignore
    const { publicKey, privateKey } = await generateKeys(customKeyValue);
    setKeys({ publicKey, privateKey });
  };

  const onFaucetClick = () => {
    window.open(
      `https://faucet.minaprotocol.com/?address=${keys.publicKey}`,
      "_blank"
    );
  };

  return (
    <CTAModal id="deploy" isVisible={isVisible} close={close}>
      <h3 className="text-lg font-bold">Deploy Smart Contract</h3>
      <p className="py-2">Choose a Smart Contract</p>
      {deploymentMessage && (
        <div className="alert alert-success">
          <KeyIcon />
          <span>{deploymentMessage.message}</span>
        </div>
      )}
      <SelectList
        title={"Choose a Smart Contract"}
        items={results.map((item) => item[1])}
        onChange={() => null}
      />
      {keys.privateKey && (
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
            <button onClick={onFaucetClick} className="btn btn-sm btn-primary">
              Faucet
            </button>
          </div>
        </div>
      )}
      <div>
        <label htmlFor="hs-trailing-button-add-on" className="sr-only">
          Label
        </label>
        <div className="flex rounded-md shadow-sm">
          <input
            value={keys.privateKey}
            onChange={(evt) => generateKeys(evt.target.value)}
            type="text"
            id="hs-trailing-button-add-on"
            name="hs-trailing-button-add-on"
            placeholder="Fee payer private key"
            className="py-3 px-4 block w-full bg-gray-700 shadow-sm rounded-l-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            onClick={() => generateKeys()}
            type="button"
            className="py-3 px-4 inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-r-md border font-semibold border-none bg-gray-500 text-white hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="white"
                d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"
              />
            </svg>
            Generate
          </button>
        </div>
      </div>
      <div className="modal-action">
        <Button
          isLoading={isDeploying}
          onClick={deployProject}
          className="btn-dark"
        >
          Deploy Smart Contract
        </Button>
      </div>
    </CTAModal>
  );
};

interface DeployModalProps {
  isVisible: boolean;
  results: RegExpMatchArray[];
  path: string;
  close(): void;
}

export default DeployModal;
