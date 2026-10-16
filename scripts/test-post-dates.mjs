import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const source = readFileSync(new URL('themes/aiovtue/assets/js/utils.js', root), 'utf8')
const { parsePostDateTime } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)

test('post times preserve precision and use China time independently of browser timezone', () => {
  const previousTZ = process.env.TZ
  try {
    for (const tz of ['UTC', 'Asia/Shanghai', 'America/New_York']) {
      process.env.TZ = tz
      for (const input of ['2026-10-16', '2026-10-16T00:00:00', '2026-10-16T00:00:00+08:00']) {
        assert.equal(parsePostDateTime(input).toISOString(), '2026-10-15T16:00:00.000Z')
      }
      assert.equal(parsePostDateTime('2026-10-16T09:08:35').toISOString(), '2026-10-16T01:08:35.000Z')
      assert.equal(parsePostDateTime('2026-10-16 09:08').toISOString(), '2026-10-16T01:08:00.000Z')
      assert.equal(parsePostDateTime('2026-10-16T09:08:35+08:00', true).toISOString(), '2026-10-16T01:08:35.000Z')
      assert.equal(parsePostDateTime('2026-10-16T01:08:35Z').toISOString(), '2026-10-16T01:08:35.000Z')
      for (const input of [null, '', '  ', 'invalid']) assert.equal(parsePostDateTime(input), null)
    }
  } finally {
    if (previousTZ === undefined) delete process.env.TZ
    else process.env.TZ = previousTZ
  }
})

