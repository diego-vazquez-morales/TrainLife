================================================================================
                            TRAINLIFE - GUÍA DE INSTALACIÓN
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

================================================================================
EJECUCIÓN DE LA APLICACIÓN:
================================================================================

1. INICIAR EL SERVIDOR DE DESARROLLO
   En la carpeta del proyecto, ejecutar:
   
   python manage.py runserver
   
2. ACCEDER A LA APLICACIÓN
   Abrir un navegador web y acceder a:
   
   http://127.0.0.1:8000/
   
