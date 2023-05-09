# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.0.0

### Breaking Changes

- Nx support now starts at 16.0.0 thanks to [gmfun](https://github.com/gmfun)
- Note: packages consuming this package might need to set `declaration: false` in their TSConfig

## 3.0.0

### Breaking Changes

- Environment variables now start with `NXCACHE_` instead of `NX_CACHE_` to prevent leaking credentials

## 2.0.0

### Breaking Changes

- Implementation & API is now stream based to reduce memory overhead.
- All file system writes are now fully asynchronous.
- Filenames are now suffixed to prevent incorrect cache hits with older versions.

## 1.1.0

### Added

- Added `name` task runner option and `NXCACHE_NAME` env variable to set a custom cache name

## 1.0.0

### Added

- Added `initEnv(options)` function for reading environment variables from `.env`

## 0.0.6

### Fixed

- File copying from `.cache` to `dist` works again

### Fixed

- `fs/promises` import broken in Node 12 and below

## 0.0.5

### Fixed

- `fs/promises` import broken in Node 12 and below

## 0.0.4

### Fixed

- `silent` option now correctly mutes all info and success logs

## 0.0.3

### Added

- `silent` option to mute info and success logs

## 0.0.2

### Added

- Initial implementation of `createCustomRunner`
