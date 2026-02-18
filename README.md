# Arca Digital - Full-Stack Test

## Full-Stack Engineer (Mid-Senior)

Bienvenido/a a la prueba técnica de Arca Digital. Esta prueba evalúa tus habilidades como Full-Stack Engineer trabajando con nuestro stack tecnológico real.

---

## 🎯 Objetivo

Completar las **3 tareas obligatorias** y opcionalmente algunas de las **4 tareas opcionales** que demuestren tus fortalezas.

**Tiempo sugerido**: 2-3 días

---

## 🛠 Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Monorepo | npm workspaces + Turborepo |
| Backend | NestJS 10 + TypeScript |
| Frontend | React 18 (CRA) + TypeScript 4.9 |
| UI | Chakra UI 2.8.2 + Emotion + Framer Motion |
| Routing | react-router-dom 6.x |
| Gráficos | Chart.js + react-chartjs-2 |
| Fechas | dayjs |
| Base de datos | PostgreSQL 15 (Neon cloud o Docker) |
| ORM | TypeORM |
| Validación BE | class-validator + class-transformer |
| Validación FE | Funciones custom (ver utils/validation.ts) |
| Data Fetching | fetch nativo |
| Testing | Jest + Testing Library |

### Principios del Stack

- **NO usar librerías de forms** (react-hook-form, formik) → validación custom en utils
- **NO usar zod/yup en frontend** → funciones de validación manuales
- **NO usar axios o react-query** → fetch nativo con async/await
- **Token siempre primer parámetro** en funciones de API
- **Context API** para estado global (NO Redux)

---

## 🚀 Setup

### Requisitos previos
- Node.js 18+
- Git
- Docker y Docker Compose **O** usar la BBDD cloud (ver opciones abajo)

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/TU-USUARIO/arca-digital-full-stack-test.git
   cd arca-digital-full-stack-test
   ```

2. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```

3. **Configura la base de datos** (elige una opción):

   **Opción A: Neon - BBDD Cloud (Default, sin Docker)**

   El `.env.example` ya viene configurado con Neon. No necesitas hacer nada más.

   **Opción B: Docker (Local)**

   Si prefieres usar Docker:
   1. Abre el archivo `.env`
   2. Comenta las variables `DATABASE_*` de Neon
   3. Descomenta las variables `DATABASE_*` de Docker
   4. Ejecuta: `docker-compose up -d`

4. **Instala dependencias y carga datos de ejemplo**
   ```bash
   npm install
   npm run db:seed
   ```

5. **Arranca el proyecto en modo desarrollo**
   ```bash
   npm run dev
   ```

6. **Verifica que todo funciona**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api
   - Swagger Docs: http://localhost:3000/api/docs
   - Mock Payroll API: http://localhost:3100/health

### Puertos y URLs

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (React) | 3001 | http://localhost:3001 |
| Backend (NestJS) | 3000 | http://localhost:3000/api |
| Swagger Docs | 3000 | http://localhost:3000/api/docs |
| Mock Payroll API | 3100 | http://localhost:3100/health |

### Comandos útiles

```bash
# Desarrollo
npm run dev            # Arranca todo (frontend + backend + mock)
npm run dev:frontend   # Solo frontend
npm run dev:backend    # Solo backend
npm run dev:mock       # Solo mock API

# Testing
npm run test           # Ejecuta todos los tests
npm run build          # Build de producción

# Base de datos
npm run db:seed        # Cargar datos de ejemplo
npm run db:reset       # Reset completo + seed
```

---

## 📋 Tareas

### Obligatorias (3)

1. **Flujo Onboarding Empleado** - Multi-step wizard con validación custom
2. **Integración API Nóminas** - Sync con retry y error handling
3. **Instrumentación Analítica** - Event tracking + dashboard con Chart.js

### Opcionales (4)

- **A**: Suite Tests E2E + CI
- **B**: Refactorizar Código Legacy
- **C**: PRD desde Contexto de Negocio
- **D**: Code Review de PR Problemática

📖 **Detalle completo**: [docs/TASKS.md](docs/TASKS.md)

---

## 📤 Entrega

### Pasos para entregar tu solución

1. **Crea tu repositorio privado**
   - Haz clic en "Use this template" → "Create a new repository"
   - Nombre sugerido: `arca-digital-full-stack-test-tu-nombre`
   - **Importante**: Marca como **Private**

2. **Desarrolla las tareas**
   - Trabaja en tu repo privado
   - Haz commits frecuentes con mensajes descriptivos

3. **Invita al revisor**
   - Ve a Settings → Collaborators → Add people
   - Invita a: `gonzaloconcep`

4. **Notifica tu entrega**
   - Rellena el formulario: https://forms.gle/DBffR99hWkwgMUWcA
   - Incluye la URL de tu repositorio

### Tu entrega debe incluir:

- ✅ Código de las tareas completadas
- ✅ `SUBMISSION.md` completado con tus decisiones
- ✅ El proyecto debe funcionar con `npm install && npm run dev`
- ✅ Tests pasando con `npm test`

---

## 📂 Estructura del Proyecto

```
arca-digital-full-stack-test/
├── apps/
│   ├── backend/                    # NestJS API
│   │   └── src/
│   │       ├── employees/          # Tarea 1 - Onboarding
│   │       ├── payroll-sync/       # Tarea 2 - Sync
│   │       └── events/             # Tarea 3 - Analytics
│   ├── frontend/                   # React (CRA)
│   │   └── src/
│   │       ├── api/                # fetch nativo (token 1er param)
│   │       ├── pages/
│   │       │   ├── Onboarding/     # Tarea 1
│   │       │   └── Dashboard/      # Tarea 3
│   │       ├── utils/
│   │       │   └── validation.ts   # Validación custom
│   │       └── types/
│   └── mock-payroll-api/           # Mock server para Tarea 2
├── packages/
│   └── shared/                     # Tipos compartidos
├── legacy/                         # Código para Opcional B
├── docs/
│   ├── TASKS.md                    # Detalle de tareas
│   ├── EVALUATION.md               # Rúbrica
│   ├── PRD-CONTEXT.md              # Contexto para Opcional C
│   └── pr-to-review.diff           # PR para Opcional D
└── README.md
```

---

## 🔍 Evaluación

Tu entrega será evaluada en:

| Aspecto | Peso |
|---------|------|
| Funcionalidad | 30% |
| Calidad del código | 25% |
| Testing | 20% |
| Arquitectura | 15% |
| Documentación | 10% |

📖 **Rúbrica detallada**: [docs/EVALUATION.md](docs/EVALUATION.md)

### Sobre el uso de AI

Valoramos la **honestidad** sobre el uso de herramientas. Usar Claude, Copilot, o ChatGPT está permitido, pero:

1. **Debes poder explicar** cualquier línea de código en la entrevista
2. **Documenta** cómo las usaste en `SUBMISSION.md`
3. El código debe ser **coherente** y seguir el contexto del proyecto

---

## 🆘 Soporte

Si tienes dudas técnicas sobre el setup:
- Abre un issue en el repositorio
- Email: gonzalo@arcadigital.app

**Nota**: No respondemos preguntas sobre cómo resolver las tareas.

---

¡Buena suerte! 🚀
