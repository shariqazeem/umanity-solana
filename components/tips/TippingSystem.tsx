'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface User {
  address: string
  username: string
  displayName: string
  totalReceived: number
  totalSent: number
  bio?: string
  rewardPoints?: number
}

export function TippingSystem() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isRegistered, setIsRegistered] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [tipAmount, setTipAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [txSignature, setTxSignature] = useState('')
  const [showRegistration, setShowRegistration] = useState(false)
  const [dismissedBanner, setDismissedBanner] = useState(false)

  useEffect(() => {
    if (publicKey) {
      checkRegistration()
      fetchUsers()
    }
  }, [publicKey])

  const checkRegistration = async () => {
    if (!publicKey) return

    try {
      const response = await fetch(`/api/register/check?address=${publicKey.toBase58()}`)
      const data = await response.json()
      setIsRegistered(data.registered)
      if (data.user) {
        setCurrentUser(data.user)
      }
    } catch (error) {
      console.error('Error checking registration:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/tips/users')
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      // Demo data
      setUsers([
        { 
          address: 'Demo1UserWa11etAddressHere1111111111111', 
          username: 'alice_dev', 
          displayName: 'Alice', 
          totalReceived: 0, 
          totalSent: 0,
          bio: 'Building cool stuff on Solana 🚀',
          rewardPoints: 150
        },
        { 
          address: 'Demo2UserWa11etAddressHere1111111111111', 
          username: 'bob_creator', 
          displayName: 'Bob', 
          totalReceived: 0, 
          totalSent: 0,
          bio: 'Content creator & educator 📚',
          rewardPoints: 89
        },
        { 
          address: 'Demo3UserWa11etAddressHere1111111111111', 
          username: 'charlie_artist', 
          displayName: 'Charlie', 
          totalReceived: 0, 
          totalSent: 0,
          bio: 'Digital artist & NFT collector 🎨',
          rewardPoints: 234
        },
      ])
    }
  }

  const register = async () => {
    if (!publicKey || !username || !displayName) {
      alert('Please fill in all required fields')
      return
    }

    if (username.length < 3) {
      alert('Username must be at least 3 characters')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: publicKey.toBase58(),
          username: username.toLowerCase(),
          displayName,
          bio,
        }),
      })

      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        return
      }

      if (data.success) {
        setIsRegistered(true)
        setCurrentUser(data.user)
        setShowRegistration(false)
        fetchUsers()
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sendTip = async () => {
    if (!publicKey || !selectedUser || !tipAmount) return

    const solAmount = parseFloat(tipAmount)
    if (solAmount < 0.001) {
      alert('Minimum tip is 0.001 SOL')
      return
    }

    setLoading(true)
    setTxSignature('')

    try {
      const lamports = solAmount * LAMPORTS_PER_SOL

      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(selectedUser.address)
      } catch (e) {
        alert('Invalid recipient address')
        return
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
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

      // Record tip and earn rewards
      try {
        await fetch('/api/tips/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: publicKey.toBase58(),
            recipient: selectedUser.address,
            recipientUsername: selectedUser.username,
            amount: solAmount,
            message,
            signature,
          }),
        })
      } catch (apiError) {
        console.error('Failed to record tip:', apiError)
      }

      alert(`Successfully tipped ${solAmount} SOL to @${selectedUser.username}! 🎉\n\nYou earned 10 reward points!`)
      
      setTimeout(() => {
        setSelectedUser(null)
        setTipAmount('')
        setMessage('')
        setTxSignature('')
        fetchUsers()
        checkRegistration() // Refresh user data
      }, 2000)

    } catch (error: any) {
      console.error('Tip error:', error)
      alert(`Tip failed: ${error.message || 'Please try again'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="text-center py-20">
        <div className="glass-card rounded-3xl p-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-6">👛</div>
          <h3 className="text-4xl font-bold mb-4">Connect Your Wallet</h3>
          <p className="text-gray-600 text-lg mb-6">
            Connect your Solana wallet to start tipping creators and earning rewards
          </p>
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-sm text-gray-700">
              <div className="font-medium mb-2">With Umanity Tips, you can:</div>
              <ul className="space-y-2 text-left">
                <li>✓ Send instant SOL tips to anyone</li>
                <li>✓ Receive tips from the community</li>
                <li>✓ Earn reward points for every tip</li>
                <li>✓ Convert rewards to tokens (coming soon)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Registration Banner for unregistered users */}
      {!isRegistered && !showRegistration && !dismissedBanner && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">Want to receive tips too?</h4>
                <p className="text-gray-700 mb-4">
                  Register your profile to receive tips from the community and earn rewards!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="primary-button text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    ✨ Register Profile
                  </button>
                  <button
                    onClick={() => setDismissedBanner(true)}
                    className="text-gray-600 text-sm hover:text-gray-800"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
              <div className="text-5xl ml-4">💰</div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Modal */}
      {showRegistration && !isRegistered && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="glass-card rounded-3xl max-w-2xl w-full p-12 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-4xl font-bold mb-2">Register Your Tipping Profile</h3>
                <p className="text-gray-600 text-lg">
                  Create your profile to receive tips and start earning rewards
                </p>
              </div>
              <button
                onClick={() => setShowRegistration(false)}
                className="text-gray-400 hover:text-black text-3xl"
              >
                ×
              </button>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">💰</div>
                  <div className="font-bold text-sm">Receive Tips</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-bold text-sm">Instant Transfer</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎁</div>
                  <div className="font-bold text-sm">Earn Rewards</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="alice_dev"
                  maxLength={30}
                  className="w-full rounded-xl px-4 py-4 text-lg border border-black/10 focus:border-black/30 focus:ring-2 focus:ring-black/10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-30 characters, lowercase letters, numbers, and underscores only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alice"
                  maxLength={50}
                  className="w-full rounded-xl px-4 py-4 text-lg border border-black/10 focus:border-black/30 focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  maxLength={280}
                  rows={3}
                  className="w-full rounded-xl px-4 py-4 border border-black/10 focus:border-black/30 focus:ring-2 focus:ring-black/10 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{bio.length}/280 characters</p>
              </div>

              <button
                onClick={register}
                disabled={loading || !username || !displayName || username.length < 3}
                className="w-full primary-button text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registering...
                  </span>
                ) : (
                  '✨ Create Profile & Start Earning'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      {currentUser && (
        <div className="max-w-3xl mx-auto mb-12">
          <div className="glass-card rounded-3xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentUser.displayName}</h3>
                  <p className="text-gray-600">@{currentUser.username}</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentUser.totalReceived.toFixed(3)}
                </div>
                <div className="text-xs text-gray-600 mt-1">SOL Received</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {currentUser.totalSent.toFixed(3)}
                </div>
                <div className="text-xs text-gray-600 mt-1">SOL Sent</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {currentUser.rewardPoints || 0}
                </div>
                <div className="text-xs text-gray-600 mt-1">Reward Points</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🎁</div>
                <div>
                  <div className="font-bold text-sm">Earn rewards for every tip!</div>
                  <p className="text-xs text-gray-600">
                    Convert to tokens when launched • Track your impact • Get exclusive perks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Members */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold mb-3">💸 Tip Community Members</h3>
        <p className="text-gray-600">
          Send tips to anyone below - no registration required to send!
        </p>
      </div>

      {users.filter(u => u.address !== publicKey.toBase58()).length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl">
          <div className="text-5xl mb-4">👥</div>
          <h4 className="text-2xl font-bold mb-2">No Community Members Yet</h4>
          <p className="text-gray-600">The community list will populate as members register their profiles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.filter(u => u.address !== publicKey.toBase58()).map((user) => (
            <div key={user.address} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg">{user.displayName}</div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </div>
              </div>

              {user.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-600">Received</div>
                    <div className="text-sm font-bold">{user.totalReceived.toFixed(3)} SOL</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Rewards</div>
                    <div className="text-sm font-bold text-yellow-600">{user.rewardPoints || 0} pts</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(user)}
                className="w-full primary-button text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform"
              >
                ⚡ Send Tip
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tip Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="glass-card rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">Tip @{selectedUser.username}</h3>
              <button 
                onClick={() => {
                  setSelectedUser(null)
                  setTxSignature('')
                }} 
                className="text-gray-400 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>

            {/* Recipient Info */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 text-center border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {selectedUser.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="font-bold text-xl mb-1">{selectedUser.displayName}</div>
              <div className="text-gray-600 mb-3">@{selectedUser.username}</div>
              {selectedUser.bio && (
                <p className="text-sm text-gray-700">{selectedUser.bio}</p>
              )}
            </div>

            {/* Transaction Success */}
            {txSignature && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center text-green-700 mb-2">
                  <span className="text-2xl mr-2">✓</span>
                  <span className="font-bold">Tip Sent Successfully!</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">+10 reward points earned!</p>
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
                Tip Amount (SOL)
              </label>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                placeholder="0.01"
                step="0.01"
                min="0.001"
                className="w-full rounded-xl px-4 py-4 text-lg border border-black/10 focus:border-black/30 focus:ring-2 focus:ring-black/10"
              />
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600">Minimum: 0.001 SOL</span>
                <span className="text-gray-600">≈ ${tipAmount ? (parseFloat(tipAmount) * 200).toFixed(2) : '0.00'} USD</span>
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {['0.01', '0.05', '0.1', '0.5'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTipAmount(preset)}
                    className="px-3 py-2 bg-black/5 hover:bg-black/10 rounded-lg text-sm font-medium transition-all"
                  >
                    {preset} SOL
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Thanks for being awesome! 🎉"
                maxLength={280}
                rows={3}
                className="w-full rounded-xl px-4 py-4 border border-black/10 focus:border-black/30 focus:ring-2 focus:ring-black/10 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/280 characters</p>
            </div>

            {/* Reward Info */}
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-100">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🎁</div>
                <div className="text-sm text-gray-700">
                  <div className="font-medium">Earn 10 reward points</div>
                  <div className="text-xs">Every tip earns you points toward future token rewards!</div>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={sendTip}
              disabled={loading || !tipAmount || parseFloat(tipAmount) < 0.001}
              className="w-full primary-button text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending Tip...
                </span>
              ) : (
                `⚡ Send ${tipAmount || '0'} SOL Tip`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}