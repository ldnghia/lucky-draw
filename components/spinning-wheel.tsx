import { useState, useEffect, useCallback } from 'react';
import type { Employee } from '../types';
import type { Prize } from '../types';
import { Button } from './ui/button';

interface SpinningWheelProps {
  isSpinning: boolean;
  onComplete: (winner: Employee) => void;
  participants: Employee[];
  selectedPrize: Prize | null;
  winnerTemp?: Employee
  isReload?: boolean
}

export function SpinningWheel({ isSpinning, onComplete, participants, selectedPrize, winnerTemp, isReload }: SpinningWheelProps) {
  const [cells, setCells] = useState<string[]>(Array(5).fill('9'));
  const [lockedCells, setLockedCells] = useState<boolean[]>(Array(5).fill(false));
  const [winner, setWinner] = useState<Employee | null>(null);

  // Generate random alphanumeric character
  const getRandomChar = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  // Update spinning cells
  useEffect(() => {
    var intervals: (NodeJS.Timeout | null)[] = [];

    if (!isSpinning) {
      // setLockedCells(Array(5).fill(false));
      // setCells(Array(5).fill('9'));
      setWinner(null);
      intervals.forEach(interval => interval && clearInterval(interval));
      return;
    }

    intervals = cells.map((_, index) => {
      if (lockedCells[index]) return null;

      return setInterval(() => {
        setCells(prev => {
          const newCells = [...prev];
          if (!lockedCells[index]) {
            newCells[index] = getRandomChar();
          }
          return newCells;
        });
      }, 50 + index * 20);
    });

    return () => {
      intervals.forEach(interval => interval && clearInterval(interval));
    };
  }, [isSpinning, lockedCells]);

  useEffect(() => {
    if (isReload) {
      setLockedCells(Array(5).fill(false));
      setCells(Array(5).fill('9'));
      setWinner(null);
    }
  }, [isReload]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isSpinning) {
        const currentLockedCount = lockedCells.filter(Boolean).length;
        if (currentLockedCount < 5) {
          setCells(prev => {
            const newCells = [...prev];
            newCells[currentLockedCount] = winnerTemp ? winnerTemp.id[currentLockedCount] : "0";
            return newCells;
          });

          setLockedCells(prev => {
            const newLocked = [...prev];
            newLocked[currentLockedCount] = true;
            return newLocked;
          });

          // If this is the last cell, select winner
          if (currentLockedCount === 4) {
            // const randomWinner = participants[Math.floor(Math.random() * participants.length)];
            if (winnerTemp) {
              setWinner(winnerTemp);
              onComplete(winnerTemp);
            }
            // Set final winner ID in cells
            // setTimeout(() => {
            //   setCells(randomWinner.id.split(''));
            // }, 100);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSpinning, lockedCells, onComplete, participants]);

  const handleChoice = () => {
    const currentLockedCount = lockedCells.filter(Boolean).length;
    if (currentLockedCount < 5) {
      setCells(prev => {
        const newCells = [...prev];
        newCells[currentLockedCount] = winnerTemp ? winnerTemp.id[currentLockedCount] : "0";
        return newCells;
      });

      setLockedCells(prev => {
        const newLocked = [...prev];
        newLocked[currentLockedCount] = true;
        return newLocked;
      });

      // If this is the last cell, select winner
      if (currentLockedCount === 4) {
        // const randomWinner = participants[Math.floor(Math.random() * participants.length)];
        // Set final winner ID in cells
        setTimeout(() => {
          if (winnerTemp) {
            setWinner(winnerTemp);
            onComplete(winnerTemp);
          }
        }, 100);
      }
    }
  }

  return (
    <div className='space-y-8'>
      <div className="flex flex-col items-center justify-center p-6 w-fit min-w-lg mx-auto bg-[#c1392b] rounded-lg border-4 border-solid border-[#f5db79]">
        <div className="flex gap-2 justify-center">
          {cells.map((char, index) => (
            <div
              key={index}
              className={`w-32 h-36 flex items-center justify-center rounded-lg 
              ${lockedCells[index] ? 'bg-yellow-400' : 'bg-yellow-400/20'}
              transition-colors duration-300`}
            >
              <div className={`text-6xl font-bold font-mono ${lockedCells[index] ? 'text-black' : 'text-white'}`}>
                {char}
              </div>
            </div>
          ))}
        </div>

        {winner && (
          <div className="text-2xl font-bold text-yellow-400 mt-4 text-center">
            <div>{winner.name}</div>
            {selectedPrize && <div className="text-xl mt-2">{selectedPrize.name}</div>}
          </div>
        )}
      </div>
      {isSpinning && (<Button
        size="lg"
        onClick={() => {
          handleChoice()
        }}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-12 mb-8"
      >
        CHỌN SỐ
      </Button>)}

    </div>
  );
}

