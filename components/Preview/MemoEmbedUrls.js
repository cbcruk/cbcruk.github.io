// @ts-check
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useRef, useState } from 'react'

export function MemoEmbedUrls({ embed }) {
  const ref = useRef()
  const [state, setState] = useState(false)
  useOnClickOutside(ref, () => setState(false))

  if (!embed?.length) {
    return null
  }

  return (
    <div ref={ref} className="relative flex ml-auto text-xs">
      <button onClick={() => setState(true)}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 48 48"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.4 26.4C9.73333 26.4 9.16667 26.1666 8.7 25.7C8.23333 25.2333 8 24.6666 8 24C8 23.3333 8.23333 22.7666 8.7 22.3C9.16667 21.8333 9.73333 21.6 10.4 21.6C11.0667 21.6 11.6333 21.8333 12.1 22.3C12.5667 22.7666 12.8 23.3333 12.8 24C12.8 24.6666 12.5667 25.2333 12.1 25.7C11.6333 26.1666 11.0667 26.4 10.4 26.4ZM24 26.4C23.3333 26.4 22.7667 26.1666 22.3 25.7C21.8333 25.2333 21.6 24.6666 21.6 24C21.6 23.3333 21.8333 22.7666 22.3 22.3C22.7667 21.8333 23.3333 21.6 24 21.6C24.6667 21.6 25.2333 21.8333 25.7 22.3C26.1667 22.7666 26.4 23.3333 26.4 24C26.4 24.6666 26.1667 25.2333 25.7 25.7C25.2333 26.1666 24.6667 26.4 24 26.4ZM37.6 26.4C36.9333 26.4 36.3667 26.1666 35.9 25.7C35.4333 25.2333 35.2 24.6666 35.2 24C35.2 23.3333 35.4333 22.7666 35.9 22.3C36.3667 21.8333 36.9333 21.6 37.6 21.6C38.2667 21.6 38.8333 21.8333 39.3 22.3C39.7667 22.7666 40 23.3333 40 24C40 24.6666 39.7667 25.2333 39.3 25.7C38.8333 26.1666 38.2667 26.4 37.6 26.4Z" />
        </svg>
      </button>

      {state && (
        <div className="absolute right-0 flex flex-col gap-2 shadow-md p-3 rounded-md bg-[color:var(--solarized-background)]">
          {embed?.map((url, index) => {
            const { host, href } = new URL(url)

            return (
              <a key={index} href={href} target="_blank" rel="noreferrer">
                {host}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
