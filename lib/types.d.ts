import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export type About = {
  company: {
    end_date: string
    is_closure: boolean
    is_freelancer: boolean
    name: string
    start_date: string
  }[]
  description: string
}

export type Links = {
  name: string
  url: string
}[]

export type MemoRecord = {
  id: string
  createdTime: string
  fields: {
    index: number
    body: string
    linked_tags: string[]
    updatedAt: string
    createdAt: string
    lastModified: string
    tags: string[]
    serialize: MDXRemoteSerializeResult
  }
}

export type TagRecord = {
  id: string
  createdTime: string
  fields: {
    select: string
  }
}

export type MemoPageProps = {
  data: {
    records: MemoRecord[]
    pagination?: (number | null)[]
  }
}
