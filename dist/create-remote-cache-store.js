"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRemoteCacheStore = void 0;
const adm_zip_1 = __importDefault(require("adm-zip"));
const get_cache_entry_path_1 = require("./get-cache-entry-path");
const zipFolder = (path) => {
    const zip = new adm_zip_1.default();
    zip.addLocalFolder(path);
    return zip.toBuffer();
};
const createRemoteCacheStore = (safeImplementation) => async (hash, cacheDirectory) => {
    const implementation = await safeImplementation;
    if (!implementation) {
        return false;
    }
    const { storeFile } = implementation;
    const source = get_cache_entry_path_1.getCacheEntryPath(hash, cacheDirectory);
    const buffer = zipFolder(source);
    await storeFile(hash, buffer);
    return true;
};
exports.createRemoteCacheStore = createRemoteCacheStore;
