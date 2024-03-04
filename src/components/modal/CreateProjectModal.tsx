import { FC, useState } from "react";
import CTAModal from "@/components/modal/CTAModal";
import Button from "@/components/button/Button";
import { useRouter } from "next/router";
import { useCreateProjectMutation } from "@/services/project";

const CreateProjectModal: FC<CreateProjectModalProps> = ({
  isVisible,
  close,
  projectId,
}) => {
  const [createProject, { isLoading, isError, isSuccess }] =
    useCreateProjectMutation();
  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const router = useRouter();
  const isFork = !!projectId;

  const onCreate = async () => {
    const body = { name, type: 0, visibility: true, files_id: 1 };
    if (isFork) {
      body["forkedProject"] = projectId;
    }
    try {
      const response = await createProject({ body }).unwrap();
      void router.push(`/project/${response.project_id}`);
    } catch {}
  };

  return (
    <CTAModal id="createProject" isVisible={isVisible} close={close}>
      <h3 className="text-lg text-gray-200 font-bold">
        Create {isFork ? "fork" : "project"}
      </h3>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Project name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full text-gray-200"
        />
      </label>
      {!isFork && (
        <div className="flex flex-col gap-2 mt-2">
          <span className="label-text">Select a template</span>
          <div className="flex flex-col lg:flex-row gap-2">
            <button
              onClick={() => setSelectedTemplate("zkApp")}
              className={`btn btn-outline ${
                selectedTemplate === "zkApp" && "bg-white text-black"
              }`}
            >
              zkApp
            </button>
            <button
              onClick={() => setSelectedTemplate("SmartContract")}
              className={`btn btn-outline ${
                selectedTemplate === "SmartContract" && "bg-white text-black"
              }`}
            >
              Smart Contract
            </button>
          </div>
        </div>
      )}
      <div className="modal-action">
        <Button
          isLoading={isLoading || isSuccess}
          onClick={onCreate}
          className="btn-dark"
        >
          Create {isFork ? "fork" : "project"}
        </Button>
        <Button onClick={close} className="btn-primary">
          Close
        </Button>
      </div>
    </CTAModal>
  );
};

interface CreateProjectModalProps {
  isVisible: boolean;
  projectId?: string;
  close(): void;
}

export default CreateProjectModal;
