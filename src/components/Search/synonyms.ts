/**
 * 한글로 친 질의를 영문 원어로 잇는다. 토크나이저나 형태소 분석기로는 못 푸는
 * 축이라 — `리액트` 는 코퍼스에 0건이고 `react` 는 76건이다 — 손으로 관리한다.
 *
 * 넣는 기준은 **측정된 차이**다. 한글 표기가 영문보다 적게 잡히는 쌍만 넣는다.
 * 쓰다가 안 잡히는 게 나오면 그때 한 줄 늘린다.
 */
export const SYNONYMS: Record<string, string> = {
  리액트: 'react',
  자바스크립트: 'javascript',
  타입스크립트: 'typescript',
  노드: 'node',
  폼: 'form',
  컴포넌트: 'component',
  렌더링: 'render',
  테스트: 'test',
  에러: 'error',
  쿼리: 'query',
  비동기: 'async',
  빌드: 'build',
  훅: 'hook',
  훅스: 'hooks',
  아이콘: 'icon',
  폰트: 'font',
  라우터: 'router',
  디버깅: 'debug',
  클라이언트: 'client',
  이미지: 'image',
}
