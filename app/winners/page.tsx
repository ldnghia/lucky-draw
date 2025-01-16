'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import type { Employee, Prize } from '../../types'

export default function WinnersPage() {
  const [winners, setWinners] = useState<Array<{employee: Employee; prize: Prize}>>([])

  useEffect(() => {
    // In a real application, you would fetch this data from an API or local storage
    const storedWinners = localStorage.getItem('winners')
    if (storedWinners) {
      setWinners(JSON.parse(storedWinners))
    }
  }, [])

  return (
    <div className="min-h-screen bg-custom-gradient from-navy-900 via-purple-900 to-red-900 font-montserrat">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Danh sách người trúng thưởng</h1>
        <div className="max-w-3xl mx-auto">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 mb-2 flex justify-between items-center"
            >
              <div>
                <div className="font-bold text-white">{winner.employee.name}</div>
                <div className="text-sm text-gray-400">{winner.employee.id}</div>
              </div>
              <div className="text-yellow-400">{winner.prize.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              Quay lại trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

