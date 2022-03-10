# Changelog

All notable changes to this project will be documented in this file.

## [v0.5.0](https://github.com/inyono/changelog/compare/v0.4.0..v0.5.0) - March 10, 2022

### Breaking Changes

- This package is now ESM only. [Learn more about ESM in this guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

## [v0.4.0](https://github.com/inyono/changelog/compare/v0.3.0..v0.4.0) - January 9, 2022

### Breaking Changes

- Drop Node v12 support.

- `generateChangelog` now requires information about the GitHub repository, i.e.:

  ```js
  generateChangelog({
    releases,
    branch,
    origin,
  })
  // becomes
  generateChangelog({
    releases,
    repository: {
      firstCommit: 'b5b9c087d461599e25080b9963a53c15fd72e9e6',
      owner: 'inyono',
      repo: 'changelog',
    },
  })
  ```

## [v0.3.0](https://github.com/inyono/changelog/compare/v0.2.1..v0.3.0) - August 30, 2021

### Breaking Changes

- Change default branch to `main`.

- `generateChangelog` now accepts an configuration object instead of two arguments, i.e.:

  ```js
  generateChangelog(releases, { branch, origin })
  // becomes
  generateChangelog({
    releases,
    branch,
    origin,
  })
  ```

## [v0.2.1](https://github.com/inyono/changelog/compare/v0.2.0..v0.2.1) - December 22, 2020

### Breaking Changes

- Drop Node v10 support.

### Added

- Update dependencies to support Node v14.

## [v0.2.0](https://github.com/inyono/changelog/compare/v0.1.5..v0.2.0) - December 22, 2020 \[YANKED]

## [v0.1.5](https://github.com/inyono/changelog/compare/v0.1.4..v0.1.5) - February 14, 2020

### Fixed

- Update dependencies to support Node v12

## [v0.1.4](https://github.com/inyono/changelog/compare/v0.1.3..v0.1.4) - June 5, 2019

### Fixed

- Handle remote urls without optional .git

## [v0.1.3](https://github.com/inyono/changelog/compare/v0.1.2..v0.1.3) - June 5, 2019

### Added

- Add scoped changelog entries

## [v0.1.2](https://github.com/inyono/changelog/compare/v0.1.1..v0.1.2) - February 8, 2019

### Fixed

- Move `@types/mdast` to dependencies

## [v0.1.1](https://github.com/inyono/changelog/compare/v0.1.0..v0.1.1) - February 2, 2019

### Added

- Add section `Changed`

## [v0.1.0](https://github.com/inyono/changelog/compare/b5b9c087d461599e25080b9963a53c15fd72e9e6..v0.1.0) - January 20, 2019

Initial working release
