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
---
```

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
