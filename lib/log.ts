import { green, grey, red, yellow } from "chalk";
import { RemoteCacheImplementation } from "./types/remote-cache-implementation";

const DELIMITER_LENGTH = 78;
const DELIMITER = Array.from({ length: DELIMITER_LENGTH }, () => "-").join("");

const log = console.log;

const formatSection = (...content: string[]) =>
  grey([DELIMITER, ...content, DELIMITER].join("\n"));

export const retrieveSuccess = (
  { name }: RemoteCacheImplementation,
  file: string
) => log(formatSection(`Remote cache hit: ${green(name)}`, `File: ${file}`));

export const retrieveFailure = (
  { name }: RemoteCacheImplementation,
  file: string,
  error: any
) =>
  log(
    formatSection(
      `${yellow(`Warning`)}: Failed to retrieve cache from ${red(name)}`,
      `File: ${file}`,
      `Error: ${error?.message}`
    )
  );

export const setupFailure = (error?: any) =>
  log(
    formatSection(
      `${yellow(`Warning`)}: Failed to setup remote cache. Check your nx.json.`,
      `Error: ${error?.message ?? error}`
    )
  );

export const storeSuccess = (
  { name }: RemoteCacheImplementation,
  file: string
) =>
  log(
    formatSection(
      `Stored output to remote cache: ${green(name)}`,
      `File: ${file}`
    )
  );

export const storeFailure = (
  { name }: RemoteCacheImplementation,
  file: string,
  error: any
) =>
  log(
    formatSection(
      `${yellow(`Warning`)}: Failed to store cache to ${red(name)}`,
      `File: ${file}`,
      `Error: ${error?.message}`
    )
  );

export const checkFailure = (
  { name }: RemoteCacheImplementation,
  file: string,
  error: any
) =>
  log(
    formatSection(
      `${yellow(`Warning`)}: Failed to check if cache file exists in ${red(
        name
      )}`,
      `File: ${file}`,
      `Error: ${error?.message}`
    )
  );
