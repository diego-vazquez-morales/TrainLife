# TrainLife

App web para gestionar viajes en tren: comprar billetes, seguir tus viajes, guardar rutas favoritas y recibir avisos cuando un tren se retrasa o se cancela, con trenes alternativos propuestos automáticamente.

Práctica final en equipo de la asignatura *Interacción Persona-Ordenador* (IPO) del Grado en Ingeniería Informática de la Universidad Francisco de Vitoria (2025). El objetivo era construir una aplicación que integrara lo aprendido en la asignatura, como el uso de ARIA y las paletas de color accesibles.

**Tecnologías:** Python · Django 5.2 · SQLite · HTML/CSS/JavaScript · Bootstrap · Docker

## Funcionalidades

- **Compra de billetes**: búsqueda de viajes disponibles por origen y destino y compra de plaza.
- **Mis viajes**: viajes próximos y pasados con su estado (programado, confirmado, retrasado, cancelado) y su detalle.
- **Incidencias y alternativas**: si un viaje se retrasa o se cancela, la app muestra trenes alternativos y permite cambiarse con un clic.
- **Rutas**: búsqueda de rutas, favoritas e incidencias que les afectan.
- **Notificaciones**: avisos por usuario sobre viajes, rutas y avisos del servicio, con estado leído/no leído.
- **Cuenta**: registro, inicio de sesión, recuperación y cambio de contraseña.
- **Accesibilidad**: modos para daltónicos (protanopia, deuteranopia, tritanopia) y modo de alto contraste, guardados por usuario y aplicados en toda la app.

## Cómo arrancarlo

Con Docker:

```bash
docker compose up --build
```

Abre http://localhost:8000. Al arrancar, el contenedor aplica las migraciones y carga los datos de demo (se restablecen en cada arranque).

Sin Docker:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata demo
python manage.py runserver
```

**Cuenta de demo:** `demo@trainlife.app` / `demo1234`

## Estructura

```
proyecto/            Configuración de Django y URLs raíz
trainLife/
  models.py          Usuario, Viaje, Ruta, Trayecto, Notificacion, Aviso
  views.py           Vistas y endpoints JSON (/api/...)
  templates/         Páginas renderizadas en servidor
  static/            CSS y JavaScript de cada página
  fixtures/demo.json Datos de demo
docs/                Notas de funcionalidades, endpoints y modelo de datos
```

## Mi parte

Equipo de tres (GitHub: diego-vazquez-morales, soff1809, BORJA). Me encargué de:

- **Flujo de compra de billetes**: convertí la página de "añadir billete" en un flujo de compra completo con búsqueda de viajes (vistas, endpoints JSON, plantillas y JS).
- **Alternativas para viajes con incidencias**: listado de trenes alternativos para viajes retrasados o cancelados y aplicación del cambio.
- Páginas de **notificaciones y configuración**.
- **Cambio de contraseña**.
- Arreglos del **Docker** y corrección de errores en vistas, URLs y modelos.

## Nota

Es un proyecto académico pensado para ejecutarse en local: `DEBUG` está activado y la autenticación está simplificada (modelo de usuario propio, contraseñas sin hash). No está preparado para producción.
