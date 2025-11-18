from django.db import models

# Create your models here.
class Usuario(models.Model):
    nombreUsuario = models.CharField(max_length=100)
    apellido1 = models.CharField(max_length=100)
    apellido2 = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)
    numeroTelefono = models.CharField(max_length=15, blank=True, null=True)
    contrasenia = models.CharField(max_length=100)

    def __str__(self):
        # Muestra un nombre legible en el admin y en representaciones
        return f"{self.nombreUsuario} {self.apellido1}"


class Viaje(models.Model):
    # Relación con usuario
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='viajes')
    
    # Información del pasajero
    nombrePasajero = models.CharField(max_length=200)
    
    # Información del billete
    coche = models.CharField(max_length=10)  # Ej: "04"
    asiento = models.CharField(max_length=10)  # Ej: "12A"
    clase = models.CharField(max_length=50, default="Turista")  # Ej: "Turista", "Preferente"
    
    # Origen
    origenEstacion = models.CharField(max_length=200)  # Ej: "Madrid - Puerta de Atocha"
    horaSalidaOrigen = models.TimeField()  # Ej: "14:30"
    andenOrigen = models.CharField(max_length=10)  # Ej: "12"
    
    # Destino final
    destinoEstacion = models.CharField(max_length=200)  # Ej: "Barcelona - Sants"
    horaLlegadaDestino = models.TimeField()  # Ej: "17:10"
    
    # Fechas
    fechaViaje = models.DateField()  # Fecha del viaje
    
    # Notificaciones
    notificacionesActivas = models.BooleanField(default=True)
    
    # Fecha de creación
    fechaCreacion = models.DateTimeField(auto_now_add=True)

    estadoViaje = models.CharField(max_length=50, default="confirmado")  # Ej: "Programado", "Completado", "Cancelado"

    class Meta:
        ordering = ['-fechaViaje', '-horaSalidaOrigen']
        verbose_name = 'Viaje'
        verbose_name_plural = 'Viajes'

    def __str__(self):
        return f"{self.origenEstacion} → {self.destinoEstacion} - {self.fechaViaje} ({self.nombrePasajero})"
    

class Ruta(models.Model):
    # Relación con usuario (opcional - puede ser null para rutas públicas sin asignar)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='rutas', null=True, blank=True)
    
    # Información de la ruta
    nombre = models.CharField(max_length=200)  # Nombre descriptivo de la ruta
    descripcion = models.TextField(blank=True, null=True)  # Descripción opcional
    
    # Fechas
    fechaCreacion = models.DateTimeField(auto_now_add=True)
    fechaActualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-fechaCreacion']
        verbose_name = 'Ruta'
        verbose_name_plural = 'Rutas'
    
    def __str__(self):
        if self.usuario:
            return f"{self.nombre} ({self.usuario.nombreUsuario})"
        return f"{self.nombre} (Sin asignar)"


class Trayecto(models.Model):
    # Relación con ruta
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, related_name='trayectos')
    
    # Información del trayecto
    orden = models.PositiveIntegerField(default=1)  # Orden del trayecto en la ruta
    
    # Estaciones
    estacionSalida = models.CharField(max_length=200)  # Ej: "Estación Central"
    andenSalida = models.CharField(max_length=10, blank=True, null=True)  # Ej: "3B"
    
    estacionLlegada = models.CharField(max_length=200)  # Ej: "Estación Intermedia"
    andenLlegada = models.CharField(max_length=10, blank=True, null=True)  # Ej: "1A"
    
    # Horarios
    horaSalida = models.TimeField()  # Hora de salida
    horaLlegada = models.TimeField()  # Hora de llegada
    
    # Línea de transporte
    nombreLinea = models.CharField(max_length=100)  # Ej: "Línea 1 (Roja)"
    colorLinea = models.CharField(max_length=50, blank=True, null=True)  # Ej: "Roja", "Azul"
    
    # Imagen del mapa del trayecto
    imagenMapa = models.ImageField(upload_to='trayectos/mapas/', blank=True, null=True)
    
    # Fechas
    fechaCreacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['ruta', 'orden']
        verbose_name = 'Trayecto'
        verbose_name_plural = 'Trayectos'
    
    def __str__(self):
        return f"{self.estacionSalida} → {self.estacionLlegada} ({self.nombreLinea})"
