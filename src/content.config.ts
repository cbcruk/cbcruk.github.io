import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

// OKF §5.2 — 생산/검증 이벤트. by 는 actor 규약(human:<id> | <producer>/<version> | process:<id>)
const okfEvent = z.object({ by: z.string(), at: z.coerce.date().optional() })

const memo = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/memo' }),
  schema: z.object({
    type: z.enum(['bookmarks', 'snippet', 'note']),
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()),
    status: z.enum(['release', 'draft', 'archive']),
    ctime: z.coerce.date(),
    mtime: z.coerce.date(),
    embed: z.string().optional(),
    parent: z.coerce.string().optional(),
    relation: z.enum(['continues', 'supersedes']).default('continues'),
    // OKF 종류(Convention·Metric…). type(형태)과 축이 다르다 — 있으면 OKF concept 장르
    kind: z.string().optional(),
    generated: okfEvent.optional(),
    // OKF §5.2 — 검증자가 하나면 리스트 없이 쓴다. 소비자는 1개짜리 리스트로 다룬다
    verified: z.union([okfEvent, z.array(okfEvent)]).optional(),
  }),
})

const think = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/think' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()),
    status: z.enum(['release', 'draft']),
    ctime: z.coerce.date(),
    mtime: z.coerce.date(),
    embed: z.string().optional(),
  }),
})

const company = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/company' }),
  schema: z.object({
    name: z.string(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date().nullable(),
    is_working: z.boolean(),
    is_freelancer: z.boolean(),
  }),
})

const link = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/links' }),
  schema: z.object({
    name: z.string(),
    url: z.string(),
    is_private: z.boolean(),
  }),
})

export const collections = { memo, company, link, think }
