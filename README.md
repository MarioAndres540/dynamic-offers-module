# Dynamic Offers Module - Monorepo

Este proyecto es una solución Fullstack para gestionar módulos de ofertas dinámicas, asegurando que no existan conflictos de fechas (solapamientos) entre diferentes promociones.

## Estructura del Proyecto
- `/client`: Aplicación frontend construida con React, Vite y Tailwind.
- `/server`: API Backend construida con Node.js, Express y MongoDB.
- `/.github`: Configuraciones de CI/CD para automatización de pruebas y despliegue.

## Cómo empezar de forma rápida

La forma más sencilla de ejecutar todo el entorno es utilizando **Docker Compose**:

```bash
docker-compose up --build
```

Esto levantará automáticamente:
- El servidor backend en el puerto `3001`.
- El cliente frontend en el puerto `5173`.
- Una instancia de MongoDB.

## CI/CD
El proyecto incluye un pipeline de GitHub Actions que:
1. Instala dependencias.
2. Ejecuta los tests del backend.
3. Verifica el linting.
4. Construye y publica imágenes de Docker en GHCR.
