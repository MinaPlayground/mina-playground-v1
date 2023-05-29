import type { NextApiRequest, NextApiResponse } from "next";
import { getTutorialByChapterAndSection } from "@/utils/tutorial";

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
  const response = await getTutorialByChapterAndSection(
    req.body.chapter,
    req.body.section
  );
  res.status(200).json({ ...response });
};

export default handler;
