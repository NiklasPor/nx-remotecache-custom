import { RemoteCache } from "@nrwl/workspace/src/tasks-runner/default-tasks-runner";
import AdmZip from "adm-zip";
import { getCacheEntryPath } from "./get-cache-entry-path";
import { SafeRemoteCacheImplementation } from "./types/safe-remote-cache-implementation";

const zipFolder = (path: string): Buffer => {
  const zip = new AdmZip();
  zip.addLocalFolder(path);

  return zip.toBuffer();
};

export const createRemoteCacheStore = (
  safeImplementation: Promise<SafeRemoteCacheImplementation | null>
): RemoteCache["store"] => async (hash, cacheDirectory) => {
  const implementation = await safeImplementation;

  if (!implementation) {
    return false;
  }

  const { storeFile } = implementation;
  const source = getCacheEntryPath(hash, cacheDirectory);
  const buffer = zipFolder(source);

  await storeFile(hash, buffer);

  return true;
};
