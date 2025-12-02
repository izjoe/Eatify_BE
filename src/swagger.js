import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eatify API Documentation",
      version: "1.0.0",
      description: "REST API documentation for Eatify food delivery system",
      contact: {
        name: "Eatify Support",
        email: "support@eatify.com"
      }
    },
    servers: [
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
          description: "Enter your JWT token"
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
