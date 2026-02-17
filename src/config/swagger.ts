import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Authentication API',
            version: '1.0.0',
            description: 'Production-Ready Authentication System with JWT, Refresh Tokens & RBAC',
        },
        servers: [
            {
                url: 'http://localhost:3002',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        paths: {
            '/auth/register': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'testuser@example.com' },
                                        password: { type: 'string', example: 'securePass123' },
                                        name: { type: 'string', example: 'Test User' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': { description: 'User registered successfully' },
                        '400': { description: 'User already exists or missing fields' },
                    },
                },
            },
            '/auth/login': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Login and get tokens',
                    description: 'Returns Access Token in body and sets Refresh Token as HTTP-Only cookie',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'testuser@example.com' },
                                        password: { type: 'string', example: 'securePass123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': { description: 'Login successful, returns accessToken' },
                        '401': { description: 'Invalid credentials' },
                    },
                },
            },
            '/auth/refresh': {
                post: {
                    tags: ['Token Management'],
                    summary: 'Refresh Access Token',
                    description: 'Uses the Refresh Token cookie (sent automatically by browser) to issue a new Access Token',
                    responses: {
                        '200': { description: 'New Access Token issued' },
                        '401': { description: 'No Refresh Token cookie found' },
                        '403': { description: 'Invalid or revoked token' },
                    },
                },
            },
            '/auth/logout': {
                post: {
                    tags: ['Token Management'],
                    summary: 'Logout and revoke Refresh Token',
                    description: 'Deletes Refresh Token from DB and clears the cookie',
                    responses: {
                        '200': { description: 'Logged out successfully' },
                    },
                },
            },
            '/auth/me': {
                get: {
                    tags: ['Protected Routes'],
                    summary: 'Get current user profile',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': { description: 'Returns user profile from token' },
                        '401': { description: 'No token or invalid token' },
                    },
                },
            },
            '/auth/admin': {
                get: {
                    tags: ['Protected Routes'],
                    summary: 'Admin Dashboard (Admin Only)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': { description: 'Welcome to Admin Dashboard' },
                        '403': { description: 'Access denied - Admin role required' },
                    },
                },
            },
        },
    },
    apis: [], // We defined paths inline above
};

export const swaggerSpec = swaggerJsdoc(options);
