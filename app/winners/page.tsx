'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import type { Employee, Prize } from '../../types'
import { MedalIcon, MoveLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WinnersPage() {
  const [winners, setWinners] = useState<Array<{ employee: Employee; prize: Prize }>>([])
  const router = useRouter()

  useEffect(() => {
    // In a real application, you would fetch this data from an API or local storage
    const storedWinners = localStorage.getItem('winners')
    if (storedWinners) {
      setWinners(JSON.parse(storedWinners))
    }
  }, [])

  const getColor = (index: string) => {
    switch (index) {
      case '0':
        return '#FFD700'
      case '1':
        return '#FF4500'
      case '2':
        return '#1E90FF'
      case '3':
        return '#32CD32'
      case '4':
        return '#A9A9A9'
      default:
        return '#fff'
    }
  }

  return (
    <div className="min-h-screen bg-custom-gradient from-navy-900 via-purple-900 to-red-900 font-montserrat">
      <div className='absolute top-6 left-6 cursor-pointer'>
        <MoveLeftIcon size={40} strokeWidth={3} color='#fff' onClick={() => {
          router.back()
        }} />
      </div>
      <div className="container mx-auto space-y-12 py-20">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">Danh sách người trúng thưởng</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          {winners.slice().reverse().map((winner, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 px-8 mb-2 flex justify-between items-center"
            >
              <div className='space-y-2'>
                <div className='flex items-center gap-4'>
                  <MedalIcon size={45} strokeWidth={2} color={getColor(winner.prize.id)} />
                  <div className="font-bold text-white text-3xl">{winner.employee.name}</div>
                </div>
                <div className=" text-gray-400 text-2xl">{winner.employee.id}</div>
              </div>
              <div className="text-yellow-400 text-2xl font-bold">{winner.prize.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

