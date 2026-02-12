# Docker Local Development Guide
**Asset Management System**  
**Date**: February 2, 2026

---

## 🐳 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)
- At least 4GB RAM available for Docker
- Ports 3000, 5000, and 27017 available

### Start the Application

```bash
# Start all services (MongoDB, Backend, Frontend)
docker compose -f docker-compose.dev.yml up --build

# Or run in detached mode (background)
docker compose -f docker-compose.dev.yml up -d --build
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Default Credentials

```
Username: admin
Password: Admin@123456
Email: admin@company.com
```

---

## 📋 Docker Services

### 1. MongoDB
- **Container**: `asset-management-mongodb-dev`
- **Port**: 27017
- **Username**: admin
- **Password**: password
- **Database**: asset-management
- **Volume**: Persistent data storage

### 2. Backend (Node.js)
- **Container**: `asset-management-backend-dev`
- **Port**: 5000
- **Hot-reload**: ✅ Enabled with nodemon
- **Volume**: Mounted from `./server`
- **Auto-init**: Creates admin user on first run

### 3. Frontend (React + Vite)
- **Container**: `asset-management-frontend-dev`
- **Port**: 3000
- **Hot-reload**: ✅ Enabled with Vite HMR
- **Volume**: Mounted from project root
- **Modern UI**: Glassmorphism and gradients

---

## 🛠️ Common Commands

### Start Services
```bash
# Start all services
docker compose -f docker-compose.dev.yml up

# Start in background
docker compose -f docker-compose.dev.yml up -d

# Start with rebuild
docker compose -f docker-compose.dev.yml up --build

# Start specific service
docker compose -f docker-compose.dev.yml up backend
```

### Stop Services
```bash
# Stop all services
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes (WARNING: Deletes database data)
docker compose -f docker-compose.dev.yml down -v

# Stop specific service
docker compose -f docker-compose.dev.yml stop backend
```

### View Logs
```bash
# View all logs
docker compose -f docker-compose.dev.yml logs

# Follow logs (real-time)
docker compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker compose -f docker-compose.dev.yml logs backend
docker compose -f docker-compose.dev.yml logs frontend
docker compose -f docker-compose.dev.yml logs mongodb

# View last 100 lines
docker compose -f docker-compose.dev.yml logs --tail=100
```

### Restart Services
```bash
# Restart all services
docker compose -f docker-compose.dev.yml restart

# Restart specific service
docker compose -f docker-compose.dev.yml restart backend
```

### Execute Commands in Containers
```bash
# Access backend shell
docker compose -f docker-compose.dev.yml exec backend sh

# Access MongoDB shell
docker compose -f docker-compose.dev.yml exec mongodb mongosh -u admin -p password

# Run npm commands in backend
docker compose -f docker-compose.dev.yml exec backend npm install <package>

# Run npm commands in frontend
docker compose -f docker-compose.dev.yml exec frontend npm install <package>
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root (or copy from `.env.docker`):

```env
# MongoDB
MONGO_USER=admin
MONGO_PASSWORD=password

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# Admin Account
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123456
ADMIN_EMAIL=admin@company.com

# Company Settings
COMPANY_NAME=Asset Management Inc
CURRENCY=USD
TIMEZONE=UTC
```

### Customizing Ports

Edit `docker-compose.dev.yml` to change ports:

```yaml
services:
  frontend:
    ports:
      - "8080:3000"  # Change 8080 to your preferred port
  
  backend:
    ports:
      - "5001:5000"  # Change 5001 to your preferred port
  
  mongodb:
    ports:
      - "27018:27017"  # Change 27018 to your preferred port
```

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change the port in docker-compose.dev.yml
```

### MongoDB Connection Failed

```bash
# Check MongoDB is running
docker compose -f docker-compose.dev.yml ps

# View MongoDB logs
docker compose -f docker-compose.dev.yml logs mongodb

# Restart MongoDB
docker compose -f docker-compose.dev.yml restart mongodb
```

### Backend Not Starting

```bash
# View backend logs
docker compose -f docker-compose.dev.yml logs backend

# Check if MongoDB is healthy
docker compose -f docker-compose.dev.yml ps

# Rebuild backend
docker compose -f docker-compose.dev.yml up --build backend
```

### Frontend Not Loading

```bash
# View frontend logs
docker compose -f docker-compose.dev.yml logs frontend

# Check if backend is running
curl http://localhost:5000/api/health

# Rebuild frontend
docker compose -f docker-compose.dev.yml up --build frontend
```

### Hot Reload Not Working

```bash
# Restart the service
docker compose -f docker-compose.dev.yml restart frontend
docker compose -f docker-compose.dev.yml restart backend

# Check volume mounts
docker compose -f docker-compose.dev.yml config
```

### Clear Everything and Start Fresh

```bash
# Stop all containers
docker compose -f docker-compose.dev.yml down

# Remove volumes (WARNING: Deletes database)
docker compose -f docker-compose.dev.yml down -v

# Remove images
docker compose -f docker-compose.dev.yml down --rmi all

# Rebuild and start
docker compose -f docker-compose.dev.yml up --build
```

---

## 📊 Monitoring

### Check Service Health

```bash
# Check all services
docker compose -f docker-compose.dev.yml ps

# Check specific service health
docker inspect asset-management-backend-dev --format='{{.State.Health.Status}}'
```

### View Resource Usage

```bash
# View container stats
docker stats

# View specific container
docker stats asset-management-backend-dev
```

### Database Access

```bash
# Access MongoDB shell
docker compose -f docker-compose.dev.yml exec mongodb mongosh -u admin -p password

# In MongoDB shell:
use asset-management
show collections
db.users.find()
db.assets.find()
```

---

## 🚀 Development Workflow

### Making Code Changes

1. **Frontend Changes**:
   - Edit files in `src/` directory
   - Vite will automatically hot-reload
   - Changes appear instantly in browser

2. **Backend Changes**:
   - Edit files in `server/` directory
   - Nodemon will automatically restart server
   - API changes take effect immediately

3. **Installing Dependencies**:
   ```bash
   # Frontend
   docker compose -f docker-compose.dev.yml exec frontend npm install <package>
   
   # Backend
   docker compose -f docker-compose.dev.yml exec backend npm install <package>
   ```

### Database Management

```bash
# Backup database
docker compose -f docker-compose.dev.yml exec mongodb mongodump --uri="mongodb://admin:password@localhost:27017/asset-management?authSource=admin" --out=/data/backup

# Restore database
docker compose -f docker-compose.dev.yml exec mongodb mongorestore --uri="mongodb://admin:password@localhost:27017" /data/backup

# Reset database (WARNING: Deletes all data)
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up -d
```

---

## 🎯 Best Practices

### Development
- ✅ Use `docker-compose.dev.yml` for development
- ✅ Keep containers running for hot-reload
- ✅ Use volume mounts for code changes
- ✅ Check logs regularly
- ✅ Commit `.env.docker` template, not `.env`

### Performance
- ✅ Allocate sufficient RAM to Docker (4GB+)
- ✅ Use Docker volumes for node_modules
- ✅ Restart services if performance degrades
- ✅ Clean up unused images/containers regularly

### Security
- ⚠️ Change default passwords in production
- ⚠️ Use strong JWT_SECRET in production
- ⚠️ Don't commit `.env` files
- ⚠️ Use environment-specific configurations

---

## 📦 Production Deployment

> **Important**: Ensure no other containers (like the development environment) are running on ports 3000, 5000, or 27017 before starting production deployment.
> 
> ```bash
> # Stop development environment first
> docker compose -f docker-compose.dev.yml down
> ```

For production deployment, use the standard `docker-compose.yml`:

```bash
# Build for production
docker compose up --build -d

# View production logs
docker compose logs -f
```

**Important**: Update environment variables for production:
- Strong `JWT_SECRET`
- Secure database credentials
- Production MongoDB URI
- SSL/TLS certificates
- Email provider configuration

---

## 🔗 Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Image](https://hub.docker.com/_/node)

---

## ✅ Quick Reference

### Start Development
```bash
docker compose -f docker-compose.dev.yml up
```

### Stop Development
```bash
docker compose -f docker-compose.dev.yml down
```

### View Logs
```bash
docker compose -f docker-compose.dev.yml logs -f
```

### Rebuild
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Login: admin / Admin@123456

---

**Status**: ✅ Ready for Development  
**Hot Reload**: ✅ Enabled  
**Database**: ✅ Persistent  
**Last Updated**: February 2, 2026
