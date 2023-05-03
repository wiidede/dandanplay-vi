import { describe, expect, it } from 'vitest'

function getDataAsync<T>(data: T, timeout: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, timeout)
  })
}

describe('useAsyncMemoizeStorage', () => {
  const getData = async <T>(data: T) => await getDataAsync(data, 100)
  const get = useAsyncMemoizeStorage(getData, 'test_useAsyncMemoizeStorage')
  it('should works', async () => {
    const time1 = Date.now()
    expect(await get(123)).toEqual(123)
    const time2 = Date.now()
    expect(time2 - time1 > 100).toBe(true)
    expect(await get(123)).toEqual(123)
    const time3 = Date.now()
    expect(time3 - time2 < 100).toBe(true)
  })
})
