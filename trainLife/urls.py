## APP (trainLife) URL Configuration

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('inicio/', views.inicioRedirect, name='inicio_redirect'),
    path('inicio/<int:usuario_id>/', views.inicioUsuario, name='inicio_usuario'),
    path('registro/', views.registroUsuario, name='registro_usuario'),
    path('viajes/<int:usuario_id>/', views.viajesUsuario, name='viajes_usuario'),
    path('misViajes/<int:usuario_id>/', views.misViajes, name='mis_viajes'),
    path('salir/<int:usuario_id>/', views.salir, name='salir'),
    path('viajesDetalles/<int:usuario_id>/<int:viaje_id>/', views.verDetallesViaje, name='detalles_viaje'),
    path('buscarRutas/<int:usuario_id>/', views.buscarRutas, name='buscar_rutas'),
    path('misRutas/<int:usuario_id>/', views.misRutas, name='mis_rutas'),
    path('agregarRutaFavorito/<int:usuario_id>/<int:ruta_id>/', views.agregarRutaFavorito, name='agregar_ruta_favorito'),
    path('eliminarRutaFavorito/<int:usuario_id>/<int:ruta_id>/', views.eliminarRutaFavorito, name='eliminar_ruta_favorito'),
    path('crearUsuario/', views.crearUsuario, name='crear_usuario'),
    path('api/buscarRutas/<int:usuario_id>/', views.api_buscar_rutas, name='api_buscar_rutas'),
    path('comprarViaje/<int:usuario_id>/', views.comprarViaje, name='comprar_viaje'),
    
    # Notificaciones
    path('notificaciones/<int:usuario_id>/', views.notificaciones, name='notificaciones'),
    path('api/notificaciones/<int:usuario_id>/', views.api_notificaciones, name='api_notificaciones'),
    path('notificaciones/<int:usuario_id>/marcar/<int:notificacion_id>/', views.marcar_notificacion_leida, name='marcar_notificacion_leida'),
    path('notificaciones/<int:usuario_id>/marcar-todas/', views.marcar_todas_leidas, name='marcar_todas_leidas'),

    # configuración
    path('configuracion/<int:usuario_id>/', views.configuracion, name='configuracion'),
    
    # Recuperación de contraseña
    path('recuperar-contrasenia/', views.recuperarContrasenia, name='recuperar_contrasenia'),
    path('api/verificar-email/', views.api_verificar_email, name='api_verificar_email'),
    
    # Sistema de alternativas (incidencias y viajes disponibles)
    path('api/incidencias/viaje/<int:usuario_id>/<int:viaje_id>/', views.api_incidencias_viaje, name='api_incidencias_viaje'),
    path('api/alternativa/aplicar/<int:usuario_id>/<int:viaje_alternativo_id>/<int:viaje_cancelado_id>/', views.api_aplicar_alternativa, name='api_aplicar_alternativa'),
    path('alternativas/viaje/<int:usuario_id>/<int:viaje_id>/', views.ver_alternativas_viaje, name='ver_alternativas_viaje'),
    path('api/incidencias/ruta/<int:usuario_id>/<int:ruta_id>/', views.api_incidencias_ruta, name='api_incidencias_ruta'),
    
    # Comprar viajes (viajes disponibles)
    path('api/viajes-disponibles/<int:usuario_id>/', views.api_viajes_disponibles, name='api_viajes_disponibles'),
    path('api/comprar-viaje/<int:usuario_id>/<int:viaje_id>/', views.api_comprar_viaje, name='api_comprar_viaje'),
    
]