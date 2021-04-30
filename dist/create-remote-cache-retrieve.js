"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRemoteCacheRetrieve = void 0;
const adm_zip_1 = __importDefault(require("adm-zip"));
const promises_1 = require("fs/promises");
const path_1 = require("path");
const util_1 = require("util");
const COMMIT_FILE_EXTENSION = ".commit";
const COMMIT_FILE_CONTENT = "true";
const extractZipBuffer = async (buffer, destination) => {
    const zip = new adm_zip_1.default(buffer);
    const extractZipAsync = util_1.promisify(zip.extractAllToAsync.bind(zip));
    return await extractZipAsync(destination, true);
};
const writeCommitFile = async (destination) => {
    const commitFilePath = destination + COMMIT_FILE_EXTENSION;
    await promises_1.writeFile(commitFilePath, COMMIT_FILE_CONTENT);
};
const createRemoteCacheRetrieve = (safeImplementation) => async (hash, cacheDirectory) => {
    const implementation = await safeImplementation;
    if (!implementation) {
        return false;
    }
    const { fileExists, retrieveFile } = implementation;
    const isFileCached = await fileExists(hash);
    if (!isFileCached) {
        return false;
    }
    const buffer = await retrieveFile(hash);
    const destination = path_1.join(cacheDirectory, hash);
    if (!buffer) {
        return false;
    }
    await extractZipBuffer(buffer, destination);
    await writeCommitFile(destination);
    return true;
};
exports.createRemoteCacheRetrieve = createRemoteCacheRetrieve;
