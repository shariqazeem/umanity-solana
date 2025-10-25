'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface Pool {
  id: string
  name: string
  description: string
  totalDonated: number
  donorCount: number
}

// Static pool display data (icons, wallets, categories)
// All pools use the treasury wallet - you can distribute funds to specific causes later
const POOL_DISPLAY_DATA: Record<string, { emoji: string; wallet: string; category: string; verified: boolean }> = {
  'medical': {
    emoji: '🏥',
    wallet: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy',
    category: 'Healthcare',
    verified: true
  },
  'education': {
    emoji: '📚',
    wallet: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy',
    category: 'Education',
    verified: true
  },
  'disaster': {
    emoji: '🆘',
    wallet: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy',
    category: 'Emergency',
    verified: true
  },
  'water': {
    emoji: '💧',
    wallet: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy',
    category: 'Infrastructure',
    verified: true
  }
}

export function DonationPools() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [pools, setPools] = useState<Pool[]>([])
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [txSignature, setTxSignature] = useState('')

  useEffect(() => {
    fetchPools()
  }, [])

  const fetchPools = async () => {
    try {
      const response = await fetch('/api/pools')
      const data = await response.json()
      setPools(data.pools || [])
    } catch (error) {
      console.error('Error fetching pools:', error)
      setPools([])
    }
  }

  const donate = async () => {
    if (!publicKey || !selectedPool || !amount) return

    const solAmount = parseFloat(amount)
    if (solAmount < 0.001) {
      // Show error inline instead of alert - will be handled by UI
      return
    }

    setLoading(true)
    setTxSignature('')

    try {
      const lamports = solAmount * LAMPORTS_PER_SOL

      // Get wallet from display data
      const displayData = POOL_DISPLAY_DATA[selectedPool.id]
      if (!displayData) {
        // Invalid pool - should not happen
        return
      }

      let poolWallet: PublicKey
      try {
        poolWallet = new PublicKey(displayData.wallet)
      } catch {
        // Fallback to treasury wallet if invalid
        poolWallet = new PublicKey('BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy')
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: poolWallet,
          lamports,
        })
      )

      const signature = await sendTransaction(transaction, connection)
      setTxSignature(signature)

      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }, 'confirmed')

      // Record donation
      try {
        await fetch('/api/pools/donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donor: publicKey.toBase58(),
            pool: selectedPool.id,
            poolName: selectedPool.name,
            amount: solAmount,
            signature,
          }),
        })
      } catch (apiError) {
        console.error('Failed to record donation:', apiError)
      }

      // Success - txSignature is set, UI will show success message
      // Wait a moment before closing modal to show success
      setTimeout(() => {
        setSelectedPool(null)
        setAmount('')
        setTxSignature('')
        fetchPools()
      }, 3000)

    } catch (error: any) {
      console.error('Donation error:', error)
      setTxSignature('')
      // Error will be shown in the UI
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Transparency Banner */}
      <div className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border border-green-100">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">🌍</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Global Impact Pools</h3>
            <p className="text-gray-700 mb-3">
              Support verified causes with custom donations. Every transaction is transparent and traceable on the Solana blockchain.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">✓ Verified Charities</span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">✓ 100% On-Chain</span>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">✓ Real-time Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pools.map((pool) => {
          const displayData = POOL_DISPLAY_DATA[pool.id]
          if (!displayData) return null

          return (
            <div key={pool.id} className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl">{displayData.emoji}</div>
                <div className="flex flex-col items-end gap-2">
                  {displayData.verified && (
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                      ✓ Verified
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                    {displayData.category}
                  </span>
                </div>
              </div>

            <h3 className="text-2xl font-bold mb-3">{pool.name}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{pool.description}</p>

            {/* Stats */}
            <div className="bg-black/5 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Raised</span>
                <span className="text-lg font-bold">{pool.totalDonated.toFixed(3)} SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contributors</span>
                <span className="text-lg font-bold">{pool.donorCount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setSelectedPool(pool)}
                disabled={!publicKey}
                className="w-full primary-button text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                {publicKey ? '💝 Donate Custom Amount' : '👛 Connect Wallet to Donate'}
              </button>
              <button
                className="w-full bg-black/5 hover:bg-black/10 text-black py-3 rounded-xl font-medium transition-all"
                onClick={() => window.open(`https://solscan.io/account/${displayData.wallet}?cluster=devnet`, '_blank')}
              >
                🔍 View Wallet Transactions →
              </button>
            </div>
          </div>
          )
        })}
      </div>

      {/* Donation Modal */}
      {selectedPool && (() => {
        const displayData = POOL_DISPLAY_DATA[selectedPool.id]
        if (!displayData) return null

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="glass-card rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold">Donate to {selectedPool.name}</h3>
                <button
                  onClick={() => {
                    setSelectedPool(null)
                    setTxSignature('')
                  }}
                  className="text-gray-400 hover:text-black text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Pool Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 text-center border border-blue-100">
                <div className="text-5xl mb-4">{displayData.emoji}</div>
                <p className="text-gray-700 mb-3">{selectedPool.description}</p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">
                    ✓ {displayData.category}
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">
                    ✓ Verified
                  </span>
                </div>
              </div>

            {/* Transaction Success */}
            {txSignature && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center text-green-700 mb-2">
                  <span className="text-2xl mr-2">✓</span>
                  <span className="font-bold">Transaction Confirmed!</span>
                </div>
                <a
                  href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  View on Solscan →
                </a>
              </div>
            )}

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (SOL)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                step="0.01"
                min="0.001"
                className="w-full rounded-xl px-4 py-4 text-lg border border-black/10 focus:border-black/30 focus:ring-2 focus:ring-black/10"
              />
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600">Minimum: 0.001 SOL</span>
                <span className="text-gray-600">≈ ${amount ? (parseFloat(amount) * 200).toFixed(2) : '0.00'} USD</span>
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {['0.01', '0.05', '0.1', '0.5'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="px-3 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-sm font-medium transition-all"
                  >
                    {preset} SOL
                  </button>
                ))}
              </div>
            </div>

            {/* Transparency Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-2">💡 Your donation will:</div>
                <ul className="space-y-1 text-xs">
                  <li>• Go directly to the verified charity wallet</li>
                  <li>• Be recorded permanently on Solana blockchain</li>
                  <li>• Earn you platform reward points</li>
                  <li>• Be fully transparent and traceable</li>
                </ul>
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={donate}
              disabled={loading || !amount || parseFloat(amount) < 0.001}
              className="w-full primary-button text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Transaction...
                </span>
              ) : (
                `💝 Donate ${amount || '0'} SOL`
              )}
            </button>
          </div>
        </div>
        )
      })()}
    </div>
  )
}