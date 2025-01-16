import { useState } from 'react'

export interface Participant {
  id: string
  name: string
}

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([])

  const addParticipant = (name: string) => {
    setParticipants(prev => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        name
      }
    ])
  }

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }

  const clearParticipants = () => {
    setParticipants([])
  }

  return {
    participants,
    addParticipant,
    removeParticipant,
    clearParticipants
  }
}

