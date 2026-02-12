#!/bin/bash

echo "========================================"
echo "☁️  Cloud Deployment Verification Tool ☁️"
echo "========================================"

# 1. Check Docker Version
echo -e "\n🔍 Checking Docker Version..."
docker --version
if [ $? -ne 0 ]; then
    echo "❌ Docker is not installed or not in PATH."
    exit 1
fi

# 2. Check Docker Compose Version
echo -e "\n🔍 Checking Docker Compose Version..."
docker compose version
if [ $? -ne 0 ]; then
    echo "❌ Docker Compose (V2) is not installed."
    echo "   Try 'docker-compose --version' for V1."
fi

# 3. Check System Resources (Memory)
echo -e "\n🔍 Checking Memory..."
total_mem=$(free -m | awk '/^Mem:/{print $2}')
echo "   Total Memory: ${total_mem}MB"
if [ "$total_mem" -lt 2000 ]; then
    echo "⚠️  WARNING: Less than 2GB RAM detected. MongoDB may crash or fail to start."
    echo "   Action: Enable Swap or upgrade instance."
    echo "   To enable swap: https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-20-04"
fi

# 4. Check CPU for AVX Support (Required for Mongo 5.0+)
echo -e "\n🔍 Checking CPU for AVX Support..."
grep -q avx /proc/cpuinfo
if [ $? -eq 0 ]; then
    echo "✅ AVX Support Detected. MongoDB 5.0+ (latest) should run."
else
    echo "❌ NO AVX SUPPORT DETECTED!"
    echo "   MongoDB 5.0+ 'latest' will CRASH with 'Illegal Instruction'."
    echo "   Action: Use image 'mongo:4.4.18' in docker-compose.yml."
fi

# 5. Check Containers Status
echo -e "\n🔍 Checking Running Containers..."
docker compose ps

# 6. Check for Restart Loops
echo -e "\n🔍 Checking for Restarting Containers..."
restarting=$(docker compose ps | grep "Restarting")
if [ ! -z "$restarting" ]; then
    echo "❌ Found restarting containers:"
    echo "$restarting"
    echo "   Fetching logs for restarting containers..."
    # Extract service names (rough assumption)
    docker compose logs --tail=50
else
    echo "✅ No containers currently restarting."
fi

# 7. Check MongoDB Specific Failure
echo -e "\n🔍 Checking MongoDB Logs for specific errors..."
docker compose logs mongodb --tail=20 > mongo_check.log 2>&1
if grep -q "Illegal instruction" mongo_check.log; then
    echo "❌ ERROR: MongoDB failed with 'Illegal instruction'."
    echo "   Cause: CPU lacks AVX support."
    echo "   Fix: Downgrade to 'mongo:4.4.18' in docker-compose.yml."
elif grep -q "invariant" mongo_check.log; then
    echo "❌ ERROR: MongoDB failed with assertion invariant."
    echo "   Cause: Possible data corruption or version mismatch."
else
    echo "ℹ️  MongoDB logs checked (tail)."
fi
rm mongo_check.log

echo -e "\n========================================"
echo "✅ Verification Complete"
echo "========================================"
