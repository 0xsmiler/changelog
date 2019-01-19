import { generateChangelog } from '../src/generate-changelog'

describe('generate changelog', () => {
  test('empty changelog', () => {
    expect(generateChangelog()).toEqual('')
  })
})
