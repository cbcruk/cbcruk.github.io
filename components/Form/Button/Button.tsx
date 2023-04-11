export function Button({ children, ...props }) {
  return (
    <button
      className="font-bold bg-[color:var(--solarized-background-highlight)] p-2 rounded-lg mt-2 text-[color:var(--solarized-violet)]"
      {...props}
    >
      {children}
    </button>
  )
}
