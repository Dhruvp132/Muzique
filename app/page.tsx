/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { Input } from "@/app/components/ui/input"
import { Users, Zap, Radio, Sun, Moon } from "lucide-react"
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from "@/app/contexts/ThemeContext"
import { getSession } from 'next-auth/react'
import { useCreator, useUserCreator } from './contexts/CreatorContext'


export default function Home() {
  const {setCreator} = useCreator(); 
  const {setUserCreator} = useUserCreator(); 
  const { theme, toggleTheme } = useTheme()
  const [showCreatorInput, setShowCreatorInput] = useState(false)
  const [creatorId, setCreatorId] = useState('')
  const router = useRouter()
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])

  const handleCreateStream = async () => {    
    const session = await getSession();
    if (session !== null) {
      router.push('/dashboard')
      const res = await fetch('/api/streams/my', {
        method : "GET", 
        credentials : 'include',
      })
      const json = await res.json();
      const creatorId = await json.id; 
      setCreator(creatorId )
    } else {
      router.push('/api/auth/signin')
    }
  }

  const handleJoinStream = () => {
    setShowCreatorInput(true)
  }

  const handleCreatorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (creatorId) {
      setUserCreator(creatorId);
      router.push(`/creator/${creatorId}`)
    }
  }

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      <button
        style={{ zIndex : 10 }}
        onClick={toggleTheme}
        className="fixed top-15 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-sm"
      >
        {theme === 'dark' ? <Sun className="text-purple-300" /> : <Moon className="text-purple-600" />}
      </button>

      <main className="flex-1">
        <motion.section
          style={{ opacity, scale }}
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className={`text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none ${theme === 'dark' ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300' : 'text-purple-800'}`}>
                  Let Your Fans Choose the Soundtrack
                </h1>
                <p className={`mx-auto max-w-[700px] ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'} md:text-xl`}>
                  Connect with your audience like never before. Let them influence your music in real-time.
                </p>
              </div>
              <div className="space-y-4 w-full max-w-sm">
                {!showCreatorInput ? (
                  <>
                    <Button
                      onClick={handleCreateStream}
                      className={`w-full ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                    >
                      Create a Stream
                    </Button>
                    <Button
                      onClick={handleJoinStream}
                      variant="outline"
                      className={`w-full ${theme === 'dark' ? 'border-purple-300 text-purple-300 hover:bg-purple-800' : 'border-purple-600 text-purple-700 hover:bg-purple-100'}`}
                    >
                      Join a Creator's Stream
                    </Button>
                  </>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleCreatorSubmit}
                    className="flex flex-col space-y-2"
                  >
                    <Input
                      className={`${theme === 'dark' ? 'bg-purple-800/90 text-purple-100 placeholder-purple-300' : 'bg-white text-purple-900 placeholder-purple-400 border-purple-200'}`}
                      placeholder="Enter the creator ID"
                      value={creatorId}
                      onChange={(e) => setCreatorId(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className={`${theme === 'dark' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                    >
                      Join Stream
                    </Button>
                  </motion.form>
                )}
              </div>
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`w-full py-12 md:py-24 lg:py-32 ${theme === 'dark' ? 'bg-purple-900' : 'bg-gray-50'}`}
        >
          <div className="container px-4 md:px-6">
            <h2 className={`text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>Key Features</h2>
            <div className="grid gap-6 items-center md:grid-cols-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg ${theme === 'dark' ? 'bg-purple-800' : 'bg-white shadow-md'}`}
              >
                <Users className={`h-12 w-12 mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} />
                <h3 className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Fan Interaction</h3>
                <p className={`text-sm text-center ${theme === 'dark' ? 'text-purple-200' : 'text-purple-600'}`}>
                  Let fans vote on the next song or genre.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg ${theme === 'dark' ? 'bg-purple-800' : 'bg-white shadow-md'}`}
              >
                <Zap className={`h-12 w-12 mb-2 ${theme === 'dark' ? 'text-pink-300' : 'text-pink-500'}`} />
                <h3 className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}>Real-time Updates</h3>
                <p className={`text-sm text-center ${theme === 'dark' ? 'text-purple-200' : 'text-purple-600'}`}>
                  See live changes to your playlist.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg ${theme === 'dark' ? 'bg-purple-800' : 'bg-white shadow-md'}`}
              >
                <Radio className={`h-12 w-12 mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`} />
                <h3 className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Multi-platform</h3>
                <p className={`text-sm text-center ${theme === 'dark' ? 'text-purple-200' : 'text-purple-600'}`}>
                  Stream on multiple platforms simultaneously.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`w-full py-12 md:py-24 lg:py-32 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-700 to-purple-600' : 'bg-gradient-to-r from-purple-100 to-white'}`}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className={`text-3xl font-bold tracking-tighter sm:text-4xl ${theme === 'dark' ? 'text-white' : 'text-purple-800'}`}>
                  Ready to revolutionize your streams?
                </h2>
                <p className={`max-w-[600px] ${theme === 'dark' ? 'text-purple-100' : 'text-purple-700'} md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
                  Join our platform and start creating unforgettable experiences for your fans.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className={`max-w-lg flex-1 ${theme === 'dark' ? 'bg-purple-800/90 text-purple-100 placeholder-purple-300' : 'bg-white text-purple-900 placeholder-purple-400 border-purple-200'}`}
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    className={`${theme === 'dark' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                  >
                    Sign Up
                  </Button>
                </form>
                <p className={`text-xs ${theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}`}>
                  By signing up, you agree to our{" "}
                  <Link className={`underline underline-offset-2 ${theme === 'dark' ? 'hover:text-white' : 'hover:text-purple-900'}`} href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <footer className={`flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t ${theme === 'dark' ? 'bg-purple-900/80 backdrop-blur-sm border-purple-800' : 'bg-white/80 backdrop-blur-sm border-purple-100'}`}>
        <p className={`text-xs ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>© 2023 MusicStream. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className={`text-xs hover:underline underline-offset-4 ${theme === 'dark' ? 'text-purple-300 hover:text-purple-100' : 'text-purple-700 hover:text-purple-900'}`} href="#">
            Terms of Service
          </Link>
          <Link className={`text-xs hover:underline underline-offset-4 ${theme === 'dark' ? 'text-purple-300 hover:text-purple-100' : 'text-purple-700 hover:text-purple-900'}`} href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}