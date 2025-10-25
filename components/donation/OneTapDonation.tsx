'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { PLATFORM_CONFIG } from '@/lib/constants'

interface DonationStats {
  totalDonations: number
  totalDonors: number
  totalRewardsDistributed: number
  pendingDistribution: number
}

export function OneTapDonation() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [txSignature, setTxSignature] = useState('')
  const [error, setError] = useState('')
  const [rewardPoints, setRewardPoints] = useState(0)
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    totalDonors: 0,
    totalRewardsDistributed: 0,
    pendingDistribution: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch combined platform stats (one-tap + pool donations)
      const response = await fetch('/api/platform/stats')
      const data = await response.json()
      if (data.stats) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const donate = async () => {
    if (!publicKey) {
      setError('Please connect your wallet first!')
      setStatus('error')
      setTimeout(() => {
        setStatus('idle')
        setError('')
      }, 3000)
      return
    }

    setStatus('processing')
    setError('')

    try {
      // One-tap donation: 0.01 SOL (~$2)
      const amount = 0.01 * LAMPORTS_PER_SOL

      // All donations go to platform treasury (YOUR wallet)
      const treasuryPubkey = new PublicKey(PLATFORM_CONFIG.TREASURY_WALLET)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryPubkey,
          lamports: amount,
        })
      )

      // Send transaction
      const signature = await sendTransaction(transaction, connection)
      setTxSignature(signature)

      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }, 'confirmed')

      // Calculate rewards
      const points = Math.floor(0.01 * PLATFORM_CONFIG.POINTS_PER_SOL)
      setRewardPoints(points)

      // Record donation
      try {
        const response = await fetch('/api/donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donor: publicKey.toBase58(),
            amount: 0.01,
            signature,
            type: 'one-tap',
          }),
        })

        const data = await response.json()
        if (data.success) {
          setRewardPoints(data.rewardPointsEarned)
        }
      } catch (apiError) {
        console.error('Failed to record donation:', apiError)
      }

      setStatus('success')
      fetchStats() // Refresh stats after donation

      // Reset after 6 seconds
      setTimeout(() => {
        setStatus('idle')
        setTxSignature('')
        setRewardPoints(0)
      }, 6000)

    } catch (error: any) {
      console.error('Donation error:', error)
      setError(error.message || 'Transaction failed')
      setStatus('error')

      setTimeout(() => {
        setStatus('idle')
        setError('')
      }, 4000)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Transparency Banner */}
      <div className="mb-12 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-3xl p-8 border border-green-200">
        <div className="flex items-start space-x-4">
          <div className="text-5xl">🌍</div>
          <div>
            <h3 className="text-3xl font-bold mb-3">How Your Donation Works</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <strong>You Donate:</strong> Click button → 0.01 SOL (~$2) sent instantly
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <strong>Platform Treasury:</strong> Funds go to secure platform wallet (verifiable on-chain)
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <strong>Distribution:</strong> Platform distributes to verified charities weekly
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <strong>Full Transparency:</strong> Every step visible on Solana blockchain
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-green-200">
                ✓ 0% Platform Fee
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-green-200">
                ✓ 100% On-Chain
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium border border-green-200">
                ✓ Instant Rewards
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="glass-card rounded-3xl p-8 mb-12">
        <h3 className="text-2xl font-bold mb-6 text-center">📊 Platform Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">
              {stats.totalDonations.toFixed(3)}
            </div>
            <div className="text-sm text-gray-700 font-medium">Total SOL Raised</div>
            <div className="text-xs text-gray-500 mt-1">≈ ${(stats.totalDonations * 200).toFixed(2)} USD</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-purple-600 mb-2">
              {stats.totalDonors}
            </div>
            <div className="text-sm text-gray-700 font-medium">Active Donors</div>
            <div className="text-xs text-gray-500 mt-1">Making a difference</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-yellow-600 mb-2">
              {stats.totalRewardsDistributed}
            </div>
            <div className="text-sm text-gray-700 font-medium">Points Distributed</div>
            <div className="text-xs text-gray-500 mt-1">Rewarding generosity</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
            <div className="text-4xl font-black text-green-600 mb-2">
              {stats.pendingDistribution.toFixed(3)}
            </div>
            <div className="text-sm text-gray-700 font-medium">Pending Distribution</div>
            <div className="text-xs text-gray-500 mt-1">To be sent to charities</div>
          </div>
        </div>
      </div>

      {/* Main Donation Card */}
      <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
        {/* Success Overlay */}
        {status === 'success' && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 bg-opacity-95 flex flex-col items-center justify-center z-10 animate-fade-in">
            <div className="text-8xl mb-6">✓</div>
            <h3 className="text-white font-bold text-4xl mb-4">Thank You!</h3>
            <p className="text-white text-xl mb-2">Donation Successful</p>
            <div className="bg-white/20 rounded-xl px-6 py-3 mb-6">
              <div className="text-white font-bold text-2xl">+{rewardPoints} Points!</div>
            </div>
            <a
              href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-green-100 text-lg"
            >
              View Transaction on Solscan →
            </a>
          </div>
        )}

        <div className="text-8xl mb-8 floating">💝</div>

        <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
          One-Tap Giving
        </h2>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Make an instant impact with just one click. Every donation goes through our verified platform treasury and is distributed to vetted charities.
        </p>

        {/* Donation Amount */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 max-w-md mx-auto border border-blue-100">
          <div className="text-6xl font-black mb-3">$2</div>
          <div className="text-lg text-gray-600 mb-4">0.01 SOL per donation</div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>🎁</span>
            <span>Earn <strong className="text-purple-600">10 reward points</strong></span>
          </div>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
            <div className="text-red-700 font-medium">{error || 'Transaction failed'}</div>
          </div>
        )}

        {/* Donate Button */}
        <button
          onClick={donate}
          disabled={status === 'processing' || !publicKey}
          className={`primary-button text-white py-6 px-12 rounded-xl font-bold text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 ${
            status === 'processing' ? 'animate-pulse' : ''
          }`}
        >
          {status === 'processing' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : !publicKey ? (
            '👛 Connect Wallet to Donate'
          ) : (
            '💝 Donate $2 Now'
          )}
        </button>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl mb-2">🔒</div>
            <div className="font-bold mb-1">Secure</div>
            <p className="text-sm text-gray-600">Platform treasury on Solana blockchain</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-bold mb-1">Transparent</div>
            <p className="text-sm text-gray-600">Every transaction publicly verifiable</p>
          </div>
          <div>
            <div className="text-4xl mb-2">⚡</div>
            <div className="font-bold mb-1">Instant</div>
            <p className="text-sm text-gray-600">Confirmed in under 1 second</p>
          </div>
        </div>

        {/* View Treasury */}
        <div className="mt-8">
          <button
            onClick={() => window.open(`https://solscan.io/account/${PLATFORM_CONFIG.TREASURY_WALLET}?cluster=devnet`, '_blank')}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            🔍 View Platform Treasury Wallet →
          </button>
        </div>
      </div>

      {/* Impact Statistics (optional - shows after first donation) */}
      {txSignature && status === 'idle' && (
        <div className="mt-12 glass-card rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Your Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600 mt-2">Donations Made</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-600">0.01</div>
              <div className="text-sm text-gray-600 mt-2">SOL Donated</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-600">{rewardPoints}</div>
              <div className="text-sm text-gray-600 mt-2">Points Earned</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
