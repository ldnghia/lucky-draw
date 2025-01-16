import './globals.css'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ subsets: ['vietnamese'] })

export const metadata = {
  title: 'Quay số may mắn',
  description: 'Ứng dụng quay số may mắn',
  icon: 'https://dev-skyoffice.dcorp.com.vn/favicon.ico',
  icons: {
    icon: 'https://dev-skyoffice.dcorp.com.vn/favicon.ico',
  },
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

