import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import { generateChangelog } from '../src'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

exec().then(() => {
  console.log('done')
})

async function exec(): Promise<void> {
  const content = generateChangelog<undefined>({
    repository: {
      firstCommit: 'b5b9c087d461599e25080b9963a53c15fd72e9e6',
      owner: 'inyono',
      repo: 'changelog',
    },
    releases: [
      {
        tagName: 'v0.1.0',
        date: '2019-01-20',
        description: 'Initial working release',
      },
      {
        tagName: 'v0.1.1',
        date: '2019-02-02',
        added: ['Add section `Changed`'],
      },
      {
        tagName: 'v0.1.2',
        date: '2019-02-08',
        fixed: ['Move `@types/mdast` to dependencies'],
      },
      {
        tagName: 'v0.1.3',
        date: '2019-06-05',
        added: ['Add scoped changelog entries'],
      },
      {
        tagName: 'v0.1.4',
        date: '2019-06-05',
        fixed: ['Handle remote urls without optional .git'],
      },
      {
        tagName: 'v0.1.5',
        date: '2020-02-14',
        fixed: ['Update dependencies to support Node v12'],
      },
      {
        tagName: 'v0.2.0',
        date: '2020-12-22',
        yanked: true,
      },
      {
        tagName: 'v0.2.1',
        date: '2020-12-22',
        breakingChanges: ['Drop Node v10 support.'],
        added: ['Update dependencies to support Node v14.'],
      },
      {
        tagName: 'v0.3.0',
        date: '2021-08-30',
        breakingChanges: [
          'Change default branch to `main`.',
          `\`generateChangelog\` now accepts an configuration object instead of two arguments, i.e.:
          
\`\`\`js
generateChangelog(releases, { branch, origin })
// becomes
generateChangelog({
  releases,
  branch,
  origin
})
\`\`\`
          `,
        ],
      },
      {
        tagName: 'v0.4.0',
        date: '2022-01-09',
        breakingChanges: [
          'Drop Node v12 support.',
          `\`generateChangelog\` now requires information about the GitHub repository, i.e.:
          
\`\`\`js
generateChangelog({
  releases,
  branch,
  origin
})
// becomes
generateChangelog({
  releases,
  repository: {
    firstCommit: 'b5b9c087d461599e25080b9963a53c15fd72e9e6',
    owner: 'inyono',
    repo: 'changelog'
  }
})
\`\`\`
          `,
        ],
      },
      {
        tagName: 'v0.5.0',
        date: '2022-03-10',
        breakingChanges: [
          'This package is now ESM only. [Learn more about ESM in this guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).',
        ],
      },
      {
        tagName: 'v0.5.1',
        date: '2022-03-10',
        internal: ['Remove .npmignore.'],
      },
      {
        tagName: 'v0.5.2',
        date: '2022-03-10',
        fixed: ['Publish build output.'],
      },
    ],
  })

  await fs.promises.writeFile(
    path.join(__dirname, '..', 'CHANGELOG.md'),
    content
  )
}
