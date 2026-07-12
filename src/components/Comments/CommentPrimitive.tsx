import { twc } from 'react-twc'

export const CommentSection = twc.section`mt-4 flex flex-col gap-3`

export const CommentSectionTitle = twc.h2`text-[10px] text-(--flexoki-400)`

export const CommentItem = twc.article`border-2 border-(--flexoki-950) p-[10px] rounded-lg text-sm`

export const CommentMeta = twc.div`flex items-center gap-2 pb-2 text-[10px] text-(--flexoki-400)`

export const CommentAuthor = twc.span`font-bold text-(--flexoki-200)`

export const CommentBody = twc.p`whitespace-pre-wrap break-words`

export const CommentFormRoot = twc.form`flex flex-col gap-2 border-2 border-(--flexoki-950) p-[10px] rounded-lg`

export const CommentInput = twc.input`bg-(--flexoki-950) rounded-md px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-(--flexoki-700)`

export const CommentTextarea = twc.textarea`bg-(--flexoki-950) rounded-md px-2 py-1 text-sm outline-none resize-y min-h-[64px] focus:ring-1 focus:ring-(--flexoki-700)`

export const CommentSubmit = twc.button`self-end px-3 py-1 rounded-lg bg-(--flexoki-950) text-xs text-(--flexoki-cyan-600) hover:text-(--flexoki-cyan-400) disabled:opacity-50 disabled:cursor-not-allowed`

export const CommentHint = twc.p`text-[10px] text-(--flexoki-400)`

export const CommentError = twc.p`text-[10px] text-(--flexoki-red-400)`
