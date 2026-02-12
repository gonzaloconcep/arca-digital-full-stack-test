# Tareas - Arca Digital Full-Stack Test

## Resumen

- **3 tareas obligatorias** - Todas deben completarse
- **4 tareas opcionales** - Elige las que quieras hacer (revelan tus fortalezas)
- **Tiempo sugerido**: 5-7 días

---

## Stack y Patrones a Seguir

### Frontend (React + CRA)

```
apps/frontend/src/
├── api/                # Funciones fetch (token 1er param)
├── components/         # Componentes reutilizables
├── pages/             # Páginas/vistas
├── utils/             # Validación custom, helpers
├── types/             # TypeScript interfaces
└── context/           # Context API
```

**Principios:**
- **NO react-hook-form, formik** → validación custom en `utils/validation.ts`
- **NO zod/yup** → funciones de validación manuales
- **NO axios/react-query** → fetch nativo con async/await
- **Chart.js + react-chartjs-2** para gráficos (NO recharts)
- **dayjs** para fechas

**Patrón de validación:**
```typescript
// utils/validation.ts
export const validateNIF = (nif: string): string | null => {
  const nifRegex = /^[0-9]{8}[A-Z]$/;
  if (!nifRegex.test(nif)) {
    return 'El NIF debe tener 8 números seguidos de una letra mayúscula';
  }
  return null; // null = sin error
};
```

**Patrón de fetch:**
```typescript
// api/employees.ts
export const getEmployee = async (
  token: string, // Token SIEMPRE primer parámetro
  id: string
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
```

---

## Tareas Obligatorias

### Tarea 1: Flujo Onboarding Empleado

**Objetivo**: Implementar un wizard multi-step para que los empleados completen su onboarding.

**Ubicación del código**:
- Frontend: `apps/frontend/src/pages/Onboarding/`
- Backend: `apps/backend/src/employees/employees.service.ts`

**Pasos del wizard**:
1. **Datos personales**: nombre, apellidos, NIF, fecha de nacimiento
2. **Selección de plan**: mostrar planes disponibles con rentabilidad y comisiones
3. **Confirmación**: resumen de la información antes de confirmar

**Requisitos técnicos**:
- **Validación custom** en `utils/validation.ts` (NO zod/yup/react-hook-form)
- UI: Chakra UI (ya configurado)
- Backend: endpoint `PATCH /employees/:id/onboarding`
- Persistir progreso en cada paso (un refresh no debe perder datos)
- Actualizar `onboardingStatus` correctamente
- Trackear eventos con `POST /events`

**APIs disponibles**:
- `GET /employees/:id/onboarding` - Obtener progreso actual
- `PATCH /employees/:id/onboarding` - Actualizar paso
- `GET /pension-plans` - Listar planes disponibles

**Criterios de aceptación**:
- [ ] Los 3 pasos funcionan con navegación adelante/atrás
- [ ] Validación en frontend (custom) Y backend (class-validator)
- [ ] Refrescar la página no pierde el progreso
- [ ] `onboardingStatus` se actualiza: `not_started` → `personal_info` → `plan_selection` → `completed`
- [ ] Mínimo 3 tests unitarios

---

### Tarea 2: Integración API Nóminas Mock

**Objetivo**: Sincronizar empleados desde un proveedor de nóminas externo (simulado).

**Ubicación del código**:
- Backend: `apps/backend/src/payroll-sync/payroll-sync.service.ts`
- Mock API: `apps/mock-payroll-api/src/server.ts` (ya implementado)

**El mock API simula errores reales**:
- 10% de requests: timeout (10 segundos)
- 5% de requests: HTTP 500
- 2 empleados con datos inválidos (NIF malo, email vacío)

**Requisitos técnicos**:
- Implementar `POST /payroll-sync/:companyId`
- Llamar a mock API: `GET http://localhost:3100/api/employees?companyId=xxx`
- **Implementar retry con exponential backoff (CÓDIGO PROPIO, no librerías)**:
  - Reintentar en: timeout, 500, 502, 503, 504
  - Delays: 1s, 2s, 4s (máximo 3 intentos)
- Validar datos antes de guardar
- Upsert por email (si existe actualiza, si no crea)
- No fallar todo el sync por un empleado inválido

**Response esperado**:
```json
{
  "created": 5,
  "updated": 2,
  "errors": [
    { "email": "invalid@example.com", "reason": "Invalid NIF format" }
  ],
  "totalProcessed": 8
}
```

**Criterios de aceptación**:
- [ ] Mock server corriendo en `:3100` (`npm run dev:mock`)
- [ ] `POST /payroll-sync/:companyId` dispara sincronización
- [ ] Retry con backoff implementado (1s, 2s, 4s)
- [ ] Maneja correctamente timeout, 500, datos inválidos
- [ ] Mínimo 5 tests cubriendo éxito y casos de error

---

### Tarea 3: Instrumentación Analítica

**Objetivo**: Sistema de eventos para tracking del onboarding + dashboard.

**Ubicación del código**:
- Backend: `apps/backend/src/events/events.service.ts`
- Frontend dashboard: `apps/frontend/src/pages/Dashboard/`

**Parte 1: Backend**
- Modelo `Event` ya existe con: type, payload, timestamp, employeeId, sessionId
- Implementar `GET /events/analytics/funnel`:
  - Query SQL para calcular conversión por paso
  - Retornar: totalStarted, totalCompleted, overallConversionRate, steps[]
- Implementar `GET /events/analytics/events-per-day`:
  - Contar eventos por día (últimos 30 días)

**Parte 2: Frontend**
- Trackear eventos en cada paso del onboarding (usar `POST /events`)
- Dashboard con:
  - Funnel chart (**Chart.js + react-chartjs-2**, NO recharts)
  - Chart de eventos por día
  - Métricas resumen

**Eventos a trackear**:
- `onboarding_started` - Al entrar al wizard
- `onboarding_step_personal_info` - Al completar paso 1
- `onboarding_step_plan_selection` - Al completar paso 2
- `onboarding_completed` - Al confirmar

**Criterios de aceptación**:
- [ ] Eventos trackeados en cada paso del onboarding
- [ ] Query SQL funcional para calcular funnel
- [ ] Dashboard muestra funnel chart (Chart.js)
- [ ] Dashboard muestra eventos por día
- [ ] Mínimo 3 tests del servicio analytics

---

## Tareas Opcionales

Elige las que quieras hacer. Revelan tus fortalezas e intereses.

### Opcional A: Suite Tests E2E + CI

**Objetivo**: Tests end-to-end y configuración de CI.

- Escribir tests E2E con Playwright del flujo de onboarding
- Configurar coverage thresholds (80%+)
- GitHub Actions workflow para CI
- Documentar cómo correr tests

**Criterios**:
- [ ] 3+ tests E2E (happy path + edge cases)
- [ ] Coverage configurado con thresholds
- [ ] GitHub Actions corriendo tests
- [ ] Documentación clara

---

### Opcional B: Refactorizar Código Legacy

**Objetivo**: Demostrar habilidades de refactoring y clean code.

**Archivo**: `legacy/contribution-calculator.ts`

Este módulo tiene múltiples code smells:
- God class (todo en una clase)
- Magic numbers (0.05, 850000, etc.)
- Callbacks anidados (callback hell)
- Sin tipos TypeScript
- Lógica duplicada (cálculo de tax benefit)
- Sin tests

**Tu trabajo**:
1. Refactorizar aplicando patrones (Strategy, Repository, etc.)
2. Mantener funcionalidad exacta
3. Añadir tests
4. Documentar decisiones en `docs/REFACTORING.md`

**Criterios**:
- [ ] Código en módulos separados
- [ ] Al menos 1 patrón de diseño aplicado
- [ ] Tests que verifican funcionalidad
- [ ] Documento con decisiones

---

### Opcional C: PRD desde Contexto de Negocio

**Objetivo**: Demostrar product thinking.

**Contexto**: `docs/PRD-CONTEXT.md`

Escribir un PRD para la feature de "matching de aportaciones".

**Criterios**:
- [ ] 5+ user stories bien escritas
- [ ] Criterios de aceptación por story
- [ ] Priorización MoSCoW justificada
- [ ] Riesgos identificados
- [ ] Estimación T-shirt sizing

**Entregable**: `docs/PRD-MATCHING.md`

---

### Opcional D: Code Review de PR

**Objetivo**: Demostrar criterio técnico y comunicación.

**Archivo**: `docs/pr-to-review.diff`

Esta PR tiene 10-15 issues escondidos:
- Vulnerabilidad de seguridad (SQL injection)
- Bug lógico
- Performance issue (N+1 query)
- Código duplicado
- Naming confuso
- Test que no testea nada
- Type safety issues
- Error handling incompleto

**Tu trabajo**:
- Revisar como si fuera PR real
- Identificar issues con severidad (crítico/medio/bajo)
- Sugerir fixes concretos
- Tono constructivo y profesional

**Criterios**:
- [ ] Identificar al menos 8 de 15 issues
- [ ] Clasificar por severidad
- [ ] Sugerencias concretas
- [ ] Comunicación clara

**Entregable**: `docs/CODE-REVIEW.md`

---

## Cómo Empezar

```bash
# 1. Setup
npm run setup

# 2. Desarrollo (3 terminales o usar turbo)
npm run dev

# 3. Verificar que todo funciona
# - Frontend: http://localhost:3001
# - Backend: http://localhost:3000/api/docs
# - Mock Payroll API: http://localhost:3100/health

# 4. Tests
npm run test
```

## Entrega

Ver `README.md` para instrucciones de entrega via PR.
