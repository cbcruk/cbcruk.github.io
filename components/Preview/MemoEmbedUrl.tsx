type Props = {
  url: string
}

export function MemoEmbedUrl({ url }: Props) {
  const { host, href } = new URL(url)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex justify-center py-1 px-3 rounded-full bg-[color:var(--solarized-background-highlight)] text-xs text-center text-[color:var(--solarized-cyan)]"
    >
      {host}
    </a>
  )
}
