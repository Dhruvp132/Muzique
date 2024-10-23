'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

type AmountContextType = {
  amount: number
  setAmount: React.Dispatch<React.SetStateAction<number>>
}

const AmountContext = createContext<AmountContextType | undefined>(undefined)

export const AmountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    document.body.className = amount.toString()
  }, [amount])

  return (
    <AmountContext.Provider value={{ amount, setAmount }}>
      {children}
    </AmountContext.Provider>
  )
}

export const useAmount = () => {
  const context = useContext(AmountContext)
  if (context === undefined) {
    throw new Error('useAmount must be used within an AmountProvider')
  }
  return context
}
