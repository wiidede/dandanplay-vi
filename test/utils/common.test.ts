import type { ICommentArt, ICommentCCL, ICommentN, ICommentRaw } from '~/typings/comment'
import { describe, expect, it } from 'vitest'

// Unit tests for dandan2nPlayer
describe('dandan2nPlayer', () => {
  it('should correctly convert ICommentRaw to ICommentN', () => {
    const testData: Array<{ input: ICommentRaw, expected: ICommentN }> = [
      {
        input: { p: '1,1,1', m: 'test', cid: 1 },
        expected: { color: '000001', text: 'test', time: 1, type: 'scroll' },
      },
      {
        input: { p: '2,4,255', m: 'another test', cid: 1 },
        expected: { color: '0000ff', text: 'another test', time: 2, type: 'bottom' },
      },
      {
        input: { p: '3,5,0', m: 'final test', cid: 1 },
        expected: { color: '000000', text: 'final test', time: 3, type: 'top' },
      },
    ]

    for (const test of testData)
      expect(dandan2nPlayer(test.input)).toEqual(test.expected)
  })
})

describe('dandan2artPlayer', () => {
  it('should correctly convert ICommentRaw to ICommentArt', () => {
    const testData: Array<{ input: ICommentRaw, expected: ICommentArt }> = [
      {
        input: { p: '123,1,16777215', m: 'Hello World', cid: 1 },
        expected: { color: 'ffffff', text: 'Hello World', time: 123, mode: 0 },
      },
      {
        input: { p: '456,4,16711680', m: 'Another message', cid: 1 },
        expected: { color: 'ff0000', text: 'Another message', time: 456, mode: 1 },
      },
      {
        input: { p: '789,5,65280', m: 'Test message', cid: 1 },
        expected: { color: '00ff00', text: 'Test message', time: 789, mode: 1 },
      },
    ]

    for (const test of testData)
      expect(dandan2artPlayer(test.input)).toEqual(test.expected)
  })
})

describe('dandan2CCL', () => {
  it('should correctly convert ICommentRaw to ICommentCCL', () => {
    const testData: Array<{ input: ICommentRaw, expected: ICommentCCL }> = [
      {
        input: { p: '100,1,2', m: 'Test comment', cid: 1 },
        expected: { text: 'Test comment', stime: 100000, color: 2, mode: 1, size: 25 },
      },
      {
        input: { p: '500,4,3', m: 'Another test comment', cid: 1 },
        expected: { text: 'Another test comment', stime: 500000, color: 3, mode: 4, size: 25 },
      },
    ]

    for (const test of testData)
      expect(dandan2CCL(test.input)).toEqual(test.expected)
  })
})
