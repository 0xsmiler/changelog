import { Changelog, generateChangelog } from '../src/generate-changelog'

const firstCommit = 'bc6106e006b1633f5e6c15f6af2eef0443d8e81f'

describe('generate changelog', () => {
  test('empty changelog', () => {
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.'
    ])
    expect(generateChangelog(createChangelog([]))).toEqual(expected)
  })

  test('unreleased changes w/ sections', () => {
    const changelog = createChangelog([
      {
        description: 'You can read more about this release at our blog.',
        breakingChanges: [
          'Drop support for Internet Explorer 9',
          'And also Internet Explorer 8'
        ],
        added: ['Added some fancy new feature'],
        deprecated: ['Deprecated `foo`. Use `fooAsync` instead'],
        removed: ['Removed entry for Internet Explorer'],
        security: ['Updated dependencies with security issues'],
        internal: ['Generate changelog with @splish-me/changelog']
      }
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
      '- And also Internet Explorer 8',
      '',
      '### Added',
      '',
      '- Added some fancy new feature',
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
      '- Generate changelog with @splish-me/changelog'
    ])
    expect(generateChangelog(changelog)).toEqual(expected)
  })

  test('released changes', () => {
    const changelog = createChangelog([
      {
        name: 'Initial release',
        tagName: '0.0.0'
      },
      {
        tagName: '1.0.0'
      },
      {}
    ])
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.',
      '',
      `## [Unreleased](https://github.com/foo/bar/compare/1.0.0..HEAD)`,
      '',
      `## [1.0.0](https://github.com/foo/bar/compare/0.0.0..1.0.0)`,
      '',
      `## [Initial release](https://github.com/foo/bar/compare/${firstCommit}..0.0.0)`
    ])
    expect(generateChangelog(changelog)).toEqual(expected)
  })
})

function createChangelog(releases: Changelog['releases']): Changelog {
  return {
    repository: {
      firstCommit: 'bc6106e006b1633f5e6c15f6af2eef0443d8e81f',
      owner: 'foo',
      repo: 'bar'
    },
    releases
  }
}

function join(lines: string[]): string {
  return lines.join('\n') + '\n'
}
