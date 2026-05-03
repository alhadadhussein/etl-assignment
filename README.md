## Architecture

A CSV file upload application with authenticated users and secure cloud storage.

- **Frontend** — Vue 3 + Vuetify SPA hosted on Azure Static Web Apps
- **Backend** — NestJS REST API hosted on Azure Web App
- **Auth** — Microsoft Entra ID (OAuth 2.0 / OpenID Connect)
- **Storage** — Azure Blob Storage (accessed via Managed Identity)
- **Monitoring** — Application Insights

See [doc/architecture.md](doc/architecture.md) for full details.

---

## Prerequisites

local development

- An Azure subscription with:
  - A Storage Account with containers `raw-uploads` and `processed-files`
  - One App Registration in Microsoft Entra ID
  - Your user assigned **Storage Blob Data Contributor** role on the Storage Account

### Azure CLI Login

The backend uses `DefaultAzureCredential` to connect to Azure Blob Storage. Locally, this falls back to your Azure CLI session, so you must be logged in:

```bash
az login
```

If you have multiple subscriptions, set the correct one:

```bash
az account set --subscription <subscription-id>
```

---

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```env
ENTRA_TENANT_ID=<your-azure-tenant-id>
ENTRA_CLIENT_ID=<your-backend-app-registration-client-id>
AZURE_STORAGE_ACCOUNT_URL=https://<your-storage-account>.blob.core.windows.net
PORT=3000

# Optional — enables Application Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=<your-connection-string>
```

### Frontend

Create a `.env` file in the `frontend/` directory:

```env
VITE_ENTRA_CLIENT_ID=<your-frontend-app-registration-client-id>
VITE_ENTRA_TENANT_ID=<your-azure-tenant-id>
VITE_API_URL=http://localhost:3000/api
```

---

## Getting Started

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Runs on http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173

---

## Running Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Project Structure

```
backend/         NestJS API (auth, upload, storage modules)
frontend/        Vue 3 SPA (auth, upload, routing)
doc/             Architecture
```
