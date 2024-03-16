interface CarriageProps {
  fontSize: number
  left: number
  top: number
}

const CARRIAGE_WIDTH_COEFFICIENT = 0.092

export const Carriage = ({ fontSize, top, left }: CarriageProps) => {
  return (
    <div
      style={{
        height: fontSize,
        width: fontSize * CARRIAGE_WIDTH_COEFFICIENT,
        top,
        left,
      }}
      className="animate-blink bg-primary absolute"
    />
  )
}
