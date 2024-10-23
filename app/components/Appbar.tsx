'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Music, Moon, Sun } from "lucide-react"
import { useTheme } from "@/app/contexts/ThemeContext"

export function Appbar() {
  const { theme, toggleTheme } = useTheme()
  const session = useSession()

  return (
    <header className={`px-4 lg:px-6 h-14 flex items-center ${theme === 'dark' ? 'bg-purple-900/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm border-b border-purple-100'}`}>
      <Link className="flex items-center justify-center" href="#">
        <Music className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} />
        <span className={`ml-2 font-bold text-xl ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>MusicStream</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:text-purple-100' : 'text-purple-600 hover:text-purple-800'}`} href="/">
          Features
        </Link>
        <Link className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:text-purple-100' : 'text-purple-600 hover:text-purple-800'}`} href="/user/plans">
          Pricing
        </Link>
        <Link className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:text-purple-100' : 'text-purple-600 hover:text-purple-800'}`} href="/contact">
          Contact
        </Link>
      </nav>
      <Button
        variant="ghost"
        size="icon"
        className={`ml-4 ${theme === 'dark' ? 'text-purple-200 hover:text-purple-100 hover:bg-purple-800' : 'text-purple-600 hover:text-purple-800 hover:bg-purple-100'}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        )}
      </Button>
      <div>
        {session.data?.user && (
          <Button 
            className={`m-2 p-2 ${theme === 'dark' ? 'bg-violet-400 hover:bg-violet-500' : 'bg-purple-600 hover:bg-purple-700 text-white'}`} 
            onClick={() => signOut()}
          >
            Log Out
          </Button>
        )}
        {!session.data?.user && (
          <Button 
            className={`m-2 p-2 ${theme === 'dark' ? 'bg-violet-400 hover:bg-violet-500' : 'bg-purple-600 hover:bg-purple-700 text-white'}`} 
            onClick={() => signIn()}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  )
}