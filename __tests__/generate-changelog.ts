import { generateChangelog } from '../src/generate-changelog'

describe('generate changelog', () => {
  test('empty changelog', () => {
    const expected =
      '# Changelog\n\nAll notable changes to this project will be document in this file.'
    expect(generateChangelog([]).trim()).toEqual(expected)
  })
})
