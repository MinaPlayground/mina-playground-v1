import { FC } from "react";
import { ErrorIcon, Spinner, SuccessIcon } from "@/icons/SaveCodeIcons";
import { CommitIcon } from "@/icons/VersionControlIcons";
import { useCreateCommitMutation } from "@/services/versionControl";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectChangedFields } from "@/features/fileTree/fileTreeSlice";

const mapStatusToIconText = (
  isLoading: boolean,
  isSaved: boolean,
  isError: boolean
) => {
  if (isLoading) {
    return {
      text: "Pushing...",
      Icon: <Spinner />,
    };
  }
  if (isSaved) {
    return {
      text: "Committed",
      Icon: <SuccessIcon />,
    };
  }
  if (isError) {
    return {
      text: "Retry",
      Icon: <ErrorIcon />,
    };
  }
  return {
    text: "Commit",
    Icon: <CommitIcon />,
  };
};

const CommitButton: FC = () => {
  const [createCommit, { isLoading, isSuccess, isError }] =
    useCreateCommitMutation();
  const { text, Icon } = mapStatusToIconText(isLoading, isSuccess, isError);
  const changedFields = useAppSelector(selectChangedFields);

  const hasSavedField = Object.values(changedFields).some(({ saved }) => saved);

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
      project_id: "659da54e538d86bedd0c8d30",
    };
    await createCommit({ body });
  };

  return (
    <button
      onClick={onCommit}
      disabled={!hasSavedField || isLoading || isSuccess}
      type="button"
      className="text-gray-200 hover:text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 inline-flex items-center disabled:opacity-50 disabled:pointer-events-none
"
    >
      {Icon}
      {text}
    </button>
  );
};

export default CommitButton;
