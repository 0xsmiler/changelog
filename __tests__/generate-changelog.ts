import { Changelog } from '../src/generate-changelog'
import { generateChangelog as generate } from '../src'

const firstCommit = 'bc6106e006b1633f5e6c15f6af2eef0443d8e81f'

describe('generate changelog', () => {
  test('empty changelog', () => {
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.',
    ])
    expect(generateChangelog([])).toEqual(expected)
  })

  test('unreleased changes w/ sections', () => {
    const changelog = generateChangelog([
      {
        description: 'You can read more about this release at our blog.',
        breakingChanges: [
          'Drop support for Internet Explorer 9',
          'And also Internet Explorer 8',
        ],
        added: ['Added some fancy new feature'],
        changed: ['Changed stuff'],
        deprecated: ['Deprecated `foo`. Use `fooAsync` instead'],
        removed: ['Removed entry for Internet Explorer'],
        security: ['Updated dependencies with security issues'],
        internal: ['Generate changelog with @splish-me/changelog'],
      },
    ])
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.',
      '',
      `## [Unreleased](https://github.com/foo/bar/compare/${firstCommit}..HEAD)`,
      '',
      'You can read more about this release at our blog.',
      '',
      '### Breaking Changes',
      '',
      '- Drop support for Internet Explorer 9',
      '',
      '- And also Internet Explorer 8',
      '',
      '### Added',
      '',
      '- Added some fancy new feature',
      '',
      '### Changed',
      '',
      '- Changed stuff',
      '',
      '### Deprecated',
      '',
      '- Deprecated `foo`. Use `fooAsync` instead',
      '',
      '### Removed',
      '',
      '- Removed entry for Internet Explorer',
      '',
      '### Security',
      '',
      '- Updated dependencies with security issues',
      '',
      '### Internal',
      '',
      '- Generate changelog with @splish-me/changelog',
    ])
    expect(changelog).toEqual(expected)
  })

  test('scoped unreleased changes w/ sections', () => {
    const changelog = generateChangelog<'main' | 'foo'>([
      {
        breakingChanges: [
          ['main', 'Drop support for Internet Explorer 9'],
          ['foo', 'Something else'],
          ['main', 'Another main'],
        ],
      },
    ])
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.',
      '',
      `## [Unreleased](https://github.com/foo/bar/compare/${firstCommit}..HEAD)`,
      '',
      '### Breaking Changes',
      '',
      '- **main**. Drop support for Internet Explorer 9',
      '',
      '- **foo**. Something else',
      '',
      '- **main**. Another main',
    ])
    expect(changelog).toEqual(expected)
  })

  test('released changes', () => {
    const changelog = generateChangelog([
      {
        name: 'Initial release',
        tagName: '0.0.0',
        date: '2019-01-01',
        yanked: true,
      },
      {
        tagName: '1.0.0',
        date: '2019-01-12',
      },
      {},
    ])
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.',
      '',
      `## [Unreleased](https://github.com/foo/bar/compare/1.0.0..HEAD)`,
      '',
      `## [1.0.0](https://github.com/foo/bar/compare/0.0.0..1.0.0) - January 12, 2019`,
      '',
      `## [Initial release](https://github.com/foo/bar/compare/${firstCommit}..0.0.0) - January 1, 2019 \\[YANKED]`,
    ])
    expect(changelog).toEqual(expected)
  })
})

function generateChangelog<Scope = undefined>(
  releases: Changelog<Scope>['releases']
) {
  return generate({
    repository: {
      firstCommit: 'bc6106e006b1633f5e6c15f6af2eef0443d8e81f',
      owner: 'foo',
      repo: 'bar',
    },
    releases,
  })
}

function join(lines: string[]): string {
  return lines.join('\n') + '\n'
}
