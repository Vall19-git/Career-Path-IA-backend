# CareerPath AI — Evidencias y verificación técnica

Este documento registra las comprobaciones realizadas sobre el backend de CareerPath AI, incluyendo compilación, pruebas automatizadas, endpoints REST, base de datos y colección de Postman.

## Resultados comprobados

| Comprobación | Resultado observado |
|---|---|
| `npm run build` | Compilación finalizada sin errores |
| `npm run test` | 17 archivos de prueba / 17 pruebas aprobadas |
| `npm run test:e2e` | 1 archivo / 1 prueba E2E aprobada |
| `npm run lint` | 0 errores, 8 advertencias correspondientes a servicios provisionales existentes |
| `git diff --check` | Sin errores de formato detectados |
| `GET /vocational-tests` | 200 OK |
| `GET /vocational-tests/1` | 200 OK |
| `POST /vocational-tests` | 201 Created |
| `PATCH /vocational-tests/1` | 200 OK |
| `DELETE /vocational-tests/1` | 200 OK |
| `GET /learning-routes` | 200 OK |
| `GET /learning-routes/1` | 200 OK |
| `POST /learning-routes` | 201 Created |
| `PATCH /learning-routes/1` | 200 OK |
| `DELETE /learning-routes/1` | 200 OK |

Los endpoints generados mediante NestJS continúan utilizando respuestas provisionales. Estas pruebas verifican el funcionamiento de las rutas REST, pero no representan persistencia real sobre Supabase.

## Base de datos

El modelo relacional fue creado y comprobado en Supabase PostgreSQL.

Las tablas verificadas son:

- `users`
- `profiles`
- `favorites`
- `careers`
- `recommendations`
- `test_questions`
- `test_answers`
- `learning_routes`

Se verificaron cinco registros de prueba por tabla, con un total de 40 registros.

También se comprobaron las relaciones mediante claves foráneas, incluyendo las asociaciones entre usuarios, perfiles, carreras, favoritos, recomendaciones, respuestas del test y rutas de aprendizaje.

Para las tablas `test_answers` y `learning_routes` se verificó además:

- ausencia de registros huérfanos;
- ausencia de relaciones duplicadas;
- integridad de las referencias a `users`, `test_questions` y `careers`;
- valores de progreso dentro del rango permitido de 0 a 100.

## Postman

La colección ubicada en `postman/` se encuentra organizada por recurso:

- `Auth`
- `Users`
- `Profiles`
- `Favorites`
- `Careers`
- `Recommendations`
- `VocationalTests`
- `LearningRoutes`

Cada recurso contiene solicitudes para las operaciones REST principales:

- GET de listado;
- GET por identificador;
- POST;
- PATCH;
- DELETE.

La colección contiene 40 solicitudes organizadas en total.

La variable global utilizada para las pruebas locales es:

```text
http://localhost:3000
```

Las operaciones CRUD de `vocational-tests` y `learning-routes` fueron comprobadas manualmente mediante Postman.

## Alcance actual

La estructura REST, los recursos NestJS, los scripts SQL, el modelo relacional, las pruebas automatizadas y la documentación de Postman se encuentran preparados para esta etapa del backend.

La persistencia directa entre los servicios NestJS y Supabase todavía no está implementada. Los servicios generados mantienen respuestas provisionales hasta incorporar la capa de acceso a datos correspondiente.

La autenticación definitiva, las validaciones de negocio, los permisos y las políticas RLS específicas también permanecen como etapas posteriores del desarrollo.

## Verificación final

Antes de integrar cambios a la rama `dev`, se utilizan las siguientes comprobaciones:

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
git diff --check
git status --short
```

Estas verificaciones permiten confirmar que el proyecto compila correctamente, que las pruebas existentes continúan aprobando y que no existen errores de formato antes de realizar el Pull Request.