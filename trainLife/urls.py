## APP (trainLife) URL Configuration

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('loginUsuario/', views.loginUsuario, name='login_usuario'),
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
]