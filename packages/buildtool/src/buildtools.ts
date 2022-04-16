#!/usr/bin/env node

import { Documentalist, TypescriptPlugin } from "@documentalist/compiler";
import { ensureDir, remove, writeJson } from "fs-extra";
import { dirname } from "path";
import { program } from 'commander';
import { compress } from 'compress-json';
import download from 'download-tarball';

program
  .argument("<package>", "package name")
  .argument("<version>", "package version")
  .argument("<target>", "target folder")
  .action(async (packageName: string, version: string, target: string) => {
    const tmpPath = `./tmp`;
    const packageNameWithoutScope = packageName.includes("@") ? packageName.split("/", 2)[1] : packageName;
    await download({
      url: `https://registry.npmjs.org/${packageName}/-/${packageNameWithoutScope}-${version}.tgz`,
      dir: tmpPath,
    });

    await ensureDir(dirname(target));

    const docs = await new Documentalist()
      .use(/\.tsx?$/, new TypescriptPlugin({ verbose: true }))
      .documentGlobs("tmp/**/*");

    const compressed = compress(JSON.parse(JSON.stringify(docs)));
    await writeJson(target, compressed);
    await remove(tmpPath);
  });

program.parse();
