const path = require("path");
const { readdirSync, readFileSync, writeFileSync } = require("fs");

const excluded = ["base", "meta.json"];

let data = {};
const projectDir = readdirSync("./src/tutorials");
for (const item of projectDir) {
  const name = JSON.parse(
    readFileSync(`./src/tutorials/${item}/meta.json`, {
      encoding: "utf-8",
    })
  ).name;
  data[item] = {
    name,
    sections: {},
  };
  const currentPath = path.join("./src/tutorials", item);
  const sections = readdirSync(currentPath).filter(
    (item) => !excluded.includes(item)
  );

  for (const section of sections) {
    const name = JSON.parse(
      readFileSync(`./src/tutorials/${item}/${section}/meta.json`, {
        encoding: "utf-8",
      })
    ).name;
    data[item].sections[section] = {
      name,
    };
  }
}
writeFileSync("./src/tutorials.json", JSON.stringify(data));
