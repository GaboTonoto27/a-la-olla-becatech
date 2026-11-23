import { useEffect, useState } from 'react'

// Hora actual que se refresca sola (para relojes de cuenta regresiva).
export function useAhora(cadaMs = 20000) {
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), cadaMs)
    return () => clearInterval(id)
  }, [cadaMs])
  return ahora
}
