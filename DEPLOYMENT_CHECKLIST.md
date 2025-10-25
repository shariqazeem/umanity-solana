# 🚀 Deployment & Submission Checklist

## Pre-Deployment Checks

### Code Quality
- [x] All features working (donations, pools, tips, leaderboard, activity feed)
- [x] No console errors in browser
- [x] No alert() dialogs (all inline messages)
- [x] Responsive design on mobile
- [x] All links work
- [ ] Test with 2-3 different wallets
- [ ] Verify all transactions on Solscan

### Environment Setup
- [ ] Supabase project created
- [ ] Tables created (run `supabase-schema.sql`)
- [ ] Environment variables set (if using Supabase)
- [ ] Treasury wallet has funds for testing

## Deployment Steps

### 1. Deploy to Vercel (10 minutes)

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Build the project
npm run build

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: umanity-solana
# - Deploy to production: Yes
```

**After deployment:**
- [ ] Test live URL
- [ ] Connect wallet works
- [ ] Make a test donation
- [ ] Check leaderboard populates
- [ ] Verify activity feed shows transactions

### 2. Get Devnet SOL for Treasury

```bash
# Get public key
solana-keygen pubkey ~/.config/solana/umanity-treasury.json

# Visit faucet
# https://faucet.solana.com
# Request 5 SOL
```

### 3. Seed Demo Data (Optional but Recommended)

**Have 2-3 friends help:**
1. Each person connects their wallet
2. Register a profile with fun username
3. Make 1-2 donations (small amounts)
4. Send 1-2 tips to each other
5. This populates leaderboard and activity feed

**Why this matters**: Empty leaderboards look bad. Having real activity shows the product works.

## Hackathon Submission

### Required Materials

#### 1. Screenshots (3-5 images)

**Must capture:**
- [ ] Homepage with value prop banner
- [ ] Donation modal showing success + Solscan link
- [ ] Leaderboard with real data
- [ ] Activity feed with transactions
- [ ] Tipping profile view with reward points

**How to capture:**
- Use Chrome DevTools (F12) → Device toolbar
- Set to "Responsive" or "iPhone 12 Pro"
- Hide sensitive info (wallet addresses if needed)
- Save as PNG, high quality

**Save to:** `/screenshots/` folder

#### 2. Loom Demo Video (2-3 minutes)

**Script:**
```
0:00 - Intro
"Hi, I'm [name]. This is Umanity—gamified philanthropy on Solana.
Traditional platforms charge 5-10% fees, take days to process,
and give donors nothing back. We flip that."

0:20 - Quick Demo
[Screen share your live app]
"Watch this: I connect my wallet..."
[Connect]
"...and donate $2 instantly."
[Click donate, approve transaction]
"Transaction confirmed in under 1 second. I just earned 10 reward points."

0:45 - Show Features
"We have three features: one-tap donations, custom pools for
specific causes, and community tips."
[Switch between tabs quickly]

1:00 - Leaderboard
"The leaderboard shows top contributors. Everyone who donates
or tips earns points that convert to governance tokens at launch."
[Show leaderboard tab]

1:15 - Activity Feed
"The activity feed is live—every transaction shows up instantly."
[Show activity feed]

1:30 - Why Solana
"We built on Solana because it's instant, nearly free, and
fully transparent. Every donation is verifiable on-chain."
[Click Solscan link]

1:45 - Business Model
"Zero fees now to gain traction. Post-launch, optional 1% fee
for charity verification. Token holders govern the platform."

2:00 - Wrap Up
"This is a working prototype on Solana devnet, ready for mainnet.
Try it at [your-url]. Thanks for watching!"
```

**Tips:**
- Don't script it word-for-word, be natural
- Show enthusiasm—you built something cool!
- Keep it under 3 minutes
- Good lighting, clear audio
- Upload to Loom, set to public

**Link:** https://loom.com/share/[your-id]

#### 3. GitHub Repository

- [ ] Code pushed to GitHub
- [ ] README.md updated with demo links
- [ ] HACKATHON_PITCH.md included
- [ ] TESTING_GUIDE.md included
- [ ] .env.example file (if using env vars)
- [ ] Clear installation instructions
- [ ] Screenshots in `/screenshots/` folder

**Repository checklist:**
```bash
# Make sure everything is committed
git status

# Push to GitHub
git add .
git commit -m "Final hackathon submission"
git push origin main

# Set repository to public
# Go to Settings → Danger Zone → Change visibility → Public
```

#### 4. Pitch Deck (Optional but Recommended)

**Create a simple 5-slide deck:**

1. **Title Slide**
   - Umanity: Gamified Philanthropy on Solana
   - Your name, date
   - Logo/screenshot

2. **Problem**
   - 5-10% fees on GoFundMe, Patreon
   - 3-5 day processing
   - Zero incentive for donors
   - $485B charity market

3. **Solution**
   - Instant Solana transactions
   - Zero fees
   - Earn reward points → governance tokens
   - Three features (donate, pools, tips)

4. **Traction Plan**
   - Month 1-2: Launch mainnet, 1K donors
   - Month 3-6: Token launch, 10K users
   - Month 6-12: DAO governance, $1M volume

5. **Team & Ask**
   - Your background
   - What's next: USDC integration, mobile app
   - Contact info

**Tools:**
- Canva (free templates)
- Google Slides
- Pitch.com

**Export as PDF**, upload to GitHub `/pitch-deck/`

## Submission Form

### Information to Prepare

**Project Name:** Umanity

**Tagline:** Gamified philanthropy on Solana—give, earn, govern

**Category:** DeFi / Social Impact / Creator Economy

**Description (500 words max):**
```
Umanity is a gamified donation platform on Solana that rewards every act of giving with points that convert to future governance tokens. We solve three major problems with traditional donation platforms:

1. High Fees: GoFundMe charges 5-10%, Patreon takes 8-12%. We charge zero.
2. Slow Processing: Traditional platforms take 3-5 business days. Solana confirms in <1 second.
3. No Donor Incentive: Donors get nothing back. We give them reward points that convert to tokens.

Our platform has three core features:

ONE-TAP DONATIONS: $2 instant donations with a single click. Perfect for impulse giving. Earn 10 points per donation.

CUSTOM POOLS: Donate any amount to specific causes (medical, education, disaster relief, clean water). Earn 1,000 points per SOL donated. Every transaction is verifiable on Solscan.

COMMUNITY TIPS: Peer-to-peer tipping for creators and community members. Optional registration—anyone can tip, but only registered users receive tips and appear on the leaderboard.

The gamification is the key innovation. Every SOL donated or tipped earns 1,000 reward points. At token launch, 100 points = 1 governance token. Token holders will:
- Vote on which charities get verified
- Decide platform fee structure
- Earn staking rewards
- Get early adopter perks

We built on Supabase to store user profiles, reward points, and transaction metadata. This keeps costs low while we accumulate points off-chain. At token launch, we'll convert points to SPL tokens via merkle tree airdrop—provably fair and transparent.

The business model: zero fees during user acquisition, then optional 1% fee for charity verification. Token holders govern fee decisions. Long-term, we add premium features (custom charity pages, analytics dashboards, matching campaigns).

Why we'll win: We're solving a real problem in a $485B market. Crypto philanthropy is growing 300% YoY, but no platform gamifies it properly. We make giving sticky through rewards, social proof (leaderboards), and future governance.

This is a fully working prototype on Solana devnet, ready for mainnet deployment. We have three major features, a clear path to revenue, and a scalable architecture. With more time, we'd add USDC support, Solana Actions, and mobile apps.

The future: Umanity becomes the default way web3 gives to charity—transparent, instant, rewarding.
```

**Links:**
- GitHub: https://github.com/yourusername/umanity-solana
- Live Demo: https://umanity-solana.vercel.app
- Loom: https://loom.com/share/your-id
- Pitch Deck: (link to GitHub PDF)

**Tech Stack:**
- Solana (Devnet)
- Next.js 15
- Supabase
- Solana Wallet Adapter
- TailwindCSS

**Team Members:**
- [Your Name] - Full Stack Developer

**What You'd Improve:**
1. USDC Integration - Stable donations vs volatile SOL
2. Solana Actions/Blinks - Donate from Twitter/Discord
3. Compressed NFTs - Donation receipts for tax purposes
4. Price Oracle - Real-time SOL/USD via Pyth
5. Mobile App - React Native with push notifications

## Final Checks Before Submitting

- [ ] All links work (GitHub, demo, Loom)
- [ ] Demo site loads without errors
- [ ] Can connect wallet and donate
- [ ] Leaderboard has data (not empty)
- [ ] Activity feed shows transactions
- [ ] Screenshots look professional
- [ ] Loom video is clear and enthusiastic
- [ ] README mentions it's a hackathon project
- [ ] Code is clean and commented

## Post-Submission

### Share on Social
- [ ] Tweet about your submission
- [ ] Post in Solana Discord
- [ ] LinkedIn post
- [ ] Tag @solana, hackathon organizers

### Keep Building
- [ ] Deploy to mainnet if you win
- [ ] Add USDC support
- [ ] Build community on Twitter/Discord
- [ ] Apply to Solana accelerators

---

## Need Help?

**Common Issues:**

**Vercel deployment fails:**
- Check `next.config.js` is correct
- Ensure all imports are valid
- Run `npm run build` locally first

**Supabase connection errors:**
- Verify `.env.local` has correct credentials
- Check Supabase tables exist
- Ensure RLS policies allow access

**Wallet won't connect:**
- Make sure you're on devnet
- Try different wallet (Phantom vs Solflare)
- Clear browser cache

**No activity in leaderboard:**
- Need real transactions first
- Have friends test
- Make a few donations yourself

---

**You've got this! 🚀**

Your app is solid. The features work, the design is clean, and you have a clear business model. Deploy, record the Loom, submit, and celebrate!
