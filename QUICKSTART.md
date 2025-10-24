# Quick Start Guide - 5 Minutes to Running

## Prerequisites
- Node.js 18+ installed
- Solana CLI installed
- Anchor CLI installed
- Phantom wallet browser extension

## 1. Install & Setup (2 minutes)

```bash
# Clone/navigate to project
cd umanity-solana

# Run automated setup
./scripts/setup.sh

# Or manually:
npm install
solana config set --url devnet
anchor build
```

## 2. Deploy Programs (1 minute)

```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Note the program IDs from output
```

## 3. Update Program IDs (30 seconds)

Replace in these files:

**programs/umanity-donations/src/lib.rs** (line 4):
```rust
declare_id!("YOUR_DEPLOYED_DONATIONS_ID");
```

**programs/umanity-tips/src/lib.rs** (line 4):
```rust
declare_id!("YOUR_DEPLOYED_TIPS_ID");
```

**Anchor.toml**:
```toml
[programs.devnet]
umanity_donations = "YOUR_DEPLOYED_DONATIONS_ID"
umanity_tips = "YOUR_DEPLOYED_TIPS_ID"
```

## 4. Run Frontend (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

## 5. Test It Out (1 minute)

1. Click "Connect Wallet" (top right)
2. Select Phantom wallet
3. Approve connection
4. Click "Donate $1" on any pool
5. Approve transaction
6. See success! ✅

## Troubleshooting

### "Insufficient SOL for transaction"
```bash
solana airdrop 2
```

### "Program not found"
- Make sure you updated program IDs after deployment
- Rebuild: `anchor build`

### Wallet won't connect
- Ensure Phantom is on Devnet (Settings → Change Network → Devnet)
- Refresh browser

## Features to Test

✅ One-tap $1 donations
✅ Custom amount donations to pools
✅ Register for tipping
✅ Send tips to other users
✅ View transactions on Solscan

## Next Steps

- Read full [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production
- Review [HACKATHON_SUBMISSION.md](HACKATHON_SUBMISSION.md)

## Getting SOL on Devnet

```bash
# Get your address
solana address

# Request airdrop
solana airdrop 2

# Check balance
solana balance
```

You can also use:
- https://solfaucet.com/
- https://faucet.solana.com/

---

**Ready in 5 minutes!** 🚀
