import { mkdir, writeFile, rm } from "fs/promises";
import type { RemoteCache } from "nx/src/tasks-runner/default-tasks-runner";
import { join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { extract } from "tar";
import { createFilterSourceFile } from "./create-filter-source-file";
import { getFileNameFromHash } from "./get-file-name-from-hash";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";
import * as log from "./log";

const COMMIT_FILE_EXTENSION = ".commit";
const COMMIT_FILE_CONTENT = "true";

const extractFolder = async (
  stream: NodeJS.ReadableStream,
  destination: string,
  hash: string
) => {
  await mkdir(destination, { recursive: true });
  return await pipeline(
    Readable.from(stream),
    extract({
      C: destination,
      strip: 1,
      filter: createFilterSourceFile(hash),
    })
  );
};

const writeCommitFile = (destination: string) => {
  const commitFilePath = destination + COMMIT_FILE_EXTENSION;
  return writeFile(commitFilePath, COMMIT_FILE_CONTENT);
};

const deleteCommitFile = (destination: string) => {
  const commitFilePath = destination + COMMIT_FILE_EXTENSION;
  return rm(commitFilePath, { force: true, maxRetries: 10 });
};

export const createRemoteCacheRetrieve =
  (
    safeImplementation: Promise<SafeRemoteCacheImplementation | null>
  ): RemoteCache["retrieve"] =>
  async (hash, cacheDirectory) => {
    const implementation = await safeImplementation;

    if (!implementation) {
      return false;
    }

    const file = getFileNameFromHash(hash);
    const destination = join(cacheDirectory, hash);

    try {
      const {fileExists, retrieveFile} = implementation;
      const isFileCached = await fileExists(file);

      if (!isFileCached) {
        return false;
      }

      const stream = await retrieveFile(file);

      if (!stream) {
        return false;
      }

      await extractFolder(stream, destination, hash);
      await writeCommitFile(destination);

      return true;
    } catch (error) {

      log.retrieveFailure(implementation, file, error);

      await rm(destination, { force: true, recursive: true, maxRetries: 10 });
      await deleteCommitFile(destination);


      return false;
    }
  };
