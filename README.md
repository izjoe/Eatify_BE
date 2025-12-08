# 🍔 Eatify Backend API

# ⚙️ Eatify - Backend

> A secure and scalable RESTful API for food delivery platform built with Node.js, Express, and MongoDB.

This is the server-side API for the Eatify food ordering application, built with **Node.js**, **Express**, and **MongoDB**. It provides a RESTful API for handling all business logic, including user authentication, database management (users, food, restaurants), and order processing.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌐 Production Server

**API Base URL:** https://eatify-be.onrender.com

**API Documentation:** https://eatify-be.onrender.com/api-docs

## 📚 Quick Links for Frontend Developers

- **[API Authentication Guide](./API_AUTHENTICATION.md)** - Complete authentication flow
- **[Frontend Integration Guide](./FRONTEND_INTEGRATION.md)** - Code examples and troubleshooting
- **[Test API Script](./test-api.sh)** - Automated API testing

## ✨ Core Features

---

* **RESTful API:** A clear and organized API structure using Express routers.

## 📋 Table of Contents* **Authentication:** Secure user registration and login using **JSON Web Tokens (JWT)**.

* **Middleware Security:** Uses custom middleware (`auth.js`) to protect sensitive routes, ensuring only authenticated users can access their personal data (like placing or viewing orders).

- [Features](#-features)* **Database Modeling:** Uses **Mongoose** to create robust schemas and models for `Users`, `Orders`, `Food`, and `Restaurant` data.

- [Tech Stack](#-tech-stack)* **Environment Management:** Securely manages sensitive information (database URI, JWT secret) using `dotenv`.

- [Getting Started](#-getting-started)* **CORS Enabled:** Configured with the `cors` middleware to allow requests from the frontend client.

- [API Documentation](#-api-documentation)

- [Project Structure](#-project-structure)## 🛠️ Tech Stack

- [Security & Access Control](#-security--access-control)

- [Testing](#-testing)* **Core:** Node.js, Express.js

- [Deployment](#-deployment)* **Database:** MongoDB with Mongoose (ODM)

* **Authentication:** `jsonwebtoken` (for token generation/verification), `bcrypt` (for password hashing - *you should add this if not already!*)

---* **Middleware:** `cors`, `express.json` (formerly `body-parser`)

* **Utilities:** `dotenv`, `nodemon` (for development)

## ✨ Features

## 🚀 Getting Started

### Core Functionality

- 🔐 **JWT Authentication** - Secure user registration and loginTo run this project locally, you must be in the `backend` directory.

- 👥 **Role-Based Access Control** - User, Seller, and Admin roles

- 🍕 **Food Management** - CRUD operations for food items### 1. Prerequisite

- 🛒 **Shopping Cart** - Add, remove, and manage cart items

- 📦 **Order Processing** - Complete order lifecycle management* [Node.js](https://nodejs.org/) (v18 or newer)

- ⭐ **Rating System** - Users can rate purchased food items* A running **MongoDB** instance (either locally or a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

- 🏪 **Seller Management** - Seller profiles and store information

### 2. Install Dependencies

### Security Features

- ✅ Password hashing with bcrypt (12 rounds)```bash

- ✅ JWT token-based authentication# Navigate to the backend directory

- ✅ Input validation and sanitizationcd backend

- ✅ File upload security (type & size validation)

- ✅ Role-based route protection# Install all dependencies

- ✅ Ownership verification for resourcesnpm install

- ✅ Protection against NoSQL injection

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **File Upload:** Multer
- **Validation:** Joi validator
- **Documentation:** Swagger UI (swagger-jsdoc, swagger-ui-express)
- **Dev Tools:** Nodemon, dotenv

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/izjoe/Eatify_BE.git
cd Eatify_BE
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=4000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/eatify
JWT_SECRET=your-super-secret-jwt-key-change-this
SALT=12
```

⚠️ **Security Warning:** Never commit `.env` to version control!

4. **Create uploads directory**
```bash
mkdir -p uploads
```

5. **Start development server**
```bash
npm run server
```

Server will start at `http://localhost:4000`  
API Documentation: `http://localhost:4000/api-docs`

---

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:4000/api-docs
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Users
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)
- `PUT /api/user/admin/update-role` - Admin updates user role (Admin only)
- `PUT /api/user/admin/update-user` - Admin updates user details (Admin only)

#### Food
- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add new food (Seller/Admin only)
- `POST /api/food/remove` - Remove food (Seller/Admin only)

#### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart/add` - Add item to cart (Protected)
- `POST /api/cart/remove` - Remove item from cart (Protected)

#### Orders
- `POST /api/order/checkout` - Create order from cart (Protected)
- `GET /api/order/my` - Get user orders (Protected)
- `GET /api/order/list` - Get all orders (Admin/Seller)
- `GET /api/order/detail/:orderID` - Get order details (Protected)
- `POST /api/order/status` - Update order status (Protected)
- `POST /api/order/verify` - Verify payment (Admin only)

#### Rating
- `POST /api/rating/rate` - Rate a food item (Protected)

#### Seller
- `GET /api/seller` - Get all sellers
- `GET /api/seller/:sellerID` - Get seller details
- `PUT /api/seller/update` - Update seller info (Seller/Admin only)

---

## 📁 Project Structure

```
Eatify_BE/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── cartController.js     # Cart management
│   ├── foodController.js     # Food CRUD operations
│   ├── orderController.js    # Order processing
│   ├── ratingController.js   # Rating system
│   ├── sellerController.js   # Seller management
│   └── userController.js     # User profile management
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── accessControlMiddleware.js  # Access control
│   ├── validateMiddleware.js # Request validation
│   ├── cartNotEmptyMiddleware.js
│   ├── rateFoodMiddleware.js
│   └── validateOrderStatusMiddleware.js
├── models/
│   ├── cartModel.js          # Cart schema
│   ├── foodModel.js          # Food schema
│   ├── orderModel.js         # Order schema
│   ├── ratingModel.js        # Rating schema
│   ├── sellerModel.js        # Seller schema
│   └── userModel.js          # User schema
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── cartRoute.js
│   ├── foodRoute.js
│   ├── orderRoute.js
│   ├── ratingRoute.js
│   ├── sellerRoute.js
│   └── userRoute.js
├── validations/
│   ├── authValidation.js
│   ├── cartValidation.js
│   ├── foodValidation.js
│   ├── orderValidation.js
│   └── ...
├── src/
│   └── swagger.js            # Swagger configuration
├── uploads/                  # Uploaded images
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── server.js                 # Application entry point
└── README.md
```

---

## 🔒 Security & Access Control

### Access Control Rules

#### 🔑 GOLDEN RULES

1. **Never trust client input** - Always validate userId from JWT, not from request body
2. **Principle of Least Privilege** - Users only have minimum necessary permissions
3. **Ownership verification** - Check ownership before allowing operations
4. **Role-based access** - Clear permission separation by role
5. **Fail securely** - Default deny, only allow when conditions are met

### Permission Matrix

| Action | User | Seller | Admin |
|--------|------|--------|-------|
| **Profile** |
| View own profile | ✅ | ✅ | ✅ |
| View others' profile | ❌ | ❌ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| Update others' profile | ❌ | ❌ | ✅ |
| Update user roles | ❌ | ❌ | ✅ |
| **Cart** |
| View/manage own cart | ✅ | ✅ | ✅ |
| View others' cart | ❌ | ❌ | ❌ |
| **Orders** |
| Create order | ✅ | ✅ | ✅ |
| View own orders | ✅ | ✅ | ✅ |
| View others' orders | ❌ | ❌ | ✅ |
| View all orders | ❌ | ✅ (related) | ✅ (all) |
| Cancel own order | ✅ | ✅ | ✅ |
| Update order status | ❌ | ✅ | ✅ |
| **Food** |
| View food list | ✅ | ✅ | ✅ |
| Add food | ❌ | ✅ | ✅ |
| Delete own food | ❌ | ✅ | ✅ |
| Delete any food | ❌ | ❌ | ✅ |
| **Seller** |
| View sellers | ✅ | ✅ | ✅ |
| Update own store | ❌ | ✅ | ✅ |
| Update any store | ❌ | ❌ | ✅ |
| **Rating** |
| Rate purchased food | ✅ | ✅ | ✅ |
| Rate non-purchased food | ❌ | ❌ | ❌ |

### Blocked Scenarios

Users **CANNOT**:
- ❌ View other users' profiles
- ❌ View other users' carts
- ❌ View other users' orders
- ❌ View order details they don't own
- ❌ Add food without seller role
- ❌ Delete food owned by others
- ❌ Update store info without seller role
- ❌ Fake userId in requests
- ❌ Rate food they haven't purchased

### Security Middleware

#### `authMiddleware.js`
```javascript
requireAuth → Verify JWT token, assign userId to req.body
requireAdmin → Require role = "admin"
```

#### `accessControlMiddleware.js`
```javascript
canAccessUserProfile → Check profile access permission
canAccessOrder → Check order access permission
requireSeller → Require role = "seller" or "admin"
canAccessCart → Ensure accessing own cart only
```

### How It Works

```javascript
// JWT Token Workflow:
1. User login → Receive JWT token: { id: userId, role: "user" }
2. Every request sends token in header
3. authMiddleware verifies token → assigns userId to req.body
4. Controllers use this userId (DON'T trust request body)
5. Check ownership: resource.userID === user.userID
6. If no match and not admin → 403 Forbidden
```

### Example Flow
```javascript
// User A tries to view User B's order
Request: GET /api/order/detail/ORDER_B
Header: Authorization: Bearer <Token_A>

authMiddleware → req.body.userId = "A123"
getOrderDetail → 
  - Find order ORDER_B
  - order.userID = "B456"
  - req.body.userId = "A123"
  - "B456" !== "A123" → ❌ 403 Forbidden
```

---

## 🛡️ Security Best Practices

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT token-based authentication
   - Password hashing with bcrypt (12 rounds)
   - Role-based access control
   - Ownership verification

2. **Input Validation**
   - Request body validation with Joi
   - Email format validation
   - Password strength requirements (8+ chars, uppercase, lowercase, numbers)
   - File type and size validation

3. **File Upload Security**
   - Allowed file types: jpg, png, webp
   - Maximum file size: 5MB
   - Safe filename generation
   - Path traversal prevention

4. **Database Security**
   - Mongoose schema validation
   - NoSQL injection prevention
   - Sensitive data filtering (passwords hidden)

### Additional Security Recommendations (HIGH PRIORITY)

#### 1. Rate Limiting 🔴
```bash
npm install express-rate-limit
```

Add to `server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
app.use('/api/', limiter);

// Stricter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

#### 2. Helmet.js for HTTP Headers 🔴
```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

#### 3. Input Sanitization 🔴
```bash
npm install express-mongo-sanitize
```

```javascript
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize()); // Prevent NoSQL injection
```

#### 4. CORS Configuration 🔴
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

---

## 🧪 Testing

### Manual Testing with Swagger UI

1. Start server: `npm run server`
2. Open: `http://localhost:4000/api-docs`
3. Test authentication flow:
   - Register new user
   - Login to get token
   - Use "Authorize" button to add token
   - Test protected endpoints

### Test Cases

#### Test 1: Cross-user Order Access
```bash
# Login User A → token_A
# Login User B → token_B
# A creates order → order_A
# B tries to view order_A
curl GET /api/order/detail/order_A -H "Authorization: Bearer token_B"
Expected: 403 Forbidden ✅
```

#### Test 2: Cross-seller Food Delete
```bash
# Seller A adds food → food_A
# Seller B tries to delete food_A
curl POST /api/food/remove -d '{"foodID":"food_A"}' -H "Authorization: Bearer seller_B_token"
Expected: "Food not found or no permission" ✅
```

#### Test 3: Regular User Add Food
```bash
# User (not seller) tries to add food
curl POST /api/food/add -H "Authorization: Bearer user_token"
Expected: 403 "Seller privileges required" ✅
```

---

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] Set strong JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Change MongoDB credentials
- [ ] Enable SSL/TLS for MongoDB connection
- [ ] Use HTTPS (not HTTP)
- [ ] Set NODE_ENV=production
- [ ] Enable logging (Winston, Morgan)
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure firewall rules
- [ ] Regular security audits (`npm audit`)
- [ ] Keep dependencies updated
- [ ] Backup database regularly
- [ ] Set up CI/CD pipeline
- [ ] Install security packages (helmet, rate-limit, etc.)

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 4000 |
| `MONGO_URL` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT | Yes | - |
| `SALT` | Bcrypt salt rounds | No | 12 |
| `NODE_ENV` | Environment mode | No | development |
| `CORS_ORIGIN` | Allowed CORS origin | No | * |

### Production Setup

1. **Install security packages:**
```bash
npm install express-rate-limit helmet express-mongo-sanitize
```

2. **Update server.js:**
```javascript
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

3. **Set production environment:**
```bash
NODE_ENV=production npm start
```

---

## 🐛 Known Issues & Future Improvements

### To Be Implemented

1. **Stock Management** - Validate stock availability during checkout
2. **Pagination** - Add pagination to list endpoints
3. **Email Verification** - Add email verification for new users
4. **Password Reset** - Implement forgot password functionality
5. **Image Optimization** - Compress images before storage
6. **Logging** - Add structured logging (Winston)
7. **Unit Tests** - Add unit and integration tests
8. **WebSocket** - Real-time order updates

---

## 📝 Quick Reference

### Starting the Server
```bash
npm run server
```

### Testing Endpoints
- Swagger UI: `http://localhost:4000/api-docs`
- Root: `http://localhost:4000`

### Common Issues

#### "403 Access Denied"
**Check:**
- Token valid? (`Authorization: Bearer <token>`)
- Correct role? (user/seller/admin)
- Resource ownership? (accessing own resources?)

#### "401 Unauthorized"
**Check:**
- Token sent?
- Token still valid? (7 days expiry)
- JWT_SECRET correct?

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Nguyen Ngoc**
- GitHub: [@izjoe](https://github.com/izjoe)

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@eatify.com

For security issues:
- **DO NOT** open public issues
- Email: security@eatify.com

---

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- All contributors and supporters

---

## 📊 Project Status

**Current Version:** 1.1.0  
**Status:** ✅ Production Ready (with recommended security enhancements)  
**Last Updated:** 3/12/2025

### Recent Updates
- ✅ Enhanced access control and privacy protection
- ✅ Added comprehensive security middleware
- ✅ Improved API documentation
- ✅ Fixed code duplication issues
- ✅ Added admin management functions
- ✅ Strengthened password requirements
- ✅ Implemented file upload security

---

**⚠️ IMPORTANT:** Before deploying to production, implement the recommended security measures (rate limiting, helmet, input sanitization) listed in the Security section above!

---

**Made with ❤️ for food lovers everywhere! 🍕🍔🍜**
