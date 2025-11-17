## APP (trainLife) URL Configuration

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.loginUsuario, name='login'),
    path('inicio/', views.inicioRedirect, name='inicio_redirect'),
    path('inicio/<int:usuario_id>/', views.inicioUsuario, name='inicio_usuario'),
    path('registro/', views.registroUsuario, name='registro_usuario'),
    
]