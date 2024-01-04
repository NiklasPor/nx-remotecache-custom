import { join, normalize } from "path";

export function createFilterSourceFile(hash: string) {
  return (path: string) => normalize(path) !== join(hash, "source");
}
