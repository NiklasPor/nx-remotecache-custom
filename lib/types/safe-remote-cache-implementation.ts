import { Readable } from "stream";
export interface SafeRemoteCacheImplementation {
  storeFile: (filename: string, data: Readable) => Promise<unknown | null>;
  fileExists: (filename: string) => Promise<boolean | null>;
  retrieveFile: (filename: string) => Promise<NodeJS.ReadableStream | null>;
  name: string;
}
