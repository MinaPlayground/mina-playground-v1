export const constructInstallCommand = (
  installDirectories: [] | { directory: string; build: boolean }[]
) =>
  installDirectories
    .map(({ directory, build }, index) => {
      const buildCommand = build ? "&& npm run build" : "";
      return `${
        index !== 0 ? "&&" : ""
      } cd ~/mina/${directory} && npm i ${buildCommand}`;
    })
    .join(" ");
