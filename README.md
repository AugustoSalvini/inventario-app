# 📦 Sistema de Gestión de Inventario para Comercios Locales

Este proyecto corresponde al Trabajo Final Integrador de las materias Programación 4 y Desarrollo de Software. Consiste en una aplicación web completa, con autenticación de usuarios, gestión de productos y manejo de presupuestos, destinada a pequeños y medianos comercios que desean administrar su inventario de forma sencilla, rápida y segura.

---


### 1. Desarrollo de una Aplicación Funcional

- ✔️ Aplicación web con arquitectura cliente-servidor (Frontend / Backend)
- ✔️ Validación completa para inicio de sesión y registro de usuarios
- ✔️ Gestión de productos: crear, listar, actualizar y eliminar
- ✔️ Gestión de presupuestos según rol del usuario
- ✔️ Generación de tokens para autenticación (Laravel Sanctum)
- ✔️ Uso de Eloquent ORM
- ✔️ Implementación de API REST propia, sin APIs externas
- ✔️ Base de datos PostgreSQL, correctamente normalizada
- ✔️ Manejo de roles y permisos en todas las vistas

---

## 🧪 Información sobre el Sistema

- 🏗️ Arquitectura separada en Frontend (Angular) y Backend (Laravel)
- 🔒 Seguridad: encriptación de contraseñas con bcrypt y rutas protegidas con middlewares
- 🧱 Relaciones claras entre usuarios, productos, clientes y presupuestos
- 🧬 Uso del ORM Eloquent para todas las consultas y relaciones
- 📂 Control de versiones utilizando correctamente Git y GitHub
- 📡 Comunicación entre Angular y Laravel mediante servicios HTTP y tokens

---

## 👥 Roles de Usuario

- `admin`: puede crear, ver, editar y eliminar productos, gestionar stock, usuarios y presupuestos

- `empleado`: puede ver productos, actualizar el stock y crear presupuestos

- `usuario`: solo puede ver productos disponibles

## 🖥️ Tecnologías Utilizadas
- **Frontend**: Angular, TypeScript, Bootstrap, CSS

- **Backend**: PHP 8+, Laravel 10/11, Laravel Sanctum, Eloquent ORM

- **Base de Datos**: PostgreSQL, 

- **Autenticación**: Tokens con Laravel Sanctum, Middleware de roles, Hash de contraseñas con `bcrypt`

- **Herramientas**: Git, GitHub, Composer, Visual Studio Code

---

## 🧭 Flujo de Usuario

1. El usuario accede al sistema e inicia sesión o se registra.

2. Según su rol (`admin`, `empleado`, `usuario`) accede a distintas pantallas y permisos.

3. Los administradores pueden realizar el `CRUD completo` y gestionar presupuestos.

4. Los empleados pueden `actualizar stock y generar presupuestos`.

5. Los usuarios solo pueden `visualizar productos`.

6. Angular consume la API del backend, enviando tokens en cada solicitud.

---

## 🧠 Proceso de Desarrollo

- 🛠️ Planificación inicial de la base de datos y diseño del sistema
- 🧱 Implementación de Laravel + Eloquent, migraciones, seeders y middlewares
- 🔄 Creación de rutas, controladores, validaciones y API REST
- 🎨 Desarrollo del frontend con Angular, componentes, servicios y rutas protegidas
- ⚙️ Diseño de pantallas responsivas, formularios y manejo de estados
- 🚧 Retos principales: integración Angular–Laravel, autenticación y CORS
- ✅ Solución: configuración de Laravel Sanctum, políticas de CORS y servicios HTTP

---

## 💻 Instalación y Ejecución

### Backend

```bash
cd backend
composer install
cp .env.example .env   # Configurar conexión a PostgreSQL
php artisan key:generate
php artisan migrate --seed
php artisan serve
```


### Configurar en .env:

```bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=inventario
DB_USERNAME=postgres
DB_PASSWORD=tuclave
```

### Frontend

```bash
cd frontend
npm install
ng serve -o
```

### 📂 Estructura del Proyecto

```bash
inventario-app/
├── backend/                     # Laravel (API REST)
│   ├── app/Http/Controllers
│   ├── app/Models
│   ├── routes/api.php
│   ├── database/migrations
│   └── .env
│
├── frontend/                    # Angular (Interfaz)
│   ├── src/app
│   ├── src/assets
│   └── angular.json
│
├── composer.json
├── package.json
├── README.md
```
