#!/bin/bash

# Cloud Database Reset Script
# Use this when downgrading from mongo:latest (8.0) to mongo:4.4
# or if MongoDB is stuck in a restart loop due to corrupted data.

echo "⚠️  WARNING: This will DELETE all MongoDB data volumes!"
echo "    Ensure you have backups if this is a production system with real data."
echo "    If this is a fresh deployment, it is safe to proceed."
echo ""
read -p "Type 'yes' to proceed with DELETING database volumes: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted."
    exit 1
fi

echo "🛑 Stopping all containers..."
echo "🛑 Stopping all containers and removing volumes..."
# Use docker compose down -v to remove volumes associated with the project automatically
docker compose -f docker-compose.ssl.yml down -v
docker compose -f docker-compose.yml down -v

echo "🧹 Attempting to remove any residual volumes (just in case)..."
# Just a fallback for common names, but 'down -v' should have handled it
docker volume rm asset-management-antigravity_mongodb_data 2>/dev/null
docker volume rm asset-management-antigravity_mongodb_config 2>/dev/null
docker volume rm codespaces-antigravity-react-main_mongodb_data 2>/dev/null

# Fallback: Prune dangling volumes
docker volume prune -f

echo "✅ Database reset complete."
echo "🚀 You can now start the application:"
echo "   docker compose up -d --build"
echo "   OR"
echo "   docker compose -f docker-compose.ssl.yml up -d --build"
