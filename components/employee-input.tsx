'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { Employee } from '../types'

interface EmployeeInputProps {
  onSubmit: (employees: Employee[]) => void
}

export function EmployeeInput({ onSubmit }: EmployeeInputProps) {
  const [ids, setIds] = useState('')
  const [names, setNames] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const idList = ids.split('\n').map(id => id.trim()).filter(Boolean)
    const nameList = names.split('\n').map(name => name.trim()).filter(Boolean)
    
    if (idList.length !== nameList.length) {
      alert('Number of IDs and names must match')
      return
    }

    const employees = idList.map((id, index) => ({
      id,
      name: nameList[index]
    }))

    onSubmit(employees)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enter Employee Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ids">Employee IDs</Label>
              <Textarea
                id="ids"
                placeholder="Enter employee IDs (one per line)"
                value={ids}
                onChange={(e) => setIds(e.target.value)}
                className="h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="names">Employee Names</Label>
              <Textarea
                id="names"
                placeholder="Enter employee names (one per line)"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="h-[200px]"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Load Employees</Button>
        </form>
      </CardContent>
    </Card>
  )
}

