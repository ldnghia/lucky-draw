'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmployeeInput } from '../components/employee-input'
import { PrizeConfig } from '../components/prize-config'
import { SpinningWheel } from '../components/spinning-wheel'
import confetti from 'canvas-confetti'
import type { Employee, Prize, DrawSettings } from '../types'
import { ChevronLeftIcon, ChevronRight, ChevronRightIcon, SettingsIcon, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useSoundEffect } from '../hooks/use-sound-effect'
import { set } from 'date-fns'

export default function LuckyDraw() {
  const [settings, setSettings] = useState<DrawSettings>({
    title: 'QUAY SỐ MAY MẮN',
    prizes: [
      { id: '1', name: 'Giải Nhất', enabled: true },
      { id: '2', name: 'Giải Nhì', enabled: true },
      { id: '3', name: 'Giải Ba', enabled: true },
    ]
  })

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '12345', name: 'Nguyễn Văn A' },
    { id: '12346', name: 'Trần Thị B' },
    { id: '12347', name: 'Lê Văn C' },
  ])
  const [currentWinner, setCurrentWinner] = useState<Employee | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>({ id: '3', name: 'Giải Ba', enabled: true })
  const [winners, setWinners] = useState<Array<{ employee: Employee; prize: Prize }>>([])
  const [remainingParticipants, setRemainingParticipants] = useState<Employee[]>([])

  const { play: playSpinSound, stop: stopSpinSound, isSupported: isSoundSupported } = useSoundEffect('/spin-sound.mp3')

  useEffect(() => {
    setRemainingParticipants(employees)
  }, [employees])

  const handleSpin = () => {
    if (isSpinning || !selectedPrize) return
    setIsSpinning(true)
    setCurrentWinner(null)
    if (isSoundSupported) {
      playSpinSound()
    }
  }

  const handleSpinComplete = (winner: Employee) => {
    setCurrentWinner(winner)
    setIsSpinning(false)
    if (isSoundSupported) {
      stopSpinSound()
    }
    if (selectedPrize) {
      setWinners(prev => [...prev, { employee: winner, prize: selectedPrize }])
      setRemainingParticipants(prev => prev.filter(emp => emp.id !== winner.id))
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  useEffect(() => {
    localStorage.setItem('winners', JSON.stringify(winners))
  }, [winners])

  const nextPrize = () => {
    const index = settings?.prizes?.findIndex(p => p.id === selectedPrize?.id)
    const nextIndex = (index + 1) % settings?.prizes?.length
    const nextPrize = settings?.prizes?.[nextIndex]
    setSelectedPrize(nextPrize)
  }

  return (
    <div className="min-h-screen bg-custom-gradient from-navy-900 via-purple-900 to-red-900 font-montserrat">
      <div className="container mx-auto px-4 py-8">
        <Button size={'icon'} onClick={() => setIsSetting(prev => !prev)} className="absolute top-4 right-4 bg-transparent">
          <SettingsIcon className="text-white" />
        </Button>

        {/* Main Draw Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            {settings.title}
          </h1>

          <div className="text-xl text-yellow-400 mb-4">
            Tổng số người tham gia: {remainingParticipants.length}
          </div>

          <div className='my-4 text-4xl'>
            {currentWinner && (
              <div className="font-bold text-yellow-400 mt-4 text-center">
                <div>{currentWinner.name}</div>
              </div>
            )}
          </div>

          {/* Prize Selection */}
          <div className="flex justify-center gap-4 mb-8">
            {/* {settings.prizes.filter(p => p.enabled).map((prize) => (
              <Button
                key={prize.id}
                variant="outline"
                className={`border-yellow-500 text-[#ffda56] bg-[#c1392b] min-h-[60px] text-2xl ${selectedPrize?.id === prize.id
                  ? 'bg-[#c1392b]'
                  : 'hover:bg-yellow-500/20'
                  }`}
                onClick={() => setSelectedPrize(prize)}
              >
                {prize.name} <Trophy className="ml-2 h-4 w-4" />
              </Button>
            ))} */}
            {selectedPrize && (
              <Button
                variant="outline"
                className={`border-yellow-500 text-[#ffda56] bg-[#c1392b] min-h-[60px] text-2xl`}
                onClick={() => nextPrize()}
              >
                {selectedPrize.name} <Trophy className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Spinning Wheel */}
          <div className="mb-8">
            <SpinningWheel
              isSpinning={isSpinning}
              onComplete={handleSpinComplete}
              participants={remainingParticipants}
              selectedPrize={selectedPrize}
            />
          </div>

          {/* Spin Button */}
          <Button
            size="lg"
            onClick={handleSpin}
            disabled={isSpinning || !selectedPrize || remainingParticipants.length === 0}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 mb-8"
          >
            {isSpinning ? 'Đang quay...' : 'QUAY SỐ'}
          </Button>

          <div className="mt-8">
            <Link href="/winners" className="text-yellow-400 hover:underline">
              Xem danh sách người trúng thưởng
            </Link>
          </div>
        </div>

        {/* Settings Section */}
        {isSetting &&
          <div className="mt-16 space-y-4">
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
          </div>}
      </div>
    </div>
  )
}

