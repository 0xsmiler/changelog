import { Root } from 'mdast'
import * as createProcessor from 'unified'
import * as stringify from 'remark-stringify'

export function generateChangelog(changelog: Changelog): string {
  return createProcessor()
    .use(stringify)
    .stringify(generateAst(changelog))
}

function generateAst(changelog: Changelog): Root {
  return {
    type: 'root',
    children: [
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
              'All notable changes to this project will be document in this file.'
          }
        ]
      }
    ]
  }
}

export type Changelog = Array<Release>

export interface Release {
  tagName: string
  name?: string
  draft?: boolean
  prerelease?: boolean
}
