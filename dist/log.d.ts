import { RemoteCacheImplementation } from "./types/remote-cache-implementation";
export declare const retrieveSuccess: ({ name }: RemoteCacheImplementation, hash: string) => void;
export declare const retrieveFailure: ({ name }: RemoteCacheImplementation, hash: string, error: any) => void;
export declare const setupFailure: (error?: any) => void;
export declare const storeSuccess: ({ name }: RemoteCacheImplementation, hash: string) => void;
export declare const storeFailure: ({ name }: RemoteCacheImplementation, hash: string, error: any) => void;
export declare const checkFailure: ({ name }: RemoteCacheImplementation, hash: string, error: any) => void;
