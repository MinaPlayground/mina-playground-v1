const fs = require("fs/promises");
const path = require("path");

const data = [];
let imports = "";
const excluded = ["base", "meta.json"];
const parseTutorials = (async () => {
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
    for (const [sectionKey, section] of sections.entries()) {
      const sectionPath = path.join("./src/tutorials", item, section);
      const sectionMetaFilePath = path.join(sectionPath, "meta.json");
      const sectionTutorialPath = path.join(sectionPath, "tutorial.mdx");
      const metaFileContent = await fs.readFile(sectionMetaFilePath, {
        encoding: "utf-8",
      });
      const sectionSrcFilesPath = path.join(sectionPath, "src");
      const sectionTestsPath = path.join(sectionPath, "tests");

      const basePath = path.join("./src/tutorials", item, "base");
      const baseSrcFilesPath = path.join(basePath, "src");
      const baseTestsPath = path.join(basePath, "tests");

      const test = await fs.readdir(sectionTestsPath);
      data[key].sections.push({
        name: JSON.parse(metaFileContent).name,
      });

      const sectionSrcFile = await fs.readdir(path.join(sectionSrcFilesPath));
      const srcFilePath = path.join(
        sectionSrcFilesPath,
        sectionSrcFile.toString()
      );
      const scrFile = await fs.readFile(srcFilePath, {
        encoding: "utf-8",
      });

      imports += `C${key}S${sectionKey}: {tutorial: dynamic(() => import(\"${sectionTutorialPath}\"), {loading}), test: "${test}", src: ${JSON.stringify(
        scrFile
      )}},`;

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
      await fs.cp(
        sectionTestsPath,
        baseTestsPath,
        { recursive: true },
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }
  }
  await fs.writeFile(
    "./src/tutorials.tsx",
    `import dynamic from "next/dynamic";
const loading = () => {
  const lazyEl = document.getElementById("tutorial")?.outerHTML;
  return (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{
        __html: lazyEl ? lazyEl : "",
      }}
    />
  );
};
export const dynamicComponents = {${imports}};`
  );
})();
