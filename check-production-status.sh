#!/bin/bash

echo "🔍 Checking Production Deployment Status..."

echo -e "\n--- 1. Container Status ---"
docker compose -f docker-compose.ssl.yml ps

echo -e "\n--- 2. Backend Logs (Last 50 Lines) ---"
docker compose -f docker-compose.ssl.yml logs backend --tail=50

echo -e "\n--- 3. MongoDB Logs (Last 50 Lines) ---"
docker compose -f docker-compose.ssl.yml logs mongodb --tail=50

echo -e "\n--- 4. Nginx Logs (Last 20 Lines) ---"
docker compose -f docker-compose.ssl.yml logs frontend --tail=20

echo -e "\n--- 5. Connectivity Check ---"
echo "Trying accessing local health endpoint..."
curl -I http://localhost:5000/api/health
if [ $? -eq 0 ]; then
    echo "✅ Local backend is responding."
else
    echo "❌ Local backend failed to respond."
fi
