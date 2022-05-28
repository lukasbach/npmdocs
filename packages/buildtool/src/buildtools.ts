#!/usr/bin/env node

import { Application, TSConfigReader, TypeDocReader } from "typedoc";
import {
  ensureDir,
  existsSync,
  lstatSync,
  readdir,
  readJSON,
  writeJson,
  remove,
} from "fs-extra";
import { join } from "path";
import { program } from "commander";
import { compress } from "compress-json";
import { exec } from "child_process";
import { promisify } from "util";
import { purge } from "./purge";
import download from "download-tarball";

const tsconfig: any = {
  compilerOptions: {
    target: "es5",
    lib: ["dom", "es2018"],
    esModuleInterop: true,
    jsx: "react",
    declaration: true,
    module: "CommonJS",
    skipLibCheck: true,
    moduleResolution: "Node",
  },
  exclude: ["**/node_modules/**", "**/*.spec.ts", "**/*.spec.tsx"],
  include: ["**/*.ts", "**/*.tsx"],
};

const tmpPath = "./tmp";
const tsconfigPath = join(tmpPath, "tsconfig.json");

const scanFolderStructure = async (currentFolder = tmpPath) => {
  const currentObj = {};
  const files = await readdir(currentFolder);
  for (const file of files) {
    if (lstatSync(join(currentFolder, file)).isDirectory()) {
      currentObj[file] = await scanFolderStructure(join(currentFolder, file));
    } else {
      currentObj[file] = true;
    }
  }
  return currentObj;
};

const build = async (
  packageName: string,
  version: string,
  target: string,
  runId: string
) => {
  await remove(tmpPath);

  const packageNameWithoutScope = packageName.includes("@")
    ? packageName.split("/", 2)[1]
    : packageName;

  const url = `https://registry.npmjs.org/${packageName}/-/${packageNameWithoutScope}-${version}.tgz`;

  console.log(
    `Building package ${packageName}@${version} to ${target} (without scope: ${packageNameWithoutScope})`
  );
  console.log(`runId is ${runId}`);
  console.log(`Using url ${url}`);

  await download({
    url,
    dir: tmpPath,
  });

  console.log(`Downloaded to ${tmpPath}`);

  await ensureDir(target);

  const folderStructure = await scanFolderStructure();
  const folderStructureCompressed = compress(folderStructure);
  await writeJson(join(target, "folder.json"), folderStructureCompressed);

  const packageFolder = (await readdir(tmpPath))[0];
  const packageJsonPath = join(tmpPath, packageFolder, "package.json");
  const packageJson = await readJSON(packageJsonPath);
  const types = packageJson.types ?? packageJson.typings;

  if (!types) {
    // TODO find @types package if not found here.
    await writeJson(
      join(target, "docs.json"),
      compress({
        error: "No types found in package.json",
        errorCode: "no-types",
      })
    );
    return;
  }

  console.log("Patching package.json...");
  await writeJson(packageJsonPath, { ...packageJson, devDependencies: {} });

  console.log("Installing dependencies...");
  const installProcess = await promisify(exec)(
    "npm install --ignore-scripts --no-package-lock --production --omit=dev",
    {
      cwd: join(tmpPath, packageFolder),
    }
  );
  console.log(installProcess.stdout);

  console.log(`Using types ${join(tmpPath, packageFolder, types)}`);
  console.log(`Using tsconfig from ${tsconfigPath}`);

  if (!existsSync(tsconfigPath)) {
    await writeJson(tsconfigPath, tsconfig);
  }

  const app = new Application();
  app.options.addReader(new TypeDocReader());
  app.options.addReader(new TSConfigReader());
  app.bootstrap({
    entryPoints: [join(tmpPath, packageFolder, types)],
    entryPointStrategy: "resolve",
    tsconfig: tsconfigPath,
    logger: console.log,
    treatWarningsAsErrors: false,
    excludeExternals: true,
    excludePrivate: true,
    excludeInternal: true,
    excludeProtected: true,
    exclude: ["**/node_modules/**"],
  });

  // https://github.com/TypeStrong/typedoc/issues/1403#issuecomment-926422566
  // const project = app.convert()!;
  const project = app.converter.convert(app.getEntryPoints() ?? []);
  await app.generateJson(project, join(tmpPath, "out.json"));
  const docs = await readJSON(join(tmpPath, "out.json"));

  // TODO filter out namespaces with the name "export=", see @types/react 18.0.2

  // console.log("Purging...");
  // const purged = purge(docs);

  console.log("Compressing...");
  const compressed = compress(
    JSON.parse(JSON.stringify(purged).replaceAll("tmp/package", ""))
  );
  await writeJson(join(target, "docs.json"), compressed);

  // await remove(tmpPath);
};

program
  .argument("<package>", "package name")
  .argument("<version>", "package version")
  .argument("<target>", "target folder")
  .argument("[runId]", "github run id")
  .action(
    async (
      packageName: string,
      version: string,
      target: string,
      runId: string
    ) => {
      try {
        await build(packageName, version, target, runId);
      } catch (e) {
        console.error("Error: ", e);
        await writeJson(
          join(target, "docs.json"),
          compress({
            error: "Build failed",
            errorCode: "build-error",
            details: e.message ?? e,
          })
        );
      }

      await writeJson(
        join(target, "info.json"),
        {
          packageName,
          version,
          runId,
          date: Date.now(),
        },
        { spaces: 2 }
      );
    }
  );

program.parse();
