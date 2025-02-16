const COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'magenta  ',
]

export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length)

  return `var(--flexoki-${COLORS[randomIndex]}-400)`
}
