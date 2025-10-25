# Umanity - Gamified Philanthropy on Solana 🎁

> **Solana Hackathon Submission** - Making generosity rewarding through blockchain technology

A gamified donation and tipping platform built on Solana that rewards every act of giving with points that convert to future governance tokens. We make philanthropy **instant, transparent, and rewarding**.

## 🎥 Demo

- **Live App**: [https://umanity-solana.vercel.app](https://umanity-solana.vercel.app) *(Update with your deployment)*
- **Loom Demo**: [2-minute walkthrough](https://loom.com/share/your-demo-id) *(Record and add)*
- **Pitch Deck**: [View Full Pitch](./HACKATHON_PITCH.md)

## 🏆 Hackathon Highlights

**Problem Solved**: Traditional donation platforms charge 5-10% fees, take 3-5 days to process, and offer zero incentive for donors.

**Our Solution**: Instant Solana transactions, zero fees, gamified rewards system where 1 SOL donated = 1,000 points → future governance tokens.

**Why It Matters**: $485B global charity market, but donors get nothing back. We flip that—donors earn while giving.

## 🌟 Features

### 1. One-Tap Donations ($2 Quick Give)
- Single-click $2 (0.01 SOL) donations
- Instant transaction confirmation (<1 second)
- **Earn 10 reward points** per donation
- Perfect for quick support to global initiatives

### 2. Custom Donation Pools
- Multiple verified causes: 🏥 Medical | 📚 Education | 🆘 Disaster Relief | 💧 Water Access
- Donate any amount (min 0.001 SOL)
- **Earn 1,000 points per SOL** donated
- Real-time statistics: total raised, contributor count
- All transactions verifiable on Solscan
- View wallet transactions for full transparency

### 3. Community Tipping System
- Optional registration (receive tips) vs browse-only mode
- Send tips to creators, community members, anyone
- **Earn points on every tip** (1,000 per SOL)
- Include personal messages with tips
- Track: SOL received, SOL sent, total reward points
- No registration needed to send tips!

## 🎮 Gamification & Rewards

**The Hook**: Every transaction earns reward points that convert to governance tokens at launch.

- **1 SOL = 1,000 points**
- **100 points = 1 future governance token**
- Example: Donate 0.1 SOL → earn 100 points → get 1 token at launch

**Governance Token Benefits**:
- Vote on which charities get verified
- Decide platform fee structure (0-1%)
- Earn staking rewards
- Early adopter airdrops

**Why This Works**: Donors get tangible value, not just warm feelings. Points accumulate in Supabase, ready for token launch.

## 🚀 Tech Stack

- **Blockchain**: Solana Devnet (ready for mainnet)
- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: Supabase (PostgreSQL) - stores user profiles, reward points, transaction metadata
- **Wallet Integration**: Solana Wallet Adapter (Phantom, Solflare, Torus)
- **Styling**: Tailwind CSS with glassmorphism effects
- **State Management**: React Hooks + Server Components
- **Deployment**: Vercel (instant global CDN)

## 📦 Project Structure

```
umanity-solana/
├── programs/                  # Solana programs (smart contracts)
│   ├── umanity-donations/    # Donation pools program
│   └── umanity-tips/         # Tipping system program
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── pools/           # Pool endpoints
│   │   ├── register/        # User registration
│   │   └── tips/            # Tipping endpoints
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/              # React components
│   ├── wallet/             # Wallet connection
│   ├── donation/           # Donation UI
│   └── tips/               # Tipping UI
└── lib/                    # Utilities
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.18+
- Anchor 0.30+
- A Solana wallet (Phantom recommended)

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Solana Programs

```bash
# Build programs
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### 3. Update Program IDs

After deployment, update the program IDs in:
- `programs/umanity-donations/src/lib.rs` (line 4)
- `programs/umanity-tips/src/lib.rs` (line 4)
- `Anchor.toml`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 💡 How It Works

### One-Tap Donations
1. Connect your Solana wallet
2. Click "Donate $1" on any pool
3. Approve transaction in wallet
4. Donation recorded on-chain instantly

### Custom Pool Donations
1. Browse available donation pools
2. Click "Donate Any Amount"
3. Enter your donation amount in SOL
4. View all transactions on Solscan

### Tipping
1. Register your account with username
2. Share your wallet address
3. Others can tip you directly
4. All tips go straight to your wallet

## 🔒 Transparency & Trust

- **On-Chain Verification**: Every donation is recorded on Solana blockchain
- **Public Transactions**: View all transactions on Solscan
- **No Intermediaries**: Direct wallet-to-wallet or wallet-to-pool transfers
- **Real-Time Stats**: Live updates of total donations and donor counts

## 🎯 Smart Contract Features

### Donation Pools Program
- Initialize donation pools with metadata
- One-tap donation (fixed $1 equivalent in SOL)
- Custom amount donations
- Pool statistics tracking
- Withdrawal functionality (admin only)

### Tipping Program
- User registration with profiles
- Direct peer-to-peer tips
- Message support
- Statistics tracking (sent/received amounts)
- Profile management

## 📊 Program Accounts

### Pool Account
```rust
pub struct Pool {
    pub authority: Pubkey,
    pub name: String,
    pub description: String,
    pub emoji: String,
    pub pool_type: u8,
    pub total_donated: u64,
    pub donor_count: u64,
    pub is_active: bool,
}
```

### User Profile
```rust
pub struct UserProfile {
    pub owner: Pubkey,
    pub username: String,
    pub display_name: String,
    pub bio: String,
    pub total_received: u64,
    pub total_sent: u64,
    pub is_active: bool,
}
```

## 🔧 API Endpoints

### Pools
- `GET /api/pools` - List all pools
- `POST /api/pools/donate` - Record donation

### Registration
- `POST /api/register` - Register user
- `GET /api/register/check` - Check registration status

### Tips
- `GET /api/tips/users` - List registered users
- `POST /api/tips/send` - Record tip transaction

## 🚀 Deployment

### Vercel Deployment

```bash
npm run build
vercel deploy
```

### Environment Variables

No environment variables needed for basic deployment. For production:

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=your_rpc_endpoint
```

## 📝 What We'd Improve With More Time

*As required by hackathon submission guidelines*

### Technical Improvements:
1. **USDC Integration**: Stable donations instead of volatile SOL for predictable giving
2. **Solana Actions & Blinks**: Donate directly from Twitter/Discord without leaving the platform
3. **Compressed NFTs**: Issue donation receipts as cNFTs for tax purposes
4. **Price Oracle**: Real-time SOL/USD conversion using Pyth Network
5. **Mobile App**: React Native app with push notifications for donation updates

### Product Features:
6. **Social Proof**: Public donation feed, leaderboards, donor badges
7. **Recurring Donations**: Set-and-forget monthly giving with auto-debit
8. **Impact Tracking**: Photos/videos from charities showing real-world impact
9. **Charity Onboarding**: Self-service verification flow with KYC/AML
10. **Analytics Dashboard**: Donor insights, charity performance metrics

### Business Model:
11. **Token Launch**: Airdrop governance tokens to early donors based on points
12. **DAO Governance**: Community votes on verified charities, fees, roadmap
13. **Matching Campaigns**: Corporate sponsors match donations 2x-3x
14. **NFT Marketplace**: Trade donor badges, charity-specific NFTs
15. **Tax Integration**: Automatic 501(c)(3) receipts for US donors

**Priority for Next Sprint**: USDC integration + Solana Actions would make this 10x more usable.

## 🎨 Design Philosophy

The UI follows a minimalist, professional design inspired by modern fintech apps:
- Clean black and white color scheme
- Glass-morphism effects
- Smooth animations and transitions
- Mobile-responsive design
- Accessible and intuitive UX

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🆘 Support

For issues and questions:
- Open a GitHub issue
- Contact: [your-email]
- Documentation: [link to docs]

## 🙏 Acknowledgments

- Solana Foundation
- Anchor Framework team
- Open source contributors

---

**Built for the Solana Hackathon** | Making crypto donations simple, transparent, and impactful.
