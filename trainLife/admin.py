from django.contrib import admin
from .models import Usuario, Viaje


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
	list_display = ('nombreUsuario', 'apellido1', 'apellido2', 'email', 'numeroTelefono')
	search_fields = ('nombreUsuario', 'apellido1', 'email')

@admin.register(Viaje)
class ViajeAdmin(admin.ModelAdmin):
	list_display = ('usuario', 'nombrePasajero', 'origenEstacion', 'destinoEstacion', 'fechaViaje', 'horaSalidaOrigen', 'notificacionesActivas')
	list_filter = ('fechaViaje', 'notificacionesActivas')
	search_fields = ('usuario__nombreUsuario', 'nombrePasajero', 'origenEstacion', 'destinoEstacion')

