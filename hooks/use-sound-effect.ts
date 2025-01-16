import { useEffect, useRef, useState } from 'react'

export function useSoundEffect(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const audio = new Audio(src)
    audio.addEventListener('canplaythrough', () => {
      audioRef.current = audio
    })
    audio.addEventListener('error', () => {
      console.warn('Audio not supported or file not found:', src)
      setIsSupported(false)
    })

    return () => {
      audio.removeEventListener('canplaythrough', () => {})
      audio.removeEventListener('error', () => {})
    }
  }, [src])

  const play = () => {
    if (audioRef.current && isSupported) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(error => {
        console.warn('Error playing audio:', error)
        setIsSupported(false)
      })
    }
  }

  const stop = () => {
    if (audioRef.current && isSupported) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return { play, stop, isSupported }
}

