import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

import { generateChangelog } from '..'

const writeFile = util.promisify(fs.writeFile)

exec().then(() => {
  console.log('done')
})

async function exec(): Promise<void> {
  const content = await generateChangelog([
    {
      tagName: '0.1.0',
      date: '2019-01-20',
      description: 'Initial working release'
    },
    {
      tagName: '0.1.1',
      date: '2019-02-02',
      added: [
        'Add section `Changed`'
      ]
    }
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
