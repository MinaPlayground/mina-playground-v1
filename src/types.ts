import { ParsedUrlQuery } from "querystring";

export type FileSystemType = "directory" | "file";

export interface TutorialParams extends ParsedUrlQuery {
  chapter: string;
  section: string;
}
