#!/usr/bin/env node

import { Documentalist, TypescriptPlugin } from "@documentalist/compiler";
import { ensureDir, remove, writeJson, readdir, lstatSync } from "fs-extra";
import { join } from "path";
import { program } from 'commander';
import { compress } from 'compress-json';
import download from 'download-tarball';

const tmpPath = `./tmp`;

const scanFolderStructure = async (currentFolder = tmpPath) => {
  let currentObj = {};
  const files = await readdir(currentFolder);
  for (const file of files) {
    if (lstatSync(join(currentFolder, file)).isDirectory()) {
      currentObj[file] = await scanFolderStructure(join(currentFolder, file));
    } else {
      currentObj[file] = true;
    }
  }
  return currentObj;
}

program
  .argument("<package>", "package name")
  .argument("<version>", "package version")
  .argument("<target>", "target folder")
  .action(async (packageName: string, version: string, target: string) => {
    const packageNameWithoutScope = packageName.includes("@") ? packageName.split("/", 2)[1] : packageName;
    await download({
      url: `https://registry.npmjs.org/${packageName}/-/${packageNameWithoutScope}-${version}.tgz`,
      dir: tmpPath,
    });

    await ensureDir(target);

    const folderStructure = await scanFolderStructure();
    const folderStructureCompressed = compress(folderStructure);
    await writeJson(join(target, "folder.json"), folderStructureCompressed);

    const docs = await new Documentalist()
      .use(/\.tsx?$/, new TypescriptPlugin({ verbose: true, includeDeclarations: true }))
      .documentGlobs("tmp/**/*");


    const compressed = compress(JSON.parse(JSON.stringify(docs)));
    await writeJson(join(target, "docs.json"), compressed);

    await remove(tmpPath);
  });

program.parse();
