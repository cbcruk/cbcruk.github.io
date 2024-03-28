import { twc } from 'react-twc'

export const Pagination = twc.div`flex justify-between items-center pt-8`

export const PaginationLabel = twc.span`text-neutral-400 text-xs`

export const PaginationLinkGroup = twc.div`flex justify-end items-center gap-1 ml-auto`

export const PaginationLink = twc.a`inline-flex justify-center p-1 px-2 rounded-full border border-transparent hover:border-sky-900 text-xs text-center bg-sky-900/30 hover:bg-sky-900/60`

export const PaginationLatest = twc.div`flex justify-between items-center pt-8`
