import { FC } from "react";
import Button from "@/components/button/Button";
import {
  deploySmartContract,
  selectDeploymentMessage,
  selectIsDeploying,
} from "@/features/webcontainer/webcontainerSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { KeyIcon } from "@/icons/DeployIcons";

export const DeployContract: FC<DeployContractProps> = ({}) => {
  const isDeploying = useAppSelector(selectIsDeploying);
  const deploymentMessage = useAppSelector(selectDeploymentMessage);
  const dispatch = useAppDispatch();

  const deploy = async () => {
    const compiledPath = `build/src/main.js`;
    dispatch(
      deploySmartContract({
        path: compiledPath,
      })
    );
  };
  return (
    <>
      {deploymentMessage && (
        <div className="alert alert-success">
          <KeyIcon />
          <span>
            {deploymentMessage.message} <br />
            <a
              className="underline"
              href={`https://minascan.io/berkeley/tx/${deploymentMessage.details}`}
              target="_blank"
            >
              View your transaction
            </a>
          </span>
        </div>
      )}
      <Button onClick={deploy} isLoading={isDeploying}>
        Deploy contract
      </Button>
    </>
  );
};

interface DeployContractProps {}
