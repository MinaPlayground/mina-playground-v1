const path = require("path");
const { readdirSync, readFileSync, writeFileSync } = require("fs");

const excluded = ["base", "meta.json"];

let data = {};
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
    data[item].sections[section] = {
      name,
    };
  }
}
writeFileSync(`${dir}/src/tutorials.json`, JSON.stringify(data));
