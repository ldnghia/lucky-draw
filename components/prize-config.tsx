'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { Prize } from '../types'

interface PrizeConfigProps {
  prizes: Prize[]
  onUpdate: (prizes: Prize[]) => void
}

export function PrizeConfig({ prizes, onUpdate }: PrizeConfigProps) {
  const addPrize = () => {
    onUpdate([
      ...prizes,
      { id: Math.random().toString(36).slice(2), name: '', enabled: true }
    ])
  }

  const updatePrize = (index: number, updates: Partial<Prize>) => {
    const newPrizes = [...prizes]
    newPrizes[index] = { ...newPrizes[index], ...updates }
    onUpdate(newPrizes)
  }

  const removePrize = (index: number) => {
    onUpdate(prizes.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prize Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prizes.map((prize, index) => (
            <div key={prize.id} className="flex items-center gap-4">
              <Input
                value={prize.name}
                onChange={(e) => updatePrize(index, { name: e.target.value })}
                placeholder="Prize name"
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={prize.enabled}
                  onCheckedChange={(checked) => updatePrize(index, { enabled: checked })}
                />
                <Label>Enabled</Label>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removePrize(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={addPrize}>Add Prize</Button>
        </div>
      </CardContent>
    </Card>
  )
}

