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
  stat,
  readFile,
} from "fs-extra";
import { join } from "path";
import { compress } from "compress-json";
import { exec } from "child_process";
import { promisify } from "util";
import { dedup } from "@lukasbach/npmdocs-typedoc-utils";
import download from "download-tarball";
import { uploadFile } from "./data-helpers";

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

const tmpRootPath = join(process.cwd(), "tmp");
const maxSize = 1024 * 1024 * 3.5;

class Output {
  public files: Record<string, string> = {};
  writeFile(fileName: string, data: string) {
    this.files[fileName] = data;
    // TODO make sure that the file name is then prefixed with the root path
  }
  writeJson(fileName: string, data: any) {
    this.files[fileName] = JSON.stringify(data);
  }
  log(message: string) {
    console.log(message);
  }
  async syncToS3(packageName: string, version: string) {
    const promises: Promise<void>[] = [];
    await Promise.all(
      Object.entries(this.files).map(([fileName, data]) =>
        uploadFile(join(packageName, version, fileName), data)
      )
    );
  }
}

const scanFolderStructure = async (currentFolder: string) => {
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

const getTypePrefix = (
  typesVersions?: Record<
    string,
    Record<string, string[] | undefined> | undefined
  >
) => {
  return typesVersions &&
    Object.keys(Object.values(typesVersions)[0] ?? {})[0] === "*"
    ? Object.values(Object.values(typesVersions)?.[0] ?? {})?.[0]?.[0]?.slice(
        0,
        -1
      ) ?? ""
    : "";
};

const build = async (out: Output, packageName: string, version: string) => {
  const tmpPath = `${tmpRootPath}/${packageName}-${version}`;
  const tsconfigPath = join(tmpPath, "tsconfig.json");
  await ensureDir(tmpPath);
  await remove(tmpPath);
  await ensureDir(tmpPath);

  const packageNameWithoutScope = packageName.includes("@")
    ? packageName.split("/", 2)[1]
    : packageName;

  const url = `https://registry.npmjs.org/${packageName}/-/${packageNameWithoutScope}-${version}.tgz`;

  out.log(
    `Building package ${packageName}@${version} (without scope: ${packageNameWithoutScope})`
  );
  out.log(`Using url ${url}`);

  await download({
    url,
    dir: tmpPath,
  });

  out.log(`Downloaded to ${tmpPath}`);

  const folderStructure = await scanFolderStructure(tmpPath);
  const folderStructureCompressed = compress(folderStructure);
  out.writeJson("folder.json", folderStructureCompressed);

  const packageFolder = (await readdir(tmpPath))[0];
  const packageJsonPath = join(tmpPath, packageFolder, "package.json");
  const packageJson = await readJSON(packageJsonPath);
  const typesWithoutPrefix = packageJson.types ?? packageJson.typings;

  if (!typesWithoutPrefix) {
    out.writeJson(
      "docs.json",
      compress({
        error: "No types found in package.json",
        errorCode: "no-types",
      })
    );
    // TODO finally
    return;
  }

  const typesPrefix = getTypePrefix(packageJson.typesVersions);
  const types = typesPrefix + typesWithoutPrefix;

  out.log(`Using types ${types} (with prefix ${typesPrefix})`);

  out.log("Patching package.json...");
  await writeJson(packageJsonPath, {
    ...packageJson,
    devDependencies: {},
    peerDependencies: {},
  });

  out.log("Installing dependencies...");
  const installProcess = await promisify(exec)(
    "npm install --ignore-scripts --no-package-lock --production --omit=dev --legacy-peer-deps",
    {
      cwd: join(tmpPath, packageFolder),
    }
  );
  out.log(installProcess.stdout);

  out.log(`Using full type path ${join(tmpPath, packageFolder, types)}`);
  out.log(`Using tsconfig from ${tsconfigPath}`);

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

  out.log("Purging...");
  const purged = dedup(docs);

  out.log("Compressing...");
  const compressed = compress(
    JSON.parse(JSON.stringify(purged).replaceAll("tmp/package", ""))
  );
  out.writeJson("docs.json", compressed);

  out.log("Copying readme...");
  const maybeFile = (file: string) =>
    existsSync(join(tmpPath, packageFolder, file))
      ? join(tmpPath, packageFolder, file)
      : undefined;
  const readmeFile =
    maybeFile("README.md") ??
    maybeFile("README.txt") ??
    maybeFile("readme.md") ??
    maybeFile("readme.txt");
  const readmeFileContents = readmeFile ? await readFile(readmeFile) : null;
  if (readmeFileContents) {
    out.writeFile("readme.md", readmeFileContents.toString());
  } else {
    out.log("Skipping, readme not found...");
  }

  const localDocsFile = join(tmpPath, "docs.json");
  await writeJson(localDocsFile, compressed);
  const { size } = await stat(localDocsFile);
  out.log(`Docs file is ${Math.floor(size / 1024)}kb in size`);

  if (size > maxSize) {
    out.log("File too large, aborting...");
    out.writeJson(
      "docs.json",
      compress({
        error: `Docs file is larger than maximum file size (${Math.floor(
          size / 1024
        )}kb).`,
        errorCode: "docs-too-big",
        size,
      })
    );
  }

  // await remove(tmpPath);
};

export const buildPackage = async (packageName: string, packageVersion) => {
  const out = new Output();
  try {
    await build(out, packageName, packageVersion);
  } catch (e) {
    console.error("Error: ", e);
    out.writeJson(
      "docs.json",
      compress({
        error: "Build failed",
        errorCode: "build-error",
        details: e.message ?? e,
      })
    );
  } finally {
    await out.syncToS3(packageName, packageVersion);
    out.log("Done");
  }
};
