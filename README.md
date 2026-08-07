# ReciclApp

Sistema de clasificación de residuos orientado a tablets instaladas en centros de reciclaje. Permite identificar residuos mediante inteligencia artificial, indicar el contenedor correspondiente y acumular puntos por cliente.

---

## Arquitectura

```
Tablet (React + Vite)
        |
        v
Backend Modular (Node.js + Express)
        |
        +-- Módulo Session/Customer
        +-- Módulo Classification
        +-- Módulo Recycling Rules
        +-- Módulo Points
        +-- Módulo Persistence (SQLite)
        +-- AI Provider Interface
                  |
                  v
          Simulated AI Provider
```

La aplicación cliente nunca se comunica directamente con el proveedor de IA.

---

## Tecnologías

| Componente | Tecnología | Justificación |
|---|---|---|
| Backend | Node.js + Express | Simple, rápido, amplio ecosistema, ideal para MVP |
| Frontend | React + Vite | Build rápido, excelente ecosistema, soporte JSX |
| Persistencia | SQLite (better-sqlite3) | Sin servidor, local, cero configuración |
| QR generación | qrcode | Biblioteca estable y ampliamente usada |
| QR escaneo | jsQR | Funciona en navegador sin dependencias nativas |
| Tests backend | Jest + supertest | Estándar para Node.js, supertest para HTTP |
| Tests frontend | Vitest + RTL | Integrado con Vite, API compatible con Jest |

---

## Requisitos

- **Node.js** >= 18
- **npm** >= 9

---

## Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Configuración

### Backend

Crea un archivo `.env` en `backend/` basado en `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Variables de entorno disponibles:

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor backend | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_PATH` | Ruta al archivo SQLite | `./reciclapp.db` |

---

## Ejecución

### Backend

```bash
cd backend
npm start          # Producción
npm run dev        # Desarrollo (con --watch)
```

El backend estará disponible en: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

> El frontend tiene configurado un proxy `/api` → `http://localhost:3001` en Vite.

---

## Ejecución de pruebas

### Backend

```bash
cd backend
npm test
```

Ejecuta todos los tests en `backend/tests/`:
- `sessions.test.js` — creación y recuperación de sesiones
- `classification.test.js` — clasificación de imágenes
- `rules.test.js` — reglas residuo → contenedor
- `points.test.js` — asignación de puntos
- `ai-provider.test.js` — proveedor de IA simulado

### Frontend

```bash
cd frontend
npm test
```

Ejecuta todos los tests en `frontend/src/tests/`:
- `ContainerDisplay.test.jsx` — visualización de contenedores
- `ClassificationResult.test.jsx` — resultado con/sin puntos
- `ErrorMessage.test.jsx` — mensajes de error y botón reintentar

---

## API endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/customers` | Crear cliente (name, email) → retorna customer + QR code |
| `GET` | `/api/customers/qr/:token` | Obtener cliente por token QR |
| `POST` | `/api/sessions` | Crear sesión (body: `{qr_token}` o `{}` para invitado) |
| `GET` | `/api/sessions/:token` | Obtener sesión por token |
| `GET` | `/api/sessions/:token/summary` | Resumen de sesión con clasificaciones |
| `POST` | `/api/classify` | Clasificar imagen (multipart, header: `X-Session-Token`) |
| `GET` | `/api/health` | Health check |

---

## Flujo de la aplicación

1. **Inicio** → opción de escanear QR o continuar como invitado
2. **Escaneo QR** → identifica al cliente y crea sesión identificada
3. **Captura** → cámara del dispositivo o selección de archivo
4. **Procesamiento** → imagen enviada al backend
5. **Resultado** → tipo de residuo, contenedor y puntos (si corresponde)
6. **Resumen** → listado de todas las clasificaciones de la sesión

---

## Proveedor de IA simulado

El `SimulatedAiProvider` no requiere credenciales ni conexión externa. Su comportamiento:

- **Determinístico**: el mismo buffer de imagen siempre produce el mismo tipo de residuo, calculado mediante un hash del contenido del buffer.
- **Confianza**: valor entre 0.70 y 0.99, calculado a partir del hash.
- **Umbral mínimo**: si la confianza es < 0.6, el backend rechaza la clasificación (en la práctica el proveedor simulado siempre está por encima de 0.70).
- **Tipos soportados**: plastic, glass, paper, metal, organic.

Para reemplazar el proveedor simulado por uno real:
1. Crea una clase que extienda `AiProvider` en `src/providers/`
2. Implementa el método `classify(imageBuffer)` → `{ waste_type, confidence }`
3. En `classificationService.js`, reemplaza `new SimulatedAiProvider()` por tu nuevo proveedor

---

## Reglas de contenedores y puntos

| Residuo | Contenedor | Color | Puntos |
|---|---|---|---|
| Plástico | Contenedor Azul | 🔵 | 10 |
| Vidrio | Contenedor Verde | 🟢 | 15 |
| Papel/Cartón | Contenedor Amarillo | 🟡 | 8 |
| Metal | Contenedor Gris | ⚫ | 20 |
| Orgánico | Contenedor Marrón | 🟤 | 5 |

> Los puntos solo se asignan a clientes identificados (no invitados).

---

## Seguridad

- No hay secretos en el código fuente
- Validación de todos los inputs en el backend con `express-validator`
- Límite de imágenes: 5MB, solo JPEG/PNG/WEBP (validado por MIME y magic bytes)
- Token de sesión en header `X-Session-Token`, validado server-side
- Los puntos se asignan **únicamente** en el backend
- No se almacenan imágenes permanentemente (solo en memoria durante el procesamiento)
- Headers de seguridad con `helmet`

---

## Manejo de errores

La aplicación maneja explícitamente:

- Cámara no disponible / permiso denegado
- Imagen inválida o formato no soportado
- Archivo demasiado grande (> 5MB)
- Error de red
- Error del backend
- Error del proveedor de IA
- Clasificación desconocida
- Nivel de confianza insuficiente (< 60%)
- Sesión inválida o expirada
