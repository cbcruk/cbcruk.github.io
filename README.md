# 📝 cbcruk.github.io

이 프로젝트는 제 개인 페이지로, 개발하면서 경험했던 메모들을 기록하고 공유하는 기능을 제공합니다.

## 주요 기능

- 메모 작성 및 관리
- 메모 검색 기능
- 태그를 통한 메모 분류

## 기술 스택

- Framework: [Astro](https://astro.build/)
- Deployment: [Github Pages](https://pages.github.com/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

## 로컬에서 실행하기

```
pnpm i
pnpm start
```

## Schema

```sql
CREATE TABLE memo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  tags TEXT NOT NULL,
  status TEXT CHECK(status IN ('release', 'draft')) NOT NULL,
  ctime DATETIME NOT NULL,
  mtime DATETIME NOT NULL,
  embed TEXT
);

CREATE TABLE company (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  is_working BOOLEAN NOT NULL,
  is_freelancer BOOLEAN NOT NULL
);

CREATE TABLE link (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL
);
```

## 코멘트

메모별 코멘트는 별도 libSQL(Turso) DB에 저장합니다. Vercel 서버리스 API(`/api/comments`)가
읽기/쓰기를 담당하고, 정적 사이트가 CORS로 호출합니다.

```sql
CREATE TABLE comment (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  memo_id  TEXT NOT NULL,
  author   TEXT NOT NULL,
  body     TEXT NOT NULL,
  status   TEXT NOT NULL DEFAULT 'pending'
           CHECK(status IN ('pending', 'approved', 'hidden', 'spam')),
  ip_hash  TEXT,
  ctime    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

- 초기화: `node scripts/init-comments.mjs`
- 사전 승인 큐: 작성 시 `pending`으로 저장 → `approve` 해야 노출
- 모더레이션: `node scripts/moderate-comments.mjs pending|list|approve|hide|spam|delete`
- 환경변수: `.env.example` 참고 (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `COMMENT_IP_SALT`)
- 스팸 방어: 허니팟 필드 + IP 레이트리밋(60초당 3개) + 사전 승인
