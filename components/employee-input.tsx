'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees')
    if (storedEmployees) {
      const employees: Employee[] = JSON.parse(storedEmployees)
      setIds(employees.map(employee => employee.id).join('\n'))
      setNames(employees.map(employee => employee.name).join('\n'))
    }
  }, [])

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

    localStorage.setItem('employees', JSON.stringify(employees))

    onSubmit(employees)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nhập danh sách nhân viên</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ids">Mã số nhân viên</Label>
              <Textarea
                id="ids"
                placeholder=""
                value={ids}
                onChange={(e) => setIds(e.target.value)}
                className="h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="names">Tên nhân viên</Label>
              <Textarea
                id="names"
                placeholder=""
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="h-[200px]"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Cập nhật danh sách</Button>
          <div onClick={() => {
            window.location.href = 'https://github.com/dnghiald1998/lucky'
          }} className="text-blue-500 cursor-pointer text-3xl">Link source code Github</div>
        </form>
      </CardContent>
    </Card>
  )
}

