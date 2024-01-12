import { FC, useEffect, useState } from "react";
import CTAModal from "@/components/modal/CTAModal";
import Button from "@/components/button/Button";
import { useRouter } from "next/router";
import { useCreateProjectMutation } from "@/services/project";

const EditProjectModal: FC<EditProjectModalProps> = ({
  isVisible,
  close,
  name,
  type,
  visibility,
  id,
}) => {
  const { query, push } = useRouter();
  const [createProject, { isLoading, isError, isSuccess }] =
    useCreateProjectMutation();
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

  console.log(values);

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
        isLoading={isLoading || isSuccess}
        onClick={() => null}
        className="mt-4 btn-sm btn-error"
      >
        Delete Project
      </Button>
      <div className="modal-action">
        <Button
          isLoading={isLoading || isSuccess}
          onClick={() => null}
          className="btn-dark"
        >
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
