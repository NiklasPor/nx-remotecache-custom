import { RemoteCache } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
import AdmZip from "adm-zip";
import { writeFileSync } from "fs";
import { join } from "path";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";

const COMMIT_FILE_EXTENSION = ".commit";
const COMMIT_FILE_CONTENT = "true";

const extractZipBuffer = (buffer: Buffer, destination: string): void => {
  const zip = new AdmZip(buffer);
  zip.extractAllTo(destination, true);
};

const writeCommitFile = (destination: string) => {
  const commitFilePath = destination + COMMIT_FILE_EXTENSION;
  writeFileSync(commitFilePath, COMMIT_FILE_CONTENT);
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

  extractZipBuffer(buffer, destination);
  writeCommitFile(destination);

  return true;
};
