import { useState, useEffect, useCallback } from 'react';
import type { Employee } from '../types';
import type { Prize } from '../types';

interface SpinningWheelProps {
  isSpinning: boolean;
  onComplete: (winner: Employee) => void;
  participants: Employee[];
  selectedPrize: Prize | null;
}

export function SpinningWheel({ isSpinning, onComplete, participants, selectedPrize }: SpinningWheelProps) {
  const [cells, setCells] = useState<string[]>(Array(5).fill(''));
  const [lockedCells, setLockedCells] = useState<boolean[]>(Array(5).fill(false));
  const [winner, setWinner] = useState<Employee | null>(null);
 
  // Generate random alphanumeric character
  const getRandomChar = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  // Update spinning cells
  useEffect(() => {
    if (!isSpinning) {
      setLockedCells(Array(5).fill(false));
      setCells(Array(5).fill(''));
      setWinner(null);
      return;
    }

    const intervals = cells.map((_, index) => {
      if (lockedCells[index]) return null;

      return setInterval(() => {
        setCells(prev => {
          const newCells = [...prev];
          if (!lockedCells[index]) {
            newCells[index] = getRandomChar();
          }
          return newCells;
        });
      }, 50 + index * 20); // Slightly different speeds for each cell
    });

    return () => {
      intervals.forEach(interval => interval && clearInterval(interval));
    };
  }, [isSpinning]);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isSpinning) {
        const currentLockedCount = lockedCells.filter(Boolean).length;
        if (currentLockedCount < 5) {
          setLockedCells(prev => {
            const newLocked = [...prev];
            newLocked[currentLockedCount] = true;
            return newLocked;
          });

          // If this is the last cell, select winner
          if (currentLockedCount === 4) {
            const randomWinner = participants[Math.floor(Math.random() * participants.length)];
            setWinner(randomWinner);
            onComplete(randomWinner);
           
            // Set final winner ID in cells
            setTimeout(() => {
              setCells(randomWinner.id.split(''));
            }, 100);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSpinning, lockedCells, onComplete, participants]);

  return (
    <div className="flex flex-col items-center justify-center p-6 w-fit min-w-lg mx-auto bg-[#c1392b] rounded-lg border-4 border-solid border-[#f5db79]">
      <div className="flex gap-2 justify-center">
        {cells.map((char, index) => (
          <div
            key={index}
            className={`w-32 h-32 flex items-center justify-center rounded-lg 
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
  );
}

