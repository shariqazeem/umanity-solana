'use client'

import { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { DonationPools } from '@/components/donation/DonationPools'
import { OneTapDonation } from '@/components/donation/OneTapDonation'
import { TippingSystem } from '@/components/tips/TippingSystem'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'donate' | 'pools' | 'tips'>('donate')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-black bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                Umanity
              </h1>
              <nav className="hidden md:flex space-x-2">
                <button
                  onClick={() => setActiveTab('donate')}
                  className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                    activeTab === 'donate'
                      ? 'bg-black text-white'
                      : 'bg-black/5 text-gray-700 hover:bg-black/10'
                  }`}
                >
                  💝 Donate
                </button>
                <button
                  onClick={() => setActiveTab('pools')}
                  className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                    activeTab === 'pools'
                      ? 'bg-black text-white'
                      : 'bg-black/5 text-gray-700 hover:bg-black/10'
                  }`}
                >
                  🌍 Custom
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                    activeTab === 'tips'
                      ? 'bg-black text-white'
                      : 'bg-black/5 text-gray-700 hover:bg-black/10'
                  }`}
                >
                  ⚡ Tips
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-black/5 rounded-xl border border-black/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Solana Devnet</span>
              </div>
              <WalletMultiButton className="!bg-black hover:!bg-gray-800 !rounded-xl !h-12" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent leading-tight">
            {activeTab === 'donate' && 'Transparent Giving'}
            {activeTab === 'pools' && 'Custom Donations'}
            {activeTab === 'tips' && 'Community Tipping'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {activeTab === 'donate' && 'One-click $2 donations to verified platform treasury. Fully transparent, instantly rewarded.'}
            {activeTab === 'pools' && 'Choose your amount, support verified causes. Every transaction visible on-chain.'}
            {activeTab === 'tips' && 'Tip creators and community members directly. Earn rewards for every tip.'}
          </p>
        </div>

        {/* Content Sections */}
        {activeTab === 'donate' && <OneTapDonation />}
        {activeTab === 'pools' && <DonationPools />}
        {activeTab === 'tips' && <TippingSystem />}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>Built on Solana • Fully On-Chain • Open Source</p>
            <p className="mt-2">Every donation is transparent and verifiable</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
