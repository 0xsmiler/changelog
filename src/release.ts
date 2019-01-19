import { BlockContent, Content, ListItem, PhrasingContent, Root } from 'mdast'
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

  public get date(): string {
    if (!this.release.date) {
      return ''
    }

    return new Date(this.release.date).toLocaleDateString('en', {
      year: 'numeric',
      day: 'numeric',
      month: 'long'
    })
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
          },
          ...date(this.date),
          ...yanked(this.release.yanked)
        ]
      }
    ]

    function date(date?: string): PhrasingContent[] {
      if (!date) {
        return []
      }

      return [
        {
          type: 'text',
          value: ` - ${date}`
        }
      ]
    }

    function yanked(yanked?: boolean): PhrasingContent[] {
      if (!yanked) {
        return []
      }

      return [
        {
          type: 'text',
          value: ' [YANKED]'
        }
      ]
    }
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
  date?: string
  prerelease?: boolean
  yanked?: boolean
  description?: string
} & Partial<Record<Section, Entry[]>>

export interface RepositoryConfig {
  firstCommit: string
  owner: string
  repo: string
}

type Entry = string
