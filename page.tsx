'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmployeeInput } from './components/employee-input'
import { PrizeConfig } from './components/prize-config'
import { NumberReveal } from './components/number-reveal'
import confetti from 'canvas-confetti'
import type { Employee, Prize, DrawSettings } from './types'
import { Trophy } from 'lucide-react'

export default function LuckyDraw() {
  const [settings, setSettings] = useState<DrawSettings>({
    title: 'LUCKY DRAW',
    prizes: [
      { id: '1', name: 'First Prize', enabled: true },
      { id: '2', name: 'Second Prize', enabled: true },
      { id: '3', name: 'Third Prize', enabled: true },
    ]
  })
  
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentWinner, setCurrentWinner] = useState<Employee | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)

  const handleSpin = () => {
    if (isSpinning || !selectedPrize) return
    
    setIsSpinning(true)
    setCurrentWinner(null)

    // Simulate spinning animation
    setTimeout(() => {
      const availableEmployees = employees.filter(emp => 
        !winners.some(w => w.employee.id === emp.id)
      )
      
      if (availableEmployees.length === 0) {
        alert('No more eligible employees!')
        setIsSpinning(false)
        return
      }

      const winner = availableEmployees[
        Math.floor(Math.random() * availableEmployees.length)
      ]
      
      setCurrentWinner(winner)
      setIsSpinning(false)
      setIsRevealing(true)
    }, 2000)
  }

  const [winners, setWinners] = useState<Array<{
    employee: Employee
    prize: Prize
  }>>([])

  const handleRevealComplete = () => {
    setIsRevealing(false)
    if (currentWinner && selectedPrize) {
      setWinners(prev => [...prev, {
        employee: currentWinner,
        prize: selectedPrize
      }])
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-purple-900 to-red-900">
      <div className="container mx-auto px-4 py-8">
        {/* Settings Section */}
        <div className="mb-8 space-y-4">
          <Input
            value={settings.title}
            onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
            className="text-center text-2xl font-bold"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EmployeeInput onSubmit={setEmployees} />
            <PrizeConfig
              prizes={settings.prizes}
              onUpdate={(prizes) => setSettings(prev => ({ ...prev, prizes }))}
            />
          </div>
        </div>

        {/* Main Draw Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-8">
            {settings.title}
          </h1>

          {/* Prize Selection */}
          <div className="flex justify-center gap-4 mb-8">
            {settings.prizes.filter(p => p.enabled).map((prize) => (
              <Button
                key={prize.id}
                variant="outline"
                className={`border-yellow-500 ${
                  selectedPrize?.id === prize.id 
                    ? 'bg-yellow-500/20' 
                    : 'hover:bg-yellow-500/20'
                }`}
                onClick={() => setSelectedPrize(prize)}
              >
                {prize.name} <Trophy className="ml-2 h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Number Display */}
          <div className="mb-8">
            {true ? (
              <NumberReveal
                number={currentWinner.id}
                isRevealing={true}
                onComplete={handleRevealComplete}
              />
            ) : (
              <div className="h-16" />
            )}
            {currentWinner && !isRevealing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-2xl font-bold text-yellow-400"
              >
                {currentWinner.name}
              </motion.div>
            )}
          </div>

          {/* Spin Button */}
          <Button
            size="lg"
            onClick={handleSpin}
            disabled={isSpinning || !selectedPrize || employees.length === 0}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 mb-8"
          >
            {isSpinning ? 'Spinning...' : 'SPIN'}
          </Button>

          {/* Winners List */}
          <div className="max-w-md mx-auto">
            {winners.map((winner, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-4 mb-2 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{winner.employee.name}</div>
                  <div className="text-sm text-gray-400">{winner.employee.id}</div>
                </div>
                <div className="text-yellow-400">{winner.prize.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

