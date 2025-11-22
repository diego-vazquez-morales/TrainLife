================================================================================
                            TRAINLIFE - GUÍA DE INSTALACIÓN
================================================================================

DESCRIPCIÓN:
TrainLife es una aplicación web desarrollada con Django para la gestión y 
planificación de viajes en tren. Permite a los usuarios consultar rutas, 
gestionar billetes, recibir notificaciones y guardar rutas favoritas.

================================================================================
REQUISITOS PREVIOS:
================================================================================

1. Python 3.8 o superior instalado en el sistema
   - Descargar desde: https://www.python.org/downloads/
   - Durante la instalación, marcar la opción "Add Python to PATH"

2. pip (gestor de paquetes de Python)
   - Se instala automáticamente con Python 3.4+
   - Verificar instalación: python --version y pip --version

================================================================================
INSTALACIÓN:
================================================================================

1. DESCOMPRIMIR EL PROYECTO
   - Extraer el archivo comprimido en una carpeta de su elección
   - Abrir una terminal/PowerShell en la carpeta del proyecto

2. INSTALAR DEPENDENCIAS
   Ejecutar el siguiente comando en la terminal:
   
   pip install -r requirements.txt
   
   Esto instalará:
   - Django 5.2.8 (framework web)
   - Pillow (manejo de imágenes)

3. APLICAR MIGRACIONES DE BASE DE DATOS
   Ejecutar los siguientes comandos en orden:
   
   python manage.py migrate
   
   Esto creará la base de datos SQLite con todas las tablas necesarias.

4. (OPCIONAL) CARGAR DATOS DE EJEMPLO
   Si desea poblar la base de datos con rutas de ejemplo:
   
   python manage.py shell < agregar_rutas_ejemplo.py
   
   O alternativamente:
   
   python agregar_rutas_ejemplo.py

================================================================================
EJECUCIÓN DE LA APLICACIÓN:
================================================================================

1. INICIAR EL SERVIDOR DE DESARROLLO
   En la carpeta del proyecto, ejecutar:
   
   python manage.py runserver
   
2. ACCEDER A LA APLICACIÓN
   Abrir un navegador web y acceder a:
   
   http://127.0.0.1:8000/
   
3. DETENER EL SERVIDOR
   Presionar Ctrl+C en la terminal donde se está ejecutando el servidor

================================================================================
ACCESO AL PANEL DE ADMINISTRACIÓN:
================================================================================

1. CREAR UN SUPERUSUARIO (OPCIONAL)
   Para acceder al panel de administración de Django:
   
   python manage.py createsuperuser
   
   Seguir las instrucciones para establecer usuario y contraseña

2. ACCEDER AL PANEL
   Con el servidor en ejecución, acceder a:
   
   http://127.0.0.1:8000/admin/
   
   Desde aquí se pueden gestionar usuarios, rutas, trayectos, viajes, etc.

================================================================================
ESTRUCTURA DEL PROYECTO:
================================================================================

TrainLife/
│
├── manage.py                   # Script de gestión de Django
├── requirements.txt            # Dependencias del proyecto
├── agregar_rutas_ejemplo.py    # Script para cargar datos de ejemplo
├── db.sqlite3                  # Base de datos (se crea tras migrate)
├── README.md                   # Documentación del proyecto
│
├── proyecto/                   # Configuración principal de Django
│   ├── settings.py            # Configuración del proyecto
│   ├── urls.py                # Rutas URL principales
│   └── wsgi.py                # Configuración WSGI
│
├── trainLife/                  # Aplicación principal
│   ├── models.py              # Modelos de base de datos
│   ├── views.py               # Vistas y lógica de negocio
│   ├── urls.py                # Rutas URL de la aplicación
│   ├── admin.py               # Configuración del panel admin
│   │
│   ├── templates/             # Plantillas HTML
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── buscarRutas.html
│   │   ├── MisRutas.html
│   │   ├── misViajes.html
│   │   └── ... (otras plantillas)
│   │
│   ├── static/                # Archivos estáticos (CSS, JS, imágenes)
│   │   ├── styles/
│   │   ├── js/
│   │   └── img/
│   │
│   └── migrations/            # Migraciones de base de datos
│
├── media/                      # Archivos subidos por usuarios
│   └── trayectos/
│       └── mapas/
│
└── docs/                       # Documentación adicional
    ├── endpoints.md           # Documentación de endpoints
    └── models_and_er.md       # Modelos y diagrama ER

================================================================================
USUARIOS DE PRUEBA:
================================================================================

Puede crear usuarios desde la interfaz web en:
http://127.0.0.1:8000/crearUsuario/

O crear un superusuario desde la terminal:
python manage.py createsuperuser

================================================================================
FUNCIONALIDADES PRINCIPALES:
================================================================================

1. GESTIÓN DE USUARIOS
   - Registro de nuevos usuarios
   - Inicio de sesión
   - Configuración de perfil y preferencias de notificaciones

2. BÚSQUEDA Y GESTIÓN DE RUTAS
   - Búsqueda de rutas por origen y destino
   - Visualización de trayectos con transbordos
   - Guardar rutas en favoritos (múltiples usuarios pueden guardar la misma ruta)
   - Ver detalles de cada trayecto (estaciones, andenes, horarios)

3. GESTIÓN DE VIAJES
   - Añadir nuevos billetes de tren
   - Ver billetes activos
   - Consultar detalles de cada viaje

4. NOTIFICACIONES
   - Sistema de notificaciones personalizables
   - Preferencias por tipo (viajes, rutas, avisos)
   - Visualización y gestión de notificaciones

5. MODALES Y CONFIRMACIONES
   - Modales de confirmación para acciones críticas
   - Modal de éxito tras completar operaciones
   - Mensajes informativos y de error

================================================================================
SOLUCIÓN DE PROBLEMAS:
================================================================================

PROBLEMA: "python no se reconoce como comando"
SOLUCIÓN: Añadir Python a las variables de entorno PATH del sistema

PROBLEMA: Error al instalar Pillow
SOLUCIÓN: En Windows, instalar Visual C++ Build Tools o usar:
          pip install --upgrade Pillow

PROBLEMA: Puerto 8000 ya en uso
SOLUCIÓN: Ejecutar en otro puerto: python manage.py runserver 8080

PROBLEMA: Archivos estáticos no se cargan
SOLUCIÓN: Verificar que DEBUG=True en settings.py y ejecutar:
          python manage.py collectstatic

PROBLEMA: Imágenes de trayectos no aparecen
SOLUCIÓN: Verificar que Pillow está instalado y que la carpeta media/ existe

================================================================================
TECNOLOGÍAS UTILIZADAS:
================================================================================

Backend:
- Django 5.2.8 (Framework web Python)
- SQLite (Base de datos)
- Pillow (Procesamiento de imágenes)

Frontend:
- HTML5, CSS3, JavaScript
- Bootstrap 5 (Framework CSS)
- Lucide Icons (Iconos)
- Tailwind CSS (en algunas páginas)

================================================================================
CONTACTO Y SOPORTE:
================================================================================

Para más información sobre el proyecto, consultar:
- README.md (documentación principal en Markdown)
- docs/endpoints.md (documentación de endpoints)
- docs/models_and_er.md (modelos de base de datos)

================================================================================
NOTAS ADICIONALES:
================================================================================

- La aplicación usa SQLite como base de datos por defecto (ideal para desarrollo)
- Los archivos media se almacenan en la carpeta media/
- Las rutas de ejemplo incluyen imágenes de mapas de trayectos
- El sistema soporta múltiples usuarios guardando la misma ruta en favoritos
- Las notificaciones se generan automáticamente según las preferencias del usuario

================================================================================
                            ¡Gracias por usar TrainLife!
================================================================================
