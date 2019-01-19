import { Content } from 'mdast'

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
    return [...this.header(previous)]
  }

  public header(previous?: Release): Content[] {
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

  public compareUrl(previous?: Release): string {
    const from = previous ? previous.tagName : this.repository.firstCommit
    const to = this.tagName

    return `https://github.com/${this.repository.owner}/${
      this.repository.repo
    }/compare/${from}..${to}`
  }
}

export interface SerializedRelease {
  name?: string
  tagName?: string
  draft?: boolean
  prerelease?: boolean
}

export interface RepositoryConfig {
  firstCommit: string
  owner: string
  repo: string
}
