import type { Metadata } from 'next'
import './globals.css'
import { WalletProvider } from '@/components/wallet/WalletProvider'

export const metadata: Metadata = {
  title: 'Umanity - Global Donations on Solana',
  description: 'One-tap donations, global pools, and tipping on Solana blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 overflow-x-hidden geometric-bg">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
