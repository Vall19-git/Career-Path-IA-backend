# CareerPath AI — Evidencias y alcance TP9

## Resultados ya comprobados (04/11/2026, pruebas realizadas en la computadora del equipo)

| Comprobación | Resultado observado |
|---|---|
| `npm run build` | Compiló sin errores |
| `npm test` | 13 archivos / 13 pruebas aprobadas |
| `npm run lint` | 0 errores, 8 advertencias de parámetros no utilizados en servicios provisionales |
| `GET /careers` | 200 OK; texto de ejemplo de NestJS |
| `GET /recommendations` | 200 OK; texto de ejemplo de NestJS |
| `GET /profiles` | 200 OK; texto de ejemplo de NestJS |
| `GET /favorites` | 200 OK; texto de ejemplo de NestJS |
| Supabase `users` | 5 registros |
| Supabase `profiles` | 5 registros |
| Supabase `favorites` | 5 registros |
| Supabase `careers` | 5 registros |
| Supabase `recommendations` | 5 registros |
| Claves foráneas | 5 vínculos comprobados mediante `information_schema` |

## Postman

Las carpetas `Auth`, `Users`, `Profiles`, `Favorites`, `Careers` y `Recommendations` documentan las rutas REST generadas: GET (lista/detalle), POST, PATCH y DELETE. Las solicitudes nuevas son **plantillas**; sus 30 ejecuciones en Postman no se han confirmado aún.

La variable de la colección `baseUrl` corresponde a `http://localhost:3000` en las pruebas realizadas. La implementación real de persistencia y autenticación está pendiente; el resultado 200 en los endpoints de ejemplo **no** equivale a haber guardado o eliminado registros.

## Alcance

Este trabajo abarca solo Valentina (auth/users), integrante 2 (profiles/favorites) e integrante 3 (careers/recommendations). No se realizaron modificaciones sobre el integrante 4.

## Verificación final antes de la entrega

```bash
npm run build
npm test
npm run lint
git diff --check
git status --short
find postman -name '*.request.yaml' | wc -l
```

Revisar las advertencias del lint como trabajo futuro, sin afirmar que haya conexión real a Supabase desde los servicios de NestJS.
