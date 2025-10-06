# 📦 Sistema de Gestión de Inventario para Comercios Locales

Este proyecto corresponde al **Trabajo Final Integrador** de las materias **Programación 4 y Desarrollo de Software**.
Consiste en una aplicación web completa, con autenticación de usuarios y gestión de productos, destinada a pequeños y medianos comercios que desean administrar su inventario de forma sencilla y segura.

---


### 1. Desarrollo de una Aplicación Funcional

✔️ Aplicación web con arquitectura cliente-servidor (Frontend/Backend)  
✔️ Validación para inicio de sesión y registro de usuarios  
✔️ Gestión de datos: crear, listar, actualizar y eliminar productos  
✔️ Generación de tokens para autenticación (Laravel Sanctum)  
✔️ Uso de Eloquent como ORM  
✔️ Implementación de API REST propia  
✔️ Base de datos relacional (PostgreSQL) correctamente normalizada  

---

## 🧪 Información sobre el Sistema

- 🏗️ Arquitectura bien definida entre **Frontend (Angular)** y **Backend (Laravel)**  
- 🔒 Seguridad: encriptación de contraseñas con `bcrypt`, rutas protegidas con middlewares  
- 🧱 Relaciones claras entre usuarios, productos, clientes y presupuestos  
- 🧬 ORM con Eloquent  
- 📂 Uso correcto de Git y GitHub para control de versiones  

---

## 👥 Roles de usuario

- `admin`: puede crear, ver, editar y eliminar productos, gestionar stock, usuarios y presupuestos  
- `empleado`: puede ver productos, actualizar el stock y crear presupuestos  
- `usuario`: solo puede ver productos disponibles  

---

## 🖥️ Tecnologías utilizadas

- **Frontend**: Angular, TypeScript, Bootstrap, CSS  
- **Backend**: PHP 8+, Laravel 11  
- **Base de Datos**: PostgreSQL  
- **Autenticación**: Laravel Sanctum (tokens)  
- **Seguridad**: Hash de contraseñas con `bcrypt`, middleware de roles  
- **ORM**: Eloquent  
- **Herramientas**: Git, GitHub, Composer, Postman, Visual Studio Code  

---

## 🧭 Flujo de Usuario

1. El usuario accede al sistema y se registra o inicia sesión  
2. Según su rol (`admin`, `empleado`, `usuario`) accede a distintas funcionalidades  
3. Los administradores pueden realizar el CRUD completo y gestionar presupuestos  
4. Los empleados actualizan únicamente el stock y también generan presupuestos  
5. Los usuarios sólo visualizan los productos  

---

## 🧠 Proceso de Desarrollo

- 🛠️ Inicio con la planificación de la base de datos y definición de roles  
- 🧱 Estructura con Laravel + Eloquent y configuración de middlewares de autenticación  
- 🔄 Implementación progresiva de rutas, controladores y modelos  
- 🎨 Desarrollo del frontend con Angular y Bootstrap, aplicando componentes reutilizables  
- 🚧 Retos: integración de frontend con backend y manejo de CORS  
- ✅ Solución: configuración de Laravel Sanctum y políticas de CORS  

---

## 💻 Instalación y ejecución

### Backend

```bash
cd backend
composer install
copy .env.example .env   # configurar conexión a PostgreSQL
php artisan key:generate
php artisan migrate
php artisan serve
```


### Frontend

```bash
cd frontend/inventario-frontend
npm install
npm start   # o: ng serve --open
```

### Estructura del Proyecto

```bash
final-inventario-app/
├── backend/                # Laravel (API REST)
│   ├── app/Http/Controllers
│   ├── app/Models
│   ├── database/migrations
│   ├── routes/api.php
│   └── .env
├── frontend/               # Angular (interfaz)
│   ├── inventario-frontend/
│   │   ├── src/app
│   │   ├── src/assets
│   │   └── angular.json
├── README.md
```

📌 Repositorio y Anteproyecto

El proyecto está versionado con Git y publicado en GitHub

Cada integrante figura con su nombre o usuario reconocible en los commits

El repositorio es compartido con el docente para revisión
