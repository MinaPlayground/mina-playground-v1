import tutorials from "@/tutorials.json";

export const isValidChapter = (chapter: string) => {
  return chapter in tutorials;
};

export const isValidChapterAndSection = (chapter: string, section: string) => {
  if (!isValidChapter(chapter)) return false;
  return section in tutorials[chapter as keyof typeof tutorials].sections;
};
