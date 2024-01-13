import { FC, useState } from "react";
import { CommitIcon } from "@/icons/VersionControlIcons";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectChangedFields } from "@/features/fileTree/fileTreeSlice";
import CommitModal from "@/components/version-control/CommitModal";

const CommitButton: FC = () => {
  const changedFields = useAppSelector(selectChangedFields);
  const hasSavedField = Object.values(changedFields).some(({ saved }) => saved);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalVisible(true)}
        disabled={!hasSavedField}
        type="button"
        className="text-gray-200 hover:text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center mr-2 inline-flex items-center disabled:opacity-50 disabled:pointer-events-none
"
      >
        <CommitIcon />
        Commit
      </button>
      <CommitModal
        isVisible={isModalVisible}
        close={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default CommitButton;
