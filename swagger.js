import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eatify API Documentation",
      version: "1.0.0",
      description: `
# Eatify REST API Documentation

Welcome to the Eatify food delivery system API documentation.

## 🔐 Authentication

Most endpoints require authentication. Follow these steps:

1. **Register a new account** at \`POST /api/auth/register\`
2. **Login** at \`POST /api/auth/login\` to receive a JWT token
3. **Click the "Authorize" button** at the top of this page
4. Enter your token in the format: \`Bearer <your-token-here>\`
5. Click "Authorize" to authenticate all requests

## 📍 Base URL

- **Production:** https://eatify-be.onrender.com
- **Development:** http://localhost:4000

## 👥 User Roles

- **buyer**: Regular customer who orders food
- **seller**: Restaurant/store owner who sells food  
- **admin**: System administrator

## 🔒 Password Requirements

- Minimum 8 characters
- Must contain uppercase letter (A-Z)
- Must contain lowercase letter (a-z)
- Must contain number (0-9)

Example: \`Password123\`
      `,
      contact: {
        name: "Eatify Support",
        email: "support@eatify.com"
      }
    },
    servers: [
      { 
        url: "https://eatify-be.onrender.com",
        description: "Production server (Render)"
      },
      { 
        url: "http://localhost:4000",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: `
JWT Authentication Token

**How to get a token:**
1. Login at POST /api/auth/login
2. Copy the token from the response
3. Click "Authorize" button above
4. Enter: Bearer <your-token-here>
5. Click "Authorize"

**Token expires in:** 7 days

**Example:**
\`\`\`
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTcyYmQ4NjJjOGI0YTEzMjQwZjI5NCIsInJvbGUiOiJidXllciIsImlhdCI6MTczMzc0NjE5MiwiZXhwIjoxNzM0MzUwOTkyfQ.abc123...
\`\`\`
          `
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./routes/*.js"] // Swagger đọc annotations từ routes
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app) {
  const port = process.env.PORT || 4000;
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`� Swagger UI running at: http://localhost:${port}/api-docs`);
}
