# 🐳 Docker Local Deployment - Step by Step

## ⚠️ Important: Docker Desktop Must Be Running

Before starting, ensure **Docker Desktop is running** on your system.

### Start Docker Desktop

1. **Open Docker Desktop** application
2. **Wait** for Docker to fully start (whale icon in system tray should be stable)
3. **Verify** Docker is running by checking the system tray icon

---

## 🚀 Quick Start (After Docker is Running)

### Option 1: Start with Build (Recommended for first time)

```powershell
# Navigate to project directory
cd e:\docker-local-test\codespaces-react-antigravity-main\codespaces-react-main

# Start all services with build
docker compose -f docker-compose.dev.yml up --build
```

### Option 2: Start in Background

```powershell
# Start in detached mode (background)
docker compose -f docker-compose.dev.yml up -d --build

# View logs
docker compose -f docker-compose.dev.yml logs -f
```

---

## 📋 Pre-Deployment Checklist

### 1. Check Docker Status
```powershell
# Verify Docker is running
docker --version
docker-compose --version
docker ps
```

**Expected Output:**
```
Docker version 29.1.3, build f52814d
Docker Compose version v2.40.3-desktop.1
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### 2. Check Ports Availability
```powershell
# Check if ports are free
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :27017
```

**If ports are in use**, either:
- Stop the processes using those ports
- Or modify ports in `docker-compose.dev.yml`

### 3. Verify Files Exist
```powershell
# Check Docker files exist
dir docker-compose.dev.yml
dir Dockerfile.frontend.dev
dir server\Dockerfile.dev
```

---

## 🎯 Deployment Steps

### Step 1: Start Docker Desktop

1. Open **Docker Desktop** from Start Menu
2. Wait for Docker engine to start (30-60 seconds)
3. Verify Docker icon in system tray shows "Docker Desktop is running"

### Step 2: Open PowerShell/Terminal

```powershell
# Navigate to project directory
cd e:\docker-local-test\codespaces-react-antigravity-main\codespaces-react-main
```

### Step 3: Start Services

```powershell
# Start all services (MongoDB, Backend, Frontend)
docker-compose -f docker-compose.dev.yml up --build
```

**What happens:**
1. **MongoDB** starts first (takes ~10-15 seconds)
2. **Backend** waits for MongoDB health check, then starts (~20-30 seconds)
3. **Frontend** starts after backend (~30-40 seconds)

**Total startup time:** ~1-2 minutes

### Step 4: Wait for Services to Start

Watch the logs for these messages:

**MongoDB:**
```
mongodb  | Waiting for connections on port 27017
```

**Backend:**
```
backend  | Server running on port 5000
backend  | MongoDB connected
```

**Frontend:**
```
frontend | VITE v6.3.6  ready in XXX ms
frontend | ➜  Local:   http://localhost:3000/
```

### Step 5: Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

**Default Login:**
```
Username: admin
Password: Admin@123456
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Docker is not running"

**Error:**
```
error during connect: This error may indicate that the docker daemon is not running
```

**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start
3. Try the command again

### Issue 2: "Port is already allocated"

**Error:**
```
Bind for 0.0.0.0:3000 failed: port is already allocated
```

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual PID)
taskkill /PID <PID> /F

# Or change port in docker-compose.dev.yml
```

### Issue 3: "Cannot find Dockerfile"

**Error:**
```
unable to prepare context: unable to evaluate symlinks in Dockerfile path
```

**Solution:**
```powershell
# Verify you're in the correct directory
pwd

# Should show: e:\docker-local-test\codespaces-react-antigravity-main\codespaces-react-main

# Verify files exist
dir docker-compose.dev.yml
dir Dockerfile.frontend.dev
dir server\Dockerfile.dev
```

### Issue 4: Build Fails

**Solution:**
```powershell
# Clean up and rebuild
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up --build --force-recreate
```

### Issue 5: Services Won't Stop

**Solution:**
```powershell
# Force stop all containers
docker compose -f docker-compose.dev.yml down --remove-orphans

# If that doesn't work
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

---

## 📊 Monitoring & Management

### View Running Containers
```powershell
docker compose -f docker-compose.dev.yml ps
```

### View Logs
```powershell
# All services
docker compose -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f mongodb
```

### Restart Services
```powershell
# Restart all
docker compose -f docker-compose.dev.yml restart

# Restart specific service
docker compose -f docker-compose.dev.yml restart backend
```

### Stop Services
```powershell
# Stop all (keeps data)
docker compose -f docker-compose.dev.yml down

# Stop and remove data (WARNING: Deletes database)
docker compose -f docker-compose.dev.yml down -v
```

---

## 🔧 Development Workflow

### Making Code Changes

**Frontend Changes:**
1. Edit files in `src/` directory
2. Vite automatically hot-reloads
3. See changes instantly in browser at http://localhost:3000

**Backend Changes:**
1. Edit files in `server/` directory
2. Nodemon automatically restarts server
3. API changes take effect immediately

### Installing New Packages

**Frontend:**
```powershell
docker compose -f docker-compose.dev.yml exec frontend npm install <package-name>
```

**Backend:**
```powershell
docker compose -f docker-compose.dev.yml exec backend npm install <package-name>
```

### Accessing Container Shell

**Backend:**
```powershell
docker compose -f docker-compose.dev.yml exec backend sh
```

**Frontend:**
```powershell
docker compose -f docker-compose.dev.yml exec frontend sh
```

**MongoDB:**
```powershell
docker compose -f docker-compose.dev.yml exec mongodb mongosh -u admin -p password
```

---

## ✅ Verification Checklist

After deployment, verify everything is working:

- [ ] Docker Desktop is running
- [ ] All 3 containers are running (`docker compose ps`)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend health check returns OK: http://localhost:5000/api/health
- [ ] Can login with admin credentials
- [ ] MongoDB is accessible (check backend logs)
- [ ] Hot reload works (make a small change and verify)

---

## 🎯 Quick Commands Reference

```powershell
# Start everything
docker compose -f docker-compose.dev.yml up --build

# Start in background
docker compose -f docker-compose.dev.yml up -d --build

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop everything
docker compose -f docker-compose.dev.yml down

# Restart
docker compose -f docker-compose.dev.yml restart

# Clean everything (including data)
docker compose -f docker-compose.dev.yml down -v

# View running containers
docker compose -f docker-compose.dev.yml ps

# View resource usage
docker stats
```

---

## 📞 Need Help?

### Check Logs
```powershell
docker compose -f docker-compose.dev.yml logs -f
```

### Check Container Status
```powershell
docker compose -f docker-compose.dev.yml ps
```

### Full Reset
```powershell
# Stop everything
docker compose -f docker-compose.dev.yml down -v

# Remove all images
docker compose -f docker-compose.dev.yml down --rmi all

# Start fresh
docker compose -f docker-compose.dev.yml up --build
```

---

## 🎉 Success!

Once you see:
```
frontend | ➜  Local:   http://localhost:3000/
backend  | Server running on port 5000
mongodb  | Waiting for connections on port 27017
```

Your application is ready! Visit **http://localhost:3000** and login with:
- **Username**: admin
- **Password**: Admin@123456

---

**Status**: ✅ Ready for Docker Deployment  
**Last Updated**: February 2, 2026  
**Docker Version**: 29.1.3  
**Docker Compose**: v2.40.3
