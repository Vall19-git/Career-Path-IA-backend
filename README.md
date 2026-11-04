# CareerPath AI — Backend

CareerPath AI es una plataforma de orientación vocacional que busca ayudar a las personas a descubrir carreras universitarias relacionadas con sus intereses, habilidades y preferencias.

El proyecto está enfocado en la oferta académica de la Universidad Tecnológica Nacional, Facultad Regional Tucumán (UTN-FRT).

Este repositorio corresponde al backend de la aplicación, desarrollado con NestJS y TypeScript. Su objetivo es proporcionar una API REST para gestionar los usuarios, perfiles vocacionales, cuestionarios, carreras, recomendaciones y rutas de aprendizaje.

## 1. Tecnologías utilizadas

- Node.js

- NestJS 12

- TypeScript

- Express

- npm

- Git y GitHub

- Postman (para documentación y pruebas de la API)

- Supabase (PostgreSQL), para la base relacional

En Supabase se crearon y comprobaron ocho tablas del modelo relacional. La conexión desde los servicios NestJS sigue pendiente.

## 2. Estructura del proyecto

La aplicación utiliza una arquitectura modular de NestJS, que permite organizar las responsabilidades del sistema de manera independiente.

```text

career-path-ia-backend/

├── src/

│   ├── main.ts

│   └── modules/

│       ├── app/

│       │   ├── app.controller.ts

│       │   ├── app.controller.spec.ts

│       │   ├── app.module.ts

│       │   └── app.service.ts

│       ├── auth/

│       ├── users/

│       ├── profiles/

│       ├── careers/

│       ├── favorites/

│       ├── vocational-tests/

│       ├── recommendations/

│       └── learning-routes/

├── test/

├── sql/

├── postman/

├── docs/

├── .gitignore

├── package.json

├── package-lock.json

├── nest-cli.json

└── README.md

```

### Descripción de los módulos

| Módulo | Responsabilidad |

|--------|-----------------|

| app | Configuración principal e integración de módulos. |

| auth | Autenticación y control de acceso de los usuarios. |

| users | Administración de usuarios registrados. |

| profiles | Gestión de perfiles e intereses vocacionales. |

| careers | Información y características de las carreras universitarias. |

| favorites | Gestión de carreras guardadas por los usuarios. |

| vocational-tests | Administración de cuestionarios y respuestas vocacionales. |

| recommendations | Generación de recomendaciones según los resultados obtenidos. |

| learning-routes | Gestión de rutas de aprendizaje y seguimiento del progreso. |

Se generaron los recursos REST/CRUD iniciales de `auth`, `users`, `profiles`, `favorites`, `careers`, `recommendations`, `vocational-tests` y `learning-routes`. Los controladores y servicios existentes son estructuras provisionales, sin persistencia real.

## 3. Instalación del proyecto

### Requisitos previos

Para trabajar con el backend es necesario contar con:

- Node.js y npm instalados.

- Git.

- Visual Studio Code u otro editor compatible.

- Acceso al repositorio de GitHub.

### Clonar el repositorio

```bash

git clone https://github.com/Vall19-git/Career-Path-IA-backend.git

```

### Ingresar a la carpeta

```bash

cd Career-Path-IA-backend

```

### Instalar las dependencias

```bash

npm install

```

Este comando instala las dependencias definidas en `package.json`.

No es necesario volver a crear el proyecto utilizando `nest new`, porque la estructura inicial ya se encuentra en el repositorio.

## 4. Configuración de variables de entorno

El backend utiliza `@nestjs/config` para cargar las variables de entorno.

Cada integrante deberá crear un archivo `.env` local en la raíz del proyecto, al mismo nivel que `package.json`.

Las variables previstas son:

| Variable | Descripción |

|----------|-------------|

| PORT | Puerto donde se ejecuta NestJS. |

| DATABASE_URL | Cadena de conexión con la base de datos relacional. |

| API_BASE_URL | URL base prevista para la API. |

Para las pruebas locales verificadas se utiliza el puerto `3000`.

La variable `PORT` es leída por el servidor al iniciar la aplicación. La conexión con la base de datos y el uso definitivo de `API_BASE_URL` quedan pendientes de implementación.

### Seguridad

Los archivos `.env` contienen configuraciones locales que pueden incluir información sensible.

Por indicación del equipo, los archivos `.env` y `.env.example` permanecen excluidos del repositorio. Cada integrante configura sus variables localmente sin publicar credenciales.

Cada integrante debe configurar sus propias variables sin publicar contraseñas ni credenciales.

## 5. Ejecución del servidor

### Modo desarrollo

```bash

npm run start:dev

```

Este comando inicia NestJS en modo desarrollo y permite detectar cambios en los archivos.

Con `PORT=3000` configurado correctamente, la aplicación estará disponible en:

http://localhost:3000

La ruta principal devuelve actualmente:

```text

Hello World!

```

Esta respuesta permite comprobar que el servidor está funcionando.

### Compilar el proyecto

```bash

npm run build

```

### Ejecutar las pruebas

```bash

npm run test

```

### Revisar el código

```bash

npm run lint

```

## 6. Recursos REST y operaciones CRUD

Los recursos del backend se generan mediante Nest CLI utilizando el comando:

```bash

npx nest g resource modules/nombre-modulo

```

Durante la generación se seleccionan las siguientes opciones:

- Transporte: REST API.

- Generación de operaciones CRUD: Yes.

NestJS genera automáticamente los controladores, servicios, módulos, DTO, entidades iniciales y archivos de prueba.

### Recursos creados

Actualmente se generaron y registraron:

- `auth`

- `users`

- `profiles`

- `favorites`

- `careers`

- `recommendations`

- `vocational-tests`

- `learning-routes`

Cada uno cuenta con las cinco rutas REST/CRUD iniciales de Nest CLI, que todavía devuelven respuestas provisionales.

### Endpoints iniciales de users

| Método | Endpoint | Operación prevista |

|--------|----------|--------------------|

| GET | /users | Consultar usuarios |

| GET | /users/:id | Consultar un usuario específico |

| POST | /users | Crear un usuario |

| PATCH | /users/:id | Actualizar un usuario |

| DELETE | /users/:id | Eliminar un usuario |

El recurso `auth` también cuenta inicialmente con rutas CRUD generadas por Nest CLI.

Estas rutas forman parte de la estructura inicial y todavía no representan funcionalidades completas conectadas a una base de datos.

La lógica de autenticación, validaciones y persistencia se implementará posteriormente.

## 7. Integración de módulos

El archivo principal de la aplicación se encuentra en:

```text

src/modules/app/app.module.ts

```

Este archivo organiza los módulos que utiliza NestJS mediante la propiedad `imports`.

Actualmente se registraron:

- `ConfigModule`

- `AuthModule`

- `UsersModule`

- `ProfilesModule`

- `FavoritesModule`

- `CareersModule`

- `RecommendationsModule`

- `VocationalTestsModule`

- `LearningRoutesModule`

El archivo `main.ts` permanece directamente dentro de `src`, ya que es el punto de entrada de la aplicación.

## 8. Diseño de la base de datos

CareerPath AI utiliza Supabase PostgreSQL para el modelo relacional de esta etapa.

El diseño deberá contemplar las entidades necesarias para usuarios, perfiles, carreras, cuestionarios, respuestas, recomendaciones, favoritos y rutas de aprendizaje.

Las actividades correspondientes incluyen:

1. Crear y configurar la base de datos.

2. Definir las tablas y sus respectivas columnas.

3. Establecer tipos de datos adecuados.

4. Identificar las claves primarias.

5. Definir claves foráneas y relaciones.

6. Incorporar las restricciones necesarias.

7. Cargar un mínimo de cinco registros por tabla.

8. Verificar la integridad y coherencia de los datos.

En Supabase se comprobaron ocho tablas (`users`, `profiles`, `favorites`, `careers`, `recommendations`, `test_questions`, `test_answers` y `learning_routes`), cinco registros en cada una y nueve relaciones mediante claves foráneas. La tabla `users` contiene datos ficticios y es un esquema inicial sujeto a revisión por Valentina. La persistencia real desde NestJS y las políticas RLS para operaciones de usuarios siguen pendientes. Ver `docs/modelo-relacional-tp9.md`.

## 9. Documentación y pruebas con Postman

Se utilizará Postman para organizar, documentar y verificar los endpoints del backend.

Las pruebas contemplarán:

- Solicitudes GET, POST, PATCH y DELETE.

- Verificación de respuestas HTTP.

- Validación de los datos enviados y recibidos.

- Comprobación del comportamiento de los recursos.

- Registro de los resultados obtenidos.

La colección de Postman se organiza directamente por recurso en `postman/`. Contiene plantillas de cinco solicitudes HTTP por recurso para los ocho módulos registrados (40 solicitudes en total). Su existencia no prueba persistencia real. Ver `docs/evidencias-tp9.md`.

## 10. Organización del trabajo con Git y GitHub

El proyecto se desarrolla de manera colaborativa mediante ramas individuales, commits descriptivos y Pull Requests.

### Estrategia de ramas

| Rama | Función |

|------|---------|

| main | Rama estable del proyecto. |

| dev | Rama de integración del desarrollo. |

| feature/ | Desarrollo de nuevas funcionalidades. |

| fix/ | Corrección de errores. |

| refactor/ | Reorganización o mejora del código. |

| docs/ | Modificaciones de documentación. |

### Procedimiento de trabajo

1. Actualizar la rama `dev` desde GitHub.

2. Crear una rama específica para la tarea asignada.

3. Realizar los cambios correspondientes.

4. Verificar que el proyecto compile correctamente.

5. Crear un commit con título y descripción detallada.

6. Publicar la rama en GitHub.

7. Abrir un Pull Request dirigido a `dev`.

8. Revisar y aprobar los cambios antes de integrarlos.

No se desarrollan funcionalidades directamente sobre `main`.

Cada integrante debe trabajar en los archivos correspondientes a su tarea para evitar conflictos con los cambios de sus compañeros.

## 11. Equipo de desarrollo

CareerPath AI Backend es desarrollado por un equipo de cuatro integrantes:

- **Valentina Pérez del Rien** — Propietaria y responsable del repositorio.

- **Leandro Nuñez** — Integrante del equipo.

- **Tatiana Herrera** — Integrante del equipo.

- **Morena Marina** — Integrante del equipo.

La responsable del repositorio coordina la estructura inicial y la integración de los cambios, mientras que las tareas de desarrollo se distribuyen entre los integrantes del equipo.

Todos los cambios deben realizarse mediante las ramas correspondientes y documentarse en GitHub.

### Repositorio del backend

https://github.com/Vall19-git/Career-Path-IA-backend

## 12. Estado actual del proyecto

### Completado y verificado

- Backend NestJS 12 con ocho recursos REST/CRUD generados y registrados: auth, users, profiles, favorites, careers, recommendations, vocational-tests y learning-routes.

- Servidor local en http://localhost:3000; respuestas GET de profiles, favorites, careers, recommendations, vocational-tests y learning-routes observadas con estado HTTP 200.

- Base Supabase PostgreSQL con ocho tablas, 40 registros ficticios y nueve claves foráneas comprobadas.

- SQL separado en scripts reproducibles (con tabla de usuarios de demostración identificada).

- Colección Postman organizada por recurso: 40 solicitudes preparadas.

- `npm run build` correcto; `npm test` con 17/17 pruebas aprobadas; `npm run test:e2e` con 1/1 prueba aprobada; `npm run lint` sin errores y con 8 advertencias.

- Diagramas y evidencias parciales en `docs/`.

### Pendiente / fuera de alcance de esta etapa

- Conectar los servicios de NestJS a Supabase para persistencia real.

- Autenticación real, validaciones, permisos y políticas RLS según el diseño definitivo.

- Revisar y aprobar la estructura de `users` con Valentina, antes de tratarla como definitiva.

- Probar todas las solicitudes de Postman de forma manual.

## 13. Alcance del repositorio

Este repositorio centraliza el backend de CareerPath AI, incluyendo la API REST desarrollada con NestJS, la estructura modular del sistema, los scripts SQL del modelo relacional, las pruebas automatizadas, la colección de Postman y la documentación técnica asociada.

El proyecto mantiene una organización orientada al desarrollo colaborativo mediante ramas de trabajo, commits descriptivos y Pull Requests hacia la rama dev, preservando main como rama estable.

El backend continúa en desarrollo, con la integración de persistencia real en Supabase y funcionalidades de autenticación como próximos pasos técnicos.