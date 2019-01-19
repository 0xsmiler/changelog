import {
  Changelog,
  generateChangelog,
  Release
} from '../src/generate-changelog'

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

  test('unreleased changes', () => {
    const changelog = createChangelog([
      {
        name: 'Unreleased'
      }
    ])
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.',
      '',
      `## [Unreleased](https://github.com/foo/bar/compare/${firstCommit}..HEAD)`
    ])
    expect(generateChangelog(changelog)).toEqual(expected)
  })

  test('released changes', () => {
    const changelog = createChangelog([
      {
        tagName: '1.0.0'
      },
      {
        name: 'Unreleased'
      }
    ])
    const expected = join([
      '# Changelog',
      '',
      'All notable changes to this project will be documented in this file.',
      '',
      `## [Unreleased](https://github.com/foo/bar/compare/1.0.0..HEAD)`,
      '',
      `## [1.0.0](https://github.com/foo/bar/compare/${firstCommit}..1.0.0)`
    ])
    expect(generateChangelog(changelog)).toEqual(expected)
  })
})

function createChangelog(releases: Release[]): Changelog {
  return {
    repository: 'foo/bar',
    firstCommit: 'bc6106e006b1633f5e6c15f6af2eef0443d8e81f',
    releases
  }
}

function join(lines: string[]): string {
  return lines.join('\n') + '\n'
}
