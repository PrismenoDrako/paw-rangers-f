export const environment = {
  production: true,
  apiUrl: 'https://api.pawrangers.com/api', // URL de producción
  apiVersion: 'v1',
  defaultLanguage: 'es',
  supportedLanguages: ['es', 'en'],
  
  auth: {
    tokenKey: 'paw_rangers_token',
    refreshTokenKey: 'paw_rangers_refresh_token',
    userKey: 'paw_rangers_user'
  },

  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50]
  },

  images: {
    maxSize: 5242880,
    allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    placeholderUrl: 'assets/img/placeholder-pet.jpg'
  },

  maps: {
    defaultCenter: [-12.0464, -77.0428],
    defaultZoom: 13,
    maxZoom: 18,
    minZoom: 5
  }
};
