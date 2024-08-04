const COLORS = [
  'yellow',
  'orange',
  'red',
  'magent',
  'violet',
  'blue',
  'cyan',
  'green',
]

export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length)

  return `var(--solarized-${COLORS[randomIndex]})`
}
