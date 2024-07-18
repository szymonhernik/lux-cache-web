import { createContext, useContext, useState } from 'react'

interface HoverContextType {
  hoveredItem: string | null
  setHoveredItem: (item: string | null) => void
}
const HoverContext = createContext<HoverContextType | undefined>(undefined)

export const useHoverContext = () => {
  const context = useContext(HoverContext)
  if (!context) {
    throw new Error('useHoverContext must be used within a HoverProvider')
  }
  return context
}

export const HoverProvider = ({ children }: { children: React.ReactNode }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <HoverContext.Provider value={{ hoveredItem, setHoveredItem }}>
      {children}
    </HoverContext.Provider>
  )
}
