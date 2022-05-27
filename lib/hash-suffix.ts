/**
 * Hash suffix will be modified whenever the archiving method is beeing updated.
 * This will prevent incorrect cache-hits with older versions.
 *
 * Examples:
 * - .zip
 * - .tar.gz
 * - -v2.tar.gz
 */
export const HASH_SUFFIX = ".tar.gz";
