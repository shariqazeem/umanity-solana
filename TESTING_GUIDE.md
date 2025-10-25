# Testing Guide for Judges 🧪

## Quick Start (2 minutes)

### Option 1: Test Without Installing Anything

1. **Visit Live Demo**: [https://umanity-solana.vercel.app](https://umanity-solana.vercel.app)
2. **Install Phantom Wallet** (if you don't have it):
   - Chrome: [chrome.google.com/webstore](https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa)
   - Create new wallet (takes 30 seconds)
   - Switch network to "Devnet" in settings
3. **Get Free Devnet SOL**:
   - Click "Get Devnet SOL" button in app, OR
   - Visit [faucet.solana.com](https://faucet.solana.com)
   - Paste your wallet address, get 2 SOL for free
4. **Test All Features**:
   - ✅ One-tap donation ($2)
   - ✅ Custom pool donation (any amount)
   - ✅ Register profile (optional)
   - ✅ Send tips to others

### Option 2: Run Locally

```bash
# Clone repo
git clone https://github.com/yourusername/umanity-solana.git
cd umanity-solana

# Install dependencies
npm install

# Setup Supabase (optional - demo data works without it)
# 1. Create project at supabase.com
# 2. Run SQL from supabase-schema.sql
# 3. Add .env.local with credentials

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Test Scenarios

### Scenario 1: Quick Donor (No Registration)
**Goal**: Test fastest path to donation

1. Connect wallet
2. Click "Donate $2" on One-Tap section
3. Approve transaction
4. See success message with reward points
5. Check Platform Impact stats update

**Expected**: <10 seconds from wallet connect to confirmed donation

### Scenario 2: Custom Amount Donor
**Goal**: Test flexible donation amounts

1. Navigate to "Custom" tab
2. Click any pool (Medical, Education, etc.)
3. Enter custom amount (try 0.01 SOL)
4. Donate and confirm
5. Click "View Wallet Transactions" → see on Solscan

**Expected**: Transaction visible on blockchain, contributor count increases

### Scenario 3: Community Member (Registration + Tips)
**Goal**: Test tipping system

1. Navigate to "Tips" tab
2. Click "Register Profile"
3. Enter username, display name, bio
4. Register (this creates your profile)
5. Browse other users
6. Tip someone (min 0.001 SOL)
7. Check your profile - see "SOL Sent" and "Reward Points"

**Expected**: Profile shows up in community, tips work instantly

### Scenario 4: Browse-Only Mode
**Goal**: Test that anyone can tip without registering

1. Connect fresh wallet (don't register)
2. Go to "Tips" tab
3. See banner: "Want to receive tips too?"
4. Click "Maybe later" to dismiss
5. Browse community members
6. Tip someone without registering

**Expected**: You can send tips, but won't appear in community list

## What to Look For

### ✅ Technical Functionality (30 points)
- [ ] Wallet connects smoothly (Phantom, Solflare work)
- [ ] Transactions confirm in <2 seconds
- [ ] All buttons/features work without errors
- [ ] Stats update in real-time
- [ ] Solscan links work
- [ ] Responsive on mobile

### ✅ Product Usefulness (25 points)
- [ ] Clear value prop (rewards for giving)
- [ ] Solves real problem (fees, incentives)
- [ ] Intuitive UI (don't need instructions)
- [ ] Gamification makes sense
- [ ] Business model is viable

### ✅ Creativity & Innovation (20 points)
- [ ] Unique reward points system
- [ ] Gamified philanthropy (new concept)
- [ ] Future token conversion (clever)
- [ ] Optional registration (smart UX)
- [ ] Multi-feature platform (3 in 1)

### ✅ User Experience (15 points)
- [ ] Beautiful, modern design
- [ ] No browser alert popups (inline messages)
- [ ] Clear feedback on every action
- [ ] Loading states visible
- [ ] Error handling graceful

### ✅ Open Source (5 points)
- [ ] Full code on GitHub
- [ ] Clear README
- [ ] Well-structured codebase
- [ ] Comments where needed

### ✅ Business Model Clarity (5 points)
- [ ] Path to revenue explained
- [ ] Token economics make sense
- [ ] Sustainable long-term
- [ ] Clear go-to-market

## Common Questions

**Q: Is this on mainnet?**
A: No, devnet only for hackathon. Mainnet-ready code, just need to switch network and deploy.

**Q: Where do donations actually go?**
A: Treasury wallet controlled by platform (you). In production, funds would be distributed to verified charities on schedule.

**Q: Are reward points on-chain?**
A: No, stored in Supabase for speed/cost. At token launch, they'd be converted to on-chain SPL tokens via merkle tree airdrop.

**Q: Can I donate without wallet?**
A: No, Solana requires wallet. But we plan to add Solana Pay QR codes for instant donations.

**Q: What happens if I donate twice?**
A: Points accumulate! Each donation adds to your total. Future token airdrop scales with points.

## Screenshots Locations

For submission, use these screens:

1. **Homepage** - Shows all three tabs, clean design
2. **Donation Modal** - Custom pool with Solscan link
3. **Tipping Success** - Green success message, reward points visible
4. **Profile View** - Shows reward points, SOL received/sent stats

## Loom Demo Script

*Record 2-3 minute walkthrough hitting these beats:*

1. **Intro (15s)**: "Hi, I'm [name]. This is Umanity—gamified philanthropy on Solana."
2. **Problem (20s)**: "Traditional platforms charge 5-10% fees, donors get nothing back."
3. **Demo (90s)**:
   - Connect wallet
   - One-tap donation → show reward points
   - Custom pool → show Solscan verification
   - Tips → show optional registration
4. **Why Solana (20s)**: "Instant transactions, near-zero fees, full transparency."
5. **Future (15s)**: "Reward points convert to governance tokens. Donors become stakeholders."
6. **CTA (10s)**: "Try it at [link]. Feedback welcome!"

## Support

Issues? Questions?
- GitHub Issues: [link]
- Email: [your-email]
- Twitter: [@yourhandle]

---

**Thank you for testing! 🙏**

Every donation, tip, and registration helps prove the concept. This is about showing that web3 philanthropy can work—and be rewarding for everyone involved.
