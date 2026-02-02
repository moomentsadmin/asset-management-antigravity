# Nexus Asset Management System

A professional, enterprise-grade Asset Management System built with the **MERN Stack** (MongoDB, Express, React, Node.js). Designed for IT operations to track global assets, manage lifecycles, and audit inventory with precision.

## 🌟 Core Features

### 📦 Asset Management
- **Multi-Type Tracking**: Hardware, software licenses, accessories, office equipment, and vehicles.
- **Lifecycle Management**: Track assets from procurement to disposal.
- **Status Monitoring**: Real-time statuses (Available, Assigned, In Maintenance, Retired, Lost).
- **Depreciation Calculator**: Automated value tracking using **Straight-Line** and **Declining Balance** methods.
- **Location Management**: Physical location tracking with building/room granularity.
- **Custom Fields**: Dynamic schema support for diverse asset types.
- **QR Code Labels**: Generation of unique QR codes for physical inventory tagging.
- **Media Support**: Storage for asset photos and receipt scans.

### 👥 User & Employee Management
- **Employee Directory**: Centralized management of employees and contractors.
- **Role-Based Access Control (RBAC)**: granular permissions for **Admins**, **Managers**, and **Employees**.
- **Bulk Operations**: CSV import/export for large-scale employee onboarding.

### 🔄 Assignments & Workflows
- **Check-In/Check-Out**: Streamlined workflows for asset distribution.
- **Audit Trails**: Immutable history of every assignment and return.
- **Condition Tracking**: Monitor physical condition of assets upon return.
- **Maintenance Logs**: Integrated notes system for repair and service history.

### 🛡️ Authentication & Security
- **Secure Authentication**: Username/Password login with **Bcrypt** hashing (Cost 10).
- **Session Management**: JWT-based secure sessions.
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA support.
- **First-Time Setup**: Automated admin provisioning for secure deployment.
- **Audit Logs**: Comprehensive system-wide event logging (Login/Logout, Creates, Updates, Deletes).

### 📊 Dashboard & Analytics
- **Health Dashboard**: Real-time system status and database connectivity monitoring.
- **Asset Analytics**: Visual breakdown of inventory by status, value, and type.
- **Recent Activity**: detailed feed of the latest operational actions.

### ⚙️ System Administration
- **Global Settings**: Configure Company Name, Timezone, and Base Currency (USD, EUR, GBP, etc.).
- **Branding**: Custom logo and UI text configuration.
- **Data Retention**: Configurable policies for audit log storage.
- **Email Notifications**: Integration support for SMTP (SendGrid, Office365, Gmail) for alerts.

## 🛠️ Technology Stack

| Component | Technology | Details |
|-----------|------------|---------|
| **Frontend** | React 18 | Vite, TailwindCSS, Chart.js, Axios |
| **Backend** | Node.js | Express.js, Helmet, Rate Limiting |
| **Database** | MongoDB | Mongoose handling schemas & validation |
| **DevOps** | Docker | Docker Compose for orchestration |
| **Styling** | TailwindCSS | Utility-first "Clean Enterprise" design system |

## 🚀 Getting Started

### Prerequisites
- Docker Desktop
- Node.js (for local dev without Docker)

### Installation (Docker)

1.  **Start the System**:
    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```
2.  **Access the Application**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:5000](http://localhost:5000)

### Default Credentials
> **Note**: Change these immediately after first login.
- **Username**: `admin`
- **Password**: `Admin@123456`

## 👨‍💻 Development

The project is structured as a monorepo-style setup:
- `/server`: Node.js Express API
- `/src`: React Frontend
- `docker-compose.dev.yml`: Development orchestration with Hot Reloading

## 📝 License
Copyright © 2026 Nexus Systems Inc.
Proprietary software. All rights reserved.
