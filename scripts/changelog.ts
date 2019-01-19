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
      date: '2019-01-19',
      description: 'Initial working release'
    }
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
