
# CareerPath AI — Backend

CareerPath AI es una plataforma de orientación vocacional que busca ayudar a las personas a identificar carreras universitarias relacionadas con sus intereses, habilidades y preferencias.

El proyecto está enfocado en la oferta académica de la Universidad Tecnológica Nacional, Facultad Regional Tucumán (UTN-FRT).

Este repositorio contiene el backend de la aplicación, desarrollado con NestJS y TypeScript. Su objetivo es proporcionar una API REST para administrar usuarios, perfiles vocacionales, cuestionarios, carreras, recomendaciones, favoritos y rutas de aprendizaje.

La aplicación utiliza Prisma ORM para comunicarse con una base de datos PostgreSQL alojada en Supabase.

Actualmente se encuentran implementadas las operaciones principales de los módulos del sistema, incluyendo el registro de usuarios, el inicio de sesión mediante JWT y la persistencia de datos.

La incorporación de inteligencia artificial para generar recomendaciones personalizadas forma parte de una etapa futura del proyecto.

---

## 1. Tecnologías utilizadas

Las principales tecnologías y herramientas utilizadas son:

- **Node.js:** entorno de ejecución de JavaScript.
- **NestJS 12:** framework utilizado para desarrollar el backend.
- **TypeScript:** lenguaje de programación principal.
- **Express:** plataforma HTTP utilizada por NestJS.
- **Prisma ORM 7:** herramienta para consultar y modificar la base de datos.
- **PostgreSQL:** sistema de gestión de base de datos relacional.
- **Supabase:** plataforma donde se encuentra alojada la base de datos.
- **bcrypt:** cifrado unidireccional de contraseñas mediante hashes.
- **JWT:** generación de tokens para la autenticación de usuarios.
- **class-validator:** validación de los datos recibidos en los DTO.
- **class-transformer:** transformación de los datos de entrada.
- **Vitest:** ejecución de pruebas automatizadas.
- **Postman:** documentación y pruebas de endpoints HTTP.
- **Git y GitHub:** control de versiones y trabajo colaborativo.
- **npm:** administración de dependencias y scripts.

### Conexión con la base de datos

El backend se conecta a PostgreSQL mediante Prisma ORM.

Los servicios utilizan Prisma para realizar operaciones reales sobre las tablas, incluyendo:

- Creación de registros.
- Consulta de registros.
- Actualización de información.
- Eliminación de registros en los recursos que lo permiten.
- Verificación de relaciones entre entidades.
- Manejo de errores y restricciones de la base de datos.

---

## 2. Estructura del proyecto

La aplicación utiliza una arquitectura modular de NestJS, que permite separar responsabilidades y mantener el código organizado.

```text
career-path-ia-backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── main.ts
│   ├── generated/
│   │   └── prisma/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── modules/
│       ├── app/
│       ├── auth/
│       ├── users/
│       ├── profiles/
│       ├── careers/
│       ├── favorites/
│       ├── vocational-tests/
│       ├── recommendations/
│       └── learning-routes/
├── test/
├── sql/
├── postman/
├── docs/
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
├── nest-cli.json
└── README.md
```

### Descripción de los módulos

| Módulo | Responsabilidad |
|---|---|
| app | Configuración principal e integración de los módulos. |
| auth | Registro de usuarios e inicio de sesión mediante JWT. |
| users | Consulta y actualización de usuarios registrados. |
| profiles | Administración de perfiles e intereses vocacionales. |
| careers | Gestión de información sobre carreras universitarias. |
| favorites | Administración de carreras favoritas de los usuarios. |
| vocational-tests | Gestión de preguntas del test vocacional. |
| recommendations | Almacenamiento y administración de recomendaciones. |
| learning-routes | Gestión de rutas de aprendizaje y seguimiento del progreso. |
| prisma | Configuración y conexión con PostgreSQL mediante Prisma ORM. |

### Organización interna de los módulos

Los módulos principales utilizan la siguiente estructura:

- **Controller:** recibe las solicitudes HTTP y llama al servicio correspondiente.
- **Service:** contiene la lógica de negocio y realiza operaciones mediante Prisma.
- **Module:** registra los controladores, servicios y dependencias.
- **DTO:** define y valida los datos enviados por el cliente.
- **Tests:** comprueban el comportamiento de los componentes.

Esta organización permite mantener separadas las responsabilidades y facilita las pruebas y el mantenimiento.

---

## 3. Instalación del proyecto

### Requisitos previos

Para ejecutar el backend se necesita:

- Node.js instalado.
- npm.
- Git.
- Visual Studio Code u otro editor compatible.
- Acceso al repositorio.
- Configuración local de las variables de entorno.

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
npm ci
```

Este comando instala las dependencias utilizando las versiones registradas en `package-lock.json`.

### Generar Prisma Client

Después de instalar las dependencias, ejecutar:

```bash
npx prisma generate --config ./prisma7.config.ts
```

Este comando genera el cliente de Prisma de acuerdo con los modelos definidos en `prisma/schema.prisma`.

Es necesario para que los servicios puedan realizar consultas mediante Prisma.

No es necesario volver a crear el proyecto con `nest new`, porque la estructura ya se encuentra desarrollada.

---

## 4. Configuración de variables de entorno

El backend utiliza `@nestjs/config` para cargar las variables de entorno.

Cada integrante debe crear un archivo `.env` local en la raíz del proyecto, al mismo nivel que `package.json`.

### Variables utilizadas

| Variable | Descripción |
|---|---|
| PORT | Puerto en el que se ejecuta NestJS. |
| DATABASE_URL | Cadena de conexión con PostgreSQL en Supabase. |
| JWT_SECRET | Clave privada utilizada para firmar y verificar tokens JWT. |

Ejemplo de estructura:

```env
PORT=4000
DATABASE_URL=CONFIGURAR_CONEXION_PRIVADA
JWT_SECRET=CONFIGURAR_CLAVE_PRIVADA_SEGURA
```

Los valores anteriores son marcadores de ejemplo y deben reemplazarse por las credenciales correspondientes.

### Seguridad

Los archivos `.env` contienen información privada que no debe publicarse.

Por indicación del equipo, `.env` y `.env.example` permanecen excluidos del repositorio mediante `.gitignore`.

Cada integrante debe configurar sus variables localmente y evitar publicar:

- Contraseñas.
- Cadenas privadas de conexión.
- Claves JWT.
- Tokens de autenticación.

La variable `JWT_SECRET` es necesaria para que el módulo de autenticación pueda generar y verificar tokens firmados. Debe configurarse antes de iniciar el servidor y de ejecutar las pruebas E2E.

---

## 5. Ejecución del servidor

### Modo desarrollo

```bash
npm run start:dev
```

Este comando inicia NestJS en modo desarrollo y permite detectar cambios durante la programación.

Con `PORT=4000`, la aplicación estará disponible en:

```text
http://localhost:4000
```

Si no se configura `PORT`, el código utiliza el puerto `3000` de forma predeterminada.

### Ruta principal

```http
GET /
```

Respuesta:

```text
Hello World!
```

Esta respuesta permite comprobar que el servidor se encuentra funcionando.

### Compilar el proyecto

```bash
npm run build
```

### Ejecutar las pruebas unitarias

```bash
npm run test
```

### Ejecutar las pruebas E2E

```bash
npm run test:e2e
```

### Analizar la calidad del código

```bash
npm run lint
```

---

## 6. Recursos REST y operaciones disponibles

Los recursos iniciales se generaron utilizando Nest CLI y posteriormente se implementó la lógica necesaria para su funcionamiento real.

La API utiliza los métodos HTTP correspondientes a cada operación:

- **GET:** consultar información.
- **POST:** crear registros.
- **PATCH:** actualizar registros.
- **DELETE:** eliminar registros.

No todos los módulos necesitan exponer los cinco endpoints CRUD.

### 6.1. Módulo Auth

El módulo `auth` permite registrar usuarios e iniciar sesión.

| Método | Endpoint | Función |
|---|---|---|
| POST | /auth/register | Registrar un nuevo usuario. |
| POST | /auth/login | Iniciar sesión y obtener un JWT (`200 OK`). |

#### Registro de usuarios

El endpoint `POST /auth/register` recibe:

```json
{
  "nombre": "Usuario Prueba",
  "email": "usuario@example.com",
  "password": "ClaveDeEjemplo123!"
}
```

Funcionamiento:

1. Recibe los datos mediante `RegisterAuthDto`.
2. Valida el nombre, correo electrónico y contraseña.
3. Normaliza el correo electrónico.
4. Comprueba que el correo no esté registrado.
5. Genera un hash de la contraseña utilizando bcrypt.
6. Guarda el usuario en PostgreSQL mediante Prisma.
7. Devuelve un mensaje de confirmación y los datos públicos del usuario.

La contraseña original y su hash no se incluyen en la respuesta HTTP.

#### Inicio de sesión

El endpoint `POST /auth/login` recibe:

```json
{
  "email": "usuario@example.com",
  "password": "ClaveDeEjemplo123!"
}
```

Funcionamiento:

1. Recibe las credenciales mediante `LoginAuthDto`.
2. Busca el usuario en la base de datos.
3. Obtiene el hash de contraseña almacenado.
4. Compara la contraseña ingresada utilizando bcrypt.
5. Rechaza las credenciales incorrectas.
6. Genera un JWT firmado cuando los datos son válidos.
7. Devuelve el token de acceso.

Ejemplo de estructura de respuesta:

```json
{
  "access_token": "TOKEN_JWT_GENERADO"
}
```

El token incluye información de identificación del usuario, como `sub` y `email`, y se configura con una duración de una hora.

El inicio de sesión devuelve `200 OK`; el registro exitoso devuelve `201 Created`. Los endpoints fuera de `/auth` y de la ruta principal `/` requieren `Authorization: Bearer <JWT>`. Las rutas `GET /users/:id` y `PATCH /users/:id` también comprueban que el `id` coincida con `sub` del JWT.

**Límite de seguridad conocido:** `GET /users` sigue listando datos públicos (`id`, `nombre`, `email`) para usuarios autenticados, y los demás módulos todavía no restringen todas las operaciones por propiedad de registro. Antes de publicar el sistema se debe definir autorización por usuario o rol y aplicarla a todas las entidades relacionadas. La conexión privilegiada de Prisma no debe considerarse protegida por el RLS de Supabase automáticamente.

### 6.2. Módulo Users

El módulo `users` permite administrar los datos públicos de las cuentas registradas.

| Método | Endpoint | Función |
|---|---|---|
| GET | /users | Listar usuarios. |
| GET | /users/:id | Consultar un usuario por ID. |
| PATCH | /users/:id | Actualizar nombre o correo electrónico. |

El controlador utiliza `UsersService`, que contiene las operaciones reales con Prisma.

Las consultas devuelven únicamente:

- `id`
- `nombre`
- `email`

No se devuelve `passwordHash`.

La creación de cuentas se realiza mediante `POST /auth/register`, evitando duplicar la lógica del registro.

Actualmente no se expone `DELETE /users/:id`. La eliminación de usuarios requiere considerar sus relaciones con perfiles, favoritos, recomendaciones y rutas.

### 6.3. Módulos de datos

Los siguientes recursos cuentan con endpoints REST conectados a Prisma:

| Recurso | Ruta base |
|---|---|
| Profiles | /profiles |
| Careers | /careers |
| Favorites | /favorites |
| Recommendations | /recommendations |
| Vocational Tests | /vocational-tests |
| Learning Routes | /learning-routes |

Estos recursos utilizan operaciones GET, POST, PATCH y DELETE para administrar los registros correspondientes.

El módulo `vocational-tests` administra las preguntas almacenadas en `test_questions`. La tabla `test_answers` forma parte de la base de datos, pero no cuenta todavía con un recurso REST independiente.

El módulo `recommendations` permite almacenar y consultar recomendaciones. La generación automática mediante inteligencia artificial todavía no está incorporada.

### Validación de datos

Los DTO utilizan `class-validator` y `class-transformer`.

La aplicación configura globalmente `ValidationPipe` para:

- Validar los datos recibidos.
- Transformar los parámetros cuando corresponde.
- Rechazar propiedades no permitidas.
- Evitar que las solicitudes incluyan campos no definidos por los DTO.

Los servicios también validan reglas de negocio, como identificadores inexistentes, registros duplicados y relaciones inválidas.

---

## 7. Integración de módulos

El módulo principal de la aplicación se encuentra en:

```text
src/modules/app/app.module.ts
```

Este archivo registra las dependencias y los módulos de NestJS.

Actualmente incorpora:

- `ConfigModule`
- `PrismaModule`
- `AuthModule`
- `UsersModule`
- `ProfilesModule`
- `FavoritesModule`
- `CareersModule`
- `RecommendationsModule`
- `VocationalTestsModule`
- `LearningRoutesModule`

### PrismaModule

`PrismaModule` permite utilizar `PrismaService` desde los servicios del proyecto.

`PrismaService` establece la conexión con PostgreSQL utilizando la configuración de Prisma y el adaptador correspondiente.

### AuthModule

El módulo de autenticación incorpora:

- `AuthController`
- `RegistrationService`
- `LoginService`
- `JwtModule`

El registro y el login utilizan servicios separados para mantener las responsabilidades organizadas.

`JwtModule` obtiene la clave de firma desde `JWT_SECRET` y configura la duración de los tokens.

### Punto de entrada

El archivo `src/main.ts` inicia la aplicación NestJS, configura las validaciones globales y establece el puerto HTTP.

---

## 8. Diseño de la base de datos

CareerPath AI utiliza una base de datos PostgreSQL alojada en Supabase.

El esquema relacional se define en:

```text
prisma/schema.prisma
```

### Tablas del sistema

| Tabla | Función |
|---|---|
| users | Almacena usuarios y sus datos de autenticación. |
| profiles | Registra intereses y habilidades de los usuarios. |
| careers | Contiene información de carreras universitarias. |
| favorites | Relaciona usuarios con carreras favoritas. |
| recommendations | Almacena recomendaciones y sus puntajes. |
| test_questions | Contiene preguntas del test vocacional. |
| test_answers | Almacena respuestas de los usuarios. |
| learning_routes | Registra rutas de aprendizaje y su progreso. |

### Relaciones

La base de datos utiliza claves primarias y foráneas para relacionar las entidades.

Entre las relaciones principales se encuentran:

- Perfiles asociados a usuarios.
- Favoritos asociados a usuarios y carreras.
- Recomendaciones asociadas a usuarios y carreras.
- Respuestas relacionadas con usuarios y preguntas.
- Rutas de aprendizaje vinculadas con usuarios y carreras.

### Modelo Users

La tabla `users` contiene:

- `id`
- `nombre`
- `email`
- `password_hash`

El campo `password_hash` se utiliza para almacenar el hash generado con bcrypt.

En Prisma, este campo se representa mediante `passwordHash`.

### Identificadores BigInt

El esquema utiliza identificadores `BigInt` en PostgreSQL.

Cuando estos valores deben enviarse mediante JSON, los servicios los convierten a `string` para evitar problemas de serialización.

### Migraciones

Las migraciones se encuentran en:

```text
prisma/migrations/
```

El historial incluye:

- `0_init`: migración inicial del modelo relacional.
- `20261122_add_users_password_hash`: incorporación del campo de contraseña cifrada.
- `20261124010906_normalize_database_3fn`: eliminación de `learning_routes.estado` y `recommendations.resultado`.

**Advertencia:** esta última migración utiliza `DROP COLUMN`, por lo que elimina los valores previamente almacenados en esas columnas. Su recuperación requeriría un respaldo histórico. Eliminar columnas derivadas puede reducir redundancia, pero **no demuestra por sí solo que el esquema completo esté en tercera forma normal**; la justificación depende de las dependencias funcionales y las reglas de negocio.

La migración de `password_hash` ya fue aplicada correctamente en la base de datos compartida de Supabase.

Para verificar el estado de las migraciones:

```bash
npx prisma migrate status --config ./prisma7.config.ts
```

Las nuevas migraciones deben coordinarse entre los integrantes antes de aplicarlas en la base de datos compartida.

No deben utilizarse comandos de reinicio de base de datos sobre Supabase sin evaluar sus consecuencias.

### Seguridad de la base de datos

El modelo incluye restricciones de integridad y tablas con Row Level Security (RLS) habilitado.

Las políticas de autorización y protección definitiva de datos deben revisarse antes de utilizar el backend en un entorno público.

---

## 9. Documentación y pruebas con Postman

Postman se utiliza para ejecutar solicitudes HTTP y comprobar las respuestas de la API REST.

Las pruebas realizadas permiten verificar:

- Registro de usuarios.
- Inicio de sesión.
- Generación de tokens JWT.
- Validación de datos.
- Consulta de información.
- Actualización de registros.
- Detección de errores HTTP.
- Persistencia en PostgreSQL.

### Entorno local

Para las pruebas se utiliza un entorno llamado:

```text
CareerPath Local
```

Variables utilizadas:

| Variable | Función |
|---|---|
| baseUrl | URL local del backend. |
| testPassword | Contraseña ficticia utilizada para las pruebas. |

La configuración local utilizada es:

```text
baseUrl = http://localhost:4000
```

La contraseña de prueba debe mantenerse privada y no incorporarse directamente al repositorio.

### Peticiones del módulo Auth

Las solicitudes actualizadas son:

```text
POST {{baseUrl}}/auth/register
POST {{baseUrl}}/auth/login
```

Estas peticiones reemplazan las operaciones CRUD de ejemplo que se habían generado inicialmente.

### Resultados de las pruebas de autenticación

| Caso probado | Resultado |
|---|---|
| Registro correcto | 201 Created |
| Inicio de sesión correcto | 200 OK |
| Contraseña incorrecta | 401 Unauthorized |
| Correo electrónico duplicado | 409 Conflict |
| Correo electrónico inválido | 400 Bad Request |

Las pruebas confirmaron el funcionamiento real del registro y login utilizando Prisma, bcrypt, JWT y Supabase.

El login utiliza `@HttpCode(HttpStatus.OK)` para devolver `200 OK`, mientras que el registro conserva `201 Created`. La colección Postman valida cada caso por separado.

### Alcance de las pruebas

Las solicitudes manuales de Postman verifican el comportamiento HTTP de los endpoints ejecutados.

Se incorporó un guard JWT global. Las rutas `/` y `/auth/register` y `/auth/login` son públicas; los demás endpoints exigen un token válido. **Autenticación no equivale a autorización completa:** faltan controles de propiedad para algunos recursos y definir permisos para los listados.

---

## 10. Organización del trabajo con Git y GitHub

El proyecto se desarrolla de forma colaborativa utilizando Git y GitHub.

Cada integrante trabaja en una rama específica y propone sus cambios mediante un Pull Request.

### Estrategia de ramas

| Rama | Función |
|---|---|
| main | Rama estable del proyecto. |
| dev | Rama principal de integración del desarrollo. |
| feature/ | Desarrollo de funcionalidades. |
| fix/ | Corrección de errores. |
| refactor/ | Reorganización y mejora del código. |
| docs/ | Actualización de documentación. |

### Procedimiento de trabajo

1. Actualizar la rama `dev` desde GitHub.
2. Crear una rama nueva para la tarea.
3. Realizar las modificaciones correspondientes.
4. Verificar la compilación.
5. Ejecutar las pruebas.
6. Revisar la calidad del código.
7. Crear un commit con título y descripción detallada.
8. Subir la rama al repositorio remoto.
9. Crear un Pull Request dirigido a `dev`.
10. Revisar y fusionar los cambios aprobados.

### Comandos utilizados

```bash
git switch dev
git pull origin dev
git switch -c feature/nombre-tarea
git status
git add .
git commit
git push -u origin feature/nombre-tarea
```

Cada integrante debe respetar los archivos y responsabilidades asignados para evitar conflictos.

No se desarrollan funcionalidades directamente sobre `main`.

---

## 11. Equipo de desarrollo

CareerPath AI Backend es desarrollado por:

- **Valentina Pérez del Rien:** responsable del repositorio, coordinación e integración del backend.
- **Leandro Nuñez:** desarrollo e integración del módulo de usuarios.
- **Tatiana Herrera:** desarrollo del registro de usuarios y validaciones de autenticación.
- **Morena Marina Noguera:** desarrollo del inicio de sesión y generación de JWT.

El equipo utiliza GitHub para organizar el trabajo, documentar los cambios y mantener un historial de implementación mediante ramas, commits y Pull Requests.

### Repositorio

https://github.com/Vall19-git/Career-Path-IA-backend

---

## 12. Estado actual del proyecto

### Funcionalidades implementadas

- Backend desarrollado con NestJS 12 y TypeScript.
- Arquitectura modular organizada por recursos.
- Ocho módulos funcionales principales.
- Integración con Prisma ORM 7.
- Conexión real con PostgreSQL alojado en Supabase.
- Modelo relacional de ocho tablas.
- Validaciones mediante DTO y ValidationPipe global.
- Registro de usuarios con bcrypt.
- Inicio de sesión mediante JWT.
- Configuración de tokens con duración de una hora.
- Validación de correos electrónicos duplicados.
- Manejo de credenciales incorrectas.
- Listado, consulta y actualización de usuarios mediante Prisma.
- Operaciones REST sobre perfiles, carreras, favoritos, recomendaciones, preguntas vocacionales y rutas de aprendizaje.
- Manejo de errores HTTP y validaciones de negocio.
- Pruebas automatizadas con Vitest.
- Verificación de endpoints mediante Postman.
- Trabajo colaborativo mediante Pull Requests hacia `dev`.

### Resultados de las verificaciones locales

Durante la actualización del módulo `auth` se obtuvieron los siguientes resultados:

| Verificación | Resultado |
|---|---|
| npm run build | Compilación correcta |
| npm run test | 297 pruebas aprobadas |
| Archivos de pruebas unitarias | 31 aprobados |
| npm run lint | 0 errores y 0 advertencias |

La prueba E2E disponible para la ruta principal también se había ejecutado correctamente durante las verificaciones previas.

Estos resultados corresponden al estado local comprobado durante el desarrollo. Deben actualizarse cuando se incorporen nuevas modificaciones.

### Funcionalidades pendientes o mejoras futuras

- Ampliar la **autorización por propietario y roles** en todos los recursos: el guard JWT global autentica, pero todavía no limita todos los registros a su propietario.
- Definir permisos para consultar o modificar información de otros usuarios.
- Revisar las políticas de seguridad RLS y los permisos de acceso a datos.
- Completar la integración entre frontend y backend propio.
- Ampliar las pruebas E2E de los flujos de registro y login.
- Actualizar y verificar las solicitudes restantes de Postman.
- Incorporar nuevas funcionalidades y mejoras de mantenimiento.
- Evaluar la incorporación futura de inteligencia artificial para recomendaciones personalizadas.

### Aclaración sobre la autenticación

El registro y el login están implementados y fueron probados correctamente.

La generación de un JWT no implica que todos los endpoints estén protegidos. La autorización de rutas requiere implementar y configurar los mecanismos correspondientes.

---

## 13. Alcance del repositorio

Este repositorio centraliza el backend de CareerPath AI.

Incluye:

- La API REST desarrollada con NestJS.
- Los módulos de la aplicación.
- Los controladores y servicios.
- Los DTO y sus validaciones.
- La integración con Prisma ORM.
- El modelo relacional PostgreSQL.
- Las migraciones de la base de datos.
- Los servicios de registro y autenticación.
- Las pruebas unitarias y E2E.
- Las solicitudes de Postman.
- Los scripts SQL.
- La documentación técnica.

El proyecto mantiene una metodología de trabajo colaborativo mediante ramas individuales, commits descriptivos y Pull Requests dirigidos a `dev`.

La rama `main` se conserva como referencia estable.

CareerPath AI continúa en desarrollo, con una base funcional para la gestión de datos y autenticación de usuarios. Las siguientes etapas estarán orientadas a reforzar la seguridad, completar la integración con el frontend y mejorar las funcionalidades de la plataforma.
