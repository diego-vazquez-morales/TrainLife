# Guía de Implementación: Buscar Rutas en TrainLife

## 📋 Resumen de Cambios

Se ha actualizado completamente la funcionalidad de **Buscar Rutas** para que funcione con Django, mostrando todas las rutas disponibles de la base de datos (tanto las que tienen usuario asignado como las que no).

## 🎯 Características Implementadas

### 1. Vista de Django (`views.py`)
- ✅ **`buscarRutas()`**: Muestra todas las rutas de la base de datos
- ✅ **`api_buscar_rutas()`**: API JSON para búsqueda dinámica
- ✅ Filtrado por origen/destino
- ✅ Muestra rutas con y sin usuario asignado

### 2. Plantilla HTML (`buscarRutas.html`)
- ✅ Usa sintaxis de Django (`{% %}` y `{{ }}`)
- ✅ Muestra rutas desde el contexto de Django
- ✅ Indica si la ruta está asignada a un usuario
- ✅ Detalles expandibles de cada ruta con trayectos
- ✅ Diseño responsive y moderno

### 3. JavaScript (`buscarRutas.js`)
- ✅ Simplificado para trabajar con datos de Django
- ✅ Funcionalidad de expandir/contraer detalles
- ✅ Integración con el botón de guardar ruta

### 4. Estilos CSS (`buscarRutas.css`)
- ✅ Estilos para todos los elementos nuevos
- ✅ Badges para indicar estado de la ruta
- ✅ Placeholders para imágenes faltantes

## 🚀 Cómo Usar

### Paso 1: Agregar Rutas de Ejemplo a la Base de Datos

```bash
# Desde el directorio del proyecto TrainLife
python manage.py shell < agregar_rutas_ejemplo.py
```

Este script creará 7 rutas de ejemplo con sus trayectos correspondientes.

### Paso 2: Ejecutar el Servidor

```bash
python manage.py runserver
```

### Paso 3: Acceder a Buscar Rutas

1. Inicia sesión en la aplicación
2. Navega a "Buscar Rutas" desde el menú
3. Verás todas las rutas disponibles

## 🔍 Funcionalidades

### Ver Todas las Rutas
- Al cargar la página, se muestran **todas** las rutas de la base de datos
- Incluye rutas sin usuario asignado (disponibles) y rutas ya asignadas

### Buscar Rutas
1. Ingresa origen (opcional)
2. Ingresa destino (opcional)
3. Selecciona fecha
4. Haz clic en "Buscar Rutas"
5. Los resultados se filtran según los criterios

### Ver Detalles de una Ruta
- Haz clic en "Ver Detalles" para expandir
- Muestra información de todos los trayectos:
  - Estaciones de salida/llegada
  - Horarios
  - Andenes
  - Nombre de la línea
  - Imagen del trayecto (si está disponible)

### Agregar a Favoritos
- Haz clic en "Agregar a Favoritos" para asignar la ruta a tu usuario
- Solo puedes agregar rutas que no sean tuyas
- Redirige a la página de "Mis Rutas" tras guardar

## 📁 Archivos Modificados

```
trainLife/
├── views.py                        # ✅ Actualizado
│   ├── buscarRutas()              # Vista principal
│   └── api_buscar_rutas()         # API JSON
├── urls.py                         # ✅ Actualizado
│   └── api/buscarRutas/<id>/      # Nueva ruta API
├── templates/
│   └── buscarRutas.html           # ✅ Actualizado completamente
├── static/
│   ├── js/
│   │   └── buscarRutas.js         # ✅ Simplificado para Django
│   └── styles/
│       └── buscarRutas.css        # ✅ Mejorado
agregar_rutas_ejemplo.py           # ✅ Nuevo script
```

## 🎨 Características Visuales

### Badges de Estado
- 🟢 **Verde "Disponible"**: Ruta sin usuario asignado
- 🔵 **Azul "Asignada a: [nombre]"**: Ruta ya asignada

### Botones
- **Ver Detalles** / **Ocultar Detalles**: Expande/contrae información
- **Agregar a Favoritos**: Asigna la ruta al usuario actual
- **Tu Ruta** (deshabilitado): Aparece en rutas ya propias

## 🔧 Estructura de Datos

### Modelo Ruta
```python
- id
- nombre
- descripcion
- usuario (nullable - puede ser None)
- fechaCreacion
- fechaActualizacion
```

### Modelo Trayecto
```python
- id
- ruta (ForeignKey)
- orden
- estacionSalida
- estacionLlegada
- horaSalida
- horaLlegada
- andenSalida
- andenLlegada
- nombreLinea
- colorLinea
- imagenMapa
```

## 📝 Endpoints Disponibles

### 1. Vista HTML
```
GET /buscarRutas/<usuario_id>/
```
Muestra la página con todas las rutas disponibles.

**Parámetros GET opcionales:**
- `origen`: Filtra por estación de origen
- `destino`: Filtra por estación de destino
- `fecha`: Fecha del viaje (no se usa actualmente en filtrado)

### 2. API JSON
```
GET /api/buscarRutas/<usuario_id>/
```
Devuelve un JSON con todas las rutas y sus trayectos.

**Respuesta:**
```json
{
  "rutas": [
    {
      "id": 1,
      "nombre": "Madrid → Barcelona (AVE Directo)",
      "descripcion": "Ruta rápida...",
      "usuario_nombre": "Sin asignar",
      "tiene_usuario": false,
      "origen": "Madrid - Puerta de Atocha",
      "destino": "Barcelona - Sants",
      "hora_salida": "09:00",
      "hora_llegada": "12:30",
      "num_transbordos": 0,
      "trayectos": [...]
    }
  ]
}
```

## 🎯 Próximos Pasos (Opcional)

1. **Agregar imágenes reales**: Subir imágenes de mapas para los trayectos
2. **Paginación**: Si hay muchas rutas, implementar paginación
3. **Filtros avanzados**: Precio, duración, número de transbordos
4. **Búsqueda en tiempo real**: Ajax para actualizar resultados sin recargar
5. **Ordenamiento**: Por precio, duración, popularidad, etc.

## ⚠️ Notas Importantes

- Las rutas mostradas incluyen **todas** las rutas de la base de datos
- Una ruta puede estar asignada a un usuario o no tener usuario (disponible)
- Solo puedes agregar a favoritos las rutas que no sean tuyas
- El filtro de búsqueda es case-insensitive (no distingue mayúsculas)

## 🐛 Solución de Problemas

### No se muestran rutas
- Verifica que hayan rutas en la base de datos:
  ```bash
  python manage.py shell
  >>> from trainLife.models import Ruta
  >>> Ruta.objects.count()
  ```
- Si es 0, ejecuta el script de ejemplo

### Error de template
- Asegúrate de que `buscarRutas.html` esté en `trainLife/templates/`
- Verifica que `{% load static %}` esté al inicio del template

### Iconos no se muestran
- Verifica la conexión a internet (usa CDN de Lucide)
- Asegúrate de que `lucide.createIcons()` se ejecute al final

## 👨‍💻 Soporte

Si encuentras algún problema, revisa:
1. Los logs de Django en la consola
2. La consola del navegador (F12) para errores de JavaScript
3. Que todos los archivos estén guardados correctamente

¡Disfruta de tu nueva funcionalidad de Buscar Rutas! 🚆
