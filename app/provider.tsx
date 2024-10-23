"use client"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
export function Providers ({children}: {
    children : React.ReactNode
} ) {
    return <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
     <SessionProvider>
        {children}
    </SessionProvider>
    </ThemeProvider>
}
//recoil, Theme Provider or any library this needs to be wrap our whol application 
// ideal way is to make our own user creaetd Contexc then wrap the application and wrap it in LayoutRouter.tsx 