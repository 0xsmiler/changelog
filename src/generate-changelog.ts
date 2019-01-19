import { Content, Root } from 'mdast'
import * as createProcessor from 'unified'
import * as stringify from 'remark-stringify'

import { Release, RepositoryConfig, SerializedRelease } from './release'

export { SerializedRelease }

export function generateChangelog(changelog: Changelog): string {
  return createProcessor()
    .use(stringify)
    .stringify(generateAst(changelog))
}

function generateAst({ repository, releases }: Changelog): Root {
  return {
    type: 'root',
    children: [...generateHeader(), ...generateReleases()]
  }

  function generateHeader(): Content[] {
    return [
      {
        type: 'heading',
        depth: 1,
        children: [
          {
            type: 'text',
            value: 'Changelog'
          }
        ]
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value:
              'All notable changes to this project will be documented in this file.'
          }
        ]
      }
    ]
  }

  function generateReleases(): Content[] {
    return releases
      .map(release => new Release(release, repository))
      .reduce<ReleasesAcc>(generateRelease, { acc: [] }).acc
  }

  function generateRelease(
    { previous, acc }: ReleasesAcc,
    release: Release
  ): ReleasesAcc {
    return {
      previous: release,
      acc: [...release.toMarkdown(previous), ...acc]
    }
  }

  interface ReleasesAcc {
    previous?: Release
    acc: Content[]
  }
}

export interface Changelog {
  releases: SerializedRelease[]
  repository: RepositoryConfig
}
