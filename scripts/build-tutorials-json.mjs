import path from 'path'
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import {getTutorialByChapterAndSection} from "./build/tutorial.mjs";
import {writeFile} from "fs/promises";
import {transformToWebcontainerFiles} from "./build/webcontainer.mjs";

const excluded = ["base", "meta.json"];

let data = {};
const tutorialPaths = []
const dir = process.cwd();
const projectDir = readdirSync(`${dir}/tutorials`);
for (const item of projectDir) {
  const name = JSON.parse(
    readFileSync(`${dir}/tutorials/${item}/meta.json`, {
      encoding: "utf-8",
    })
  ).name;
  data[item] = {
    name,
    sections: {},
  };
  const webContainerFiles = await transformToWebcontainerFiles(
    `${dir}/tutorials/${item}/base`
  );
  await writeFile(`${dir}/src/json/${item}-base.json`, JSON.stringify(webContainerFiles));

  const currentPath = path.join(`${dir}/tutorials/${item}`);
  const sections = readdirSync(currentPath).filter(
    (item) => !excluded.includes(item)
  );

  for (const section of sections) {
    const name = JSON.parse(
      readFileSync(`${dir}/tutorials/${item}/${section}/meta.json`, {
        encoding: "utf-8",
      })
    ).name;

    const response = await getTutorialByChapterAndSection(item, section);
    await writeFile(`${dir}/src/json/${item}-${section}.json`, JSON.stringify(response));
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
