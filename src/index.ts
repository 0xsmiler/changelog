import git from 'nodegit'

import {
  generateChangelog as generate,
  SerializedRelease,
} from './generate-changelog'

export async function generateChangelog<Scope>({
  releases,
  branch = 'main',
  remote = 'origin',
}: {
  releases: SerializedRelease<Scope>[]
  branch?: string
  remote?: string
}) {
  try {
    const repository = await git.Repository.open(process.cwd())
    const origin = await repository.getRemote(remote)
    const master = await repository.getBranchCommit(branch)
    const match = matchRemoteUrl(origin.url())

    let commit = master

    while (commit.parentcount() > 0) {
      commit = await commit.parent(0)
    }

    if (!match) {
      return ''
    }

    return generate<Scope>({
      releases,
      repository: {
        firstCommit: commit.sha(),
        ...match,
      },
    })
  } catch (e) {
    console.log(e)
    return ''
  }
}

export function matchRemoteUrl(url: string) {
  /**
   * Matches an string that consists of
   * - An arbitrary prefix (that ends with : (for SSH) or / (for HTTPS))
   * - [1] Repository owner (next part without : or /)
   * - [2] A forward slash /
   * - [3] Repository name (next part without : or / and without trailing .git)
   * - [4] Optionally .git
   *                               --[1]--|[2]|------[3]--------|---[4]---|
   */
  const match = url.match(/([^\/:]+)\/([^\/:]+(?<!\.git))(\.git)?$/)
  if (!match) return null
  return {
    owner: match[1],
    repo: match[2],
  }
}
