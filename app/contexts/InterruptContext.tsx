'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

type InterruptContextType = {
  interrupt: number
  setInterrupt: React.Dispatch<React.SetStateAction<number>>
}

const InterruptContext = createContext<InterruptContextType | undefined>(undefined)

export const InterruptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interrupt, setInterrupt] = useState(0)

  useEffect(() => {
    document.body.className = interrupt.toString()
  }, [interrupt])

  return (
    <InterruptContext.Provider value={{ interrupt, setInterrupt }}>
      {children}
    </InterruptContext.Provider>
  )
}

export const useInterrupt = () => {
  const context = useContext(InterruptContext)
  if (context === undefined) {
    throw new Error('useInterrupt must be used within an InterruptProvider')
  }
  return context
}
