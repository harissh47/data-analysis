'use client'

import { useState, createContext, useContext, useEffect } from 'react'

type ThemeStyles = {
  background: string
  text: string
  icon: string
  card: string
}

export const ThemeContext = createContext<{
  themeStyles: ThemeStyles
  toggleTheme: () => void
  isDarkMode: boolean
}>({
  themeStyles: {
    background: 'bg-gray-100',
    text: 'text-[#000000]',
    icon: 'text-[#333333]',
    card: 'bg-white'
  },
  toggleTheme: () => {},
  isDarkMode: false
})

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const themeStyles = isDarkMode ? {
    background: 'bg-[#202020]',
    text: 'text-[#00FF00]',
    icon: 'text-[#FFFFFF]',
    card: 'bg-[#202020]'
  } : {
    background: 'bg-gray-100',
    text: 'text-[#000000]',
    icon: 'text-[#333333]',
    card: 'bg-white'
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('theme', (!isDarkMode).toString())
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'true'
    setIsDarkMode(savedTheme)
  }, [])

  return (
    <ThemeContext.Provider value={{ themeStyles, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}