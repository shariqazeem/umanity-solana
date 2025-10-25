'use client'

import { useState } from 'react'
import { WalletButton } from '@/components/wallet/WalletButton'
import { DonationPools } from '@/components/donation/DonationPools'
import { OneTapDonation } from '@/components/donation/OneTapDonation'
import { TippingSystem } from '@/components/tips/TippingSystem'
import { Leaderboard } from '@/components/leaderboard/Leaderboard'
import { ActivityFeed } from '@/components/activity/ActivityFeed'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'donate' | 'pools' | 'tips' | 'community'>('donate')

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
                <button
                  onClick={() => setActiveTab('community')}
                  className={`px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                    activeTab === 'community'
                      ? 'bg-black text-white'
                      : 'bg-black/5 text-gray-700 hover:bg-black/10'
                  }`}
                >
                  🏆 Community
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-black/5 rounded-xl border border-black/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Solana Devnet</span>
              </div>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Value Prop Banner - Only on donate tab */}
        {activeTab === 'donate' && (
          <div className="mb-12 glass-card rounded-3xl p-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-black text-green-600 mb-2">$0 Fees</div>
                <div className="text-sm text-gray-700">Keep 100% vs 5-10% traditional</div>
              </div>
              <div>
                <div className="text-4xl font-black text-blue-600 mb-2">&lt;1 Second</div>
                <div className="text-sm text-gray-700">Instant vs 3-5 days traditional</div>
              </div>
              <div>
                <div className="text-4xl font-black text-purple-600 mb-2">Get Rewarded</div>
                <div className="text-sm text-gray-700">Earn points → future tokens</div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent leading-tight">
            {activeTab === 'donate' && 'Give & Get Rewarded'}
            {activeTab === 'pools' && 'Support What Matters'}
            {activeTab === 'tips' && 'Reward Community'}
            {activeTab === 'community' && 'Top Contributors'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {activeTab === 'donate' && 'One-tap $2 donations on Solana. Instant, transparent, rewarding. Earn 10 points per donation.'}
            {activeTab === 'pools' && 'Donate any amount to verified causes. Earn 1,000 points per SOL. Every cent visible on-chain.'}
            {activeTab === 'tips' && 'Send instant tips to creators and community members. Earn points on every tip. No fees, ever.'}
            {activeTab === 'community' && 'See who\'s making the biggest impact. Leaderboards update in real-time with every donation and tip.'}
          </p>
        </div>

        {/* Content Sections */}
        {activeTab === 'donate' && <OneTapDonation />}
        {activeTab === 'pools' && <DonationPools />}
        {activeTab === 'tips' && <TippingSystem />}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Leaderboard />
            <ActivityFeed />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-black text-2xl mb-3 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                Umanity
              </h3>
              <p className="text-sm text-gray-600">
                Gamified philanthropy on Solana. Give, earn, govern.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Zero fees, instant transfers</li>
                <li>• Earn reward points</li>
                <li>• Future token conversion</li>
                <li>• Full transparency on-chain</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Built With</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Solana Blockchain</li>
                <li>• Next.js 15 + React</li>
                <li>• Supabase Database</li>
                <li>• Open Source on GitHub</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-black/10">
            <p className="text-sm text-gray-600">
              Built for Solana Hackathon • Every donation is verifiable on-chain •
              <a href="https://github.com/yourusername/umanity-solana" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                View Source
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
