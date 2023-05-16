import fs from "fs/promises";
import path from "path";

const data = [];
const excluded = ["base", "meta.json"];
const projectDir = await fs.readdir("./src/tutorials");
for (const [key, item] of projectDir.entries()) {
  const currentPath = path.join("./src/tutorials", item);
  const chapterMetaFilePath = path.join(currentPath, "meta.json");
  const fileContent = await fs.readFile(chapterMetaFilePath, {
    encoding: "utf-8",
  });
  data.push({
    chapter: JSON.parse(fileContent).name,
    sections: [],
  });
  const sections = (await fs.readdir(currentPath)).filter(
    (item) => !excluded.includes(item)
  );
  for (const section of sections) {
    const sectionPath = path.join("./src/tutorials", item, section);
    const sectionMetaFilePath = path.join(sectionPath, "meta.json");
    const fileContent = await fs.readFile(sectionMetaFilePath, {
      encoding: "utf-8",
    });
    const sectionSrcFilesPath = path.join(sectionPath, "src");
    const sectionTestsPath = path.join(sectionPath, "tests");
    const baseSrcFilesPath = path.join("./src/tutorials", item, "base", "src");
    const baseTestsPath = path.join("./src/tutorials", item, "base", "tests");

    const tests = await fs.readdir(sectionTestsPath);
    data[key].sections.push({
      name: JSON.parse(fileContent).name,
      tests,
    });

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

console.log(JSON.stringify(data));
