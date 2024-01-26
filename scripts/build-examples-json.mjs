import path from 'path'
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'fs'
import {transformToWebcontainerFiles} from "./build/webcontainer.mjs";
import {json} from "./build/fileSystem.mjs";
import {getFiles} from "./build/tutorial.mjs";

const excluded = ["base", "meta.json"];

let data = {};
const examplePaths = []
const dir = process.cwd();
const projectDir = readdirSync(`${dir}/examples`);

for (const item of projectDir) {
  const name = JSON.parse(
    readFileSync(`${dir}/examples/${item}/meta.json`, {
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
        `${dir}/examples/${item}/base`
    );
    writeFileSync(`${dir}/src/examples-json/${item}-base.json`, JSON.stringify(baseFiles));
  }

  const currentPath = path.join(`${dir}/tutorials/${item}`);
  const sections = readdirSync(currentPath).filter(
    (item) => !excluded.includes(item)
  );

  for (const section of sections) {
    const {name, type, options} = json(`${dir}/examples/${item}/${section}/meta.json`)
    const response = await getFiles(item, section, options)

    const jsonData = {
      type,
      ...response
    }

    writeFileSync(`${dir}/src/examples-json/${item}-${section}.json`, JSON.stringify(jsonData));
    examplePaths.push({
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
writeFileSync(`${dir}/src/examples.json`, JSON.stringify(data));
writeFileSync(`${dir}/src/examplePaths.json`, JSON.stringify({
  "paths": examplePaths,
  "fallback": false
}));
