import history from 'history/browser'

/** 입력이 이만큼 멈추면 검색하고 주소를 쓴다 */
export const SETTLE_DELAY = 200

/**
 * 주소가 곧 검색어다. 입력값을 React 상태로 들고 있지 않는 이유는 성능이다 —
 * 상태를 결과와 같은 트리에 두면 키 입력마다 결과 목록 전체가 다시 렌더된다
 * (결과 29건 떠 있는 채로 네 글자 입력에 스크립트 95ms).
 */
export function writeQuery(value: string) {
  const url = new URL(window.location.href)

  if (value) {
    url.searchParams.set('q', value)
  } else {
    url.searchParams.delete('q')
  }

  history.replace(`${url.pathname}${url.search}${url.hash}`)
}
