# Sistema de Recuperación de Contraseña

Este documento describe la implementación del sistema de recuperación de contraseña en TrainLife.

## Flujo de Usuario

### 1. Inicio en Login
- El usuario hace clic en "¿Has olvidado tu contraseña?" en la página de login
- Se abre un modal solicitando el correo electrónico

### 2. Modal de Recuperación
- El usuario introduce su correo electrónico
- Se valida el formato del email
- Al hacer clic en "Continuar", el email se guarda en `localStorage` y se redirige a la página de cambio de contraseña

### 3. Página de Cambio de Contraseña
- Se muestra el email del usuario (recuperado del `localStorage`)
- El usuario introduce su nueva contraseña dos veces
- Se valida que:
  - Ambos campos estén llenos
  - Las contraseñas coincidan
  - La contraseña tenga al menos 6 caracteres
- Al enviar, se actualiza la contraseña en la base de datos

## Archivos Creados/Modificados

### Templates
- `trainLife/templates/recuperarContrasenia.html` - Nueva página para cambiar contraseña
- `trainLife/templates/login.html` - Añadido modal de recuperación

### CSS
- `trainLife/static/styles/recuperarContrasenia.css` - Estilos para la página de recuperación
- `trainLife/static/styles/login.css` - Añadidos estilos para el modal

### JavaScript
- `trainLife/static/js/recuperarContrasenia.js` - Lógica de validación y envío
- `trainLife/static/js/login.js` - Lógica para abrir/cerrar modal y validación

### Backend
- `trainLife/views.py` - Añadida vista `recuperarContrasenia`
- `trainLife/urls.py` - Añadida ruta `/recuperar-contrasenia/`

## Funcionalidades

### Validaciones del Modal
- Email requerido
- Formato de email válido

### Validaciones de Cambio de Contraseña
- Nueva contraseña requerida (mínimo 6 caracteres)
- Repetir contraseña requerida
- Las contraseñas deben coincidir
- El email debe existir en la base de datos

### Características de UI/UX
- Modal con animación de entrada/salida
- Toggle para mostrar/ocultar contraseñas
- Mensajes de error personalizados por campo
- Pre-llenado del email si está disponible en el formulario de login
- Diseño responsive
- Iconos de Lucide para mejorar la experiencia visual
- Botón "Volver" para regresar al login
- Enlace para cambiar el correo electrónico

## URLs

- **Login**: `/login/`
- **Recuperar Contraseña**: `/recuperar-contrasenia/`

## Notas de Seguridad

⚠️ **IMPORTANTE**: Esta implementación es básica y **NO** debe usarse en producción sin mejoras de seguridad:

1. **No hay verificación por email**: El sistema permite cambiar la contraseña sin enviar un código de verificación
2. **Contraseñas sin hash**: Las contraseñas se almacenan en texto plano (deberían usar hash con bcrypt/argon2)
3. **Sin rate limiting**: No hay protección contra ataques de fuerza bruta
4. **Sin tokens de recuperación**: Debería generarse un token único con tiempo de expiración

### Mejoras Recomendadas para Producción
1. Implementar envío de email con token de recuperación
2. Usar hash para las contraseñas (Django `make_password` y `check_password`)
3. Añadir rate limiting para prevenir abuso
4. Implementar CAPTCHA para prevenir bots
5. Registrar intentos de recuperación en logs de auditoría
