'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

type CreatorContextType = {
  creator: string
  setCreator: React.Dispatch<React.SetStateAction<string>>
}

type UserCreatorContextType = {
    userCreator : string, 
    setUserCreator: React.Dispatch<React.SetStateAction<string>>
}   
const CreatorContext = createContext<CreatorContextType | undefined>(undefined)
const UserCreatorContext = createContext<UserCreatorContextType | undefined>(undefined);
export const CreatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creator, setCreator] = useState("")

  useEffect(() => {
    document.body.className = creator.toString()
  }, [creator])

  return (
    <CreatorContext.Provider value={{ creator, setCreator }}>
      {children}
    </CreatorContext.Provider>
  )
}


export const UserCreatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userCreator, setUserCreator] = useState("")
  
    useEffect(() => {
      document.body.className = userCreator.toString()
    }, [userCreator])
  
    return (
      <UserCreatorContext.Provider value={{ userCreator, setUserCreator }}>
        {children}
      </UserCreatorContext.Provider>
    )
  }

export const useCreator = () => {
  const context = useContext(CreatorContext)
  if (context === undefined) {
    throw new Error('useCreator must be used within an CreatorProvider')
  }
  return context
}

export const useUserCreator = () => {
    const context = useContext(UserCreatorContext); 
    if (context === undefined) {
        throw new Error('useuserCreator must be used within an CreatorProvider')
      }
      return context
}