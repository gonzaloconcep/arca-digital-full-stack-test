# Contexto de Negocio - Matching de Aportaciones

## TAREA OPCIONAL C: Escribir PRD

A partir del siguiente contexto de negocio, escribe un PRD (Product Requirements Document) completo.

---

## Contexto

Arca Digital es una plataforma de planes de pensiones de empleo. Las empresas contratan Arca para ofrecer planes de pensiones a sus empleados.

Actualmente, los empleados pueden hacer aportaciones voluntarias a su plan de pensiones. Las empresas quieren poder **incentivar** estas aportaciones ofreciendo "matching": por cada euro que aporta el empleado, la empresa aporta una cantidad adicional.

### Feedback de clientes (verbatim de entrevistas):

> "Queremos poder decirle a nuestros empleados: 'si tú pones 100€, nosotros ponemos 50€ más'. Pero necesitamos control sobre cuánto gastamos como máximo al mes."
> — Director RRHH, empresa tecnológica (150 empleados)

> "Nos gustaría configurar diferentes niveles de matching según la antigüedad del empleado. Los que llevan más de 5 años deberían tener mejor matching."
> — CEO, startup (40 empleados)

> "El límite anual es importante. No queremos sorpresas en el presupuesto. Y sería genial ver en un dashboard cuánto llevamos gastado."
> — CFO, consultora (80 empleados)

### Requisitos de alto nivel mencionados:

1. **Ratio de matching configurable**: La empresa decide cuánto aporta por cada euro del empleado (ej: 0.5x, 1x, 2x)

2. **Límites**:
   - Límite mensual por empleado
   - Límite anual por empleado
   - Límite presupuestario total de la empresa

3. **Reglas opcionales**:
   - Matching diferente según antigüedad
   - Matching diferente según categoría laboral
   - Periodo de "vesting" (el matching de la empresa se consolida tras X tiempo)

4. **Visibilidad**:
   - El empleado ve cuánto matching recibe
   - RRHH ve dashboard con gasto total y proyección
   - Alertas cuando se acercan a límites

### Restricciones técnicas:

- El cálculo debe ser en tiempo real cuando el empleado hace una aportación
- Debe cumplir con el límite legal de 8.500€/año en aportaciones totales
- Los datos de matching deben poder exportarse para contabilidad

### Entidades existentes en el sistema:

- `Company` - Empresas cliente
- `Employee` - Empleados (tienen `hireDate`, `category`)
- `PensionPlan` - Planes de pensiones
- `Contribution` - Aportaciones (tienen `type`: employee/employer)

---

## Tu tarea

Escribe un PRD que incluya:

1. **Resumen ejecutivo** (2-3 párrafos)

2. **User Stories** (mínimo 5)
   - Formato: "As a [role], I want [feature] so that [benefit]"
   - Incluir criterios de aceptación para cada una

3. **Priorización** (MoSCoW)
   - Must have
   - Should have
   - Could have
   - Won't have (para V1)

4. **Riesgos y dependencias**

5. **Estimación de complejidad** (T-shirt sizing: S, M, L, XL)

6. **Opcional**: Diagrama de flujo o wireframe simple

---

## Entregable

Crea el archivo `docs/PRD-MATCHING.md` con tu PRD.
