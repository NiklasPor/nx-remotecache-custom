export interface SafeRemoteCacheImplementation {
  storeFile: (filename: string, data: Buffer) => Promise<unknown | null>;
  fileExists: (filename: string) => Promise<boolean | null>;
  retrieveFile: (filename: string) => Promise<Buffer | null>;
  name: string;
}
