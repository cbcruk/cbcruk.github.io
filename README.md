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
