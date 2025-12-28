# Usamos una imagen base oficial de Python ligera
FROM python:3.11-slim

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Variables de entorno para optimizar Python en Docker
# Evita la creación de archivos .pyc
ENV PYTHONDONTWRITEBYTECODE=1
# Asegura que la salida de logs se vea inmediatamente en la consola
ENV PYTHONUNBUFFERED=1

# Instalamos las dependencias del sistema necesarias (opcional, pero recomendado para Pillow)
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiamos el archivo de requerimientos
COPY requirements.txt /app/

# Instalamos las dependencias del proyecto
# Basado en tu archivo requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código del proyecto al contenedor
COPY . /app/

# Exponemos el puerto 8000 (el puerto por defecto de Django)
EXPOSE 8000

# Comando por defecto para ejecutar el servidor
# Nota: bind 0.0.0.0 es necesario para acceder desde fuera del contenedor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]