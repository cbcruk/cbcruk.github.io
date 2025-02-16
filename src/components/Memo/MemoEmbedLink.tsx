type Props = {
  url: ConstructorParameters<typeof URL>[0]
}

export function MemoEmbedLink({ url }: Props) {
  const { host, href } = new URL(url)

  return (
    <a
      href={href}
      target="_blank"
      className="inline-flex justify-center py-1 px-3 rounded-lg bg-[--flexoki-950] text-[--flexoki-cyan-600] hover:text-[--flexoki-cyan-400]"
    >
      {host}
    </a>
  )
}
