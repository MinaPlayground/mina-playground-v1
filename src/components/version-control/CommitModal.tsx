import { FC, useState } from "react";
import { useCreateCommitMutation } from "@/services/versionControl";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectChangedFields } from "@/features/fileTree/fileTreeSlice";
import CTAModal from "@/components/modal/CTAModal";
import Button from "@/components/button/Button";
import { normalizePath } from "@/utils/fileSystemWeb";
import { useRouter } from "next/router";
import { KeyIcon } from "@/icons/DeployIcons";

const CommitModal: FC<CommitModalProps> = ({ isVisible, close }) => {
  const [createCommit, { isLoading, isSuccess, isError, reset }] =
    useCreateCommitMutation();
  const [message, setMesssage] = useState("");
  const changedFields = useAppSelector(selectChangedFields);
  const { query, push } = useRouter();

  const onCommit = async () => {
    const fieldValues: Record<
      string,
      { previousCode: string; currentCode: string }
    > = {};
    for (const key in changedFields) {
      const { previousCode, currentCode, saved } = changedFields[key];
      if (!saved) return;
      fieldValues[key] = { previousCode, currentCode };
    }
    const body = {
      files: fieldValues,
      message,
      project_id: query.projectId,
    };
    await createCommit({ body });
  };

  const onClose = () => {
    close();
    reset();
  };

  return (
    <CTAModal id="deploy" isVisible={isVisible} close={onClose}>
      <h3 className="text-lg text-gray-200 font-bold">Commit changes</h3>
      {isSuccess && (
        <div className="alert alert-success my-4">
          <KeyIcon />
          <span>Commit has been pushed</span>
        </div>
      )}
      {!isSuccess && (
        <>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Commit message</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              value={message}
              onChange={(e) => setMesssage(e.target.value)}
              className="input input-bordered w-full text-gray-200"
            />
          </label>
          <div className="my-4">
            <h2 className="text-gray-200">Files changed:</h2>
            <ul className="list-disc px-4 text-blue-400">
              {Object.entries(changedFields)
                .filter(([, { saved }]) => saved)
                .map(([key]) => (
                  <li key={key}>{normalizePath(key)}</li>
                ))}
            </ul>
          </div>
        </>
      )}
      <div className="modal-action">
        {isSuccess ? (
          <Button
            onClick={() => push(`/commits/${query.projectId}`)}
            className="btn-dark"
          >
            Check commits
          </Button>
        ) : (
          <Button isLoading={isLoading} onClick={onCommit} className="btn-dark">
            Commit
          </Button>
        )}
        <Button onClick={onClose} className="btn-primary">
          Close
        </Button>
      </div>
    </CTAModal>
  );
};

interface CommitModalProps {
  isVisible: boolean;
  close(): void;
}

export default CommitModal;
