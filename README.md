# ♻️ ReciclApp — MVP

Aplicación orientada a tablets para identificación y clasificación de residuos mediante IA. Permite fotografiar un residuo, clasificarlo y mostrar en qué contenedor debe depositarse. Asigna puntos a clientes identificados por código QR.

---

## Arquitectura

```
reciclapp/
├── backend/          # API REST en Node.js + Express
│   ├── src/
│   │   ├── index.js              # Entry point
│   │   ├── routes/
│   │   │   ├── classify.js       # POST /api/classify
│   │   │   └── customers.js      # GET /api/customers/*
│   │   ├── services/
│   │   │   ├── aiClassifier.js   # Proveedor IA simulado
│   │   │   └── wasteService.js   # Lógica de negocio
│   │   ├── models/
│   │   │   └── database.js       # SQLite (better-sqlite3)
│   │   └── middleware/
│   │       └── errorHandler.js
│   └── tests/
│       ├── aiClassifier.test.js
│       ├── wasteService.test.js
│       └── api.test.js
│
└── frontend/         # React + Vite (orientado a tablet)
    └── src/
        ├── pages/MainPage.jsx    # Flujo principal
        ├── components/
        │   ├── QrScanner.jsx     # Escáner de QR
        │   ├── CameraCapture.jsx # Cámara / archivo
        │   ├── ContainerDisplay.jsx # Resultado de clasificación
        │   └── PointsBadge.jsx   # Puntos del cliente
        ├── hooks/
        │   ├── useCustomer.js
        │   └── useClassification.js
        └── services/api.js
```

---

## Requisitos

- **Node.js** 18 o superior
- **npm** 9 o superior

---

## Instalación y ejecución

### 1. Backend

```bash
cd backend
cp .env.example .env   # opcional, valores por defecto funcionan
npm install
npm start
```

El backend queda disponible en `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # opcional
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable  | Default                  | Descripción                 |
|-----------|--------------------------|-----------------------------|
| `PORT`    | `3001`                   | Puerto del servidor          |
| `DB_PATH` | `./data/reciclapp.db`    | Ruta de la base de datos SQLite |

### Frontend (`frontend/.env`)

| Variable        | Default                        | Descripción          |
|-----------------|--------------------------------|----------------------|
| `VITE_API_URL`  | `http://localhost:3001/api`    | URL del backend       |

---

## API REST

| Método | Ruta                          | Descripción                           |
|--------|-------------------------------|---------------------------------------|
| GET    | `/api/health`                 | Estado del servidor                   |
| POST   | `/api/classify`               | Clasificar imagen de residuo          |
| GET    | `/api/customers/qr/:qrCode`   | Buscar cliente por QR                 |
| GET    | `/api/customers/:id`          | Obtener cliente por ID                |
| GET    | `/api/customers/:id/history`  | Historial de clasificaciones          |

### POST `/api/classify`

**Body:** `multipart/form-data`
- `image` (required): archivo de imagen (JPEG / PNG / WebP, máx 10 MB)
- `customerId` (optional): ID del cliente para acumular puntos

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "classificationId": "uuid",
    "wasteType": "Plástico",
    "containerColor": "yellow",
    "containerLabel": "Contenedor Amarillo",
    "containerIcon": "🟡",
    "confidence": 0.91,
    "provider": "simulated",
    "pointsAwarded": 10,
    "totalPoints": 130,
    "customer": { "id": "cust-001", "name": "Ana García", "points": 130 }
  }
}
```

---

## Clientes de prueba (QR)

Los siguientes QR codes están precargados:

| Código QR         | Nombre          | Puntos iniciales |
|-------------------|-----------------|-----------------|
| `QR-ANA-001`      | Ana García      | 120             |
| `QR-CARLOS-002`   | Carlos López    | 45              |
| `QR-DEMO-003`     | Demo User       | 0               |

Para probar la identificación por QR, usa cualquiera de estos códigos.

---

## Clasificación de residuos (IA simulada)

| Tipo de residuo   | Contenedor         | Puntos |
|-------------------|--------------------|--------|
| Plástico          | 🟡 Amarillo        | 10     |
| Papel y Cartón    | 🔵 Azul            | 8      |
| Vidrio            | 🟢 Verde           | 12     |
| Metal             | ⚫ Gris            | 15     |
| Orgánico          | 🟤 Marrón          | 5      |
| Residuo Especial  | 🟠 Naranja         | 20     |
| General           | ⬛ Negro           | 2      |

El proveedor simulado clasifica según el nombre del archivo. Por ejemplo, subir un archivo llamado `plastic_bottle.jpg` clasificará como Plástico. En producción se reemplaza `aiClassifier.js` con una llamada real a un servicio de visión IA.

---

## Pruebas

```bash
cd backend
npm test
```

Cobertura incluida. Se ejecutan 27 pruebas sobre:
- Lógica de clasificación IA
- Servicio de residuos (puntos, historial, búsqueda por QR)
- API REST (endpoints, validaciones, respuestas)

---

## Flujo de uso en la aplicación

1. **Identificar cliente** — escanear QR o continuar sin cuenta
2. **Fotografiar residuo** — usar cámara del dispositivo o subir imagen
3. **Resultado** — ver tipo de residuo, contenedor correcto y puntos ganados
4. **Repetir** — clasificar otro residuo o iniciar nueva sesión

---

## Limitaciones y trabajo pendiente

- El proveedor IA es simulado (clasifica por nombre de archivo). Para producción, integrar con Google Vision, Azure AI o similar.
- La autenticación es por QR simple sin seguridad adicional. Para producción, agregar JWT.
- No hay registro de nuevos clientes desde la UI.
- Sin soporte offline / PWA.
- Las imágenes subidas no se limpian automáticamente del servidor.
