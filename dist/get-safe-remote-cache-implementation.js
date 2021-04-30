"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeRemoteCacheImplementation = void 0;
const log = __importStar(require("./log"));
const attachLogsToFileOperation = ({ operation, success, failure, verbose, }) => async (filename, ...args) => {
    try {
        const result = await operation(filename, ...args);
        success === null || success === void 0 ? void 0 : success(filename);
        return result;
    }
    catch (error) {
        failure(filename, error);
        if (verbose) {
            console.error(error);
        }
        return null;
    }
};
const getSafeRemoteCacheImplementation = async (implementationPromise, options) => {
    const verbose = !!options.verbose;
    try {
        const implementation = await implementationPromise;
        const { name, fileExists, storeFile, retrieveFile } = implementation;
        return {
            name,
            retrieveFile: attachLogsToFileOperation({
                operation: retrieveFile,
                success: (filename) => log.retrieveSuccess(implementation, filename),
                failure: (filename, error) => log.retrieveFailure(implementation, filename, error),
                verbose,
            }),
            storeFile: attachLogsToFileOperation({
                operation: storeFile,
                success: (filename) => log.storeSuccess(implementation, filename),
                failure: (filename, error) => log.storeFailure(implementation, filename, error),
                verbose,
            }),
            fileExists: attachLogsToFileOperation({
                operation: fileExists,
                failure: (filename, error) => log.checkFailure(implementation, filename, error),
                verbose,
            }),
        };
    }
    catch (error) {
        log.setupFailure(error);
        if (verbose) {
            console.error(error);
        }
        return null;
    }
};
exports.getSafeRemoteCacheImplementation = getSafeRemoteCacheImplementation;
