![Static Badge](https://img.shields.io/badge/Status-Deprecated-red)
[![https://www.npmjs.com/package/nx-remotecache-custom](https://img.shields.io/npm/v/nx-remotecache-custom)](https://www.npmjs.com/package/nx-remotecache-custom)
<a href="https://www.npmjs.com/package/nx-remotecache-custom" target="_blank"><img src="https://img.shields.io/npm/dw/nx-remotecache-custom?label=Installs&color=purple&logoColor=white&logo=nx" alt="Downloads" /></a>
[![Sponsored by LastBIM](https://img.shields.io/badge/Sponsored_by-LastBIM-6887DA)](https://lastbim.com)

# The future of `nx-remotecache-*`

Nrwl Nx just introduced us to **Powerpack**. It's the clear successor of the remote cache setup and officially supports custom caching solutions. This will mark the end of the `nx-remotecache-*` packages as custom caching solutions based on the filesystem won't work anymore starting with Nx 21.

Powerpack fills exactly the void that `nx-remotecache-custom` filled. Therefore I'm happy to give this topic back to the creators behind Nx. Thanks for the great ride – we reached over 114,000 weekly downloads on npm as I'm writing this 🥳

Feel free to read the [Introduction to Powerpack](https://nx.dev/blog/evolving-nx#introducing-nx-powerpack) by Jeff yourself. If you have any further questions checkout the pinned GitHub [issue](https://github.com/NiklasPor/nx-remotecache-custom/issues/48).

Cheers, Niklas 👋

## Critical Vulnerability: CVE-2025-36852
Due to the way remote caching with shared buckets works, cache poisoning is possible via anything that runs pipelines on untrusted code (e.g. a pull request). You can read-up on the vulnerability in [this document](https://nx.app/files/cve-2025-06) from NX or [here](https://nvd.nist.gov/vuln/detail/CVE-2025-36852) on nist. There's **no planned fix** for this vulnerability. I still recommend to use the official solution powerpack by Nx instead.

## nx-remotecache-custom

`nx-remotecache-custom` is a simple package which includes a helper function to create custom nx remote cache implementations. You'll only need to add functions for:

1. storing a file / buffer
2. retrieving a file / buffer
3. checking if a file / buffer exists

and `createCustomRunner()` is taking care of everything else. Not convinced yet? The package will also:

- Print beautiful & colored nx-style messages to the console 💅🎆
- Allow you to execute asynchronous code in the setup phase of your runner 🤖
- Handle all thrown errors ➡ No broken builds to offline remote caches 🚀
- Automagically zip all the cached files ➡ Minimal storage & traffic consumption 📦
- Provide a small defined and documented API 📚

## Compatability

|  Nx               | Remote Cache     |
| ----------------- | ---------------- |
|  `>= 21`          | `Deprecated`     |
|  `>= 20.0.0 < 21` | `>= 20.0.0`      |
|  `>= 19.0.0 < 20` | `>= 19.0.0 < 20` |
|  `>= 18.0.0 < 19` | `>= 18.0.0 < 19` |
|  `>= 17.0.0 < 18` | `>= 17.0.0 < 18` |
|  `>= 16.9.0 < 17` | `>= 5.0.0 < 17`  |
|  `< 16.9.0`       | `< 5.0.0`        |

### Usage

```sh
npm i nx-remotecache-custom
```

```ts
// define custom parameters for your nx.json here
interface MyRunnerOptions {
  remoteUrl: string;
}

export default createCustomRunner<MyRunnerOptions>(async (options) => {
  // initialize environment variables from dotfile
  initEnv(options);

  // initialize the connection to your remote storage here
  const myStorage = new MyStorage(options.remoteUrl);

  return {
    // name is used for logging purposes
    name: "My Storage",

    // fileExists checks whether a file exists on your remote storage
    fileExists: (filename) => myStorage.exists(filename),

    // retrieveFile downloads a file from your remote storage
    retrieveFile: (filename) => myStorage.download(filename),

    // storeFile uploads a file from a buffer to your remote storage
    storeFile: (filename, buffer) => myStorage.upload(filename, buffer),
  };
});
```

```json
{
  "name": "nx-remotecache-mystorage",
  "main": "index.js"
}
```

After this your package is already ready for usage. Publish it to npm (or an internal registry) and consume it in your client library. Install it and adjust your `nx.json` to use the newly created runner:

```json
"tasksRunnerOptions": {
  "default": {
    "runner": "nx-remotecache-mystorage",
    "options": {
      "remoteUrl": "http://127.0.0.1:1337",
      "cacheableOperations": ["build", "test", "lint", "e2e"]
    }
  }
}
```

> For a more in-depth code example you can take a look at the implementation of [nx-remotecache-azure](https://github.com/NiklasPor/nx-remotecache-azure) which uses this package to implement a nx cache on the Azure Blob Storage.

### Advanced Configuration

| Option       | Environment Variable / .env | Description                                                                                           |
| ------------ | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `name`       | `NXCACHE_NAME`              | Set to provide task runner name for logging. Overrides name provided in implementation.               |
| `verbose`    |                             | Set to receive full stack traces whenever errors occur. Best used for debugging. **Default:** `false` |
| `silent`     |                             | Set to mute success and info logs. **Default:** `false`                                               |
| `read`       | `NXCACHE_READ`              | Set to enable / disable reading from the remote cache. **Default:** `true`                            |
| `write`      | `NXCACHE_WRITE`             | Set to enable / disable writing to the remote cache. **Default:** `true`                              |
| `dotenv`     |                             | Set to `false` to disable reading `.env` into `process.env`. **Default:** `true`                      |
| `dotenvPath` |                             | Set to read `.env` files from a different folder.                                                     |

```json
"tasksRunnerOptions": {
  "default": {
    "options": {
      "name": "My Storage",
      "verbose": true,
      "silent": true
    }
  }
}
```

### All Custom Runners

| Runner                                                                                       | Storage             |
| -------------------------------------------------------------------------------------------- | ------------------- |
| [nx-remotecache-azure](https://www.npmjs.com/package/nx-remotecache-azure)                   |  Azure Blob Storage |
| [@pellegrims/nx-remotecache-s3](https://www.npmjs.com/package/@pellegrims/nx-remotecache-s3) |  S3 Storage         |
| [nx-remotecache-minio](https://www.npmjs.com/package/nx-remotecache-minio)                   |  MinIO Storage      |
| [@vercel/remote-nx](https://www.npmjs.com/package/@vercel/remote-nx)                         | Vercel Cache        |
| [nx-remotecache-redis](https://www.npmjs.com/package/nx-remotecache-redis)                   | Redis Cache         |

... and [many more!](https://www.npmjs.com/browse/depended/nx-remotecache-custom)
