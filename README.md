# Umanity - Global Donation Platform on Solana

A decentralized donation and tipping platform built on Solana blockchain featuring one-tap donations, transparent donation pools, and instant peer-to-peer tipping.

## 🌟 Features

### 1. One-Tap Donations ($1 donations)
- Single-click $1 donations to verified causes
- Instant transaction confirmation
- Perfect for quick support to global initiatives

### 2. Donation Pools
- Multiple verified donation pools (Medical, Education, Disaster Relief, etc.)
- Flexible donation amounts
- Real-time statistics and transparency
- All transactions verifiable on-chain

### 3. Tipping System
- Register your wallet with username and profile
- Send tips to anyone with a registered account
- Include personal messages with tips
- Track total sent and received amounts

## 🚀 Tech Stack

- **Blockchain**: Solana (Devnet)
- **Smart Contracts**: Anchor Framework (Rust)
- **Frontend**: Next.js 15, React 19, TypeScript
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare, Torus)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

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

## 📝 Future Enhancements

- [ ] Integration with USDC for stable $1 donations
- [ ] Real-time price oracle for SOL/USD conversion
- [ ] Mobile app (React Native)
- [ ] Social features (donation feed, leaderboards)
- [ ] NFT rewards for top donors
- [ ] Recurring donations
- [ ] Multi-signature pool management
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Farcaster frames integration

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
