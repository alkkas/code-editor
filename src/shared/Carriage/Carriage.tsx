interface CarriageProps {
  fontSize: number
}

export const Carriage = ({ fontSize }: CarriageProps) => {
  return (
    <div
      style={{ width: fontSize, height: fontSize * 0.09 }}
      className="animate-blink"
    />
  )
}
