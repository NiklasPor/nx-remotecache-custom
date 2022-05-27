import { HASH_SUFFIX } from "./hash-suffix";

export function getFileNameFromHash(hash: string): string {
  return hash + HASH_SUFFIX;
}
