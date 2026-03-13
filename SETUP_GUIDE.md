# 🧪 API Testing Setup Guide

This guide helps you get started testing the Fashion API using Postman or Insomnia.

## 📋 Files Included

- **`.env.example`** - Environment variables template (copy to `.env` and fill in your values)
- **`.env`** - Your environment variables (already created, add your actual values here)
- **`README.md`** - Complete API documentation with all endpoints
- **`Fashion-API-Collection.postman_collection.json`** - Postman collection for testing
- **`Fashion-API-Collection-Insomnia.json`** - Insomnia collection for testing
- **`SETUP_GUIDE.md`** - This file

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Setup Environment Variables

```bash
# Already created, but add your actual values:
nano .env  # or open with your editor
```

**Required Values:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fashion_db
JWT_SECRET=your-super-secret-jwt-key-with-minimum-32-characters
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Generate a strong JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Step 2: Start the API Server

```bash
cd apps/api
pnpm install          # First time only
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run database migrations
pnpm dev              # Start development server
```

Expected output:
```
✓ Compiled successfully
Server running on http://localhost:4000
```

### Step 3: Import API Collection

Choose your tool:

#### Using Postman:
1. Open [Postman](https://www.postman.com/downloads/)
2. Click **"Import"** (top-left)
3. Select **"Upload Files"** tab
4. Choose `Fashion-API-Collection.postman_collection.json`
5. ✅ Collection imported!

#### Using Insomnia:
1. Open [Insomnia](https://insomnia.rest/download)
2. Click **"Create"** → **"Import"**
3. Select **"From File"**
4. Choose `Fashion-API-Collection-Insomnia.json`
5. ✅ Collection imported!

---

## 🔑 Setting Environment Variables in Your Tool

### Postman
1. Click **"Environments"** (left sidebar)
2. Select **"Fashion API"** environment
3. Edit these variables:
   - `base_url`: `http://localhost:4000/api/v1`
   - `access_token`: (leave empty for now)
   - `refresh_token`: (leave empty for now)

### Insomnia
1. Click **"Manage Environments"** (top-right gear icon)
2. Select **"Development"** environment
3. Edit variables same as Postman

---

## 🧪 Testing Workflow

### 1️⃣ First Request: Health Check
- Open **Health Check** request
- Click **"Send"**
- Expected response:
  ```json
  {
    "status": "ok",
    "ts": "2026-03-13T12:00:00.000Z"
  }
  ```

### 2️⃣ Register a User
- Go to **Auth** → **Register**
- Edit the request body with your test email/password
- Click **"Send"**
- Response contains `accessToken` and `refreshToken`

**Save the tokens:**
- Copy the `accessToken` value
- In your environment, set `access_token` to this value
- Copy the `refreshToken` value
- In your environment, set `refresh_token` to this value

### 3️⃣ Test Authenticated Requests
Now you can test any endpoint that requires auth:

**Products:**
- GET `/products` - Get all products
- POST `/products` - Create new product
- GET `/products/{id}` - Get specific product
- DELETE `/products/{id}` - Delete product

**Accessories:**
- GET `/accessories` - Get all accessories
- POST `/accessories` - Create new accessory
- GET `/accessories/{id}` - Get specific accessory
- DELETE `/accessories/{id}` - Delete accessory

**Outfits:**
- GET `/outfits` - Get all outfits
- POST `/outfits` - Create new outfit
- GET `/outfits/{id}` - Get specific outfit
- PATCH `/outfits/{id}` - Update outfit
- DELETE `/outfits/{id}` - Delete outfit

**Outfit Items:**
- POST `/outfits/{outfitId}/items` - Add item to outfit
- PATCH `/outfits/{outfitId}/items/{itemId}` - Update item position
- DELETE `/outfits/{outfitId}/items/{itemId}` - Remove item from outfit

---

## 📝 Collection Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `base_url` | API base URL | `http://localhost:4000/api/v1` |
| `access_token` | JWT access token for auth | `eyJhbGc...` |
| `refresh_token` | JWT refresh token | `eyJhbGc...` |
| `product_id` | Product ID from create/list | `123abc...` |
| `accessory_id` | Accessory ID from create/list | `456def...` |
| `outfit_id` | Outfit ID from create/list | `789ghi...` |
| `item_id` | Outfit item ID | `012jkl...` |

**Tip:** After creating a product, copy its `id` and set it as `product_id` in your environment to reuse it in other requests.

---

## 🔄 Token Refresh Flow

When your access token expires (15 minutes by default):

1. Go to **Auth** → **Refresh Token**
2. The request already has `refreshToken` from your environment
3. Click **"Send"**
4. Update both `access_token` and `refresh_token` in environment with new values
5. Continue testing!

---

## 📊 Complete Testing Sequence

```
1. Health Check (public)
   ↓
2. Register User (public)
   ↓ Save access_token to environment
   ↓
3. Get Current User (authenticated)
   ↓
4. Create Product (authenticated)
   ↓ Save product_id to environment
   ↓
5. Get Product by ID (authenticated)
   ↓
6. Create Accessory (authenticated)
   ↓ Save accessory_id to environment
   ↓
7. Get All Accessories (authenticated)
   ↓
8. Create Outfit (authenticated)
   ↓ Save outfit_id to environment
   ↓
9. Add Item to Outfit (authenticated)
   ↓ Save item_id to environment
   ↓
10. Update Outfit Item (authenticated)
    ↓
11. Get Outfit by ID (authenticated)
    ↓
12. Logout (authenticated)
```

---

## 🐛 Troubleshooting

### "Connection refused" error
- **Problem:** API not running
- **Solution:** 
  ```bash
  cd apps/api
  pnpm dev
  ```

### "401 Unauthorized" error
- **Problem:** Missing or invalid access token
- **Solution:**
  1. Register or Login to get new token
  2. Copy `accessToken` from response
  3. Update `access_token` variable in your environment

### "Database connection failed"
- **Problem:** DATABASE_URL incorrect or database not running
- **Solution:**
  ```bash
  # Check .env DATABASE_URL
  # Ensure PostgreSQL is running
  # Test connection: psql postgresql://user:password@localhost:5432/fashion_db
  ```

### "Invalid JWT_SECRET"
- **Problem:** JWT_SECRET less than 32 characters
- **Solution:**
  ```bash
  openssl rand -base64 32
  # Copy output to .env JWT_SECRET
  ```

### "CORS error"
- **Problem:** CORS_ORIGIN doesn't match frontend URL
- **Solution:**
  Check `.env` CORS_ORIGIN matches your web app URL (default: `http://localhost:3000`)

---

## 📚 Additional Resources

- **API Documentation:** See [README.md](./README.md)
- **Postman Docs:** https://learning.postman.com/
- **Insomnia Docs:** https://docs.insomnia.rest/
- **JWT Refresh:** Automatically handled in "Refresh Token" endpoint

---

## ✅ You're Ready!

Start with the **Health Check** request and work your way through the testing sequence above. Each endpoint builds on the previous one, creating a complete user journey through the API.

**Happy Testing! 🎉**
