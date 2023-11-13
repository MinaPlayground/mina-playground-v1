import path from 'path'
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'fs'
import {getTutorial, getTutorialAndFiles} from "./build/tutorial.mjs";
import {transformToWebcontainerFiles} from "./build/webcontainer.mjs";
import {json} from "./build/fileSystem.mjs";

const excluded = ["base", "meta.json"];

let data = {};
const tutorialPaths = []
const dir = process.cwd();
const projectDir = readdirSync(`${dir}/tutorials`);

const mapTypeToResponse = async (type, c, s, options) => {
  switch (type) {
    case "unit":
    case "playground":
      return await getTutorialAndFiles(c, s, options);
    case "theory":
      const tutorial = await getTutorial(c, s);
      return {tutorial}
  }
}

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

  const baseFolderExists = existsSync(`${dir}/tutorials/${item}/base`)
  if (baseFolderExists) {
    const {files: baseFiles} = transformToWebcontainerFiles(
        `${dir}/tutorials/${item}/base`
    );
    writeFileSync(`${dir}/src/json/${item}-base.json`, JSON.stringify(baseFiles));
  }

  const currentPath = path.join(`${dir}/tutorials/${item}`);
  const sections = readdirSync(currentPath).filter(
    (item) => !excluded.includes(item)
  );

  for (const section of sections) {
    const {name, type, options} = json(`${dir}/tutorials/${item}/${section}/meta.json`)
    const response = await mapTypeToResponse(type, item, section, options)

    const jsonData = {
      type,
      ...response
    }

    writeFileSync(`${dir}/src/json/${item}-${section}.json`, JSON.stringify(jsonData));
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
