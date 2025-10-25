// Platform Configuration
export const PLATFORM_CONFIG = {
  // Platform treasury wallet - ALL donations go here first
  // You control this wallet and can distribute funds to verified charities
  TREASURY_WALLET: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy', // Your treasury wallet

  // Platform fee (0% for hackathon, can add small fee later)
  PLATFORM_FEE_PERCENT: 0,

  // Unified Reward System - ALL activities use the same formula
  POINTS_PER_SOL: 1000, // 1 SOL = 1000 points (base rate)
  POINTS_TO_TOKEN_RATIO: 100, // 100 points = 1 future token
}

// Unified reward calculation function
export function calculateRewardPoints(solAmount: number): number {
  // Simple, consistent formula across all platform activities:
  // Donations, Tips, and Pool Contributions all use the same rate
  // 1 SOL = 1000 points
  // 0.01 SOL = 10 points
  // 0.1 SOL = 100 points
  return Math.floor(solAmount * PLATFORM_CONFIG.POINTS_PER_SOL)
}

// Verified charity partners (where funds will eventually go)
// Currently all use treasury wallet - update with real charity wallets when you partner with them
export const VERIFIED_CHARITIES = [
  {
    id: 'medical',
    name: 'International Medical Relief',
    wallet: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy', // Treasury wallet (update with charity wallet later)
    category: 'Healthcare',
    verified: true,
    description: 'Provides emergency medical care worldwide',
    impact: 'Every $100 funds 1 emergency surgery in underserved areas',
    website: 'https://example-charity.org',
    documents: ['501c3.pdf', 'verification.pdf'], // For transparency
  },
  {
    id: 'education',
    name: 'Global Education Fund',
    wallet: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy', // Treasury wallet (update with charity wallet later)
    category: 'Education',
    verified: true,
    description: 'Scholarships for underprivileged children',
    impact: 'Every $50 provides school supplies for 1 child for a year',
    website: 'https://example-edu.org',
    documents: ['verification.pdf'],
  },
  {
    id: 'disaster',
    name: 'Emergency Response Network',
    wallet: 'BAScBKuDXCqdHxcoqdaDrUyJtFVtjBM5wS8tLd6tsgpy', // Treasury wallet (update with charity wallet later)
    category: 'Emergency',
    verified: true,
    description: 'Rapid response to natural disasters',
    impact: 'Every $200 provides emergency shelter for 1 family',
    website: 'https://example-disaster.org',
    documents: ['verification.pdf'],
  },
]

// How the system works:
// 1. User donates → Funds go to TREASURY_WALLET (your controlled wallet)
// 2. You accumulate donations
// 3. You manually/programmatically distribute to verified charities
// 4. All transactions are on-chain and transparent
// 5. Users can see where their donation goes through transaction history

export const DONATION_FLOW = {
  step1: 'User clicks donate',
  step2: 'Funds transfer to platform treasury',
  step3: 'Platform accumulates donations',
  step4: 'Platform distributes to verified charities',
  step5: 'All steps visible on blockchain',
}
