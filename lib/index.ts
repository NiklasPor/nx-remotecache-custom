import { BlobServiceClient } from "@azure/storage-blob";
import { createCustomRunner } from "./create-custom-runner";

interface AzureBlobRunnerOptions {
  connectionString: string;
}

export default createCustomRunner<AzureBlobRunnerOptions>(async (options) => {
  const serviceClient = BlobServiceClient.fromConnectionString(
    options.connectionString
  );

  const containerClient = serviceClient.getContainerClient("nx");
  await containerClient.createIfNotExists();

  const getBlobClient = (filename: string) =>
    containerClient.getBlockBlobClient(filename);

  return {
    name: "Azure Blob Storage",
    fileExists: (filename) => getBlobClient(filename).exists(),
    retrieveFile: (filename) => getBlobClient(filename).downloadToBuffer(),
    storeFile: (filename, buffer) => getBlobClient(filename).uploadData(buffer),
  };
});
