"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheEntryPath = void 0;
const path_1 = require("path");
const getCacheEntryPath = (hash, cacheDirectory) => path_1.join(cacheDirectory, hash);
exports.getCacheEntryPath = getCacheEntryPath;
