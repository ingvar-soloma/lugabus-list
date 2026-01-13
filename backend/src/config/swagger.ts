import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LugaBus.ua API',
      version: '1.0.0',
      description: 'API documentation for the LugaBus.ua backend service.',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/schemas/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
