# Modelos y Diagrama ER - TrainLife

Este documento describe los modelos de datos de la aplicación trainLife, sus relaciones, el diagrama entidad-relación (ER), y los riesgos y recomendaciones de seguridad identificados.

## Modelos

### Usuario
Representa a los usuarios registrados en la aplicación.

Campos:
- `id` (AutoField, PK): identificador único generado automáticamente por Django
- `nombreUsuario` (CharField, max_length=100): nombre del usuario
- `apellido1` (CharField, max_length=100): primer apellido
- `apellido2` (CharField, max_length=100, opcional): segundo apellido
- `email` (EmailField, unique=True): correo electrónico único del usuario
- `numeroTelefono` (CharField, max_length=15, opcional): número de teléfono
- `contrasenia` (CharField, max_length=100): contraseña del usuario

Relaciones:
- Uno a muchos con Viaje (un usuario puede tener múltiples viajes)
- Uno a muchos con Ruta (un usuario puede crear múltiples rutas)
- Uno a muchos con RutaFavorita (un usuario puede marcar múltiples rutas como favoritas)

Método __str__: retorna "{nombreUsuario} {apellido1}"

**RIESGO CRÍTICO**: Las contraseñas se almacenan en texto claro en el campo `contrasenia`. Esto es una vulnerabilidad de seguridad grave. Ver sección de Riesgos y Recomendaciones.

### Viaje
Representa un viaje de tren de un usuario.

Campos:
- `id` (AutoField, PK): identificador único
- `usuario` (ForeignKey a Usuario, CASCADE): usuario propietario del viaje
- `nombrePasajero` (CharField, max_length=200): nombre del pasajero
- `coche` (CharField, max_length=10): número de coche (ej: "04")
- `asiento` (CharField, max_length=10): número de asiento (ej: "12A")
- `clase` (CharField, max_length=50, default="Turista"): clase del billete
- `origenEstacion` (CharField, max_length=200): estación de origen
- `horaSalidaOrigen` (TimeField): hora de salida desde origen
- `andenOrigen` (CharField, max_length=10): andén de salida
- `destinoEstacion` (CharField, max_length=200): estación de destino
- `horaLlegadaDestino` (TimeField): hora de llegada a destino
- `fechaViaje` (DateField): fecha del viaje
- `notificacionesActivas` (BooleanField, default=True): indica si las notificaciones están activas
- `fechaCreacion` (DateTimeField, auto_now_add=True): fecha de creación del registro
- `estadoViaje` (CharField, max_length=50, default="confirmado"): estado del viaje

Relaciones:
- Muchos a uno con Usuario (relacionado como 'viajes')

Ordenamiento por defecto: por fechaViaje y horaSalidaOrigen descendente

Método __str__: retorna "{origenEstacion} → {destinoEstacion} - {fechaViaje} ({nombrePasajero})"

### Ruta
Representa una ruta de transporte (conjunto de trayectos).

Campos:
- `id` (AutoField, PK): identificador único
- `usuario` (ForeignKey a Usuario, CASCADE, opcional): usuario que creó la ruta (null para rutas públicas)
- `nombre` (CharField, max_length=200): nombre descriptivo de la ruta
- `descripcion` (TextField, opcional): descripción de la ruta
- `esPublica` (BooleanField, default=True): indica si la ruta es pública
- `fechaCreacion` (DateTimeField, auto_now_add=True): fecha de creación
- `fechaActualizacion` (DateTimeField, auto_now=True): fecha de última actualización

Relaciones:
- Muchos a uno con Usuario (relacionado como 'rutas', opcional)
- Uno a muchos con Trayecto (una ruta contiene múltiples trayectos)
- Uno a muchos con RutaFavorita (una ruta puede ser marcada como favorita por múltiples usuarios)

Ordenamiento por defecto: por fechaCreacion descendente

Método __str__: retorna "{nombre} ({nombreUsuario})" o "{nombre} (Pública)"

### RutaFavorita
Representa la relación muchos a muchos entre Usuario y Ruta para marcar rutas favoritas.

Campos:
- `id` (AutoField, PK): identificador único
- `usuario` (ForeignKey a Usuario, CASCADE): usuario que marca la ruta como favorita
- `ruta` (ForeignKey a Ruta, CASCADE): ruta marcada como favorita
- `fechaAgregado` (DateTimeField, auto_now_add=True): fecha cuando se agregó a favoritos

Relaciones:
- Muchos a uno con Usuario (relacionado como 'rutas_favoritas')
- Muchos a uno con Ruta (relacionado como 'favoritos')

Restricción: unique_together en ['usuario', 'ruta'] - un usuario no puede marcar la misma ruta como favorita dos veces

Ordenamiento por defecto: por fechaAgregado descendente

Método __str__: retorna "{nombreUsuario} - {nombre_ruta}"

### Trayecto
Representa un segmento individual de una ruta (de una estación a otra).

Campos:
- `id` (AutoField, PK): identificador único
- `ruta` (ForeignKey a Ruta, CASCADE): ruta a la que pertenece el trayecto
- `orden` (PositiveIntegerField, default=1): orden del trayecto dentro de la ruta
- `estacionSalida` (CharField, max_length=200): estación de salida
- `andenSalida` (CharField, max_length=10, opcional): andén de salida
- `estacionLlegada` (CharField, max_length=200): estación de llegada
- `andenLlegada` (CharField, max_length=10, opcional): andén de llegada
- `horaSalida` (TimeField): hora de salida
- `horaLlegada` (TimeField): hora de llegada
- `nombreLinea` (CharField, max_length=100): nombre de la línea de transporte
- `colorLinea` (CharField, max_length=50, opcional): color de la línea
- `imagenMapa` (ImageField, upload_to='trayectos/mapas/', opcional): imagen del mapa del trayecto
- `numeroTransbordos` (PositiveIntegerField, default=0): número de transbordos antes de este trayecto
- `fechaCreacion` (DateTimeField, auto_now_add=True): fecha de creación

Relaciones:
- Muchos a uno con Ruta (relacionado como 'trayectos')

Ordenamiento por defecto: por ruta y orden

Método __str__: retorna "{estacionSalida} → {estacionLlegada} ({nombreLinea})"

## Diagrama ER (Entidad-Relación)

```
Usuario (1) ─────────── (*) Viaje
   |
   | (1)
   |
   └─────────── (*) Ruta
   |                 |
   | (*)             | (1)
   |                 |
RutaFavorita         └─────────── (*) Trayecto
   |
   | (*)
   |
Ruta ────────────────┘
```

Descripción de relaciones:

1. **Usuario → Viaje** (1:N)
   - Un usuario puede tener múltiples viajes
   - Un viaje pertenece a un solo usuario
   - DELETE CASCADE: al eliminar un usuario, se eliminan todos sus viajes

2. **Usuario → Ruta** (1:N, opcional)
   - Un usuario puede crear múltiples rutas
   - Una ruta puede ser pública (usuario = null) o pertenecer a un usuario
   - DELETE CASCADE: al eliminar un usuario, se eliminan todas sus rutas creadas

3. **Usuario ↔ Ruta** (N:M a través de RutaFavorita)
   - Un usuario puede marcar múltiples rutas como favoritas
   - Una ruta puede ser marcada como favorita por múltiples usuarios
   - DELETE CASCADE en ambos lados: al eliminar un usuario o una ruta, se eliminan las relaciones de favoritos

4. **Ruta → Trayecto** (1:N)
   - Una ruta contiene múltiples trayectos ordenados
   - Un trayecto pertenece a una sola ruta
   - DELETE CASCADE: al eliminar una ruta, se eliminan todos sus trayectos

## Riesgos y Recomendaciones de Seguridad

### CRÍTICO: Contraseñas en Texto Claro

**Riesgo**: Las contraseñas de los usuarios se almacenan en texto claro en el campo `Usuario.contrasenia`. Esto significa que:
- Si un atacante obtiene acceso a la base de datos, tendrá acceso directo a todas las contraseñas de los usuarios
- Las contraseñas son visibles para cualquiera con acceso al admin de Django o a la base de datos
- Viola las mejores prácticas de seguridad y regulaciones como RGPD

**Impacto**: Si la base de datos se ve comprometida, todas las cuentas de usuario están en riesgo. Además, si los usuarios reutilizan contraseñas, sus cuentas en otros servicios también podrían verse comprometidas.

**Recomendaciones**:

1. **Opción A: Migrar a django.contrib.auth (recomendado)**
   - Usar el modelo User de Django que ya incluye gestión segura de contraseñas
   - Crear un perfil de usuario (UserProfile) con campos adicionales (apellidos, teléfono)
   - Django usa PBKDF2 con hash SHA256 por defecto para las contraseñas

2. **Opción B: Implementar hashing manual**
   - Usar `make_password()` y `check_password()` de `django.contrib.auth.hashers`
   - Actualizar views.py para usar check_password() en lugar de comparación directa
   - Migrar las contraseñas existentes (requiere un script de migración)

Ejemplo de código para Opción B:
```python
from django.contrib.auth.hashers import make_password, check_password

# Al crear o actualizar un usuario:
usuario.contrasenia = make_password(contrasenia_texto_plano)
usuario.save()

# Al verificar en login:
usuario = Usuario.objects.get(email=email)
if check_password(contrasenia_ingresada, usuario.contrasenia):
    # Login exitoso
    pass
```

### ALTO: Autorización Inconsistente

**Riesgo**: Algunas vistas verifican correctamente la sesión (inicioUsuario, viajesUsuario, verDetallesViaje), mientras que otras (misViajes, salir) no realizan verificación explícita.

**Recomendaciones**:
- Crear un decorador personalizado para verificar la sesión y el usuario_id
- Aplicar este decorador a todas las vistas protegidas
- O migrar a django.contrib.auth y usar @login_required

Ejemplo:
```python
from functools import wraps
from django.shortcuts import redirect

def requiere_sesion(view_func):
    @wraps(view_func)
    def wrapper(request, usuario_id, *args, **kwargs):
        session_usuario_id = request.session.get('usuario_id')
        if not session_usuario_id or session_usuario_id != usuario_id:
            return redirect('login')
        return view_func(request, usuario_id, *args, **kwargs)
    return wrapper

# Uso:
@requiere_sesion
def misViajes(request, usuario_id):
    # ...
```

### MEDIO: Falta de Validación de Entrada

**Riesgo**: No hay validación exhaustiva de los datos de entrada en las vistas.

**Recomendaciones**:
- Usar Django Forms o Serializers para validar datos de entrada
- Sanitizar datos antes de almacenarlos
- Validar tipos de datos y rangos permitidos

### MEDIO: Gestión de Sesiones

**Riesgo**: La gestión de sesiones es manual y podría mejorarse.

**Recomendaciones**:
- Considerar establecer SESSION_COOKIE_SECURE = True en producción (requiere HTTPS)
- Establecer SESSION_COOKIE_HTTPONLY = True
- Configurar SESSION_COOKIE_AGE para expiración de sesiones
- Implementar logout adecuado que limpie la sesión

### BAJO: Mensajes de Error Verbosos

**Riesgo**: Los mensajes de error podrían revelar información sobre la existencia de usuarios.

**Recomendaciones**:
- Usar mensajes genéricos como "Usuario o contraseña incorrectos" en lugar de especificar cuál es incorrecto
- Actualmente se hace bien en login, mantener esta práctica

### BAJO: DEBUG en Producción

**Riesgo**: Según README.md, DEBUG = True en la configuración actual.

**Recomendaciones**:
- Establecer DEBUG = False en producción
- Configurar ALLOWED_HOSTS apropiadamente
- Configurar logging para errores en producción
- Usar variables de entorno para configuración sensible

## Mejoras Sugeridas para el Futuro

1. **Validación de Datos**:
   - Añadir validación en el modelo para campos como numeroTelefono
   - Validar formato de estaciones, horarios, etc.

2. **Índices de Base de Datos**:
   - Añadir índices en campos frecuentemente consultados (Usuario.email, Viaje.fechaViaje, etc.)

3. **Auditoría**:
   - Añadir campos de auditoría (fechaModificacion, usuarioModificacion) donde sea relevante

4. **Soft Delete**:
   - Considerar soft delete (campo activo/eliminado) en lugar de DELETE CASCADE en algunas relaciones

5. **Migraciones**:
   - Documentar el proceso de migración de contraseñas en texto claro a hash

6. **Tests**:
   - Añadir tests unitarios y de integración para modelos y vistas
   - Probar especialmente la lógica de autorización

7. **API REST**:
   - Considerar añadir una API REST con Django REST Framework para acceso programático

8. **Internacionalización**:
   - Preparar la aplicación para múltiples idiomas si es necesario
