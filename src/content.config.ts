import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const memo = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/memo' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()),
    status: z.enum(['release', 'draft']),
    ctime: z.coerce.date(),
    mtime: z.coerce.date(),
    embed: z.string().optional(),
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
