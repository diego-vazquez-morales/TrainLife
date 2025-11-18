# TrainLife

Proyecto Django para gestionar datos relacionados con 'TrainLife'. Este repositorio contiene la aplicación principal `trainLife` y la configuración del proyecto en `proyecto/`.

Estado
- Proyecto en configuración de desarrollo (DEBUG = True).
- Base de datos incluida: db.sqlite3 (archivo con datos de desarrollo).

Avisos importantes
- SECRET_KEY está en el archivo de configuración: no usar este repositorio tal cual en producción.
- DEBUG = True y ALLOWED_HOSTS vacío: cambiar antes de desplegar.
- Si vas a publicar el código, añade una licencia.

Requisitos
- Python 3.11+ (compatible con Django 5.2.8 usado para generar el proyecto)
- pip

Instalación y ejecución (desarrollo)
1. Clona el repositorio:
   git clone https://github.com/diego-vazquez-morales/TrainLife.git
   cd TrainLife

2. Crea y activa un entorno virtual (recomendado):
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate   # Windows

3. Instala dependencias (crea un requirements.txt si hace falta):
   pip install django

4. Aplica migraciones (si quieres crear una nueva base de datos en vez de usar la incluida):
   python manage.py migrate

5. Crea un superusuario (opcional, para acceder a /admin):
   python manage.py createsuperuser

6. Inicia el servidor de desarrollo:
   python manage.py runserver

Estructura principal del repositorio
- manage.py: script administrativo de Django.
- proyecto/: paquete con la configuración del proyecto (settings.py, urls.py, wsgi.py, asgi.py).
- trainLife/: aplicación Django principal (models, views, templates, static, admin, migrations).
- db.sqlite3: base de datos SQLite incluida para desarrollo.

Qué contiene trainLife (resumen rápido)
- models.py: definición de modelos y relaciones de datos.
- views.py: vistas que atienden las rutas de la app.
- urls.py: rutas específicas de la app.
- admin.py: registro de modelos para el admin de Django.
- templates/: plantillas HTML.
- static/: archivos estáticos (CSS, JS, imágenes).

Buenas prácticas y próximos pasos sugeridos
- Mover SECRET_KEY a variables de entorno y desactivar DEBUG para producción.
- Añadir un requirements.txt con las dependencias exactas.
- Añadir documentación más detallada (ejemplos de uso, endpoints, capturas).
- Añadir una licencia (por ejemplo MIT) si quieres permitir uso público.
- Eliminar db.sqlite3 del repositorio o incluir una copia de ejemplo (dump) en su lugar.

Contacto
- Autor: diego-vazquez-morales
- Repo: https://github.com/diego-vazquez-morales/TrainLife

