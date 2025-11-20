# Sistema de Notificaciones - TrainLife

## Descripción General
Sistema completo de notificaciones que detecta automáticamente cambios en la base de datos y notifica a los usuarios en tiempo real. Utiliza Django Signals para monitorear modificaciones en los viajes y genera notificaciones inteligentes.

## Arquitectura del Sistema

### 1. Modelo de Datos (`models.py`)

#### Modelo `Notificacion`
```python
class Notificacion(models.Model):
    usuario = ForeignKey(Usuario)
    tipo = CharField(choices=TIPO_CHOICES)
    titulo = CharField(max_length=200)
    mensaje = TextField()
    viaje = ForeignKey(Viaje, opcional)
    leida = BooleanField(default=False)
    importante = BooleanField(default=False)
    fechaCreacion = DateTimeField(auto_now_add=True)
    fechaLeida = DateTimeField(null=True)
```

#### Tipos de Notificaciones
- `cambio_viaje`: Cambios generales en el viaje
- `nuevo_viaje`: Nuevo viaje añadido
- `cancelacion`: Viaje cancelado
- `recordatorio`: Recordatorios programados
- `cambio_anden`: Cambio de andén
- `cambio_hora`: Cambio de horarios
- `alerta`: Alertas importantes
- `info`: Información general

### 2. Sistema de Detección de Cambios

#### Django Signals Implementados

**Pre-Save Signal** (`pre_save`):
- Captura el estado del viaje ANTES de guardarse
- Almacena valores anteriores en variable global `_viaje_previo`
- Campos monitoreados:
  - `fechaViaje`
  - `horaSalidaOrigen`
  - `horaLlegadaDestino`
  - `andenOrigen`
  - `estadoViaje`
  - `coche`
  - `asiento`

**Post-Save Signal** (`post_save`):
- Se ejecuta DESPUÉS de guardar el viaje
- Compara valores antiguos vs nuevos
- Crea notificaciones específicas según el cambio detectado

#### Detección Automática de Cambios

1. **Cambio de Andén** (Importante)
   ```python
   if andenOrigen != andenOrigen_anterior:
       → Crear notificación tipo 'cambio_anden'
   ```

2. **Cambio de Hora de Salida** (Importante)
   ```python
   if horaSalidaOrigen != horaSalidaOrigen_anterior:
       → Crear notificación tipo 'cambio_hora'
   ```

3. **Cambio de Hora de Llegada** (Importante)
   ```python
   if horaLlegadaDestino != horaLlegadaDestino_anterior:
       → Crear notificación tipo 'cambio_hora'
   ```

4. **Cambio de Fecha** (Importante)
   ```python
   if fechaViaje != fechaViaje_anterior:
       → Crear notificación tipo 'cambio_viaje'
   ```

5. **Cancelación** (Importante)
   ```python
   if estadoViaje == 'Cancelado' y estado_anterior != 'Cancelado':
       → Crear notificación tipo 'cancelacion'
   ```

6. **Cambio de Asiento**
   ```python
   if asiento != asiento_anterior:
       → Crear notificación tipo 'cambio_viaje'
   ```

7. **Cambio de Coche**
   ```python
   if coche != coche_anterior:
       → Crear notificación tipo 'cambio_viaje'
   ```

8. **Nuevo Viaje**
   ```python
   if created:
       → Crear notificación tipo 'nuevo_viaje'
   ```

### 3. API REST

#### Endpoints Implementados

**GET `/api/notificaciones/<usuario_id>/`**
- Obtiene notificaciones del usuario
- Parámetros de query:
  - `filtro`: 'all' | 'unread' | 'alerts'
- Respuesta JSON:
  ```json
  {
    "notificaciones": [...],
    "total": 10,
    "no_leidas": 3
  }
  ```

**POST `/notificaciones/<usuario_id>/marcar/<notificacion_id>/`**
- Marca una notificación como leída
- Actualiza `fechaLeida` automáticamente
- Respuesta: `{"success": true, "leida": true}`

**POST `/notificaciones/<usuario_id>/marcar-todas/`**
- Marca todas las notificaciones del usuario como leídas
- Respuesta: `{"success": true, "marcadas": 5}`

### 4. Vistas Django

#### `notificaciones(request, usuario_id)`
- Vista principal de notificaciones
- Renderiza template con contador de no leídas
- Autenticación por sesión

#### `api_notificaciones(request, usuario_id)`
- API JSON para obtener notificaciones
- Soporta filtros dinámicos
- Serialización completa de notificaciones

#### `marcar_notificacion_leida(request, usuario_id, notificacion_id)`
- Marca notificación individual como leída
- Método: POST
- Protección CSRF

#### `marcar_todas_leidas(request, usuario_id)`
- Marca todas las notificaciones como leídas en lote
- Método: POST
- Retorna número de notificaciones marcadas

### 5. Frontend JavaScript

#### Funciones Principales

**`cargarNotificaciones()`**
- Carga notificaciones desde API
- Actualiza DOM dinámicamente
- Se ejecuta al iniciar y cada 30 segundos

**`renderizarNotificaciones()`**
- Renderiza HTML de notificaciones
- Aplica filtros seleccionados
- Inicializa event listeners

**`crearNotificacionHTML(notif)`**
- Genera HTML individual para cada notificación
- Asigna iconos y colores según tipo
- Formatea fechas de forma legible

**`marcarComoLeida(notifId)`**
- Marca notificación como leída via AJAX
- Actualiza UI sin recargar página
- Actualiza contador de no leídas

**`marcarTodasComoLeidas()`**
- Marca todas las notificaciones en lote
- Confirmación del usuario
- Actualización global

**`formatearFecha(fechaStr)`**
- Convierte fechas a formato legible
- "Ahora", "Hace 5 min", "Hace 3h", etc.

#### Auto-Refresh
```javascript
setInterval(() => {
    cargarNotificaciones();
}, 30000); // Cada 30 segundos
```

### 6. UI/UX

#### Componentes Visuales

**Badge de Notificaciones**
- Contador de notificaciones no leídas
- Se oculta cuando no hay no leídas
- Actualización en tiempo real

**Filtros**
- Todas las notificaciones
- Solo no leídas
- Solo alertas (importantes)

**Tarjetas de Notificación**
- Icono según tipo
- Título descriptivo
- Mensaje detallado
- Timestamp relativo
- Badge "Importante" si aplica
- Punto rojo si no leída

**Estado Visual**
- `.unread`: Fondo destacado para no leídas
- `.important`: Borde especial para importantes
- Colores dinámicos según tipo:
  - Success (verde): Nuevo viaje, confirmaciones
  - Warning (amarillo): Cambios de andén, hora
  - Danger (rojo): Cancelaciones, alertas
  - Info (azul): Información general

## Flujo de Trabajo Completo

### Escenario: Usuario Modifica un Viaje

1. **Usuario edita un viaje** (ej: cambia andén de "3" a "5")
   
2. **Pre-Save Signal** se dispara:
   ```python
   detectar_cambios_viaje()
   # Guarda estado anterior: andenOrigen = "3"
   ```

3. **Viaje se guarda** en la base de datos

4. **Post-Save Signal** se dispara:
   ```python
   notificar_cambios_viaje()
   # Compara: "3" != "5"
   # Crea Notificacion(tipo='cambio_anden', importante=True)
   ```

5. **Notificación creada** automáticamente en la BD

6. **Frontend auto-refresca** (cada 30s o al cargar página)
   ```javascript
   cargarNotificaciones()
   ```

7. **API devuelve** nueva notificación

8. **UI se actualiza**:
   - Badge muestra "+1"
   - Nueva tarjeta aparece
   - Punto rojo indica "no leída"

9. **Usuario hace clic** en la notificación

10. **AJAX marca como leída**:
    ```javascript
    marcarComoLeida(notifId)
    ```

11. **UI se actualiza**:
    - Badge disminuye
    - Punto rojo desaparece
    - Tarjeta cambia a estado "leída"

## Ejemplo de Uso

### Crear Notificación Manualmente
```python
from trainLife.models import Notificacion, Usuario, Viaje

usuario = Usuario.objects.get(id=1)
viaje = Viaje.objects.get(id=10)

Notificacion.objects.create(
    usuario=usuario,
    tipo='alerta',
    titulo='Mantenimiento programado',
    mensaje='Habrá mantenimiento en la línea Madrid-Barcelona el 25/11',
    viaje=viaje,
    importante=True
)
```

### Modificar Viaje (Genera Notificación Automática)
```python
viaje = Viaje.objects.get(id=10)
viaje.andenOrigen = "12"  # Antes era "8"
viaje.save()  # Signal detecta cambio y crea notificación
```

### Obtener Notificaciones en Template
```django
{% for notif in usuario.notificaciones.all %}
    <div class="{{ 'leida' if notif.leida else 'no-leida' }}">
        {{ notif.titulo }} - {{ notif.mensaje }}
    </div>
{% endfor %}
```

## Características Avanzadas

### ✅ Detección Inteligente
- Solo notifica si `notificacionesActivas=True` en el viaje
- No crea duplicados
- Prioriza cambios importantes

### ✅ Rendimiento
- Queries optimizadas con `select_related`
- Cache de estado previo
- Auto-refresh configurable

### ✅ Seguridad
- Autenticación por sesión
- Protección CSRF
- Validación de permisos (usuario solo ve sus notificaciones)

### ✅ UX
- Formato de fechas inteligente
- Iconos descriptivos
- Colores semánticos
- Feedback inmediato

### ✅ Escalabilidad
- Paginación ready (fácil de implementar)
- API RESTful
- Frontend desacoplado

## Próximas Mejoras Sugeridas

1. **Notificaciones Push**
   - Integrar Web Push API
   - Notificaciones de escritorio

2. **Email Notifications**
   - Enviar emails para cambios importantes
   - Resumen diario configurable

3. **Preferencias de Usuario**
   - Configurar qué tipo de notificaciones recibir
   - Horarios de notificaciones

4. **Historial**
   - Archivo de notificaciones antiguas
   - Búsqueda y filtros avanzados

5. **WebSockets**
   - Actualización en tiempo real sin polling
   - Django Channels

6. **Templates de Notificaciones**
   - Personalizar mensajes
   - Internacionalización

## Testing

### Casos de Prueba
```python
# Test: Crear notificación al cambiar andén
viaje.andenOrigen = "nuevo"
viaje.save()
assert Notificacion.objects.filter(
    tipo='cambio_anden'
).exists()

# Test: No crear notificación si notificaciones desactivadas
viaje.notificacionesActivas = False
viaje.andenOrigen = "otro"
viaje.save()
assert not Notificacion.objects.filter(
    tipo='cambio_anden',
    viaje=viaje
).exists()
```

## Monitoreo

### Queries Útiles
```python
# Notificaciones no leídas por usuario
Notificacion.objects.filter(
    usuario=usuario,
    leida=False
).count()

# Notificaciones importantes del último día
from datetime import timedelta
Notificacion.objects.filter(
    importante=True,
    fechaCreacion__gte=timezone.now() - timedelta(days=1)
)
```

## Conclusión

Este sistema de notificaciones proporciona una solución completa y robusta para mantener a los usuarios informados sobre cambios en sus viajes. La detección automática mediante Django Signals garantiza que ningún cambio importante pase desapercibido, mejorando significativamente la experiencia del usuario.
