# Fashion App - Mission Top Secret 🎭

A full-stack fashion application with a Chrome extension that detects fashion products from e-commerce sites and helps users create outfits.

## 📋 Project Structure

```
├── apps/
│   ├── api/              # Express backend API
│   ├── extension/        # Chrome extension (React + Vite)
│   └── web/              # Next.js web application
├── packages/
│   └── shared/           # Shared types and utilities
└── pnpm-workspace.yaml   # Monorepo workspace config
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **pnpm** (package manager)
- **PostgreSQL** or **MySQL** (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahadhuss3in/missiontopsecret.git
   cd missiontopsecret
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your actual values in `.env`:
   - `DATABASE_URL`: Your database connection string
   - `JWT_SECRET`: Generate with: `openssl rand -base64 32`
   - `PORT`: API port (default: 4000)
   - `CORS_ORIGIN`: Web app URL (default: http://localhost:3000)

4. **Setup database**
   ```bash
   cd apps/api
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start development servers**
   
   In separate terminals:
   
   ```bash
   # API Server (port 4000)
   cd apps/api
   pnpm dev
   
   # Web App (port 3000)
   cd apps/web
   pnpm dev
   
   # Extension (watch mode)
   cd apps/extension
   pnpm dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api/v1
```

### Health Check
- **GET** `/health` - Check API status (no auth required)
  ```json
  Response: { "status": "ok", "ts": "2026-03-13T..." }
  ```

---

## 🔐 Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Auth:** None
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }
  ```
- **Response:** 
  ```json
  {
    "user": { "id": "...", "email": "...", "name": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  }
  ```

### Login
- **POST** `/auth/login`
- **Auth:** None
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** Same as register

### Get Current User
- **GET** `/auth/me`
- **Auth:** Bearer Token (required)
- **Response:**
  ```json
  {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-13T..."
  }
  ```

### Refresh Token
- **POST** `/auth/refresh`
- **Auth:** None
- **Body:**
  ```json
  {
    "refreshToken": "..."
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "...",
    "refreshToken": "..."
  }
  ```

### Logout
- **POST** `/auth/logout`
- **Auth:** Bearer Token (required)
- **Response:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## 👕 Products Endpoints

All product endpoints require authentication.

### Get All Products
- **GET** `/products`
- **Auth:** Bearer Token (required)
- **Query Parameters:**
  - `skip` (optional): Number of items to skip (default: 0)
  - `take` (optional): Number of items to return (default: 20)
- **Response:**
  ```json
  [
    {
      "id": "...",
      "name": "Product Name",
      "description": "...",
      "price": 99.99,
      "imageUrl": "https://...",
      "url": "https://store.com/product",
      "source": "asos",
      "createdAt": "2026-03-13T..."
    }
  ]
  ```

### Get Product by ID
- **GET** `/products/:id`
- **Auth:** Bearer Token (required)
- **Response:** Single product object (see above)

### Create Product
- **POST** `/products`
- **Auth:** Bearer Token (required)
- **Body:**
  ```json
  {
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "imageUrl": "https://...",
    "url": "https://store.com/product",
    "source": "asos"
  }
  ```
- **Response:** Created product object

### Delete Product
- **DELETE** `/products/:id`
- **Auth:** Bearer Token (required)
- **Response:** 
  ```json
  {
    "success": true,
    "id": "..."
  }
  ```

---

## 🎨 Accessories Endpoints

All accessory endpoints require authentication.

### Get All Accessories
- **GET** `/accessories`
- **Auth:** Bearer Token (required)
- **Response:**
  ```json
  [
    {
      "id": "...",
      "name": "Accessory Name",
      "type": "watch|bracelet|necklace|ring|hat|etc",
      "imageUrl": "https://...",
      "price": 49.99,
      "url": "https://store.com/accessory",
      "createdAt": "2026-03-13T..."
    }
  ]
  ```

### Get Accessory by ID
- **GET** `/accessories/:id`
- **Auth:** Bearer Token (required)
- **Response:** Single accessory object

### Create Accessory
- **POST** `/accessories`
- **Auth:** Bearer Token (required)
- **Body:**
  ```json
  {
    "name": "Accessory Name",
    "type": "watch",
    "imageUrl": "https://...",
    "price": 49.99,
    "url": "https://store.com/accessory"
  }
  ```
- **Response:** Created accessory object

### Delete Accessory
- **DELETE** `/accessories/:id`
- **Auth:** Bearer Token (required)
- **Response:**
  ```json
  {
    "success": true,
    "id": "..."
  }
  ```

---

## 👗 Outfits Endpoints

All outfit endpoints require authentication.

### Get All Outfits
- **GET** `/outfits`
- **Auth:** Bearer Token (required)
- **Response:**
  ```json
  [
    {
      "id": "...",
      "name": "Casual Summer",
      "description": "Light and breezy",
      "occasion": "casual",
      "createdAt": "2026-03-13T...",
      "items": [...]
    }
  ]
  ```

### Get Outfit by ID
- **GET** `/outfits/:id`
- **Auth:** Bearer Token (required)
- **Response:** Single outfit object with items

### Create Outfit
- **POST** `/outfits`
- **Auth:** Bearer Token (required)
- **Body:**
  ```json
  {
    "name": "Casual Summer",
    "description": "Light and breezy",
    "occasion": "casual"
  }
  ```
- **Response:** Created outfit object

### Update Outfit
- **PATCH** `/outfits/:id`
- **Auth:** Bearer Token (required)
- **Body:**
  ```json
  {
    "name": "New Name",
    "description": "Updated description",
    "occasion": "formal"
  }
  ```
- **Response:** Updated outfit object

### Delete Outfit
- **DELETE** `/outfits/:id`
- **Auth:** Bearer Token (required)
- **Response:**
  ```json
  {
    "success": true,
    "id": "..."
  }
  ```

---

## 👕 Outfit Items Endpoints

Manage items within an outfit.

### Add Item to Outfit
- **POST** `/outfits/:outfitId/items`
- **Auth:** Bearer Token (required)
- **Body:**
  ```json
  {
    "productId": "...",
    "position": { "x": 100, "y": 50 }
  }
  ```
- **Response:**
  ```json
  {
    "id": "...",
    "outfitId": "...",
    "productId": "...",
    "position": { "x": 100, "y": 50 },
    "zIndex": 1,
    "createdAt": "2026-03-13T..."
  }
  ```

### Update Outfit Item
- **PATCH** `/outfits/:outfitId/items/:itemId`
- **Auth:** Bearer Token (required)
- **Body:**
  ```json
  {
    "position": { "x": 150, "y": 75 },
    "zIndex": 2
  }
  ```
- **Response:** Updated item object

### Remove Item from Outfit
- **DELETE** `/outfits/:outfitId/items/:itemId`
- **Auth:** Bearer Token (required)
- **Response:**
  ```json
  {
    "success": true,
    "id": "..."
  }
  ```

---

## 🧪 Testing API Endpoints

### Using Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Import the OpenAPI spec or create requests manually
3. Add header: `Authorization: Bearer YOUR_ACCESS_TOKEN`

### Using Insomnia
1. Download [Insomnia](https://insomnia.rest/download)
2. Create requests for each endpoint
3. Set environment variables:
   - `base_url`: http://localhost:4000/api/v1
   - `access_token`: Your JWT token

### Quick Test Flow
1. **Register/Login** at `/auth/register` or `/auth/login`
2. Copy the `accessToken` from response
3. Add to all subsequent requests as: `Authorization: Bearer <token>`
4. Test endpoints in order: Products → Accessories → Outfits → Outfit Items

### Using cURL
```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get Products (replace TOKEN with your accessToken)
curl -X GET http://localhost:4000/api/v1/products \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔄 Rate Limiting

- **Auth endpoints** (`/auth/*`): 20 requests per 15 minutes
- **General endpoints** (`/api/*`): 200 requests per minute
- Response when rate limited: `{ "error": { "code": "RATE_LIMITED", "message": "Too many requests" } }`

---

## 🛡️ Security Features

- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting on sensitive endpoints
- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Input validation with Zod
- ✅ Cookie-based token storage

---

## 📦 Available Commands

### API
```bash
cd apps/api
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Run production build
pnpm typecheck     # Check TypeScript
pnpm db:migrate    # Run database migrations
pnpm db:generate   # Generate Prisma client
pnpm db:studio     # Open Prisma Studio
```

### Web
```bash
cd apps/web
pnpm dev           # Start Next.js dev server
pnpm build         # Build for production
pnpm start         # Run production server
pnpm typecheck     # Check TypeScript
```

### Extension
```bash
cd apps/extension
pnpm dev           # Build in watch mode
pnpm build         # Build for production
pnpm typecheck     # Check TypeScript
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

---

## 📄 License

This project is private and confidential.

---

## ❓ Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Ensure database server is running
- Check database credentials

### JWT Token Invalid
- Verify `JWT_SECRET` is at least 32 characters
- Check token hasn't expired (15 minutes default)
- Use `/auth/refresh` to get new token

### CORS Errors
- Verify `CORS_ORIGIN` matches your frontend URL
- Check that credentials are being sent with requests
- Ensure extension origin is whitelisted: `chrome-extension://`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process: `lsof -ti:4000 | xargs kill -9`

---

## 📞 Support

For issues, questions, or suggestions, please reach out to the development team.
