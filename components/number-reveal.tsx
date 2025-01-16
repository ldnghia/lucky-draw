'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NumberRevealProps {
  number: string
  isRevealing: boolean
  onComplete: () => void
}

export function NumberReveal({ number, isRevealing, onComplete }: NumberRevealProps) {
  const [revealedDigits, setRevealedDigits] = useState<string[]>([])
  
  useEffect(() => {
    if (isRevealing) {
      const digits = number.split('')
      let currentIndex = 0
      
      const interval = setInterval(() => {
        if (currentIndex < digits.length) {
          setRevealedDigits(prev => [...prev, digits[currentIndex]])
          currentIndex++
        } else {
          clearInterval(interval)
          onComplete()
        }
      }, 500)

      return () => clearInterval(interval)
    } else {
      setRevealedDigits([])
    }
  }, [isRevealing, number, onComplete])

  return (
    <div className="flex gap-2 justify-center text-6xl font-mono">
      <AnimatePresence>
        {revealedDigits.map((digit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-12 h-16 bg-yellow-400/20 flex items-center justify-center rounded"
          >
            {digit}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

