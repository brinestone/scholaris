//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  "compatibilityDate": "2025-07-25",
  preset: 'netlify',
  experimental: {
    database: true,
    openAPI: true
  },
  routeRules: {
    '/api/**': { // Apply CORS to all routes under /api
      cors: true,
      headers: {
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Origin': '*', // Specify allowed origin
        // 'Access-Control-Allow-Credentials': 'true',
      },
    },
    // Add other rules as needed
  },
  openAPI: {
    meta: {
      description: "REST API documentation for Scholaris",
      title: "Scholaris API",
      version: "1.0.0",
    },
    ui: {
      scalar: {
        theme: "purple",
        route: "/_docs/scalar",
      }
    },
    route: "/_docs/openapi.json",
  },
});
