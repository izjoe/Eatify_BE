# Eatify Food Delivery Backend API

## Overview
This is the backend API for the Eatify Food Delivery Application, built with Express.js, MongoDB, and featuring integrated Swagger UI documentation.

## 🚀 Getting Started

### Installation
```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend folder:
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_API_KEY=your_stripe_key
```

### Running the Server
```bash
npm run server
```

The server will start on `http://localhost:4000`

## 📚 API Documentation

### Swagger UI
Once the server is running, access the API documentation at:
```
http://localhost:4000/api-docs
```

This provides an interactive interface to test all endpoints.

## 📋 API Endpoints

### User Management (`/api/user`)
- **POST** `/register` - Register new user
- **POST** `/login` - User login
- **GET** `/profile` - Get user profile (requires auth)
- **PUT** `/profile` - Update user profile (requires auth)

### Food Management (`/api/food`)
- **POST** `/add` - Add new food item (seller only)
- **GET** `/list` - Get all food items
- **POST** `/remove` - Remove food item (seller only)

### Shopping Cart (`/api/cart`)
- **POST** `/add` - Add item to cart (requires auth)
- **POST** `/remove` - Remove item from cart (requires auth)
- **GET** `/` - Get cart data (requires auth)

### Orders (`/api/order`)
- **POST** `/place` - Place new order (requires auth)
- **POST** `/verify` - Verify payment (admin only)
- **POST** `/status` - Update order status (requires auth)
- **GET** `/userorders` - Get user's orders (requires auth)
- **GET** `/list` - Get all orders (admin only)
- **GET** `/detail/:orderID` - Get order details (requires auth)

### Sellers (`/api/seller`)
- **GET** `/:sellerID` - Get seller details
- **GET** `/` - List all sellers
- **PUT** `/update` - Update seller info (seller only)

### Ratings (`/api/rating`)
- **POST** `/rate` - Rate a food item (requires auth)

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🛠️ Middleware

- **auth.js** - JWT authentication middleware
- **cartNotEmptyMiddleware.js** - Validates cart is not empty
- **rateFoodMiddleware.js** - Validates user eligibility to rate
- **validateOrderStatusMiddleware.js** - Validates order status changes

## 📂 Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middlewares
├── models/          # Database schemas
├── routes/          # API routes
├── uploads/         # Uploaded files
├── server.js        # Main server file
├── swagger.js       # Swagger configuration
└── package.json
```

## 🔄 Workflow Examples

### User Registration & Login
1. POST `/api/user/register` - Create new account (buyer or seller)
2. POST `/api/user/login` - Login and get JWT token
3. Save token to localStorage

### Shopping & Ordering
1. GET `/api/food/list` - Browse food items
2. POST `/api/cart/add` - Add items to cart
3. GET `/api/cart` - View cart
4. POST `/api/order/place` - Checkout
5. POST `/api/order/verify` - Verify payment (admin)

### Seller Operations
1. POST `/api/food/add` - List food items
2. PUT `/api/seller/update` - Update store info
3. GET `/api/order/list` - View orders

## 🧪 Testing with Swagger UI

1. Open `http://localhost:4000/api-docs`
2. Click on any endpoint to expand it
3. Click "Try it out" button
4. For protected endpoints:
   - Click the lock icon in the endpoint header
   - Enter your JWT token
5. Fill in required parameters
6. Click "Execute" to test the endpoint

## 📝 Common Issues

### CORS Errors
- Ensure frontend is added to CORS whitelist in server.js

### JWT Token Expired
- Get a new token by logging in again

### Image Upload Fails
- Check `uploads/` folder permissions
- Ensure multer is properly configured

## 🚀 Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use proper environment variables
3. Enable HTTPS
4. Implement rate limiting
5. Add input validation & sanitization

## 📞 Support

For issues or questions, contact: support@eatify.com
