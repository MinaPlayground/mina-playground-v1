import { FC, useState } from "react";
import Button from "@/components/button/Button";
import * as React from "react";
import { useCreateSnippetMutation } from "@/services/snippet";
import { useRouter } from "next/router";

const CreateSnippet: FC<CreateSnippetProps> = ({ code }) => {
  const [createSnippet, { isLoading, isError, isSuccess }] =
    useCreateSnippetMutation();
  const [snippetName, setSnippetName] = useState("");
  const router = useRouter();

  const onCreateSnippet = async () => {
    const body = { name: snippetName, code };
    try {
      const response = await createSnippet({ body }).unwrap();
      void router.push(`/snippet/${response.snippet_id}`);
    } catch {}
  };
  return (
    <div className="flex flex-row p-2 gap-2">
      <div className="flex flex-row gap-2 items-center">
        <input
          type="text"
          name="name"
          id="name"
          value={snippetName}
          onChange={(evt) => setSnippetName(evt.target.value)}
          className="input input-bordered input-sm input-primary text-white w-full max-w-xs"
          placeholder="My snippet"
          required
        />
        <Button
          className="btn-sm"
          onClick={onCreateSnippet}
          isLoading={isLoading}
          disabled={!code || !snippetName}
        >
          <span className="text-xs">Create snippet</span>
        </Button>
      </div>
    </div>
  );
};

interface CreateSnippetProps {
  code: string;
}
export default CreateSnippet;
