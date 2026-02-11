# Arca Digital - Take-Home Assessment

## Full-Stack Engineer (Mid-Senior)

Bienvenido/a a la prueba técnica de Arca Digital. Esta prueba evalúa tus habilidades como Full-Stack Engineer trabajando con nuestro stack tecnológico real.

---

## 🎯 Objetivo

Completar las **3 tareas obligatorias** y opcionalmente algunas de las **4 tareas opcionales** que demuestren tus fortalezas.

**Tiempo sugerido**: 5-7 días

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
| Base de datos | PostgreSQL 15 (Docker) |
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
- Docker y Docker Compose
- Git

### Instalación

```bash
# 1. Fork este repositorio a tu cuenta de GitHub

# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/arca-takehome.git
cd arca-takehome

# 3. Copia el archivo de entorno
cp .env.example .env

# 4. Setup completo (instala dependencias, levanta Docker, ejecuta seeds)
npm run setup

# 5. Inicia todos los servicios
npm run dev
```

### Verificar que funciona

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Mock Payroll API**: http://localhost:3002/health

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

### Método de entrega: Pull Request

1. **Fork** este repositorio a tu cuenta de GitHub
2. **Crea una rama** con tu nombre: `submission/nombre-apellido`
3. **Desarrolla** las tareas en esa rama
4. **Crea una Pull Request** al repositorio original
5. **Completa** el archivo `SUBMISSION.md`

### Tu PR debe incluir:

- ✅ Código de las tareas completadas
- ✅ `SUBMISSION.md` completado
- ✅ El proyecto debe compilar y ejecutarse con `npm run setup && npm run dev`
- ✅ Tests pasando con `npm test`

---

## 📂 Estructura del Proyecto

```
arca-takehome/
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
