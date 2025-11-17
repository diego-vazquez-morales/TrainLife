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

    class Meta:
        ordering = ['-fechaViaje', '-horaSalidaOrigen']
        verbose_name = 'Viaje'
        verbose_name_plural = 'Viajes'

    def __str__(self):
        return f"{self.origenEstacion} → {self.destinoEstacion} - {self.fechaViaje} ({self.nombrePasajero})"
    

