// @ts-check
import clsx from 'clsx'
import { useKBar } from 'kbar'

function Header({ children }) {
  const kbar = useKBar()

  return (
    <div className="flex justify-between sticky top-0 z-10 p-4 bg-[color:var(--solarized-background-highlight)] text-[color:var(--solarized-emphasized)]">
      {children}

      <button
        className="flex items-center py-1 px-2 rounded-full bg-gray-800 text-md"
        onClick={() => {
          kbar.query.toggle()
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 0 24 24"
          width="20px"
          fill="#fff"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <span className="flex items-center ml-2">
          {['⌘', 'K'].map((key) => {
            const isK = key === 'K'

            return (
              <span
                key={key}
                className={clsx(
                  'inline-flex items-center justify-center bg-gradient-to-b from-slate-700 to-indigo-900 rounded-lg shadow-lg w-[20px] h-[18px]',
                  {
                    'text-sm': isK,
                    'ml-1': isK,
                  }
                )}
              >
                {key}
              </span>
            )
          })}
        </span>
      </button>
    </div>
  )
}

export default Header
