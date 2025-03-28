import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for the application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
            },
        ],
    },
    apis: ['../auth/routes.js'], // Path to the route files for Swagger annotations
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs; 