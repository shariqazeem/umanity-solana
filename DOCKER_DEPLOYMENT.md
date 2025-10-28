# Docker Deployment Guide for Ubuntu Server

Complete guide to deploy Umanity Solana app on Ubuntu server with Docker and domain configuration for **umanity.xyz**.

## Prerequisites on Ubuntu Server

1. **Ubuntu Server** (20.04 LTS or newer)
2. **Docker & Docker Compose** installed
3. **Domain DNS configured** - Point umanity.xyz to your server IP
4. **Ports open**: 80 (HTTP), 443 (HTTPS), 22 (SSH)

---

## Part 1: Local Testing (macOS)

### 1. Test Docker Build Locally

```bash
# Build the Docker image
docker build -t umanity-solana .

# Test run (without docker-compose)
docker run -p 3000:3000 --env-file .env.local umanity-solana

# Visit http://localhost:3000
```

### 2. Test with Docker Compose

```bash
# Start only the app (without nginx for local testing)
docker-compose up app

# Visit http://localhost:3000
```

### 3. Commit and Push to GitHub

```bash
# Add Docker files
git add Dockerfile docker-compose.yml .dockerignore nginx/ next.config.ts

# Commit
git commit -m "Add Docker deployment configuration with nginx and SSL"

# Push to GitHub
git push origin main
```

---

## Part 2: Ubuntu Server Setup

### Step 1: Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, to avoid using sudo)
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker --version
docker compose version
```

### Step 2: Clone Repository

```bash
# Clone your repo
cd ~
git clone https://github.com/YOUR_USERNAME/umanity-solana.git
cd umanity-solana
```

### Step 3: Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your production values
nano .env.local
```

Add your production environment variables:
```env
# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Add any other environment variables
```

### Step 4: Verify DNS Configuration

Before proceeding, ensure your domain points to your server:

```bash
# Check DNS resolution
dig umanity.xyz +short

# Should return your server's IP address
```

**Configure DNS Records:**
- Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
- Add/Update A records:
  - `@` (root) → Your Server IP
  - `www` → Your Server IP
- Wait for DNS propagation (can take 5-60 minutes)

---

## Part 3: Initial Deployment (HTTP Only)

### Step 1: Start with HTTP Configuration

First, we'll deploy without SSL to ensure everything works:

```bash
# Temporarily rename SSL config
cd ~/umanity-solana
mv nginx/conf.d/umanity.conf nginx/conf.d/umanity.conf.ssl-backup

# Use HTTP-only config
# (default-http.conf is already in place)

# Build and start services
docker compose up -d --build
```

### Step 2: Verify HTTP Access

```bash
# Check running containers
docker compose ps

# Check logs
docker compose logs -f app
docker compose logs -f nginx

# Test from server
curl http://localhost

# Test from your browser
# Visit http://umanity.xyz
```

---

## Part 4: SSL Certificate Setup

### Step 1: Obtain SSL Certificate

```bash
# Stop nginx temporarily
docker compose stop nginx

# Run certbot to get certificate
docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d umanity.xyz \
  -d www.umanity.xyz \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Alternative: Interactive mode if above fails
docker compose run --rm certbot certonly --standalone \
  -d umanity.xyz \
  -d www.umanity.xyz \
  --email your-email@example.com \
  --agree-tos
```

### Step 2: Switch to SSL Configuration

```bash
# Remove HTTP-only config
rm nginx/conf.d/default-http.conf

# Restore SSL config
mv nginx/conf.d/umanity.conf.ssl-backup nginx/conf.d/umanity.conf

# Restart all services
docker compose restart

# Or restart just nginx
docker compose restart nginx
```

### Step 3: Verify HTTPS Access

```bash
# Check certificate
docker compose exec nginx ls -la /etc/letsencrypt/live/umanity.xyz/

# Test HTTPS
curl https://umanity.xyz

# Visit in browser
# https://umanity.xyz
```

---

## Part 5: Management Commands

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f nginx

# Last 100 lines
docker compose logs --tail=100 app
```

### Restarting Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart app
docker compose restart nginx
```

### Stopping Services

```bash
# Stop all services
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove including volumes (careful!)
docker compose down -v
```

### Updating the Application

```bash
cd ~/umanity-solana

# Pull latest code
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Or rebuild specific service
docker compose up -d --build app
```

### SSL Certificate Renewal

Certificates auto-renew via the certbot container, but you can manually renew:

```bash
# Test renewal (dry-run)
docker compose run --rm certbot renew --dry-run

# Force renewal
docker compose run --rm certbot renew --force-renewal

# Reload nginx after renewal
docker compose exec nginx nginx -s reload
```

---

## Part 6: Monitoring & Maintenance

### Health Checks

```bash
# Check container health
docker compose ps

# Check app health endpoint
curl http://localhost:3000/api/health

# Check nginx status
docker compose exec nginx nginx -t
```

### Disk Space Management

```bash
# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a

# Remove old images
docker image prune -a
```

### Backup Strategy

```bash
# Backup environment file
cp .env.local .env.local.backup

# Backup SSL certificates
sudo tar -czf ssl-backup.tar.gz certbot/

# Backup application data if needed
docker compose exec app tar -czf /app/backup.tar.gz /app/data
```

---

## Part 7: Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs app

# Check if port is already in use
sudo netstat -tlnp | grep :3000

# Rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

### SSL Certificate Issues

```bash
# Check certificate files
docker compose exec nginx ls -la /etc/letsencrypt/live/umanity.xyz/

# Check nginx config
docker compose exec nginx nginx -t

# Manually test certbot
docker compose run --rm certbot certificates
```

### DNS Not Resolving

```bash
# Test DNS from server
dig umanity.xyz +short
nslookup umanity.xyz

# Check nginx logs
docker compose logs nginx

# Test locally on server
curl -H "Host: umanity.xyz" http://localhost
```

### Next.js Build Errors

```bash
# Check build logs
docker compose logs app

# Rebuild with verbose output
docker compose build --progress=plain app

# Check environment variables
docker compose exec app env | grep NEXT_PUBLIC
```

---

## Part 8: Security Best Practices

### Firewall Configuration

```bash
# Install UFW (Uncomplicated Firewall)
sudo apt install ufw

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d
```

### Secure Environment Variables

```bash
# Set proper permissions
chmod 600 .env.local

# Never commit .env.local to git
cat .gitignore | grep .env.local
```

---

## Quick Reference Commands

```bash
# Deploy/Update
git pull && docker compose up -d --build

# View logs
docker compose logs -f app

# Restart
docker compose restart

# Stop
docker compose stop

# Full restart
docker compose down && docker compose up -d

# Check status
docker compose ps

# Renew SSL
docker compose run --rm certbot renew && docker compose restart nginx
```

---

## Support

If you encounter issues:

1. Check logs: `docker compose logs -f`
2. Verify DNS: `dig umanity.xyz`
3. Test nginx config: `docker compose exec nginx nginx -t`
4. Check firewall: `sudo ufw status`
5. Verify environment variables: `docker compose exec app env`

For more help, check the main README.md or open an issue on GitHub.
