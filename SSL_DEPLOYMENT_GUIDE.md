# ☁️ Cloud Deployment with SSL (Master Guide)

This is the definitive guide for deploying the Asset Management System to Digital Ocean (or any VPS) with automatic SSL.
**Ignore all other deployment documents.** Follow this guide for a production-ready SSL setup.

## 📋 Prerequisites
1.  **Server**: A VPS (Digital Ocean Droplet, AWS EC2, etc.) with Docker & Docker Compose installed.
    - Recommended: 2 CPU / 4GB RAM (or at least 2GB + Swap).
2.  **Domain**: A valid domain name (e.g., `asset.digile.com`) pointing to your server's *Public IP*.
3.  **Firewall**: Ensure Ports **80** (HTTP) and **443** (HTTPS) are open.

---

## 🚀 Deployment Steps (Start to Finish)

### 1. Prepare Code & Config
If you haven't already, clone the repo and set up your environment.

```bash
# Enter project directory
cd codespaces-antigravity-react-main

# Create environment file
cp .env.example .env

# Edit configuration
nano .env
```

**Required Changes in `.env`:**
```ini
# Production Mode
NODE_ENV=production

# Domain Configuration (CRITICAL for SSL)
DOMAIN_NAME=asset.digile.com
ADMIN_EMAIL=admin@digile.com

# Security Secrets (Change these!)
MONGO_PASSWORD=your_secure_password
JWT_SECRET=your_long_random_secret_string
```

### 2. Reset Database (CRITICAL FIX)
If you have deployed before, or if you see "MongoDB Unhealthy" / "Dependency Failed" errors, you **MUST** reset the database volumes to ensure version compatibility.

```bash
# Run the reset script provided
sh reset-cloud-db.sh

# Type 'yes' when prompted.
```
*This deletes old incompatible data and prepares a clean slate for the stable MongoDB 4.4.*

### 3. Initialize SSL Certificates
This automated script will:
1.  Start a temporary Nginx server.
2.  Request Let's Encrypt certificates for your `DOMAIN_NAME`.
3.  Verify domain ownership.

```bash
# Run the SSL init script
bash ssl/init-letsencrypt.sh
```

**Success Indicator:**
Look for the message: `Congratulations! Your certificate and chain have been saved...`

*   **If it fails with "Connection Refused":** Check your DNS settings. Your domain MUST point to this server.
*   **If it fails with "Firewall":** Check Port 80 is open.

### 4. Start the Application
Once the certificates are successfully generated, start the full production stack.

```bash
docker compose -f docker-compose.ssl.yml up -d --build
```

### 5. Verify Deployment
1.  Open your browser to `https://asset.digile.com` (your domain).
2.  You should see the login screen.
3.  Login with default credentials (if not changed):
    *   User: `admin`
    *   Pass: `Admin@123456`

---

## 🛠 Common Troubleshooting

### 🔴 MongoDB Unhealthy / Dependency Failed
**Cause:** Old data from a previous deployment (MongoDB 8.0) is clashing with the stable version (4.4).
**Fix:**
```bash
docker compose down
sh reset-cloud-db.sh
docker compose -f docker-compose.ssl.yml up -d
```

### 🔴 Nginx Failed / "Certificates Missing"
**Cause:** The SSL initialization script (Step 3) was skipped or failed. Nginx cannot start without certificates.
**Fix:**
Run `bash ssl/init-letsencrypt.sh` again and fix any DNS errors it reports.

### 🔴 502 Bad Gateway
**Cause:** The Backend API is strictly starting up or failed to connect to DB.
**Fix:**
Check backend logs:
```bash
docker compose -f docker-compose.ssl.yml logs backend
```
Wait 30-60 seconds for the backend to fully initialize.

### 🔴 Certbot "Connection Refused"
**Cause:** Nginx didn't start or Port 80 is blocked.
**Fix:**
Ensure `DOMAIN_NAME` is correct in `.env`.
Ensure `init-letsencrypt.sh` sourced the `.env` file (we patched this, so just re-run it).
