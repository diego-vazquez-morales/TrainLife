from django.db import models
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from datetime import datetime, timedelta

# Create your models here.
class Usuario(models.Model):
    COLOR_MODE_CHOICES = [
        ('normal', 'Normal'),
        ('protanopia', 'Protanopia (Rojo-Verde)'),
        ('deuteranopia', 'Deuteranopia (Rojo-Verde)'),
        ('tritanopia', 'Tritanopia (Azul-Amarillo)'),
        ('high_contrast', 'Alto Contraste'),
    ]
    
    nombreUsuario = models.CharField(max_length=100)
    apellido1 = models.CharField(max_length=100)
    apellido2 = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)
    numeroTelefono = models.CharField(max_length=15, blank=True, null=True)
    contrasenia = models.CharField(max_length=100)
    
    # Preferencias de notificaciones
    notificacionesViajes = models.BooleanField(default=True)
    notificacionesRutas = models.BooleanField(default=True)
    notificacionesAvisos = models.BooleanField(default=True)
    
    # Preferencia de modo de color (accesibilidad)
    color_mode = models.CharField(
        max_length=20,
        choices=COLOR_MODE_CHOICES,
        default='normal',
        verbose_name='Modo de Color'
    )

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
    # Relación con usuarios (ManyToMany - múltiples usuarios pueden tener la misma ruta en favoritos)
    usuarios = models.ManyToManyField(Usuario, related_name='rutas', blank=True)
    
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
        if self.usuarios.exists():
            return f"{self.nombre} ({self.usuarios.count()} usuarios)"
        return f"{self.nombre} (Sin usuarios)"


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


class Notificacion(models.Model):
    TIPO_CHOICES = [
        ('cambio_viaje', 'Cambio en Viaje'),
        ('nuevo_viaje', 'Nuevo Viaje'),
        ('cancelacion', 'Cancelación'),
        ('recordatorio', 'Recordatorio'),
        ('cambio_anden', 'Cambio de Andén'),
        ('cambio_hora', 'Cambio de Hora'),
        ('cambio_ruta', 'Cambio en Ruta'),
        ('aviso_general', 'Aviso General'),
        ('alerta', 'Alerta'),
        ('info', 'Información'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='info')
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE, null=True, blank=True, related_name='notificaciones')
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, null=True, blank=True, related_name='notificaciones')
    aviso = models.ForeignKey('Aviso', on_delete=models.CASCADE, null=True, blank=True, related_name='notificaciones')
    
    # Estado
    leida = models.BooleanField(default=False)
    importante = models.BooleanField(default=False)
    
    # Fechas
    fechaCreacion = models.DateTimeField(auto_now_add=True)
    fechaLeida = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-fechaCreacion']
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
    
    def __str__(self):
        return f"{self.tipo} - {self.titulo} ({self.usuario.nombreUsuario})"
    
    def marcar_como_leida(self):
        if not self.leida:
            self.leida = True
            self.fechaLeida = datetime.now()
            self.save()


class Aviso(models.Model):
    """
    Modelo para avisos generales del sistema que se envían a todos los usuarios
    o a usuarios específicos.
    """
    nombreAviso = models.CharField(max_length=200)
    fechaAviso = models.DateField()
    horaAviso = models.TimeField()
    informacion = models.TextField()
    
    # Fechas de control
    fechaCreacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-fechaAviso', '-horaAviso']
        verbose_name = 'Aviso'
        verbose_name_plural = 'Avisos'
    
    def __str__(self):
        return f"{self.nombreAviso} - {self.fechaAviso.strftime('%d/%m/%Y')} {self.horaAviso.strftime('%H:%M')}"


# ===== SIGNALS PARA DETECTAR CAMBIOS Y CREAR NOTIFICACIONES =====

@receiver(post_save, sender=Viaje)
def notificar_viaje_guardado(sender, instance, created, **kwargs):
    """
    Crea notificación cuando se crea o modifica un viaje.
    Solo si el usuario tiene notificaciones de viajes activas.
    """
    if not instance.usuario.notificacionesViajes:
        return
    
    if created:
        # Nuevo viaje creado
        Notificacion.objects.create(
            usuario=instance.usuario,
            tipo='nuevo_viaje',
            titulo='Nuevo viaje añadido',
            mensaje=f'Se ha añadido un nuevo viaje: {instance.origenEstacion} → {instance.destinoEstacion} el {instance.fechaViaje.strftime("%d/%m/%Y")} a las {instance.horaSalidaOrigen.strftime("%H:%M")}',
            viaje=instance,
            importante=False
        )
    else:
        # Viaje modificado - solo crear notificación si hay cambios significativos
        # (esto se maneja mejor con pre_save, ver abajo)
        pass


# Variable global para almacenar el estado previo del viaje
_viaje_previo = {}

@receiver(pre_save, sender=Viaje)
def detectar_cambios_viaje(sender, instance, **kwargs):
    """
    Detecta cambios en campos importantes del viaje antes de guardar.
    """
    if not instance.pk:  # Es un nuevo viaje, no hay estado previo
        return
    
    try:
        viaje_antiguo = Viaje.objects.get(pk=instance.pk)
        
        # Guardar estado previo para usar en post_save
        _viaje_previo[instance.pk] = {
            'fechaViaje': viaje_antiguo.fechaViaje,
            'horaSalidaOrigen': viaje_antiguo.horaSalidaOrigen,
            'horaLlegadaDestino': viaje_antiguo.horaLlegadaDestino,
            'andenOrigen': viaje_antiguo.andenOrigen,
            'estadoViaje': viaje_antiguo.estadoViaje,
            'coche': viaje_antiguo.coche,
            'asiento': viaje_antiguo.asiento,
        }
    except Viaje.DoesNotExist:
        pass


@receiver(post_save, sender=Viaje)
def notificar_cambios_viaje(sender, instance, created, **kwargs):
    """
    Crea notificaciones específicas basadas en los cambios detectados.
    """
    if created or not instance.usuario.notificacionesViajes:
        return
    
    if instance.pk not in _viaje_previo:
        return
    
    viaje_antiguo = _viaje_previo[instance.pk]
    notificaciones_creadas = []
    
    # Detectar cambio de andén
    if viaje_antiguo['andenOrigen'] != instance.andenOrigen:
        Notificacion.objects.create(
            usuario=instance.usuario,
            tipo='cambio_anden',
            titulo='Cambio de andén',
            mensaje=f'El andén de salida de tu viaje {instance.origenEstacion} → {instance.destinoEstacion} ha cambiado de "{viaje_antiguo["andenOrigen"]}" a "{instance.andenOrigen}"',
            viaje=instance,
            importante=True
        )
        notificaciones_creadas.append('andén')
    
    # Detectar cambio de hora de salida
    if viaje_antiguo['horaSalidaOrigen'] != instance.horaSalidaOrigen:
        Notificacion.objects.create(
            usuario=instance.usuario,
            tipo='cambio_hora',
            titulo='Cambio de hora de salida',
            mensaje=f'La hora de salida de tu viaje {instance.origenEstacion} → {instance.destinoEstacion} ha cambiado de {viaje_antiguo["horaSalidaOrigen"].strftime("%H:%M")} a {instance.horaSalidaOrigen.strftime("%H:%M")}',
            viaje=instance,
            importante=True
        )
        notificaciones_creadas.append('hora salida')
    
    # Detectar cambio de hora de llegada
    if viaje_antiguo['horaLlegadaDestino'] != instance.horaLlegadaDestino:
        Notificacion.objects.create(
            usuario=instance.usuario,
            tipo='cambio_hora',
            titulo='Cambio de hora de llegada',
            mensaje=f'La hora de llegada de tu viaje {instance.origenEstacion} → {instance.destinoEstacion} ha cambiado de {viaje_antiguo["horaLlegadaDestino"].strftime("%H:%M")} a {instance.horaLlegadaDestino.strftime("%H:%M")}',
            viaje=instance,
            importante=True
        )
        notificaciones_creadas.append('hora llegada')
    
    # Detectar cambio de fecha
    if viaje_antiguo['fechaViaje'] != instance.fechaViaje:
        Notificacion.objects.create(
            usuario=instance.usuario,
            tipo='cambio_viaje',
            titulo='Cambio de fecha del viaje',
            mensaje=f'La fecha de tu viaje {instance.origenEstacion} → {instance.destinoEstacion} ha cambiado de {viaje_antiguo["fechaViaje"].strftime("%d/%m/%Y")} a {instance.fechaViaje.strftime("%d/%m/%Y")}',
            viaje=instance,
            importante=True
        )
        notificaciones_creadas.append('fecha')
    
    # Detectar cambios de estado del viaje
    if viaje_antiguo['estadoViaje'] != instance.estadoViaje:
        estado_anterior = viaje_antiguo['estadoViaje']
        estado_nuevo = instance.estadoViaje
        
        # Cancelación
        if estado_nuevo.lower() == 'cancelado':
            Notificacion.objects.create(
                usuario=instance.usuario,
                tipo='cancelacion',
                titulo='Viaje cancelado',
                mensaje=f'Tu viaje {instance.origenEstacion} → {instance.destinoEstacion} del {instance.fechaViaje.strftime("%d/%m/%Y")} ha sido cancelado',
                viaje=instance,
                importante=True
            )
            notificaciones_creadas.append('cancelación')
        
        # Confirmación
        elif estado_nuevo.lower() == 'confirmado':
            Notificacion.objects.create(
                usuario=instance.usuario,
                tipo='nuevo_viaje',
                titulo='Viaje confirmado',
                mensaje=f'Tu viaje {instance.origenEstacion} → {instance.destinoEstacion} del {instance.fechaViaje.strftime("%d/%m/%Y")} ha sido confirmado',
                viaje=instance,
                importante=True
            )
            notificaciones_creadas.append('confirmación')
        
        # Retraso
        elif estado_nuevo.lower() == 'retrasado':
            Notificacion.objects.create(
                usuario=instance.usuario,
                tipo='alerta',
                titulo='Viaje retrasado',
                mensaje=f'Tu viaje {instance.origenEstacion} → {instance.destinoEstacion} del {instance.fechaViaje.strftime("%d/%m/%Y")} ha sido retrasado',
                viaje=instance,
                importante=True
            )
            notificaciones_creadas.append('retraso')
        
        # En curso
        elif estado_nuevo.lower() == 'en curso':
            Notificacion.objects.create(
                usuario=instance.usuario,
                tipo='info',
                titulo='Viaje en curso',
                mensaje=f'Tu viaje {instance.origenEstacion} → {instance.destinoEstacion} está ahora en curso',
                viaje=instance,
                importante=False
            )
            notificaciones_creadas.append('en_curso')
        
        # Completado
        elif estado_nuevo.lower() == 'completado':
            Notificacion.objects.create(
                usuario=instance.usuario,
                tipo='nuevo_viaje',
                titulo='Viaje completado',
                mensaje=f'Tu viaje {instance.origenEstacion} → {instance.destinoEstacion} del {instance.fechaViaje.strftime("%d/%m/%Y")} ha sido completado',
                viaje=instance,
                importante=False
            )
            notificaciones_creadas.append('completado')
        
        # Programado (cuando vuelve a ser programado desde otro estado)
        elif estado_nuevo.lower() == 'programado':
            Notificacion.objects.create(
                usuario=instance.usuario,
                tipo='info',
                titulo='Viaje reprogramado',
                mensaje=f'Tu viaje {instance.origenEstacion} → {instance.destinoEstacion} del {instance.fechaViaje.strftime("%d/%m/%Y")} ha sido reprogramado',
                viaje=instance,
                importante=True
            )
            notificaciones_creadas.append('reprogramado')
        
        # Cualquier otro cambio de estado
        else:
            Notificacion.objects.create(
                usuario=instance.usuario,
                tipo='cambio_viaje',
                titulo='Cambio de estado del viaje',
                mensaje=f'El estado de tu viaje {instance.origenEstacion} → {instance.destinoEstacion} ha cambiado de "{estado_anterior}" a "{estado_nuevo}"',
                viaje=instance,
                importante=True
            )
            notificaciones_creadas.append('estado')
    
    # Detectar cambio de asiento
    if viaje_antiguo['asiento'] != instance.asiento:
        Notificacion.objects.create(
            usuario=instance.usuario,
            tipo='cambio_viaje',
            titulo='Cambio de asiento',
            mensaje=f'Tu asiento ha cambiado de {viaje_antiguo["asiento"]} a {instance.asiento} para el viaje {instance.origenEstacion} → {instance.destinoEstacion}',
            viaje=instance,
            importante=False
        )
        notificaciones_creadas.append('asiento')
    
    # Detectar cambio de coche
    if viaje_antiguo['coche'] != instance.coche:
        Notificacion.objects.create(
            usuario=instance.usuario,
            tipo='cambio_viaje',
            titulo='Cambio de coche',
            mensaje=f'Tu coche ha cambiado de {viaje_antiguo["coche"]} a {instance.coche} para el viaje {instance.origenEstacion} → {instance.destinoEstacion}',
            viaje=instance,
            importante=False
        )
        notificaciones_creadas.append('coche')
    
    # Limpiar el estado previo
    if instance.pk in _viaje_previo:
        del _viaje_previo[instance.pk]


# ===== SIGNALS PARA DETECTAR CAMBIOS EN RUTAS Y TRAYECTOS =====

# Variable global para almacenar el estado previo de trayectos
_trayecto_previo = {}

@receiver(pre_save, sender=Trayecto)
def detectar_cambios_trayecto(sender, instance, **kwargs):
    """
    Detecta cambios en campos importantes del trayecto antes de guardar.
    """
    if not instance.pk:  # Es un nuevo trayecto, no hay estado previo
        return
    
    try:
        trayecto_antiguo = Trayecto.objects.get(pk=instance.pk)
        
        # Guardar estado previo para usar en post_save
        _trayecto_previo[instance.pk] = {
            'estacionSalida': trayecto_antiguo.estacionSalida,
            'estacionLlegada': trayecto_antiguo.estacionLlegada,
            'andenSalida': trayecto_antiguo.andenSalida,
            'andenLlegada': trayecto_antiguo.andenLlegada,
            'horaSalida': trayecto_antiguo.horaSalida,
            'horaLlegada': trayecto_antiguo.horaLlegada,
            'nombreLinea': trayecto_antiguo.nombreLinea,
        }
    except Trayecto.DoesNotExist:
        pass


@receiver(post_save, sender=Trayecto)
def notificar_cambios_trayecto(sender, instance, created, **kwargs):
    """
    Crea notificaciones cuando se modifica un trayecto de una ruta.
    Notifica a todos los usuarios que tienen la ruta en sus favoritos.
    """
    # Si es un nuevo trayecto, no generar notificaciones de cambio
    if created:
        return
    
    if instance.pk not in _trayecto_previo:
        return
    
    # Obtener todos los usuarios que tienen esta ruta
    usuarios_ruta = instance.ruta.usuarios.filter(notificacionesRutas=True)
    if not usuarios_ruta.exists():
        return
    
    trayecto_antiguo = _trayecto_previo[instance.pk]
    
    # Detectar cambio de andén de salida
    if trayecto_antiguo['andenSalida'] != instance.andenSalida:
        for usuario in usuarios_ruta:
            Notificacion.objects.create(
                usuario=usuario,
                tipo='cambio_ruta',
                titulo=f'Cambio de andén en ruta "{instance.ruta.nombre}"',
                mensaje=f'El andén de salida en {instance.estacionSalida} ha cambiado de "{trayecto_antiguo["andenSalida"]}" a "{instance.andenSalida}"',
                ruta=instance.ruta,
                importante=True
            )
    
    # Detectar cambio de andén de llegada
    if trayecto_antiguo['andenLlegada'] != instance.andenLlegada:
        for usuario in usuarios_ruta:
            Notificacion.objects.create(
                usuario=usuario,
                tipo='cambio_ruta',
                titulo=f'Cambio de andén en ruta "{instance.ruta.nombre}"',
                mensaje=f'El andén de llegada en {instance.estacionLlegada} ha cambiado de "{trayecto_antiguo["andenLlegada"]}" a "{instance.andenLlegada}"',
                ruta=instance.ruta,
                importante=True
            )
    
    # Detectar cambio de hora de salida
    if trayecto_antiguo['horaSalida'] != instance.horaSalida:
        for usuario in usuarios_ruta:
            Notificacion.objects.create(
                usuario=usuario,
                tipo='cambio_ruta',
                titulo=f'Cambio de hora en ruta "{instance.ruta.nombre}"',
                mensaje=f'La hora de salida desde {instance.estacionSalida} ha cambiado de {trayecto_antiguo["horaSalida"].strftime("%H:%M")} a {instance.horaSalida.strftime("%H:%M")}',
                ruta=instance.ruta,
                importante=True
            )
    
    # Detectar cambio de hora de llegada
    if trayecto_antiguo['horaLlegada'] != instance.horaLlegada:
        for usuario in usuarios_ruta:
            Notificacion.objects.create(
                usuario=usuario,
                tipo='cambio_ruta',
                titulo=f'Cambio de hora en ruta "{instance.ruta.nombre}"',
                mensaje=f'La hora de llegada a {instance.estacionLlegada} ha cambiado de {trayecto_antiguo["horaLlegada"].strftime("%H:%M")} a {instance.horaLlegada.strftime("%H:%M")}',
                ruta=instance.ruta,
                importante=True
            )
    
    # Detectar cambio de estaciones
    if trayecto_antiguo['estacionSalida'] != instance.estacionSalida or trayecto_antiguo['estacionLlegada'] != instance.estacionLlegada:
        for usuario in usuarios_ruta:
            Notificacion.objects.create(
                usuario=usuario,
                tipo='cambio_ruta',
                titulo=f'Cambio de estaciones en ruta "{instance.ruta.nombre}"',
                mensaje=f'El trayecto ha cambiado de "{trayecto_antiguo["estacionSalida"]} → {trayecto_antiguo["estacionLlegada"]}" a "{instance.estacionSalida} → {instance.estacionLlegada}"',
                ruta=instance.ruta,
                importante=True
            )
    
    # Detectar cambio de línea
    if trayecto_antiguo['nombreLinea'] != instance.nombreLinea:
        for usuario in usuarios_ruta:
            Notificacion.objects.create(
                usuario=usuario,
                tipo='cambio_ruta',
                titulo=f'Cambio de línea en ruta "{instance.ruta.nombre}"',
                mensaje=f'La línea del trayecto {instance.estacionSalida} → {instance.estacionLlegada} ha cambiado de "{trayecto_antiguo["nombreLinea"]}" a "{instance.nombreLinea}"',
                ruta=instance.ruta,
                importante=False
            )
    
    # Limpiar el estado previo
    if instance.pk in _trayecto_previo:
        del _trayecto_previo[instance.pk]


@receiver(post_save, sender=Trayecto)
def notificar_nuevo_trayecto(sender, instance, created, **kwargs):
    """
    Crea notificación cuando se añade un nuevo trayecto a una ruta.
    Notifica a todos los usuarios que tienen la ruta en sus favoritos.
    """
    if not created:
        return
    
    # Obtener todos los usuarios que tienen esta ruta
    usuarios_ruta = instance.ruta.usuarios.filter(notificacionesRutas=True)
    
    for usuario in usuarios_ruta:
        Notificacion.objects.create(
            usuario=usuario,
            tipo='cambio_ruta',
            titulo=f'Nuevo trayecto en ruta "{instance.ruta.nombre}"',
            mensaje=f'Se ha añadido un nuevo trayecto: {instance.estacionSalida} → {instance.estacionLlegada} ({instance.nombreLinea})',
            ruta=instance.ruta,
            importante=False
        )



@receiver(post_save, sender=Aviso)
def notificar_nuevo_aviso(sender, instance, created, **kwargs):
    """
    Crea notificaciones para todos los usuarios que tengan activadas
    las notificaciones de avisos generales cuando se crea un nuevo aviso.
    """
    if created:
        # Obtener todos los usuarios con notificaciones de avisos activas
        usuarios_con_notificaciones = Usuario.objects.filter(notificacionesAvisos=True)
        
        # Crear una notificación para cada usuario
        notificaciones_a_crear = []
        for usuario in usuarios_con_notificaciones:
            notificaciones_a_crear.append(
                Notificacion(
                    usuario=usuario,
                    tipo='aviso_general',
                    titulo=instance.nombreAviso,
                    mensaje=instance.informacion,
                    aviso=instance,
                    importante=True
                )
            )
        
        # Crear todas las notificaciones en una sola operación (más eficiente)
        if notificaciones_a_crear:
            Notificacion.objects.bulk_create(notificaciones_a_crear)

