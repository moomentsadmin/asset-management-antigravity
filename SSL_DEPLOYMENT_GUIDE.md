# 🔒 SSL Deployment Guide (Let's Encrypt)

This guide walks you through deploying the Asset Management System with automated SSL/HTTPS using Let's Encrypt.

## ✨ Prerequisites

- A domain name pointing to your server's IP address (e.g., `asset.example.com`).
- Ports **80** and **443** must be open and accessible from the internet.
- Docker and Docker Compose installed.

---

## 🚀 Setup Instructions

### 1. Configure Domain & Email

Edit functionality requires setting your domain in the `.env` file first.

1. Create a `.env` file from `.env.docker` if you haven't already:
   ```bash
   cp .env.docker .env
   ```

2. Add these variables to your `.env` file:
   ```env
   # Your domain name (required for SSL)
   DOMAIN_NAME=asset.yourdomain.com
   
   # Admin email for Let's Encrypt notifications
   ADMIN_EMAIL=admin@yourdomain.com
   ```

### 2. Initialize Certificates

Because Nginx will fail to start if SSL certificates are missing, you must run our initialization script first. This script requests a dummy certificate, starts Nginx, then requests the real certificate.

**Run the script:**

```bash
# If using Linux/macOS
chmod +x ssl/init-letsencrypt.sh
./ssl/init-letsencrypt.sh

# If using Windows (requires Git Bash or WSL)
bash ssl/init-letsencrypt.sh
```

Follow the prompts.

### 3. Start the Application

Once certificates are obtained, start the full stack:

```bash
docker-compose -f docker-compose.ssl.yml up -d
```

---

## 🛠️ Management

### Auto-Renewal
The `certbot` container runs in the background and checks for certificate renewal every 12 hours. If a certificate is renewed, you may need to reload Nginx:

```bash
docker-compose -f docker-compose.ssl.yml exec frontend nginx -s reload
```

### Logs
Check logs to ensure everything is running smoothly:

```bash
docker-compose -f docker-compose.ssl.yml logs -f
```

### Stopping the Stack
To stop the SSL deployment:

```bash
docker-compose -f docker-compose.ssl.yml down
```

---

## 🔍 Troubleshooting

### "Nginx failed to start"
If Nginx keeps restarting, check the logs:
```bash
docker-compose -f docker-compose.ssl.yml logs frontend
```
It usually means certificates are missing. Run `./ssl/init-letsencrypt.sh` again.

### "Challenge failed"
If Let's Encrypt fails to verify your domain:
1. Ensure your DNS A record points to this server's IP.
2. Ensure port 80 is open to the world.
3. Check firewall settings.
