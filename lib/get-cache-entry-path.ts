import { join } from "path";

export const getCacheEntryPath = (hash: string, cacheDirectory: string) =>
  join(cacheDirectory, hash);
