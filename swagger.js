import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eatify Food Delivery API',
      version: '1.0.0',
      description: 'API documentation for Eatify Food Delivery Application',
      contact: {
        name: 'Eatify Support',
        url: 'https://eatify.com',
        email: 'support@eatify.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      },
      {
        url: 'https://food-delivery-backend-5b6g.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['buyer', 'seller'] },
            phone: { type: 'string' },
            address: { type: 'string' }
          }
        },
        Food: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            image: { type: 'string' },
            category: { type: 'string' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            items: { type: 'array' },
            amount: { type: 'number' },
            address: { type: 'object' },
            status: { type: 'string' },
            date: { type: 'string' },
            payment: { type: 'boolean' }
          }
        }
      }
    }
  },
  apis: [
    './routes/userRoute.js',
    './routes/foodRoute.js',
    './routes/cartRoute.js',
    './routes/orderRoute.js',
    './routes/sellerRoute.js',
    './routes/ratingRoute.js'
  ]
};

const specs = swaggerJsdoc(options);
export default specs;
