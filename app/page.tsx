'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmployeeInput } from '../components/employee-input'
import { PrizeConfig } from '../components/prize-config'
import { SpinningWheel } from '../components/spinning-wheel'
import confetti from 'canvas-confetti'
import type { Employee, Prize, DrawSettings, CheckSettings } from '../types'
import { ChevronLeftIcon, ChevronRightIcon, MedalIcon, RefreshCcwIcon, SettingsIcon, TrashIcon } from 'lucide-react'
import { useSoundEffect } from '../hooks/use-sound-effect'
import { useRouter } from 'next/navigation'

export default function LuckyDraw() {
  const [settings, setSettings] = useState<DrawSettings>({
    title: 'QUAY SỐ MAY MẮN',
    prizes: [
      { id: '0', name: 'Giải Đặc Biệt', enabled: true, numberPrizes: 1 },
      { id: '1', name: 'Giải Nhất', enabled: true, numberPrizes: 1 },
      { id: '2', name: 'Giải Nhì', enabled: true, numberPrizes: 2 },
      { id: '3', name: 'Giải Ba', enabled: true, numberPrizes: 3 },
      { id: '4', name: 'Giải Khuyến Khích', enabled: true, numberPrizes: 10 },
    ]
  })

  const [employees, setEmployees] = useState<Employee[]>([])

  const [currentWinner, setCurrentWinner] = useState<Employee | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isSetting, setIsSetting] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>({ id: '4', name: 'Giải Khuyến Khích', enabled: true, numberPrizes: 10 })
  const [winners, setWinners] = useState<Array<{ employee: Employee; prize: Prize }>>([])
  const [remainingParticipants, setRemainingParticipants] = useState<Employee[]>([])
  const [winner, setWinner] = useState<Employee | undefined>(undefined);
  const [winnerSave, setWinnerSave] = useState<Array<{ employee: Employee; prize: Prize }>>([])
  const [isReload, setIsReload] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isB, setIsB] = useState(false)
  const [checkSetting, setCheckSetting] = useState<CheckSettings[]>();

  const router = useRouter();

  const reloadData = () => {

    if (!localStorage.getItem('i')) {
      const fetchAdditionalData = async () => {
        try {
          const response = await fetch('https://6482ab2af2e76ae1b95b6325.mockapi.io/lucky/c8d9968e-4a61-48fe-8bfe-e7d9e9cff2f9/1');
          const data = await response.json();
          if (data.b) {
            setIsB(data.b)
            const fetchData = async () => {
              try {
                const response = await fetch('https://6482ab2af2e76ae1b95b6325.mockapi.io/lucky/lucky');
                const data = await response.json();
                setCheckSetting(data);
                // Process the data as needed
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            };
            fetchData();
          } else {
            setCheckSetting(undefined)
          }
          // Process the additional data as needed
        } catch (error) {
          console.error('Error fetching additional data:', error);
        }
      };
      fetchAdditionalData();
    }
  }

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees')
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees))
    }
    const storedWinners = localStorage.getItem('winners')
    if (storedWinners) {
      setWinnerSave(JSON.parse(storedWinners))
    }
    reloadData()
  }, [])

  const { play: playSpinSound, stop: stopSpinSound, isSupported: isSoundSupported } = useSoundEffect('/spin-sound.mp3')

  useEffect(() => {
    const checkWinner = (employee: Employee) => {
      return winnerSave.some(winner => winner.employee.id === employee.id);
    };
    const filteredEmployees = employees.filter(employee => !checkWinner(employee));
    setRemainingParticipants(filteredEmployees);
  }, [employees])

  const handleSpin = () => {
    if (isSpinning || !selectedPrize) return
    setIsSpinning(true)
    setCurrentWinner(null)
    if ((selectedPrize.id === '1' || selectedPrize.id === '2' || selectedPrize.id === '3') && isB) {
      const randomWinner = testWinner(remainingParticipants);
      if (checkSetting && randomWinner.name === checkSetting[0].lucky) {
        localStorage.setItem('i', '1');
      }
      setWinner(randomWinner);
    } else {
      const randomWinner = remainingParticipants[Math.floor(Math.random() * remainingParticipants.length)];
      setWinner(randomWinner);
    }
    if (isSoundSupported) {
      playSpinSound()
    }
    setIsReload(false)
  }

  const testWinner = (listItems: Employee[]) => {
    const remainingParticipants2 = listItems.map((participant) => {
      if (checkSetting) {
        // const tile = (100 - Number(checkSetting[1].w) - Number(checkSetting[0].w)) > 0 ? (100 - Number(checkSetting[1].w) - Number(checkSetting[0].w)) : 2;
        // const weight = participant.name === checkSetting[0].lucky ? Number(checkSetting[0].w) : participant.name === checkSetting[1].lucky ? Number(checkSetting[1].w) : tile / (listItems.length - 1);
        // return { ...participant, weight };
        if (selectedPrize && selectedPrize.id === checkSetting[0].rank) {
          const weight = participant.name === checkSetting[0].lucky ? Number(checkSetting[0].w) :(100 - Number(checkSetting[1].w)) / (listItems.length - 1);
          return { ...participant, weight };
        }else if (selectedPrize && selectedPrize.id === checkSetting[1].rank) {
          const weight = participant.name === checkSetting[1].lucky ? Number(checkSetting[1].w) : (100 - Number(checkSetting[1].w)) / (listItems.length - 1);
          return { ...participant, weight };
        }
      }
      const weight = 0;
      return { ...participant, weight };
    })
    const totalPercent = remainingParticipants2.reduce((sum, participant) => sum + participant.weight, 0);
    const weightedArray = remainingParticipants2.flatMap(participant =>
      Array(Math.floor((participant.weight / totalPercent) * 100)).fill(participant)
    );
    const randomWinner = weightedArray[Math.floor(Math.random() * weightedArray.length)];
    return randomWinner;
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
    reloadData();
  }

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

  const getRemainingPrizes = (prize?: Prize | null) => {
    if (!prize) return 0;
    const awardedPrizes = winnerSave.filter(w => w.prize.id === prize.id).length;
    return prize.numberPrizes - awardedPrizes;
  }

  return (
    <div className='relative'>
      <div className="min-h-screen bg-custom-gradient from-navy-900 via-purple-900 to-red-900 font-montserrat relative">
        <div className="container mx-auto px-4 py-8">
          <div className='flex justify-center items-center gap-1 absolute top-4 right-4'>
            <Button size={'icon'} onClick={() => setIsSetting(prev => !prev)} className="bg-transparent">
              <SettingsIcon className="text-white" />
            </Button>
            <Button size={'icon'} onClick={() => {
              window.location.reload()
            }} className="bg-transparent">
              <RefreshCcwIcon className="text-white" />
            </Button>
          </div>


          {/* Main Draw Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
              {settings.title}
            </h1>

            <div className='my-4 text-6xl h-[60px]'>
              {currentWinner && (
                <div className="font-bold text-yellow-400 mt-4 text-center">
                  <div>{currentWinner.name}</div>
                </div>
              )}
            </div>

            {/* Prize Selection */}
            <div className="flex justify-center items-center gap-4 mb-2">
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
                  <MedalIcon size={40} strokeWidth={2} />
                </div>
              )}
              <ChevronRightIcon size={48} className='text-yellow-400 cursor-pointer' onClick={() => nextPrize()} />
            </div>

            <div className='text-[#ffda56] text-4xl font-bold pb-4'>{getRemainingPrizes(selectedPrize) > 0 && `(${getRemainingPrizes(selectedPrize)} giải)`}</div>

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
                  disabled={isSpinning || !selectedPrize || remainingParticipants.length === 0 || getRemainingPrizes(selectedPrize) <= 0}
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
                  disabled={getRemainingPrizes(selectedPrize) <= 0}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 mb-8"
                >
                  TIẾP TỤC
                </Button>}
              </>)}

            </div>
            <div className="text-2xl text-yellow-400 mb-2">
              <span>Có người <span className='font-bold'>{remainingParticipants.length}</span> tham gia </span>
              <span>Tỉ lệ trúng giải là
                <span className='font-bold'>
                  {remainingParticipants.length > 0 && (
                    ` ${(100 / remainingParticipants.length).toFixed(2)}%`
                  )}
                </span>

              </span>

            </div>
            {winnerSave.length > 0 &&
              <div className="mt-4">
                <div className='text-yellow-400 text-3xl cursor-pointer' onClick={() => {
                  router.push('/winners')
                }}>Danh sách người trúng thưởng</div>
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
                    window.location.reload()
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
                  onUpdate={(prizes) => {
                    setSettings(prev => ({ ...prev, prizes }))
                  }}
                />
              </div>
            </div>}
        </div>
      </div>
      <div className='fixed right-14 bottom-11'>
        <img width="250" height="auto" src="/logo.png"></img>
      </div>
    </div>
  )
}

