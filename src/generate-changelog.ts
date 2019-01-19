import { Content, Root } from 'mdast'
import * as createProcessor from 'unified'
import * as stringify from 'remark-stringify'

export function generateChangelog(changelog: Changelog): string {
  return createProcessor()
    .use(stringify)
    .stringify(generateAst(changelog))
}

function generateAst({ firstCommit, repository, releases }: Changelog): Root {
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
    const { acc } = releases.reduce<ReleasesAcc>(generateRelease, { acc: [] })
    return acc
  }

  function generateRelease(
    { previous, acc }: ReleasesAcc,
    release: Release
  ): ReleasesAcc {
    return {
      previous: release,
      acc: [
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'link',
              url: compareUrl(previous, release),
              children: [
                {
                  type: 'text',
                  value: releaseLabel(release)
                }
              ]
            }
          ]
        },
        ...acc
      ]
    }
  }

  interface ReleasesAcc {
    previous?: Release
    acc: Content[]
  }

  function compareUrl(previous: Release | undefined, current: Release): string {
    const from = (previous && previous.tagName) || firstCommit
    const to = current.tagName || 'HEAD'

    return `https://github.com/${repository}/compare/${from}..${to}`
  }
}

function releaseLabel(release: Release): string {
  return (release as NamedRelease).name || (release as TaggedRelease).tagName
}

export interface Changelog {
  firstCommit: string
  repository: string
  releases: Release[]
}

export type Release = NamedRelease | TaggedRelease

interface NamedRelease extends AbstractRelease {
  name: string
}

interface TaggedRelease extends AbstractRelease {
  tagName: string
}

interface AbstractRelease {
  name?: string
  tagName?: string
  draft?: boolean
  prerelease?: boolean
}
