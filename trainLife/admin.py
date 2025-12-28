from django.contrib import admin
from .models import Usuario, Viaje, Ruta, Trayecto, Notificacion, Aviso


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
	list_display = ('nombreUsuario', 'apellido1', 'apellido2', 'email', 'numeroTelefono', 'color_mode', 'notificacionesViajes', 'notificacionesRutas', 'notificacionesAvisos')
	list_filter = ('color_mode', 'notificacionesViajes', 'notificacionesRutas', 'notificacionesAvisos')
	search_fields = ('nombreUsuario', 'apellido1', 'email')
	fieldsets = (
		('Información Personal', {
			'fields': ('nombreUsuario', 'apellido1', 'apellido2', 'email', 'numeroTelefono', 'contrasenia')
		}),
		('Accesibilidad', {
			'fields': ('color_mode',)
		}),
		('Preferencias de Notificaciones', {
			'fields': ('notificacionesViajes', 'notificacionesRutas', 'notificacionesAvisos')
		}),
	)

@admin.register(Viaje)
class ViajeAdmin(admin.ModelAdmin):
	list_display = ('usuario', 'nombrePasajero', 'origenEstacion', 'destinoEstacion', 'fechaViaje', 'horaSalidaOrigen', 'estadoViaje')
	list_filter = ('fechaViaje', 'estadoViaje')
	search_fields = ('usuario__nombreUsuario', 'nombrePasajero', 'origenEstacion', 'destinoEstacion')


class TrayectoInline(admin.TabularInline):
	model = Trayecto
	extra = 1
	fields = ('orden', 'estacionSalida', 'andenSalida', 'estacionLlegada', 'andenLlegada', 'horaSalida', 'horaLlegada', 'nombreLinea', 'colorLinea', 'imagenMapa')
	ordering = ['orden']


@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
	list_display = ('nombre', 'get_usuarios', 'fechaCreacion', 'numero_trayectos')
	list_filter = ('fechaCreacion',)
	search_fields = ('nombre', 'descripcion', 'usuarios__nombreUsuario')
	filter_horizontal = ('usuarios',)
	inlines = [TrayectoInline]
	
	def get_usuarios(self, obj):
		return ", ".join([u.nombreUsuario for u in obj.usuarios.all()])
	get_usuarios.short_description = 'Usuarios'
	
	def numero_trayectos(self, obj):
		return obj.trayectos.count()
	numero_trayectos.short_description = 'Nº Trayectos'


@admin.register(Trayecto)
class TrayectoAdmin(admin.ModelAdmin):
	list_display = ('ruta', 'orden', 'estacionSalida', 'estacionLlegada', 'nombreLinea', 'horaSalida', 'horaLlegada')
	list_filter = ('nombreLinea',)
	search_fields = ('estacionSalida', 'estacionLlegada', 'nombreLinea', 'ruta__nombre')
	ordering = ['ruta', 'orden']


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
	list_display = ('usuario', 'tipo', 'titulo', 'leida', 'importante', 'fechaCreacion')
	list_filter = ('tipo', 'leida', 'importante', 'fechaCreacion')
	search_fields = ('usuario__nombreUsuario', 'titulo', 'mensaje')
	readonly_fields = ('fechaCreacion', 'fechaLeida')
	ordering = ['-fechaCreacion']


@admin.register(Aviso)
class AvisoAdmin(admin.ModelAdmin):
	list_display = ('nombreAviso', 'fechaAviso', 'horaAviso', 'fechaCreacion')
	list_filter = ('fechaAviso',)
	search_fields = ('nombreAviso', 'informacion')
	ordering = ['-fechaAviso', '-horaAviso']
	fieldsets = (
		('Información del Aviso', {
			'fields': ('nombreAviso', 'fechaAviso', 'horaAviso', 'informacion')
		}),
		('Fechas de Control', {
			'fields': ('fechaCreacion',),
			'classes': ('collapse',)
		}),
	)
	readonly_fields = ('fechaCreacion',)
