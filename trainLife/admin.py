from django.contrib import admin
from .models import Usuario, Viaje, Ruta, RutaFavorita, Trayecto


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
	fields = ('orden', 'estacionSalida', 'andenSalida', 'estacionLlegada', 'andenLlegada', 'horaSalida', 'horaLlegada', 'nombreLinea', 'colorLinea', 'imagenMapa', 'numeroTransbordos')
	ordering = ['orden']


@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
	list_display = ('nombre', 'usuario', 'esPublica', 'fechaCreacion', 'numero_trayectos', 'numero_favoritos')
	list_filter = ('esPublica', 'fechaCreacion', 'usuario')
	search_fields = ('nombre', 'descripcion', 'usuario__nombreUsuario')
	inlines = [TrayectoInline]
	
	def numero_trayectos(self, obj):
		return obj.trayectos.count()
	numero_trayectos.short_description = 'Nº Trayectos'
	
	def numero_favoritos(self, obj):
		return obj.favoritos.count()
	numero_favoritos.short_description = 'Nº Favoritos'


@admin.register(RutaFavorita)
class RutaFavoritaAdmin(admin.ModelAdmin):
	list_display = ('usuario', 'ruta', 'fechaAgregado')
	list_filter = ('fechaAgregado', 'usuario', 'ruta')
	search_fields = ('usuario__nombreUsuario', 'ruta__nombre')
	date_hierarchy = 'fechaAgregado'


@admin.register(Trayecto)
class TrayectoAdmin(admin.ModelAdmin):
	list_display = ('ruta', 'orden', 'estacionSalida', 'estacionLlegada', 'nombreLinea', 'horaSalida', 'horaLlegada', 'numeroTransbordos')
	list_filter = ('nombreLinea', 'ruta__usuario', 'numeroTransbordos')
	search_fields = ('estacionSalida', 'estacionLlegada', 'nombreLinea', 'ruta__nombre')
	ordering = ['ruta', 'orden']
