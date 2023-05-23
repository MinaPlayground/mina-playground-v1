import type { NextApiRequest, NextApiResponse } from "next";
import { transformToWebcontainerFiles } from "@/utils/webcontainer";

type Error = {
  message: string;
};

type Data = {
  files: Record<string, any>;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Error | Data>
) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const files = await transformToWebcontainerFiles(
    `./src/tutorials/${req.body.chapter}/base`
  );
  res.status(200).json({ files });
};

export default handler;
