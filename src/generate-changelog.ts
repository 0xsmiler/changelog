import { Content, Root } from 'mdast'
import prettier from 'prettier'
import stringify from 'remark-stringify'
import createProcessor from 'unified'

import { Release, RepositoryConfig, SerializedRelease } from './release'

export { SerializedRelease }

export function generateChangelog<Scope>(changelog: Changelog<Scope>): string {
  const content = createProcessor()
    .use(stringify)
    .stringify(generateAst(changelog))

  return prettier.format(content, { parser: 'markdown' })
}

function generateAst<Scope>({ repository, releases }: Changelog<Scope>): Root {
  return {
    type: 'root',
    children: [...generateHeader(), ...generateReleases()],
  }

  function generateHeader(): Content[] {
    return [
      {
        type: 'heading',
        depth: 1,
        children: [
          {
            type: 'text',
            value: 'Changelog',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value:
              'All notable changes to this project will be documented in this file.',
          },
        ],
      },
    ]
  }

  function generateReleases(): Content[] {
    return releases
      .map((release) => new Release(release, repository))
      .reduce<ReleasesAcc>(generateRelease, { acc: [] }).acc
  }

  function generateRelease(
    { previous, acc }: ReleasesAcc,
    release: Release<Scope>
  ): ReleasesAcc {
    return {
      previous: release,
      acc: [...release.toMarkdown(previous), ...acc],
    }
  }

  interface ReleasesAcc {
    previous?: Release<Scope>
    acc: Content[]
  }
}

export interface Changelog<Scope> {
  releases: SerializedRelease<Scope>[]
  repository: RepositoryConfig
}
