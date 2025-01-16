'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmployeeInput } from '../components/employee-input'
import { PrizeConfig } from '../components/prize-config'
import { SpinningWheel } from '../components/spinning-wheel'
import confetti from 'canvas-confetti'
import type { Employee, Prize, DrawSettings } from '../types'
import { AlignLeftIcon, ChevronLeftIcon, ChevronRight, ChevronRightIcon, DeleteIcon, MoveRightIcon, SettingsIcon, TrashIcon, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useSoundEffect } from '../hooks/use-sound-effect'
import { set } from 'date-fns'
import Image from 'next/image'

export default function LuckyDraw() {
  const [settings, setSettings] = useState<DrawSettings>({
    title: 'QUAY SỐ MAY MẮN',
    prizes: [
      { id: '1', name: 'Giải Nhất', enabled: true },
      { id: '2', name: 'Giải Nhì', enabled: true },
      { id: '3', name: 'Giải Ba', enabled: true },
    ]
  })

  const [employees, setEmployees] = useState<Employee[]>([])

  const [currentWinner, setCurrentWinner] = useState<Employee | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>({ id: '3', name: 'Giải Ba', enabled: true })
  const [winners, setWinners] = useState<Array<{ employee: Employee; prize: Prize }>>([])
  const [remainingParticipants, setRemainingParticipants] = useState<Employee[]>([])
  const [winner, setWinner] = useState<Employee | undefined>(undefined);
  const [winnerSave, setWinnerSave] = useState<Array<{ employee: Employee; prize: Prize }>>([])
  const [isReload, setIsReload] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees')
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    }
    const storedWinners = localStorage.getItem('winners')
    if (storedWinners) {
      setWinnerSave(JSON.parse(storedWinners))
    }
  }, [])

  const { play: playSpinSound, stop: stopSpinSound, isSupported: isSoundSupported } = useSoundEffect('/spin-sound.mp3')

  useEffect(() => {
    setRemainingParticipants(employees)
  }, [employees])

  const handleSpin = () => {
    if (isSpinning || !selectedPrize) return
    setIsSpinning(true)
    setCurrentWinner(null)
    const randomWinner = remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)];
    setWinner(randomWinner);
    if (isSoundSupported) {
      playSpinSound()
    }
    setIsReload(false)
  }

  const handleSpinComplete = (winner: Employee) => {
    if (!selectedPrize) return;
    const updatedWinners = [...winnerSave, { employee: winner, prize: selectedPrize }];
    setWinnerSave(updatedWinners);
    localStorage.setItem('winners', JSON.stringify(updatedWinners));
    setCurrentWinner(winner)
    setIsSpinning(false)
    if (isSoundSupported) {
      stopSpinSound()
    }
    setWinners(prev => [...prev, { employee: winner, prize: selectedPrize }])
    setRemainingParticipants(prev => prev.filter(emp => emp.id !== winner.id))
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    setWinner(undefined);
    setIsSuccess(true);
  }

  // useEffect(() => {
  //   localStorage.setItem('winners', JSON.stringify(winners))
  // }, [winners])

  // useEffect(() => {
  //   // In a real application, you would fetch this data from an API or local storage
  //   const storedWinners = localStorage.getItem('winners')
  //   if (storedWinners) {
  //     setWinnerSave(JSON.parse(storedWinners))
  //   }
  // }, [winners])


  // const nextPrize = () => {
  //   const index = settings?.prizes?.findIndex(p => p.id === selectedPrize?.id)
  //   const nextIndex = (index + 1) % settings?.prizes?.length
  //   const nextPrize = settings?.prizes?.[nextIndex]
  //   setSelectedPrize(nextPrize)
  // }

  const backPrize = () => {
    const index = settings?.prizes?.findIndex(p => p.id === selectedPrize?.id)
    if (index === 0) {
      const nextPrize = settings?.prizes?.[settings.prizes.length - 1];
      setSelectedPrize(nextPrize);
      return;
    }
    const nextIndex = (index - 1) % settings?.prizes?.length
    const nextPrize = settings?.prizes?.[nextIndex]
    setSelectedPrize(nextPrize)
  }

  const nextPrize = () => {
    const index = settings?.prizes?.findIndex(p => p.id === selectedPrize?.id)
    const nextIndex = (index + 1) % settings?.prizes?.length
    const nextPrize = settings?.prizes?.[nextIndex]
    setSelectedPrize(nextPrize)
  }

  return (
    <div className='relative'>
      <div className="min-h-screen bg-custom-gradient from-navy-900 via-purple-900 to-red-900 font-montserrat relative">
        <div className="container mx-auto px-4 py-8">
          <Button size={'icon'} onClick={() => setIsSetting(prev => !prev)} className="absolute top-4 right-4 bg-transparent">
            <SettingsIcon className="text-white" />
          </Button>

          {/* Main Draw Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
              {settings.title}
            </h1>

            <div className='my-4 text-4xl h-[40px]'>
              {currentWinner && (
                <div className="font-bold text-yellow-400 mt-4 text-center">
                  <div>{currentWinner.name}</div>
                </div>
              )}
            </div>

            {/* Prize Selection */}
            <div className="flex justify-center items-center gap-4 mb-8">
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
              <ChevronLeftIcon size={48} className='text-yellow-400 cursor-pointer' onClick={() => backPrize()} />
              {selectedPrize && (
                // <Button
                //   variant="outline"
                //   className={`border-yellow-500 text-[#ffda56] bg-[#c1392b] min-h-[70px] min-w-[200px] text-4xl px-8`}
                //   onClick={() => nextPrize()}
                // >
                //   {selectedPrize.name} <Trophy size={48} className="ml-2 w-full h-full" />
                // </Button>
                <div className='flex gap-2 rounded-2xl justify-center items-center border-solid border-[3px] border-yellow-500 text-[#ffda56] bg-[#c1392b] min-h-[70px] w-fit text-4xl p-4 px-8'>
                  <div className='font-bold min-w-[190px]'>
                    {selectedPrize.name}
                  </div>
                  <Trophy size={30} />
                </div>
              )}
              <ChevronRightIcon size={48} className='text-yellow-400 cursor-pointer' onClick={() => nextPrize()} />
            </div>

            {/* Spinning Wheel */}
            <div className="mb-8">
              <SpinningWheel
                isSpinning={isSpinning}
                onComplete={handleSpinComplete}
                participants={remainingParticipants}
                selectedPrize={selectedPrize}
                winnerTemp={winner}
                isReload={isReload}
              />
            </div>

            {/* Spin Button */}
            <div className='flex items-center justify-center gap-4'>
              {!isSpinning && (<>
                {!isSuccess && <Button
                  size="lg"
                  onClick={handleSpin}
                  disabled={isSpinning || !selectedPrize || remainingParticipants.length === 0}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 mb-8"
                >
                  QUAY SỐ
                </Button>}

                {isSuccess && <Button
                  size="lg"
                  onClick={() => {
                    setIsReload(true)
                    setIsSuccess(false)
                  }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 mb-8"
                >
                  TIẾP TỤC
                </Button>}
              </>)}

            </div>
            <div className="text-xl text-yellow-400 mb-2">
              Tổng số người tham gia: {remainingParticipants.length}
            </div>
            {winnerSave.length > 0 &&
              <div className="mt-4">
                <div className='text-yellow-400 text-3xl'>Danh sách người trúng thưởng</div>
              </div>
            }

          </div>

          <div className="max-w-3xl mx-auto">
            {winnerSave.slice().reverse().map((winner, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-4 mb-2 flex justify-between items-center relative"
              >
                <div>
                  <div className="font-bold text-white">{winner.employee.name}</div>
                  <div className="text-sm text-gray-400">{winner.employee.id}</div>
                </div>
                <div className="text-yellow-400">{winner.prize.name}</div>
                <div className="absolute right-[-30px] group">
                  <div className='h-[20px] w-[20px] opacity-0 group-hover:opacity-100 cursor-pointer' onClick={() => {
                    const updatedWinners = winnerSave.filter((item, i) => item.employee.id !== winner.employee.id)
                    setWinnerSave(updatedWinners)
                    localStorage.setItem('winners', JSON.stringify(updatedWinners))
                  }}>
                    <TrashIcon className='text-white transition-opacity duration-300' />
                  </div>
                </div>
              </div>
            ))}
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
      <div className='fixed right-14 bottom-11'>
        <img width="250" height="auto" src="https://dev-id.dcorp.com.vn/resources/129gn/login/dcorp/dist/images/dcorp-logo-footer-light.svg"></img>
      </div>
    </div>
  )
}

