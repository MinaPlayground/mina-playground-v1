import fs from "fs/promises";
import path from "path";

const data = [];
const excluded = ["base", "meta.json"];
const projectDir = await fs.readdir("./src/tutorials");
for (const [key, item] of projectDir.entries()) {
  data.push({
    chapter: item,
    sections: [],
  });
  const currentPath = path.join("./src/tutorials", item);
  const sections = (await fs.readdir(currentPath)).filter(
    (item) => !excluded.includes(item)
  );
  for (const section of sections) {
    const sectionPath = path.join("./src/tutorials", item, section);
    const sectionSrcFilesPath = path.join(sectionPath, "src");
    const sectionTestsPath = path.join(sectionPath, "tests");
    const baseSrcFilesPath = path.join("./src/tutorials", item, "base", "src");
    const baseTestsPath = path.join("./src/tutorials", item, "base", "tests");

    await fs.cp(
      sectionSrcFilesPath,
      baseSrcFilesPath,
      { recursive: true },
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
    await fs.cp(sectionTestsPath, baseTestsPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}
