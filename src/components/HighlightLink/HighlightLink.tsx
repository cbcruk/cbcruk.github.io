export function HighlightLink({ children, ...props }) {
  return (
    <a
      {...props}
      className="p-0.5 rounded-md cursor-pointer hover:bg-[--flexoki-yellow-200] hover:text-[var(--flexoki-black)] transition-all"
    >
      {children}
    </a>
  )
}
