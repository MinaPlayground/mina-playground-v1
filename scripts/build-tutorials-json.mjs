import path from 'path'
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'fs'
import {getTutorialByChapterAndSection} from "./build/tutorial.mjs";
import {transformToWebcontainerFiles} from "./build/webcontainer.mjs";

const excluded = ["base", "meta.json"];

let data = {};
const tutorialPaths = []
const dir = process.cwd();
const projectDir = readdirSync(`${dir}/tutorials`);

for (const item of projectDir) {
  let baseFiles = {}
  const name = JSON.parse(
    readFileSync(`${dir}/tutorials/${item}/meta.json`, {
      encoding: "utf-8",
    })
  ).name;
  data[item] = {
    name,
    sections: {},
  };

  const baseFolderExists = existsSync(`${dir}/tutorials/${item}/base`)
  if (baseFolderExists) {
    baseFiles = transformToWebcontainerFiles(
        `${dir}/tutorials/${item}/base`
    );
  }

  const currentPath = path.join(`${dir}/tutorials/${item}`);
  const sections = readdirSync(currentPath).filter(
    (item) => !excluded.includes(item)
  );

  for (const section of sections) {
    const {name, base} = JSON.parse(
      readFileSync(`${dir}/tutorials/${item}/${section}/meta.json`, {
        encoding: "utf-8",
      })
    )

    const response = await getTutorialByChapterAndSection(item, section);
    writeFileSync(`${dir}/src/json/${item}-${section}.json`, JSON.stringify(response));
    tutorialPaths.push({
      "params": {
        "chapter": item,
        "section": section
      }
    })


    data[item].sections[section] = {
      name,
    };
  }
}
writeFileSync(`${dir}/src/tutorials.json`, JSON.stringify(data));
writeFileSync(`${dir}/src/tutorialPaths.json`, JSON.stringify({
  "paths": tutorialPaths,
  "fallback": false
}));
