# DECISIONS.md

## 1. Technology Stack Selection

### Frontend: React + Vite + TailwindCSS
- **React**: Elegido por su arquitectura basada en componentes, su amplio ecosistema y su adecuación a los requisitos.
- **Vite**: Tiempos de compilación y recarga en caliente significativamente más rápidos en comparación con Webpack/CRA, lo que mejora la experiencia del desarrollador.
- **TailwindCSS**: El CSS orientado a la utilidad permite un desarrollo rápido de la interfaz de usuario y un fácil mantenimiento de la consistencia sin tener que escribir archivos CSS personalizados para cada componente.

### Backend: Node.js + TypeScript + Express
- **Node.js**: Eficiente para operaciones de E/S.
- **TypeScript**: Incorpora tipado estático, lo que reduce los errores de ejecución y mejora la calidad y la facilidad de mantenimiento del código, esencial para la lógica de negocio, como la validación de ofertas.
- **Express**: Minimalista, flexible y ampliamente conocido. Ideal para proyectos de este tamaño, donde un framework completo como NestJS podría resultar excesivo, aunque implementaremos patrones estructurados manualmente.

### Database: MongoDB
**Justificación**: El concepto "Separado" se adapta bien a un modelo de documento (un documento de oferta contiene metadatos y una lista de productos/reglas incluidos).

**Flexibilidad**: Es más fácil almacenar diferentes esquemas de configuración de promociones (por ejemplo, una configuración "2x1" podría ser diferente a una configuración "Porcentaje") en la misma colección sin migraciones rígidas.

## 2. Architecture Decisions

### Monorepo Structure
Mantenemos el cliente y el servidor en el mismo repositorio.
- **Beneficio**: Mayor facilidad para gestionar funciones completas, tipos compartidos (potencialmente) y un flujo de trabajo de CI/CD unificado para este tamaño específico de desafío.

### Strategy Pattern for Promotions
**Requisito**: "La arquitectura debe estar preparada para nuevos tipos de promociones... sin modificar la lógica central".

**Solución**: Implementamos el **Patrón de Estrategia**.

La interfaz `PromotionStrategy` define un método `calculateDiscount(price, rules)`.

Las clases concretas `FixedDiscountStrategy` y `PercentageStrategy` implementan una lógica específica.

Para añadir "2x1" en el futuro, solo es necesario añadir `TwoForOneStrategy` y registrarla, sin modificar la lógica central de `calculateTotal`.

### Docker & Docker Compose

- Garantiza que el entorno sea idéntico para desarrollo, pruebas y producción (simulada).
- Simplifica el requisito de "levantar todo con docker-compose".

## 3. Validation Logic
- **Prevención de superposición**: antes de guardar una Separata, consultamos la base de datos para encontrar cualquier Separata existente que contenga *alguno* de los productos de destino Y tenga un rango de fechas que se superponga con la nueva Separata.
