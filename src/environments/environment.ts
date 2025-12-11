export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Base real de la API (sin /api)
  apiVersion: 'v1',
  defaultLanguage: 'es',
  supportedLanguages: ['es', 'en'],
  
  // Configuración de autenticación
  auth: {
    tokenKey: 'paw_rangers_token',
    refreshTokenKey: 'paw_rangers_refresh_token',
    userKey: 'paw_rangers_user'
  },

  // Configuración de paginación por defecto
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50]
  },

  // Configuración de imágenes
  images: {
    maxSize: 5242880, // 5MB en bytes
    allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    placeholderUrl: 'assets/img/placeholder-pet.jpg'
  },

  // Configuración de mapas (Leaflet)
  maps: {
    defaultCenter: [-12.0464, -77.0428], // Lima, Perú
    defaultZoom: 13,
    maxZoom: 18,
    minZoom: 5
  }
};
