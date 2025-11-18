from django.contrib import admin
from .models import Usuario, Viaje, Ruta, Trayecto


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
	list_display = ('nombreUsuario', 'apellido1', 'apellido2', 'email', 'numeroTelefono')
	search_fields = ('nombreUsuario', 'apellido1', 'email')

@admin.register(Viaje)
class ViajeAdmin(admin.ModelAdmin):
	list_display = ('usuario', 'nombrePasajero', 'origenEstacion', 'destinoEstacion', 'fechaViaje', 'horaSalidaOrigen', 'estadoViaje', 'notificacionesActivas')
	list_filter = ('fechaViaje', 'estadoViaje', 'notificacionesActivas')
	search_fields = ('usuario__nombreUsuario', 'nombrePasajero', 'origenEstacion', 'destinoEstacion')


class TrayectoInline(admin.TabularInline):
	model = Trayecto
	extra = 1
	fields = ('orden', 'estacionSalida', 'andenSalida', 'estacionLlegada', 'andenLlegada', 'horaSalida', 'horaLlegada', 'nombreLinea', 'colorLinea', 'imagenMapa')
	ordering = ['orden']


@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
	list_display = ('nombre', 'usuario', 'fechaCreacion', 'numero_trayectos')
	list_filter = ('fechaCreacion', 'usuario')
	search_fields = ('nombre', 'descripcion', 'usuario__nombreUsuario')
	inlines = [TrayectoInline]
	
	def numero_trayectos(self, obj):
		return obj.trayectos.count()
	numero_trayectos.short_description = 'Nº Trayectos'


@admin.register(Trayecto)
class TrayectoAdmin(admin.ModelAdmin):
	list_display = ('ruta', 'orden', 'estacionSalida', 'estacionLlegada', 'nombreLinea', 'horaSalida', 'horaLlegada')
	list_filter = ('nombreLinea', 'ruta__usuario')
	search_fields = ('estacionSalida', 'estacionLlegada', 'nombreLinea', 'ruta__nombre')
	ordering = ['ruta', 'orden']
