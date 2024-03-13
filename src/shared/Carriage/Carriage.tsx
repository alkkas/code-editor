interface CarriageProps {
  fontSize: number
}

const CARRIAGE_WIDTH_COEFFICIENT = 0.092

export const Carriage = ({ fontSize }: CarriageProps) => {
  return (
    <div
      style={{ height: fontSize, width: fontSize * CARRIAGE_WIDTH_COEFFICIENT }}
      className="animate-blink bg-primary"
    />
  )
}
