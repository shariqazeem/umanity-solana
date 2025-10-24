# Deployment Guide for Umanity Solana

## Quick Deploy Checklist

- [ ] Install Solana CLI and Anchor
- [ ] Build and deploy programs
- [ ] Update program IDs
- [ ] Install frontend dependencies
- [ ] Test locally
- [ ] Deploy to Vercel

## Step-by-Step Deployment

### 1. Setup Solana CLI

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Verify installation
solana --version

# Create a new keypair (if you don't have one)
solana-keygen new --outfile ~/.config/solana/id.json

# Set to devnet
solana config set --url devnet

# Airdrop some SOL for deployment
solana airdrop 2
```

### 2. Install Anchor

```bash
# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.1 anchor-cli

# Verify
anchor --version
```

### 3. Build Solana Programs

```bash
# From project root
anchor build

# This creates:
# - target/deploy/umanity_donations.so
# - target/deploy/umanity_tips.so
```

### 4. Deploy Programs to Devnet

```bash
# Deploy both programs
anchor deploy --provider.cluster devnet

# You'll see output like:
# Program Id: ABC123... (donations)
# Program Id: DEF456... (tips)
```

### 5. Update Program IDs

Copy the deployed program IDs and update:

**programs/umanity-donations/src/lib.rs**
```rust
declare_id!("YOUR_DEPLOYED_DONATIONS_PROGRAM_ID");
```

**programs/umanity-tips/src/lib.rs**
```rust
declare_id!("YOUR_DEPLOYED_TIPS_PROGRAM_ID");
```

**Anchor.toml**
```toml
[programs.devnet]
umanity_donations = "YOUR_DEPLOYED_DONATIONS_PROGRAM_ID"
umanity_tips = "YOUR_DEPLOYED_TIPS_PROGRAM_ID"
```

### 6. Rebuild After ID Update

```bash
# Rebuild with correct IDs
anchor build

# Upgrade deployed programs
anchor upgrade target/deploy/umanity_donations.so --program-id YOUR_DONATIONS_ID --provider.cluster devnet
anchor upgrade target/deploy/umanity_tips.so --program-id YOUR_TIPS_ID --provider.cluster devnet
```

### 7. Initialize Pools (Optional)

Create a script to initialize donation pools:

```bash
# Create initialization script
anchor run initialize-pools
```

### 8. Test Frontend Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Test all features:
- [ ] Wallet connection
- [ ] One-tap donations
- [ ] Custom pool donations
- [ ] User registration
- [ ] Tipping functionality

### 9. Deploy to Vercel

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel deploy --prod
```

Or use Vercel GitHub integration:
1. Push code to GitHub
2. Import project on Vercel
3. Vercel auto-deploys on push

### 10. Post-Deployment Verification

1. **Test on Devnet**
   - Connect wallet
   - Make test donations
   - Register test user
   - Send test tips

2. **Verify Transactions**
   - Check transactions on [Solscan Devnet](https://solscan.io/?cluster=devnet)
   - Verify program accounts

3. **Monitor Program Logs**
   ```bash
   solana logs --url devnet YOUR_PROGRAM_ID
   ```

## Production Deployment (Mainnet)

### Additional Steps for Mainnet

1. **Security Audit**
   - Get programs audited by professionals
   - Review all smart contract code

2. **Get Mainnet SOL**
   ```bash
   # Switch to mainnet
   solana config set --url mainnet-beta

   # Fund your wallet (purchase SOL)
   # You'll need ~5-10 SOL for deployment
   ```

3. **Deploy to Mainnet**
   ```bash
   anchor deploy --provider.cluster mainnet-beta
   ```

4. **Update Frontend Config**
   - Change network to mainnet-beta
   - Update RPC endpoint to production RPC
   - Consider using paid RPC (Helius, QuickNode)

5. **Set Up Database**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Set up proper user authentication
   - Implement caching (Redis)

6. **Enable Monitoring**
   - Set up error tracking (Sentry)
   - Monitor transaction success rates
   - Track user analytics

## Environment Variables

For production, set these in Vercel:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=your_premium_rpc_endpoint
NEXT_PUBLIC_DONATIONS_PROGRAM_ID=deployed_program_id
NEXT_PUBLIC_TIPS_PROGRAM_ID=deployed_program_id
DATABASE_URL=your_database_url
```

## Troubleshooting

### Program Deployment Fails
```bash
# Check SOL balance
solana balance

# Increase transaction size if needed
solana program deploy --max-len 200000 program.so
```

### Wallet Connection Issues
- Ensure wallet is on correct network (devnet/mainnet)
- Clear browser cache
- Try different wallet (Phantom, Solflare)

### Transaction Failures
- Check SOL balance for gas fees
- Verify program is deployed
- Check transaction logs on Solscan

## Cost Estimates

### Devnet (Free)
- Program deployment: Free (airdrop SOL)
- Testing transactions: Free

### Mainnet
- Program deployment: ~2-5 SOL ($40-100)
- Transaction fees: ~0.000005 SOL per transaction
- Rent exemption for accounts: ~0.001-0.002 SOL per account

## Resources

- [Solana Docs](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Solscan Explorer](https://solscan.io/)

## Support

For deployment issues:
1. Check Anchor Discord
2. Solana Stack Exchange
3. Open GitHub issue
