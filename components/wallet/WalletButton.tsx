'use client'

import { useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function WalletButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="bg-black hover:bg-gray-800 rounded-xl h-12 px-6 text-white font-medium">
        Select Wallet
      </button>
    )
  }

  return <WalletMultiButton className="!bg-black hover:!bg-gray-800 !rounded-xl !h-12" />
}
