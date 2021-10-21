import path from "path";
import { readdir, stat, open, writeFile, rename, rm  } from "fs/promises";

export async function getFiles(directory) {
  const fileNames = await readdir(directory);

  const fileData = fileNames.map(async (name) => {
    const p = path.join(directory, name);

    const data = await stat(p);

    const file = {};
    file.filePath = p;
    file.name = name;
    file.isFile = data.isFile();
    file.children = [];

    if (!file.isFile) {
      const children = await getFiles(p);
      file.children = children;
    }

    return file;
  });

  return (await Promise.all(fileData)).filter((file) => { // TODO: better method of excluding files.
    return !(file.isFile) || path.extname(file.filePath) !== ".json";
  });
}

export async function moveFile(src, dest) {
  await rename(src, path.join(dest, path.basename(src)));
}

export async function deleteFile(src) {
  await rm(src, {recursive: true});
}

export async function renameFile(src, name) {
  await rename(src, path.join(path.dirname(src), path.basename(name)));
}

export const loadAdjustments = async (file) => {
  const inPath = file + ".json";

  const handle = await open(inPath);
  const adjustments = JSON.parse(await handle.readFile());
  handle.close();

  return adjustments;
}

// A map of file paths that we're currently writing to. When a promise finishes it will remove the path from inProgress.
var inProgress = new Set();

// A map of file paths to data that we're going to eventually write to. When a more recent write request comes along the file paths and data in here will be updated with the new request.
// This ensures that we're not opening multiple promises to the same file without waiting for the oldest to resolve first.
var queued = new Map();

const process = async (outPath, adjustmentsJson) => {
  inProgress.add(outPath);

  const writePromise = await writeFile(outPath, adjustmentsJson).finally(() => {
    // Remove this file from the inProgress set.
    inProgress.delete(outPath);

    // If it's in the queue then process it next.
    if (queued.has(outPath))
    {
      setTimeout(() => { process(outPath, queued.get(outPath)).catch(() => {}); queued.delete(outPath)});
    }
  });

  return writePromise;
}

export const saveAdjustments = async (files, adjustments) => {
  const adjustmentsJson = JSON.stringify(adjustments);
  
  var promises = [];

  for (var i = 0; i < files.length; i++) {
    const outPath = files[i] + ".json";

    if (!inProgress.has(outPath)) {
      process(outPath, adjustmentsJson).catch(() => {
        // Ignore errors as they're filesystem related, so we can't do anything about them.
      });
    } else {
      queued.set(outPath, adjustmentsJson);
    }
  }
}