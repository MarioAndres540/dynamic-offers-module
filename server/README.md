# Backend API - Dynamic Offers Module

API centralizada para la gestión de separatas y validación de solapamiento de ofertas.

## Requisitos
- Node.js (v18+)
- MongoDB (Local o vía Docker)

## Scripts Disponibles
- `npm run dev`: Inicia el servidor en modo desarrollo con reload automático.
- `npm start`: Inicia el servidor desde la carpeta `/dist`.
- `npm run build`: Compila el código TypeScript a JavaScript.
- `npm test`: Ejecuta la suite de pruebas con Jest.
- `npm run seed`: Pobla la base de datos con datos de prueba iniciales.

## Estructura
- `src/controllers`: Lógica de manejo de peticiones.
- `src/services`: Lógica de negocio principal (cálculo de ofertas y validaciones).
- `src/models`: Esquemas de Mongoose.
- `src/routes`: Definición de endpoints.
- `src/strategies`: Implementación del patrón Strategy para cálculos de promociones.

## Endpoints Principales
- `POST /api/separatas`: Crea una nueva separata (incluye validación de solapamiento).
- `GET /api/separatas`: Lista todas las separatas.
