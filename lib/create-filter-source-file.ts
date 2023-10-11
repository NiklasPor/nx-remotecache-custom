import { join } from "path";

export function createFilterSourceFile(hash: string) {
  return (path: string) => path !== join(hash, "source");
}
