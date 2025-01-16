import './globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['vietnamese'] })

export const metadata = {
  title: 'Quay số may mắn',
  description: 'Ứng dụng quay số may mắn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}

