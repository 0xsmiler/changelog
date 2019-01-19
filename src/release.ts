import { BlockContent, Content, ListItem, Root } from 'mdast'
import * as parse from 'remark-parse'
import * as createProcessor from 'unified'

enum Section {
  BreakingChanges = 'breakingChanges',
  Added = 'added',
  Deprecated = 'deprecated',
  Removed = 'removed',
  Fixed = 'fixed',
  Security = 'security',
  Internal = 'internal'
}

export class Release {
  constructor(
    private release: SerializedRelease,
    private repository: RepositoryConfig
  ) {}

  public get name(): string {
    return this.release.name || this.release.tagName || 'Unreleased'
  }

  public get tagName(): string {
    return this.release.tagName || 'HEAD'
  }

  public toMarkdown(previous?: Release): Content[] {
    return [...this.header(previous), ...this.body()]
  }

  private header(previous?: Release): Content[] {
    return [
      {
        type: 'heading',
        depth: 2,
        children: [
          {
            type: 'link',
            url: this.compareUrl(previous),
            children: [
              {
                type: 'text',
                value: this.name
              }
            ]
          }
        ]
      }
    ]
  }

  private body(): Content[] {
    return [
      ...this.description(),
      ...([] as Content[]).concat(...Release.sections.map(this.section))
    ]
  }

  private description(): Content[] {
    if (!this.release.description) {
      return []
    }

    return [
      {
        type: 'paragraph',
        children: [{ type: 'text', value: this.release.description }]
      }
    ]
  }

  private section = (section: Section): Content[] => {
    const entries: Entry[] = this.release[section] || []

    if (entries.length === 0) {
      return []
    }

    return [
      {
        type: 'heading',
        depth: 3,
        children: [
          {
            type: 'text',
            value: Release.sectionTitle(section)
          }
        ]
      },
      {
        type: 'list',
        children: entries.map<ListItem>(entry => {
          const children = (createProcessor()
            .use(parse)
            .parse(entry) as Root).children as BlockContent[]

          return {
            type: 'listItem',
            children
          }
        })
      }
      // ...entries.map((entry))
    ]
  }

  private compareUrl(previous?: Release): string {
    const from = previous ? previous.tagName : this.repository.firstCommit
    const to = this.tagName

    return `https://github.com/${this.repository.owner}/${
      this.repository.repo
    }/compare/${from}..${to}`
  }

  static sections: Section[] = [
    Section.BreakingChanges,
    Section.Added,
    Section.Deprecated,
    Section.Removed,
    Section.Fixed,
    Section.Security,
    Section.Internal
  ]

  static sectionTitle(section: Section): string {
    switch (section) {
      case Section.BreakingChanges:
        return 'Breaking Changes'
      case Section.Added:
        return 'Added'
      case Section.Deprecated:
        return 'Deprecated'
      case Section.Removed:
        return 'Removed'
      case Section.Fixed:
        return 'Fixed'
      case Section.Security:
        return 'Security'
      case Section.Internal:
        return 'Internal'
    }
  }
}

export type SerializedRelease = {
  name?: string
  tagName?: string
  draft?: boolean
  prerelease?: boolean
  description?: string
} & Partial<Record<Section, Entry[]>>

export interface RepositoryConfig {
  firstCommit: string
  owner: string
  repo: string
}

type Entry = string
