# Eatify_BE
# ⚙️ Eatify - Backend

This is the server-side API for the Eatify food ordering application, built with **Node.js**, **Express**, and **MongoDB**.

It provides a RESTful API for handling all business logic, including user authentication, database management (users, food, restaurants), and order processing.

## ✨ Core Features

* **RESTful API:** A clear and organized API structure using Express routers.
* **Authentication:** Secure user registration and login using **JSON Web Tokens (JWT)**.
* **Middleware Security:** Uses custom middleware (`auth.js`) to protect sensitive routes, ensuring only authenticated users can access their personal data (like placing or viewing orders).
* **Database Modeling:** Uses **Mongoose** to create robust schemas and models for `Users`, `Orders`, `Food`, and `Restaurant` data.
* **Environment Management:** Securely manages sensitive information (database URI, JWT secret) using `dotenv`.
* **CORS Enabled:** Configured with the `cors` middleware to allow requests from the frontend client.

## 🛠️ Tech Stack

* **Core:** Node.js, Express.js
* **Database:** MongoDB with Mongoose (ODM)
* **Authentication:** `jsonwebtoken` (for token generation/verification), `bcrypt` (for password hashing - *you should add this if not already!*)
* **Middleware:** `cors`, `express.json` (formerly `body-parser`)
* **Utilities:** `dotenv`, `nodemon` (for development)

## 🚀 Getting Started

To run this project locally, you must be in the `backend` directory.

### 1. Prerequisite

* [Node.js](https://nodejs.org/) (v18 or newer)
* A running **MongoDB** instance (either locally or a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 2. Install Dependencies

```bash
# Navigate to the backend directory
cd backend

# Install all dependencies
npm install
