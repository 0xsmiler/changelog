import git from 'nodegit'
import path from 'path'

import {
  generateChangelog as generate,
  SerializedRelease
} from './generate-changelog'

export async function generateChangelog(
  releases: SerializedRelease[],
  {
    branch = 'master',
    remote = 'origin'
  }: {
    branch?: string
    remote?: string
  } = {}
) {
  try {
    const repository = await git.Repository.open(process.cwd())
    const origin = await repository.getRemote(remote)
    const master = await repository.getBranchCommit(branch)
    const url = origin.url()
    const match = url.match('([^/:]+)/([^/:]+).git')

    let commit = master

    while (commit.parentcount() > 0) {
      commit = await commit.parent(0)
    }

    if (!match) {
      return ''
    }

    return generate({
      releases,
      repository: {
        firstCommit: commit.sha(),
        owner: match[1],
        repo: match[2]
      }
    })
  } catch (e) {
    console.log(e)
    return ''
  }
}
