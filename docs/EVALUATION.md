# Rúbrica de Evaluación

## Criterios Principales

| Aspecto | Peso | Descripción |
|---------|------|-------------|
| **Funcionalidad** | 30% | Cumple requisitos, sin bugs críticos, casos edge manejados |
| **Código** | 25% | Clean code, naming consistente, estructura clara, DRY |
| **Testing** | 20% | Cobertura adecuada, casos edge, tests que aportan valor |
| **Arquitectura** | 15% | Separación de responsabilidades, patrones apropiados |
| **Documentación** | 10% | README claro, tipos bien definidos, código auto-documentado |

---

## Niveles de Evaluación

### Excelente (90-100%)
- 3 tareas obligatorias completas + 2 o más opcionales
- Tests con coverage >80%
- Código production-ready
- Manejo robusto de errores
- Documentación clara de decisiones

### Bueno (75-89%)
- 3 tareas obligatorias completas
- Tests significativos en áreas críticas
- Código limpio y bien estructurado
- Errores comunes manejados

### Aceptable (60-74%)
- 2 tareas obligatorias completas + 1 parcial
- Tests básicos presentes
- Código funcional con algunas mejoras posibles

### Insuficiente (<60%)
- Menos de 2 tareas completas
- Tests ausentes o triviales
- Código difícil de seguir

---

## Red Flags (Descalificación automática)

- ❌ El código no compila/ejecuta
- ❌ Credenciales hardcodeadas o en el repo
- ❌ Plagio evidente (código copiado sin entender)
- ❌ PR que no sigue las instrucciones de entrega
- ❌ Código claramente generado por AI sin revisión ni comprensión

---

## Bonus Points

- ✅ CI/CD configurado y funcionando
- ✅ Docker compose completo para desarrollo
- ✅ Swagger bien documentado
- ✅ Conventional commits
- ✅ Manejo de errores excepcional
- ✅ Performance optimizations explicadas

---

## Evaluación de Uso de Herramientas AI

### Lo que valoramos positivamente:
- Uso transparente y honesto de herramientas AI
- Capacidad de explicar y defender el código generado
- Modificaciones y mejoras sobre código generado
- Comprensión demostrada del código entregado

### Lo que penalizamos:
- Código inconsistente (mezcla de estilos que sugiere copy-paste)
- No poder explicar decisiones técnicas en la entrevista
- Errores básicos que sugieren falta de revisión
- Código que no sigue el contexto del proyecto

### Preguntas de Follow-up (Entrevista)
Prepárate para explicar:
1. ¿Por qué elegiste esta estructura/patrón?
2. ¿Qué alternativas consideraste?
3. ¿Cómo manejarías X caso edge?
4. ¿Qué mejorarías con más tiempo?
5. Walk me through this piece of code line by line

---

## Matriz de Evaluación por Tarea

### Tarea 1: Onboarding
| Criterio | Puntos |
|----------|--------|
| Wizard funciona end-to-end | 25 |
| Validación frontend (Zod) | 15 |
| Validación backend | 15 |
| Persistencia de progreso | 20 |
| Tests | 15 |
| UX/UI cuidada | 10 |

### Tarea 2: Payroll Sync
| Criterio | Puntos |
|----------|--------|
| Retry con backoff propio | 30 |
| Manejo de errores de red | 20 |
| Validación de datos | 15 |
| Upsert correcto | 15 |
| Tests de casos error | 20 |

### Tarea 3: Analytics
| Criterio | Puntos |
|----------|--------|
| Query SQL funnel | 25 |
| Query SQL eventos/día | 15 |
| Tracking frontend | 20 |
| Dashboard funcional | 25 |
| Tests | 15 |
