# 프로젝트 가이드

개인 블로그 - 간단한 메모 형태로 정리

---

## 메모 작성 원칙 (필수)

**메모 ≠ 블로그 글**

```
1. 한 문장으로 요약할 수 있는가?
2. 코드가 핵심이면 코드만
3. 링크가 핵심이면 링크 + 한 줄 설명
4. 헤딩(H1, H2...)은 정말 필요할 때만
5. "나중에 이해할 수 있는 최소한"만 작성
```

### 하지 말 것

- 서론 → 본론 → 결론 구조
- 친절한 독자 배려 문장
- 불필요한 섹션 분리
- "이 글에서는...", "결론적으로..." 같은 블로그 투

### 할 것

- 핵심 먼저, 맥락은 최소한
- 코드 블록 + 짧은 설명
- 미래의 나를 위한 힌트
- 나중에 확장 가능한 씨앗

---

## 메모 명세

### 파일 구조

- **위치**: `src/content/memo/`
- **파일명**: 숫자 기반 ID (1.md, 2.md, ...)
- **확장자**:
  - `.md` - 기본
  - `.mdx` - 컴포넌트 임포트가 필요한 경우만

### Frontmatter (필수)

```yaml
---
tags: ['tag1', 'tag2']  # 필수, 빈 배열 [] 허용
status: draft           # 필수, 'draft' 또는 'release'
ctime: YYYY-MM-DD       # 필수, 생성일
mtime: YYYY-MM-DD       # 필수, 수정일
title: 제목              # 선택
description: 설명        # 선택
parent: '307'           # 선택, 이 메모가 이어지는/대체하는 부모 메모 ID
relation: continues     # 선택, 'continues'(기본) 또는 'supersedes'
---
```

### 메모 연결 (계보)

메모 간 관계는 세 레이어로 표면화됨:

| 레이어 | 필드 | 의미 |
|---|---|---|
| 자동 유사도 | (없음) | 공유 태그 IDF 가중 → "관련 메모" 자동 노출 |
| 방향 계보 | `parent` | 이 메모가 어떤 메모에서 이어졌는지 (시간/계보) |
| 관계 종류 | `relation` | `continues`(이어짐) / `supersedes`(부모를 대체) |

- **thread**: `parent` 체인을 따라가면 도출됨
- **branch**: 같은 `parent`를 가진 메모가 2개 이상 = 자동 분기 (별도 표기 불필요)
- **supersedes**: `relation: supersedes`면 부모 페이지에 "대체됨" 경고 표시
- `parent`는 `release` 메모만 해석됨 (draft는 공개되지 않음)

### Status 기준

| 값 | 의미 |
|---|---|
| `draft` | 작성 중, 비공개 |
| `release` | 완성됨, 공개 가능 |

### 태그 규칙

- **네이밍**: kebab-case
  - O: `design-system`, `react-query`, `google-apps-script`
  - X: `design_system`, `reactQuery`
- **빈 태그**: `[]` 허용 (분류가 애매한 경우)
- **특수 태그**:
  - `bookmarks` - 링크 모음 형태의 메모

### 각주 규칙

메모 번호를 접두사로 사용:
```markdown
[^496-1]: 첫 번째 각주
[^496-2]: 두 번째 각주
```

### 본문 구조

자유 형식. 유형에 따라 적절히 선택.

### Alerts (GitHub 스타일)

중요 정보 강조 시 사용. 남용 금지 (메모당 1-2개 이하).

```markdown
> [!NOTE]
> 참고할 만한 정보

> [!TIP]
> 유용한 팁

> [!IMPORTANT]
> 핵심 정보

> [!WARNING]
> 주의 필요

> [!CAUTION]
> 위험/부정적 결과 경고
```

- 연속 배치 금지
- 다른 요소 안에 중첩 금지

---

## 메모 유형 및 템플릿

### Type A: 링크 모음 (bookmarks)

```markdown
---
tags: ['keyword', 'bookmarks']
status: draft
ctime: YYYY-MM-DD
mtime: YYYY-MM-DD
---

- [링크 제목](URL)[^N-1]
- [링크 제목](URL)[^N-2]

---

[^N-1]: 간단한 설명
[^N-2]: 간단한 설명
```

### Type B: 코드 스니펫

```markdown
---
tags: ['typescript', 'pattern']
status: release
ctime: YYYY-MM-DD
mtime: YYYY-MM-DD
---

한두 줄 설명

\`\`\`tsx
// 코드
\`\`\`

---

- 참고: [링크](URL)
```

### Type C: 기술 문서

```markdown
---
tags: ['react', 'architecture']
status: draft
ctime: YYYY-MM-DD
mtime: YYYY-MM-DD
title: 선택사항
description: 선택사항
---

# 제목

소개 문단

## 섹션 1

내용

## 섹션 2

내용

---

## 참고 자료

- [링크](URL)
```

### Type D: 비교/분석

```markdown
---
tags: ['library', 'comparison']
status: release
ctime: YYYY-MM-DD
mtime: YYYY-MM-DD
---

## 옵션 A

설명, 장단점

## 옵션 B

설명, 장단점

## 결론

추천 사항
```

### Type E: 아이디어/실험

```markdown
---
tags: ['idea', 'keyword']
status: draft
ctime: YYYY-MM-DD
mtime: YYYY-MM-DD
---

## 아이디어

배경, 동기

## 접근 방식

시도할 것들

## 메모

관련 리소스, 참고사항
```

### Type F: 문제 해결 (디버그)

버그/이슈 추적은 **객관적 사실 위주**로. 현상 → 원인 → 해결 순서. 추적 과정의 서사·개인 감상은 덜어내고, 일반화되는 교훈만 1~2줄 남긴다.

```markdown
---
tags: ['debug', 'keyword']
status: release
ctime: YYYY-MM-DD
mtime: YYYY-MM-DD
---

한 줄 결론 (문제 = 원인)

## 현상

객관적으로 관찰된 사실 (재현 조건, 증상, 비대칭 단서)

## 원인

검증된 근본 원인 (+ 근거)

## 해결

적용한 방어/수정 (+ 주의사항)

## 교훈

일반화되는 원칙만 1~2줄 (개인 감상 X)

## 참고

- [링크](URL)
```

원칙:

- "추적기", "회고" 같은 서사 프레임 지양 — 6개월 뒤 "그래서 뭐였지"에 즉답되는 형태
- 일반화 사실(예: "URL 인코딩은 멱등이 아니다")은 보존, 그 순간의 감상(예: "어디서 멈출지 판단이 중요했다")은 제거
- 레퍼런스 예시: `539.md`

---

## 워크플로우

### 새 메모 추가

1. **중복 확인**: 관련 태그/키워드로 기존 메모 검색
2. **파일 생성**: 다음 숫자 ID로 `.md` 생성
3. **유형 선택**: 위 템플릿 중 적절한 것 선택
4. **태그 지정**: kebab-case로 관련 태그 추가
5. **status**: 작성 중이면 `draft`, 완성되면 `release`

### 메모 수정

1. `mtime` 업데이트
2. 필요시 `status` 변경 (draft → release)

---

## 변경 이력

- 태그 정규화: snake_case → kebab-case 변환 (23개 파일)
- 빈 태그 메모: 28개 파일에 태그 적용
- 삭제: 427.md (내용 없음)
