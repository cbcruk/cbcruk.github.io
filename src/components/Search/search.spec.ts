import { describe, expect, it } from 'vitest'
import { prepare, search, type CorpusEntry } from './search'

const entry = (
  i: string,
  t: string,
  b: string,
  k: string[] = []
): CorpusEntry => ({ i, t, k, c: '2026-01-01', m: '2026-01-01', b })

const CORPUS = [
  entry('1', '타입 추론', '제네릭에서 타입을 좁히는 방법', ['typescript']),
  entry('2', 'React 렌더링', 'react 는 참조로 비교한다', ['react']),
  entry('3', '스크롤 복원', '스크롤 위치를 직접 들고 있는다'),
  entry('4', '스크립트 로딩', 'blocking 속성은 body 앞에서만 등록된다'),
]

const index = prepare(CORPUS)
const ids = (query: string) => search(index, query).map((hit) => hit.id)

describe('search', () => {
  it('빈 질의는 아무것도 안 낸다', () => {
    expect(search(index, '')).toEqual([])
    expect(search(index, '   ')).toEqual([])
  })

  it('제목·본문·태그를 함께 훑는다', () => {
    expect(ids('제네릭')).toEqual(['1'])
    expect(ids('렌더링')).toEqual(['2'])
    expect(ids('typescript')).toEqual(['1'])
  })

  it('대소문자를 가리지 않는다', () => {
    expect(ids('REACT')).toEqual(['2'])
  })

  describe('그대로 못 찾을 때 넓히는 세 축', () => {
    it('공백을 지운 사본으로 `타입추론` 이 `타입 추론` 에 닿는다', () => {
      expect(ids('타입추론')).toEqual(['1'])
    })

    it('조사를 떼어 `타입의` 가 `타입` 에 닿는다', () => {
      expect(ids('타입의')).toEqual(['1'])
    })

    it('한글 질의를 영문 원어로 잇는다', () => {
      expect(ids('리액트')).toEqual(['2'])
    })
  })

  describe('어간까지 깎는 것은 마지막 수단이다', () => {
    it('친 그대로 세 건 미만일 때만 깎는다', () => {
      // `스크롤` 은 그대로 한 건이라 깎기가 열리고 `스크` 로 `스크립트` 까지 딸려온다
      expect(ids('스크롤')).toContain('3')
      expect(ids('스크롤')).toContain('4')
    })

    it('깎아서 걸린 것은 그대로 걸린 것보다 뒤에 온다', () => {
      expect(ids('스크롤')[0]).toBe('3')
    })

    it('영문은 깎지 않는다 — `react` 를 `re` 로 깎으면 정밀도가 무너진다', () => {
      expect(ids('reactx')).toEqual([])
    })
  })

  it('걸린 자리를 앞뒤와 함께 낸다', () => {
    const [hit] = search(index, '제네릭')

    expect(hit.hit).toBe('제네릭')
    expect(hit.tail).toContain('타입을')
    expect(hit.title).toBe('타입 추론')
  })

  it('실제로 걸린 말을 함께 낸다 — 질의와 다를 수 있다', () => {
    expect(search(index, '리액트')[0].term).toBe('react')
  })
})
