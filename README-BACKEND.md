# Integración con Backend - Paw Rangers

## 📋 Estructura del Frontend

El frontend está organizado de la siguiente manera:

```
src/app/
├── core/
│   ├── models/              # Modelos de datos TypeScript
│   │   ├── pet.model.ts     # Interfaces para mascotas
│   │   └── user.model.ts    # Interfaces para usuarios
│   ├── services/            # Servicios para consumir API
│   │   ├── auth.service.ts  # Autenticación
│   │   ├── pet.service.ts   # Gestión de mascotas
│   │   └── user.service.ts  # Gestión de usuarios
│   ├── interceptors/        # Interceptores HTTP
│   │   ├── auth.interceptor.ts   # Añade token a requests
│   │   └── error.interceptor.ts  # Manejo de errores
│   └── guards/              # Guards de rutas
│       ├── auth.guard.ts    # Protege rutas autenticadas
│       └── admin.guard.ts   # Protege rutas de admin
└── environments/            # Configuración de entornos
    ├── environment.ts       # Desarrollo
    └── environment.prod.ts  # Producción
```

## 🔌 Endpoints Esperados del Backend

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/login` | Iniciar sesión | `{ email, password }` |
| POST | `/register` | Registrar usuario | `{ email, password, name, phone }` |
| POST | `/refresh` | Refrescar token | `{ refreshToken }` |
| POST | `/forgot-password` | Recuperar contraseña | `{ email }` |
| POST | `/reset-password` | Restablecer contraseña | `{ token, newPassword }` |

**Respuesta esperada de login/register:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+51999999999",
      "profileImage": "https://...",
      "createdAt": "2024-11-30T00:00:00.000Z",
      "updatedAt": "2024-11-30T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Mascotas Perdidas (`/api/pets/lost`)

| Método | Endpoint | Descripción | Query Params |
|--------|----------|-------------|--------------|
| GET | `/` | Listar mascotas perdidas | `page, limit, type, breed, location` |
| GET | `/:id` | Obtener por ID | - |
| POST | `/` | Crear reporte | Body: `CreateLostPetDto` |
| PUT | `/:id` | Actualizar reporte | Body: `Partial<CreateLostPetDto>` |
| DELETE | `/:id` | Eliminar reporte | - |
| PATCH | `/:id/found` | Marcar como encontrada | - |
| GET | `/recent` | Obtener recientes | `limit` |
| GET | `/search` | Buscar por texto | `q` |

**Respuesta esperada (lista con paginación):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Max",
      "type": "Perro",
      "breed": "Golden Retriever",
      "color": "Dorado",
      "location": "San Isidro, Lima",
      "lastSeenLocation": "Parque Kennedy",
      "date": "2024-11-28T00:00:00.000Z",
      "reward": 500,
      "image": "https://...",
      "description": "Perro muy amigable...",
      "ownerName": "María García",
      "ownerPhone": "+51999999999",
      "ownerEmail": "maria@example.com",
      "characteristics": ["collar azul", "cicatriz en pata"],
      "status": "active"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

### Mascotas Encontradas (`/api/pets/found`)

| Método | Endpoint | Descripción | Query Params |
|--------|----------|-------------|--------------|
| GET | `/` | Listar mascotas encontradas | `page, limit, type, breed, location` |
| GET | `/:id` | Obtener por ID | - |
| POST | `/` | Crear reporte | Body: `CreateFoundPetDto` |
| PUT | `/:id` | Actualizar reporte | Body: `Partial<CreateFoundPetDto>` |
| DELETE | `/:id` | Eliminar reporte | - |
| PATCH | `/:id/claimed` | Marcar como reclamada | - |
| GET | `/recent` | Obtener recientes | `limit` |
| GET | `/search` | Buscar por texto | `q` |

**Respuesta esperada (similar a lost pets):**
```json
{
  "data": [
    {
      "id": 1,
      "type": "Perro",
      "breed": "Labrador",
      "color": "Negro",
      "location": "Miraflores, Lima",
      "date": "2024-11-28T00:00:00.000Z",
      "image": "https://...",
      "description": "Encontrado en parque...",
      "contactName": "Carlos Ruiz",
      "contactPhone": "+51999999999",
      "contactEmail": "carlos@example.com",
      "shelterLocation": "Refugio Huellitas",
      "status": "available"
    }
  ],
  "total": 32,
  "page": 1,
  "limit": 10,
  "totalPages": 4
}
```

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/profile` | Obtener perfil actual |
| PUT | `/profile` | Actualizar perfil |
| POST | `/profile/image` | Subir foto de perfil |
| GET | `/lost-pets` | Mascotas perdidas del usuario |
| GET | `/found-pets` | Mascotas encontradas del usuario |
| POST | `/change-password` | Cambiar contraseña |
| DELETE | `/profile` | Eliminar cuenta |

### Upload de Imágenes (`/api/pets/upload`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/` | Subir imagen | FormData con campo `image` |

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Imagen subida exitosamente",
  "data": {
    "url": "https://cloudinary.com/paw-rangers/abc123.jpg"
  }
}
```

## 🔐 Autenticación

El frontend envía el token JWT en cada request mediante el `authInterceptor`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚙️ Configuración

### 1. Actualizar URL del Backend

Edita `src/app/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // 👈 Cambiar aquí
  // ... resto de configuración
};
```

### 2. Para Producción

Edita `src/app/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.pawrangers.com/api', // 👈 URL de producción
  // ... resto de configuración
};
```

## 📦 Modelos de Datos (DTOs)

### CreateLostPetDto
```typescript
{
  name: string;
  type: string;
  breed: string;
  color: string;
  location: string;
  lastSeenLocation: string;
  date: Date;
  reward?: number;
  image?: string;
  description: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  characteristics?: string[];
}
```

### CreateFoundPetDto
```typescript
{
  type: string;
  breed: string;
  color: string;
  location: string;
  date: Date;
  image?: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  shelterLocation?: string;
}
```

## 🚀 Uso en Componentes

### Ejemplo: Obtener mascotas perdidas

```typescript
import { PetService } from '@/core/services/pet.service';

export class LostPetsListComponent {
  constructor(private petService: PetService) {}

  ngOnInit() {
    this.petService.getLostPets(1, 10).subscribe({
      next: (response) => {
        this.pets = response.data;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
```

### Ejemplo: Crear reporte de mascota perdida

```typescript
createReport() {
  const data: CreateLostPetDto = {
    name: 'Max',
    type: 'Perro',
    breed: 'Golden Retriever',
    // ... resto de datos
  };

  this.petService.createLostPet(data).subscribe({
    next: (response) => {
      console.log('Reporte creado:', response.data);
      this.router.navigate(['/animales-perdidos']);
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

## 🛠️ Manejo de Errores

El `errorInterceptor` captura automáticamente errores HTTP y:
- Muestra mensajes apropiados según el código de error
- Redirige a login en caso de 401 (no autorizado)
- Registra errores en consola

## 📝 Notas Importantes

1. **CORS**: El backend debe permitir requests desde `http://localhost:4200` (desarrollo)
2. **Tokens**: Los tokens se guardan en localStorage con las keys definidas en `environment.ts`
3. **Formato de Fecha**: Usar ISO 8601 (`2024-11-30T00:00:00.000Z`)
4. **Imágenes**: Soporta JPEG, PNG, WebP (máximo 5MB)
5. **Paginación**: Por defecto 10 items por página

## ✅ Checklist de Integración

- [ ] Backend configurado con CORS
- [ ] Endpoints implementados según especificación
- [ ] JWT configurado correctamente
- [ ] Base de datos con esquema apropiado
- [ ] Upload de imágenes funcionando
- [ ] Variables de entorno configuradas en frontend
- [ ] Pruebas de endpoints con Postman/Insomnia
- [ ] Validación de DTOs en backend
- [ ] Manejo de errores apropiado

## 🤝 Contacto

Para dudas sobre la integración, revisar los modelos en:
- `src/app/core/models/pet.model.ts`
- `src/app/core/models/user.model.ts`
- `src/app/core/services/pet.service.ts`
