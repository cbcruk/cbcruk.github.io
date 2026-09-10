import type { CollectionEntry } from 'astro:content'

type Props = {
  sources: NonNullable<CollectionEntry<'memo'>['data']['sources']>
}

export function MemoSources({ sources }: Props) {
  if (sources.length === 0) {
    return null
  }

  return (
    <section
      aria-label="출처"
      className="mt-4 pt-4 border-t-2 border-(--flexoki-950) text-xs"
    >
      <h2 className="text-[10px] text-(--flexoki-400) mb-2">출처</h2>
      <ul className="flex flex-col gap-1">
        {sources.map(({ id, resource, title }) => (
          <li key={id}>
            {resource ? (
              <a
                href={resource}
                target="_blank"
                rel="noreferrer"
                className="text-(--flexoki-cyan-600) hover:text-(--flexoki-cyan-400)"
              >
                {title || resource}
              </a>
            ) : (
              // resource 가 비어 있는 출처가 넷 있다. 없는 URL 을 지어내지 않고 이름만 낸다
              <span className="text-(--flexoki-300)">{title || id}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
