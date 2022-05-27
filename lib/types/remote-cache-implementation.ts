import { Readable } from "stream";

export interface RemoteCacheImplementation {
  /**
   * Stores the file on the remote cache.
   * @param filename Filename of the file..
   * @param data Buffer of the data that will be stored on the remote cache.
   */
  storeFile: (filename: string, data: Readable) => Promise<unknown>;
  /**
   * Checks whether a file exists on the remote cache.
   * @param filename Filename of the file.
   * @returns `true` if the file exists, `false` if not.
   */
  fileExists: (filename: string) => Promise<boolean>;
  /**
   * Retrieves a file from the remote cache.
   * @param filename Filename of the file.
   * @returns Buffer of the data that was retrieved from the remote cache.
   */
  retrieveFile: (filename: string) => Promise<NodeJS.ReadableStream>;
  /**
   * A name to identify your remote cache.
   * Mainly used for console logging. So please use a pretty string.
   * @example `name: 'My Beautiful Cache'`
   */
  name: string;
}
