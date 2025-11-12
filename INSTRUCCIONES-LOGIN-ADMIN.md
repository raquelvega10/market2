# 🔐 Sistema de Login Admin - Instrucciones

## ✅ Sistema Completamente Funcional

El sistema de autenticación para administradores está **100% implementado y funcional**.

---

## 👤 Usuario Admin Existente

Ya existe un usuario administrador en el sistema:

```
📧 Email:     daniel.gonzalez.esquerra@gmail.com
🔒 Password:  [Tu contraseña configurada en Supabase]
👤 Rol:       admin
🆔 Auth ID:   a10eb145-a623-4590-a479-2458b9db5045
```

---

## 🚀 Cómo Iniciar Sesión

### Paso 1: Acceder al Login

Ve a la ruta de administración:
```
http://localhost:5173/administracion
```
O en producción:
```
https://tu-dominio.com/administracion
```

### Paso 2: Ingresar Credenciales

1. Ingresa tu email: `daniel.gonzalez.esquerra@gmail.com`
2. Ingresa tu contraseña (la que configuraste en Supabase)
3. Haz clic en **"Iniciar Sesión"**

### Paso 3: Acceder al Dashboard

Si tus credenciales son correctas y tienes rol admin, serás **redirigido automáticamente** a:
```
/admin_dashboard
```

---

## 🛡️ Seguridad Implementada

El sistema verifica **3 cosas** en cada login:

### ✅ 1. Credenciales Correctas
- Verifica email y password en **Supabase Auth**
- La contraseña está hasheada con **bcrypt**
- Nunca se almacena en texto plano

### ✅ 2. Usuario Existe en BD
- Verifica que el usuario exista en la tabla `users`
- Usa el `auth_id` para vincular Auth con la tabla users

### ✅ 3. Rol de Administrador
- Verifica que `role = 'admin'` en la tabla users
- Si no es admin, **cierra la sesión automáticamente**
- Muestra error: "No tienes permisos de administrador"

---

## 🔄 Flujo de Autenticación

```
Usuario ingresa credenciales en /administracion
             ↓
Sistema verifica en Supabase Auth
             ↓
       ✅ ¿Email/Password correcto?
             ↓ SI
Sistema busca usuario en tabla users
             ↓
       ✅ ¿Usuario existe?
             ↓ SI
Sistema verifica role = 'admin'
             ↓
       ✅ ¿Es admin?
             ↓ SI
Crea sesión JWT y redirige a /admin_dashboard
             ↓
Dashboard verifica permisos en cada carga
```

---

## 🔒 Ruta Protegida: `/admin_dashboard`

El dashboard está protegido por `ProtectedRoute`:

### Verificaciones automáticas:
- ✅ Usuario autenticado (sesión JWT válida)
- ✅ Usuario tiene rol 'admin'
- ✅ Si falta alguna, redirige a `/administracion`

### Características:
- Muestra información del usuario (email, rol)
- Dashboard con métricas
- Botón para cerrar sesión
- Solo accesible para admins

---

## 🧪 Casos de Uso

### ✅ Caso 1: Login Exitoso (Admin)
```
Email: daniel.gonzalez.esquerra@gmail.com
Password: [tu password]
Role: admin
→ ✅ Redirige a /admin_dashboard
```

### ❌ Caso 2: Contraseña Incorrecta
```
Email: daniel.gonzalez.esquerra@gmail.com
Password: incorrecta
→ ❌ Error: "Invalid login credentials"
→ ❌ Permanece en /administracion
```

### ❌ Caso 3: Usuario No Admin
```
Email: usuario@normal.com
Password: correcta
Role: operador (no admin)
→ ❌ Error: "No tienes permisos de administrador"
→ ❌ Cierra sesión automáticamente
→ ❌ Permanece en /administracion
```

### ❌ Caso 4: Acceso Directo sin Login
```
URL: /admin_dashboard (sin estar logueado)
→ ❌ Redirige automáticamente a /administracion
```

---

## 🔧 Estructura de la Base de Datos

### Tabla: `users`
```sql
id              UUID
auth_id         UUID (vincula con auth.users)
email           TEXT
password_hash   TEXT (no usado, Auth lo maneja)
full_name       TEXT
role            TEXT ('admin', 'operador', 'consultor')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Verificar tu usuario:
```sql
SELECT
  u.email,
  u.full_name,
  u.role,
  u.auth_id,
  au.email_confirmed_at
FROM users u
JOIN auth.users au ON u.auth_id = au.id
WHERE u.email = 'daniel.gonzalez.esquerra@gmail.com';
```

---

## 🛠️ Troubleshooting

### ❌ Error: "Invalid login credentials"
**Causa**: Email o contraseña incorrecta
**Solución**: Verifica tus credenciales o restablece tu contraseña en Supabase Dashboard

### ❌ Error: "Usuario no encontrado en el sistema"
**Causa**: Usuario existe en auth.users pero no en tabla users
**Solución**: Ejecuta en SQL Editor:
```sql
INSERT INTO users (auth_id, email, password_hash, full_name, role)
VALUES (
  'a10eb145-a623-4590-a479-2458b9db5045',
  'daniel.gonzalez.esquerra@gmail.com',
  'MANAGED_BY_AUTH',
  'Daniel Gonzalez',
  'admin'
);
```

### ❌ Error: "No tienes permisos de administrador"
**Causa**: El usuario no tiene role = 'admin'
**Solución**: Actualiza el rol en SQL Editor:
```sql
UPDATE users
SET role = 'admin'
WHERE email = 'daniel.gonzalez.esquerra@gmail.com';
```

### ❌ Redirige a /administracion al intentar acceder al dashboard
**Causa**: No estás autenticado o no eres admin
**Solución**:
1. Inicia sesión primero en /administracion
2. Verifica que tu usuario tenga role = 'admin'

---

## 📦 Archivos del Sistema

### Creados:
- ✅ `src/contexts/AuthContext.tsx` - Manejo de autenticación
- ✅ `src/pages/Login.tsx` - Página de login
- ✅ `src/pages/AdminDashboard.tsx` - Dashboard admin
- ✅ `src/components/ProtectedRoute.tsx` - Protección de rutas
- ✅ `src/main.tsx` - Router configurado

### Modificados:
- ✅ `package.json` - Agregado react-router-dom

---

## 🎯 Rutas Disponibles

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Sitio web principal |
| `/administracion` | Público | Página de login admin |
| `/admin_dashboard` | Solo Admin | Panel de administración |

---

## 🔐 Cerrar Sesión

Desde el dashboard, haz clic en el botón **"Salir"** en la esquina superior derecha:
- ✅ Cierra la sesión en Supabase Auth
- ✅ Limpia el estado de usuario
- ✅ Redirige a `/administracion`

---

## ✨ Características Implementadas

- ✅ **Login seguro** con verificación de credenciales
- ✅ **Contraseñas hasheadas** (bcrypt por Supabase)
- ✅ **Verificación de rol** en servidor
- ✅ **Rutas protegidas** con middleware
- ✅ **Sesiones JWT** seguras
- ✅ **Redirección automática** según permisos
- ✅ **Mensajes de error** claros
- ✅ **Cierre de sesión** seguro
- ✅ **Estado de carga** durante verificación

---

**Sistema implementado y probado ✅**
**Build exitoso ✅**
**Listo para producción ✅**
