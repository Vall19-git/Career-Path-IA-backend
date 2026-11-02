
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

La base de datos relacional se definirá y configurará durante el desarrollo del proyecto.

## 2. Estructura del proyecto

La aplicación utiliza una arquitectura modular de NestJS, que permite organizar las responsabilidades del sistema de manera independiente.

```text
career-path-ia-backend/
├── src/
│   ├── main.ts
│   └── modules/
│       ├── app/
│       │   ├── app.controller.ts
│       │   ├── app.controller.spec.ts
│       │   ├── app.module.ts
│       │   └── app.service.ts
│       ├── auth/
│       ├── users/
│       ├── profiles/
│       ├── careers/
│       ├── favorites/
│       ├── vocational-tests/
│       ├── recommendations/
│       └── learning-routes/
├── test/
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

Los recursos `auth` y `users` ya fueron generados mediante Nest CLI con estructura REST y operaciones CRUD.

Los demás módulos están definidos como carpetas iniciales y serán desarrollados por los integrantes del equipo.

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

Para las pruebas locales actuales se utiliza el puerto `4000`.

La variable `PORT` es leída por el servidor al iniciar la aplicación. La conexión con la base de datos y el uso definitivo de `API_BASE_URL` quedan pendientes de implementación.

### Seguridad

Los archivos `.env` contienen configuraciones locales que pueden incluir información sensible.

Por indicación de la profesora, los archivos `.env` y `.env.example` están excluidos del repositorio mediante `.gitignore`.

Cada integrante debe configurar sus propias variables sin publicar contraseñas ni credenciales.

## 5. Ejecución del servidor

### Modo desarrollo

```bash
npm run start:dev
```

Este comando inicia NestJS en modo desarrollo y permite detectar cambios en los archivos.

Con `PORT=4000` configurado correctamente, la aplicación estará disponible en:

http://localhost:4000

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

Actualmente se generaron:

- `auth`
- `users`

Ambos recursos se encuentran registrados en el arreglo `imports` de `AppModule`.

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

A medida que los integrantes generen los demás recursos, sus módulos deberán incorporarse a `AppModule`.

El archivo `main.ts` permanece directamente dentro de `src`, ya que es el punto de entrada de la aplicación.

## 8. Diseño de la base de datos

CareerPath AI utilizará una base de datos relacional para organizar la información del sistema.

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

La implementación de la base de datos y su conexión definitiva con NestJS se encuentran pendientes.

## 9. Documentación y pruebas con Postman

Se utilizará Postman para organizar, documentar y verificar los endpoints del backend.

Las pruebas contemplarán:

- Solicitudes GET, POST, PATCH y DELETE.
- Verificación de respuestas HTTP.
- Validación de los datos enviados y recibidos.
- Comprobación del comportamiento de los recursos.
- Registro de los resultados obtenidos.

La colección de Postman se desarrollará a medida que se implementen los recursos y sus funcionalidades.

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

### Completado

- Creación del proyecto con NestJS 12.
- Configuración inicial de TypeScript y npm.
- Organización de la carpeta `src/modules/app`.
- Definición de ocho recursos del sistema.
- Generación de los recursos `auth` y `users`.
- Registro de ambos recursos en `AppModule`.
- Instalación y configuración inicial de `@nestjs/config`.
- Preparación de las variables de entorno locales.
- Verificación de compilación mediante `npm run build`.
- Ejecución correcta del servidor mediante `npm run start:dev`.
- Verificación de la respuesta del backend en `localhost:4000`.
- Organización inicial de las ramas del repositorio.

### Pendiente

- Generación de los seis recursos restantes.
- Registro de los demás módulos en `AppModule`.
- Diseño e implementación de la base de datos relacional.
- Carga y verificación de registros de prueba.
- Conexión del backend con la base de datos.
- Implementación de la lógica de negocio.
- Validaciones y tratamiento de errores.
- Organización de la colección de Postman.
- Documentación y ejecución de las pruebas de los endpoints.

## 13. Trabajo Práctico N.º 9

Este repositorio forma parte del desarrollo de CareerPath AI para la asignatura Programación.

La entrega contempla la creación y organización del backend con NestJS, generación de recursos REST, diseño de una base de datos relacional, gestión de variables de entorno, documentación técnica y organización colaborativa mediante Git y GitHub.

**Fecha de presentación:** miércoles 4 de noviembre de 2026.

**Estado:** En desarrollo.
