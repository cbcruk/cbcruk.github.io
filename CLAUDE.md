# 프로젝트 가이드

개인 블로그 - 간단한 메모 형태로 정리

## 메모 관리 규칙

### 파일 구조
- 위치: `src/content/memo/`
- 파일명: 숫자 기반 ID (1.md, 2.md, ...)
- 형식: `.md` 또는 `.mdx`

### Frontmatter
```yaml
---
tags: ['tag1', 'tag2']
status: release
ctime: YYYY-MM-DD
mtime: YYYY-MM-DD
---
```

### 태그 규칙
- **네이밍**: kebab-case 사용
  - O: `design-system`, `google-apps-script`, `react-query`
  - X: `design_system`, `reactQuery`
- **분류**: 태그만으로 관리 (별도 링크/허브 시스템 없음)
- **bookmarks 태그**: 링크 모음 형태의 메모에 사용

## 새 메모 추가 워크플로우

1. **중복 확인**: 관련 태그/키워드로 기존 메모 검색
2. **파일 생성**: 다음 숫자 ID로 생성
3. **태그 지정**: kebab-case로 관련 태그 추가

## 태그 정규화 완료

snake_case → kebab-case 변환 완료 (23개 파일)

## 빈 태그 메모 - 적용 완료

28개 파일에 태그 적용 완료

### 삭제 완료
- 427.md: 내용 없어서 삭제됨
