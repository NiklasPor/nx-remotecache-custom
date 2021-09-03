import { RemoteCache } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
import AdmZip from "adm-zip";
import { promises } from "fs";
const { writeFile } = promises;

import { join } from "path";
import { promisify } from "util";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";

const COMMIT_FILE_EXTENSION = ".commit";
const COMMIT_FILE_CONTENT = "true";

const extractZipBuffer = async (
  buffer: Buffer,
  destination: string
): Promise<void> => {
  const zip = new AdmZip(buffer);
  const extractZipAsync = promisify(zip.extractAllToAsync.bind(zip));

  return await extractZipAsync(destination, true);
};

const writeCommitFile = async (destination: string) => {
  const commitFilePath = destination + COMMIT_FILE_EXTENSION;
  await writeFile(commitFilePath, COMMIT_FILE_CONTENT);
};

export const createRemoteCacheRetrieve = (
  safeImplementation: Promise<SafeRemoteCacheImplementation | null>
): RemoteCache["retrieve"] => async (hash, cacheDirectory) => {
  const implementation = await safeImplementation;

  if (!implementation) {
    return false;
  }

  const { fileExists, retrieveFile } = implementation;
  const isFileCached = await fileExists(hash);

  if (!isFileCached) {
    return false;
  }

  const buffer = await retrieveFile(hash);
  const destination = join(cacheDirectory, hash);

  if (!buffer) {
    return false;
  }

  await extractZipBuffer(buffer, destination);
  await writeCommitFile(destination);

  return true;
};
