// @ts-check
export function MemoTags({ tags }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {tags.map((tag) => {
        return (
          <span
            key={tag}
            className="border border-sky-800 rounded-full px-2 py-1 bg-sky-900/30"
          >
            #{tag}
          </span>
        )
      })}
    </div>
  )
}
