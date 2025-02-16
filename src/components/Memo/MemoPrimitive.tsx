import { twc } from 'react-twc'

export const Memo = twc.div`overflow-hidden border-2 border-[--flexoki-950] p-[10px] rounded-lg text-xs`

export const MemoFooter = twc.div`flex flex-col gap-1 pt-4 text-[10px] text-[--flexoki-400]`

export const MemoLink = twc.a``

export const MemoTags = twc.div`flex gap-2 overflow-x-auto`

export const MemoTag = twc.a`px-2 py-1 rounded-lg bg-[--flexoki-950] whitespace-nowrap text-[11px] text-[--flexoki-purple-500] hover:text-[--flexoki-purple-400]`

export const MemoDate = twc.time`text-ellipsis overflow-hidden whitespace-nowrap cursor-`

export const MemoEmbedUrl = twc.a`inline-flex justify-center py-1 px-3 rounded-full bg-[--flexoki-950] text-xs text-center text-[--flexoki-cyan-600]`

export const MemoIdAndDate = twc.div`flex items-center gap-2 py-2`

export const MemoId = twc.a`underline`
