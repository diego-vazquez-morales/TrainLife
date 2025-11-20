# Añadir Nuevo Billete - Documentación

## Descripción
Funcionalidad completa para añadir billetes de tren manualmente a "Mis Viajes". Permite a los usuarios ingresar todos los detalles de un billete comprado y agregarlo a su colección de viajes.

## Archivos Implementados

### 1. Vista Django
**Archivo:** `trainLife/views.py`
- **Función:** `aniadirBillete(request, usuario_id)`
- **Métodos:** GET (mostrar formulario), POST (guardar billete)
- **Autenticación:** Verifica sesión del usuario
- **Validación:** Manejo de errores con try/except
- **Redirección:** Redirige a la página de viajes tras guardar exitosamente

### 2. Template HTML
**Archivo:** `trainLife/templates/AniadirBillete.html`
- Formulario completo con todos los campos del modelo `Viaje`
- Organizado en secciones lógicas:
  - **Información del Pasajero**: Nombre completo
  - **Origen y Destino**: Estaciones y andén
  - **Fecha y Horarios**: Fecha, hora de salida y llegada
  - **Información del Billete**: Coche, asiento, clase
  - **Opciones Adicionales**: Estado del viaje, notificaciones
- Integración con Bootstrap 5 para diseño responsivo
- Iconos Lucide para mejor UX
- Breadcrumbs para navegación
- Mensajes de éxito/error usando Django messages

### 3. Estilos CSS
**Archivo:** `trainLife/static/styles/AniadirBillete.css`
- Diseño moderno y limpio
- Secciones visuales bien definidas
- Formulario responsivo
- Estilos para:
  - Sidebar de navegación
  - Formulario con secciones
  - Botones de acción
  - Breadcrumbs
  - Alertas
- Media queries para móviles

### 4. JavaScript
**Archivo:** `trainLife/static/js/AniadirBillete.js`
- **Validaciones del lado del cliente:**
  - Hora de llegada posterior a hora de salida
  - Fecha mínima (hoy)
- **Mejoras UX:**
  - Auto-capitalización de nombres de estaciones
  - Formateo automático de número de coche (01, 02, etc.)
  - Asientos en mayúsculas automáticas
  - Fecha por defecto: hoy
- **Responsividad:**
  - Toggle del sidebar en móvil
  - Cierre automático al hacer clic fuera

### 5. URL Configuration
**Archivo:** `trainLife/urls.py`
- **Ruta:** `/aniadirBillete/<int:usuario_id>/`
- **Nombre:** `aniadir_billete`
- **Vista:** `views.aniadirBillete`

## Campos del Formulario

### Campos Obligatorios (*)
- **Nombre del Pasajero**: Texto completo del pasajero
- **Estación de Origen**: Ej: "Madrid - Puerta de Atocha"
- **Estación de Destino**: Ej: "Barcelona - Sants"
- **Fecha del Viaje**: Selector de fecha (mínimo: hoy)
- **Hora de Salida**: Selector de hora
- **Hora de Llegada**: Selector de hora (debe ser > hora salida)
- **Coche**: Número de coche (auto-formateado a 2 dígitos)
- **Asiento**: Número y letra (ej: 12A)
- **Clase**: Dropdown (Turista, Preferente, Business)

### Campos Opcionales
- **Andén de Origen**: Texto corto
- **Estado del Viaje**: Dropdown con opciones:
  - Programado (default)
  - Confirmado
  - En curso
  - Completado
  - Cancelado
- **Notificaciones Activas**: Checkbox (marcado por default)

## Flujo de Usuario

1. Usuario hace clic en "Añadir nuevo billete" desde la página de Viajes
2. Se muestra el formulario completo con campos organizados
3. El nombre del pasajero se pre-rellena con el nombre del usuario
4. Usuario completa los campos requeridos
5. JavaScript valida en tiempo real
6. Al enviar:
   - Si hay error: muestra mensaje de error y mantiene datos
   - Si éxito: guarda el viaje y redirige a "Viajes" con mensaje de éxito

## Validaciones Implementadas

### Backend (Django)
- Usuario autenticado mediante sesión
- Usuario existe en base de datos
- Try/except para capturar errores de guardado
- Campos obligatorios del modelo

### Frontend (JavaScript)
- Hora de llegada > hora de salida
- Fecha >= hoy
- Formateo automático de valores

## Integración con el Sistema

### Modelos Django
Utiliza el modelo `Viaje` existente con todos sus campos:
```python
- usuario (ForeignKey)
- nombrePasajero
- coche
- asiento
- clase
- origenEstacion
- horaSalidaOrigen
- andenOrigen
- destinoEstacion
- horaLlegadaDestino
- fechaViaje
- notificacionesActivas
- estadoViaje
- fechaCreacion (auto)
```

### Navegación
- Desde: Página de "Viajes" (botón "Añadir nuevo billete")
- Breadcrumb: Home > Viajes > Añadir Nuevo Billete
- Botón "Cancelar": Vuelve a Viajes
- Tras guardar: Redirige a Viajes con mensaje de éxito

## Características de UX

✅ **Diseño Limpio**: Formulario organizado en secciones visuales
✅ **Responsivo**: Funciona en desktop, tablet y móvil
✅ **Validación Inteligente**: Feedback inmediato al usuario
✅ **Auto-completado**: Nombre del pasajero pre-rellenado
✅ **Formateo Automático**: Coche, asiento, estaciones
✅ **Feedback Visual**: Mensajes de éxito/error con Django messages
✅ **Navegación Clara**: Breadcrumbs y botones bien posicionados
✅ **Iconografía**: Lucide icons para mejor comprensión

## Próximas Mejoras Sugeridas

1. **Autocompletado de Estaciones**: Agregar datalist con estaciones comunes
2. **Integración con Rutas**: Permitir seleccionar una ruta guardada
3. **Upload de PDF**: Escanear billete y extraer datos
4. **Validación de Horarios**: Verificar horarios reales de trenes
5. **Sugerencias Inteligentes**: Basadas en viajes anteriores
6. **Preview del Billete**: Mostrar cómo se verá antes de guardar

## Testing

### Casos de Prueba
- ✅ Guardar billete con todos los campos
- ✅ Guardar billete con solo campos obligatorios
- ✅ Validación de hora de llegada < salida
- ✅ Usuario no autenticado (redirige a login)
- ✅ Usuario diferente en sesión vs URL
- ✅ Formato de fecha correcta
- ✅ Mensajes de error/éxito

## Uso

1. Iniciar sesión en TrainLife
2. Ir a "Viajes"
3. Hacer clic en "Añadir nuevo billete"
4. Completar el formulario
5. Hacer clic en "Guardar Billete"
6. Ver el nuevo viaje en "Mis Viajes"
