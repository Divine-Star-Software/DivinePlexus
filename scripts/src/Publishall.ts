import { UpdateVersions } from "./UpdateVersions.js";
import { loadJson, writeJson } from "./Functions/Files.js";
import { runCommand } from "./Functions/RunCommand.js";

const updateVersion = (version: string) => {
  const split = version.split(".");
  let last = Number(split.pop()!);
  let middle = Number(split.pop()!);
  let first = Number(split.pop()!);
  if (last < 10) last = last * 10;
  last++;
  if (last == 99) {
    middle++;
    if (middle < 10) middle = middle * 10;
    last = 0;
  }
  if (middle == 99) {
    middle = 0;
    first++;
    if (first < 10) first = first * 10;
  }

  const format = (num: number) =>
    !num ? "0" : `${num < 10 ? `0${num}` : num}`;
  return `${format(first)}.${format(middle)}.${format(last)}`;
};

export async function PublishAll() {
  const mainPackage = await loadJson<
    {
      workspaces: string[];
    } & PackageJsonType
  >("../../package.json");

  for (const workspace of mainPackage.workspaces) {
    const path = `../../${workspace.replace("dist", "")}`;
    const packageData = await loadJson<PackageJsonType>(`${path}/package.json`);
    console.log(
      packageData.name,
      packageData.version,
      "->",
      updateVersion(packageData.version)
    );
    packageData.version = updateVersion(packageData.version);
    await writeJson(`${path}/package.json`, packageData);
  }
  await UpdateVersions();
  for (const workspace of mainPackage.workspaces) {
    const path = `../../${workspace.replace("dist", "")}`;
    console.log("build", workspace);
    await runCommand(`cd ${path}; npm run build`);
  }
  for (const workspace of mainPackage.workspaces) {
    const path = `../../${workspace}`;

    await runCommand(`npm publish ${path}`);
  }
}
