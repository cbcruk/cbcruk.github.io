---
name: create-memo
description: 새 메모 파일을 src/content/memo/에 생성합니다. Use when the user wants to create a new memo — triggers on phrases like "메모 생성", "새 메모", "메모 만들어줘", "메모 추가해줘", "이거 메모로 남겨줘".
---

# 메모 생성

다음 ID로 새 메모 파일을 생성합니다.

## 실행 방법

`scripts/create-memo.mjs`를 실행하여 빈 메모를 생성. 첫 인자로 `type`(형태)을 넘긴다:

```bash
node scripts/create-memo.mjs bookmarks   # 링크 모음
node scripts/create-memo.mjs snippet     # 코드가 주인공
node scripts/create-memo.mjs note        # 산문이 주인공 (기본값)
```

스크립트는 다음을 자동으로 처리:
- `src/content/memo/` 내 가장 큰 숫자 ID + 1
- `ctime`, `mtime`을 오늘 날짜로 설정
- 빈 `tags: []`
- `status`: `bookmarks`는 `archive`, 나머지는 `draft` (Status 기준은 CLAUDE.md 참고)

`type`과 본문 형태가 어긋나면 빌드가 잡는다 (`pnpm lint:memo`).

## 작업 순서

1. **사용자 의도 파악**: 메모 주제/내용/태그를 사용자가 함께 제공했는지 확인
2. **스크립트 실행**: `node scripts/create-memo.mjs` 실행 → 생성된 파일명 확인
3. **내용 작성** (사용자가 주제/내용을 제공한 경우):
   - 적절한 태그 추가 (kebab-case)
   - CLAUDE.md의 메모 유형(A~F) 중 적합한 템플릿 선택
   - 본문 작성
4. **중복 확인**: 유사 태그/주제 기존 메모가 있으면 사용자에게 알리고 통합 여부 확인
5. **관계 탐지 (계보 연결)**: 아래 "관계 자동화" 절차 수행

## 관계 자동화 (parent / relation)

새 메모가 기존 메모를 **이어가거나 대체**하면 frontmatter에 `parent`(+`relation`)를 추가한다. 계보 스펙은 CLAUDE.md "메모 연결" 참고.

### 절차

1. **후보 탐색**: 새 메모의 태그로 관련 기존 메모를 찾는다.

   ```bash
   node scripts/find-related.mjs tag1,tag2
   ```

   (IDF 가중 점수 순으로 release 메모 후보 + 첫 줄 출력)

2. **관계 판단**: 상위 후보의 내용을 읽고 새 메모와의 관계를 판단한다.

   | 판단 | 설정 |
   |---|---|
   | 단순히 비슷함 (주제만 겹침) | **연결 안 함** — 자동 관련 메모가 이미 처리 |
   | 후보의 후속/심화/이어지는 생각 | `parent: '후보ID'` (relation 생략 = continues) |
   | 후보의 내용을 갱신/교체/대체 | `parent: '후보ID'`, `relation: supersedes` |

3. **사용자 확인 후 적용**: 단정하지 말고 "이 메모는 #N을 이어가는/대체하는 것으로 보입니다. 연결할까요?"로 제안한 뒤 frontmatter에 추가한다.

### 주의

- `parent`는 **하나만** 건다 (가장 직접적인 부모). 곁가지(branch)는 같은 부모를 공유하면 자동 도출되므로 명시 불필요.
- 애매하면 **연결하지 않는다.** 약한 연결은 노이즈. 자동 관련 메모로 충분.
- `parent`는 `release` 메모만 해석됨 — draft를 부모로 걸지 않는다.

## 메모 작성 원칙 (CLAUDE.md 준수)

- 한 문장으로 요약 가능한가?
- 코드가 핵심이면 코드만
- 헤딩은 정말 필요할 때만
- 서론/결론 구조 지양

## 주의사항

- 주제가 명확하지 않으면 빈 파일만 생성하고 사용자에게 작성을 위임
- `status`는 기본 `draft`, 완성도 확인 후 `release`로 변경
- 태그가 애매하면 `[]`로 두는 것도 허용
