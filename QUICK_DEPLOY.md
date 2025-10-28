# Quick Deploy Guide - Umanity.xyz

Fast reference for deploying to Ubuntu server.

## On Your Mac (Local)

```bash
# 1. Test build locally (optional)
docker build -t umanity-solana .

# 2. Commit and push
git add .
git commit -m "Docker deployment setup"
git push origin main
```

## On Ubuntu Server

### First Time Setup

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in

# 2. Clone repo
git clone https://github.com/YOUR_USERNAME/umanity-solana.git
cd umanity-solana

# 3. Setup environment
cp .env.example .env.local
nano .env.local  # Add your values

# 4. Initial deploy (HTTP only)
mv nginx/conf.d/umanity.conf nginx/conf.d/umanity.conf.backup
docker compose up -d --build

# 5. Get SSL certificate
docker compose stop nginx
docker compose run --rm certbot certonly --standalone \
  -d umanity.xyz -d www.umanity.xyz \
  --email your-email@example.com --agree-tos

# 6. Enable HTTPS
rm nginx/conf.d/default-http.conf
mv nginx/conf.d/umanity.conf.backup nginx/conf.d/umanity.conf
docker compose up -d

# Done! Visit https://umanity.xyz
```

### Updates (After Initial Setup)

```bash
cd ~/umanity-solana
git pull
docker compose up -d --build

# Or use the deploy script
./scripts/deploy.sh
```

## Common Commands

```bash
# View logs
docker compose logs -f app

# Restart
docker compose restart

# Stop
docker compose down

# Check status
docker compose ps

# Renew SSL (auto-renews, but manual if needed)
docker compose run --rm certbot renew
docker compose restart nginx
```

## Troubleshooting

```bash
# Check if containers are running
docker compose ps

# View detailed logs
docker compose logs -f

# Rebuild from scratch
docker compose down
docker compose up -d --build --force-recreate

# Check DNS
dig umanity.xyz +short

# Test nginx config
docker compose exec nginx nginx -t
```

## DNS Configuration

Before deploying, set these DNS records at your registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| A | www | YOUR_SERVER_IP |

Wait 5-60 minutes for DNS propagation.

## Environment Variables (.env.local)

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Firewall Setup

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

For detailed instructions, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)
