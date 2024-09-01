function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export function Today({ today = formatDate(new Date()) }) {
  return <span>{today}</span>
}

function rollDice(randomizer = Math.random) {
  return Math.ceil(randomizer() * 6)
}

export function DiceRoll({ randomizer = Math.random }) {
  return <span>{rollDice(randomizer)}</span>
}
