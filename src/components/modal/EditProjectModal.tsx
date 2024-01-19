import { FC, useEffect, useState } from "react";
import CTAModal from "@/components/modal/CTAModal";
import Button from "@/components/button/Button";
import { useRouter } from "next/router";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "@/services/project";
import { useDeleteFileTreeItemMutation } from "@/services/fileTree";

const EditProjectModal: FC<EditProjectModalProps> = ({
  isVisible,
  close,
  name,
  type,
  visibility,
  id,
}) => {
  const { query, push } = useRouter();
  const [deleteProject, { isLoading: isLoadingDeletion }] =
    useDeleteProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [values, setValues] = useState({
    name,
    type,
    visibility,
    id,
  });
  const router = useRouter();

  useEffect(() => {
    setValues({
      name,
      type,
      visibility,
      id,
    });
  }, [id]);

  const onDelete = async () => {
    try {
      await deleteProject({
        id,
      }).unwrap();
      router.reload();
    } catch {}
  };

  const onUpdate = async () => {
    try {
      await updateProject({
        id,
        body: { name: values.name, visibility: values.visibility },
      }).unwrap();
      router.reload();
    } catch {}
  };

  return (
    <CTAModal id="editProject" isVisible={isVisible} close={close}>
      <h3 className="text-lg text-gray-200 font-bold">Create project</h3>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Project name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="input input-bordered w-full text-gray-200"
        />
      </label>
      <div className="label-text my-4">
        Type: {type === 0 ? "zkApp" : "Smart Contract"}
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          onChange={() =>
            setValues({ ...values, visibility: !values.visibility })
          }
          type="checkbox"
          checked={!values.visibility}
          className="checkbox checkbox-secondary bg-gray-600"
        />
        <span className="label-text">Make private</span>
      </label>
      <Button
        isLoading={isLoadingDeletion}
        onClick={onDelete}
        className="mt-4 btn-sm btn-error"
      >
        Delete Project
      </Button>
      <div className="modal-action">
        <Button isLoading={isUpdating} onClick={onUpdate} className="btn-dark">
          Update
        </Button>
        <Button onClick={close} className="btn-primary">
          Close
        </Button>
      </div>
    </CTAModal>
  );
};

interface EditProjectModalProps {
  isVisible: boolean;
  name: string;
  type: number;
  visibility: boolean;
  id: string;
  close(): void;
}

export default EditProjectModal;
