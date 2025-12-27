"""
Script para crear viajes disponibles (sin usuario asignado) y una incidencia de ejemplo.
Ejecutar con: python crear_viajes_disponibles.py
"""
import os
import django
from datetime import datetime, date, time, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyecto.settings')
django.setup()

from trainLife.models import Usuario, Viaje

def crear_viajes_disponibles():
    """Crea viajes disponibles en la base de datos."""
    
    print("🚀 Creando viajes disponibles...")
    
    # Fecha de hoy y mañana
    hoy = date.today()
    manana = hoy + timedelta(days=1)
    
    # Lista de viajes disponibles a crear
    viajes_disponibles = [
        # Madrid - Barcelona (varios horarios) - ESPECÍFICOS PARA EL VIAJE CANCELADO
        # El viaje cancelado es AVE-2175 a las 9:30, creamos alternativas cercanas
        {
            'nombreTren': 'AVE-2180',
            'origenEstacion': 'Madrid - Atocha',
            'destinoEstacion': 'Barcelona - Sants',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(10, 30),
            'horaLlegadaDestino': time(13, 15),
            'clase': 'Turista',
            'precio': 45.50,
            'plazasDisponibles': 120,
            'coche': None,
            'asiento': None,
            'andenOrigen': '5'
        },
        {
            'nombreTren': 'AVE-2182',
            'origenEstacion': 'Madrid - Atocha',
            'destinoEstacion': 'Barcelona - Sants',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(12, 0),
            'horaLlegadaDestino': time(14, 45),
            'clase': 'Turista Plus',
            'precio': 65.00,
            'plazasDisponibles': 80,
            'coche': None,
            'asiento': None,
            'andenOrigen': '7'
        },
        {
            'nombreTren': 'AVE-2184',
            'origenEstacion': 'Madrid - Atocha',
            'destinoEstacion': 'Barcelona - Sants',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(14, 30),
            'horaLlegadaDestino': time(17, 15),
            'clase': 'Preferente',
            'precio': 95.00,
            'plazasDisponibles': 45,
            'coche': None,
            'asiento': None,
            'andenOrigen': '3'
        },
        {
            'nombreTren': 'AVE-2186',
            'origenEstacion': 'Madrid - Atocha',
            'destinoEstacion': 'Barcelona - Sants',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(16, 0),
            'horaLlegadaDestino': time(18, 45),
            'clase': 'Turista',
            'precio': 48.00,
            'plazasDisponibles': 95,
            'coche': None,
            'asiento': None,
            'andenOrigen': '6'
        },
        
        # Sevilla - Madrid
        {
            'nombreTren': 'AVE-3105',
            'origenEstacion': 'Sevilla - Santa Justa',
            'destinoEstacion': 'Madrid - Atocha',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(11, 0),
            'horaLlegadaDestino': time(13, 30),
            'clase': 'Turista',
            'precio': 42.00,
            'plazasDisponibles': 110,
            'coche': None,
            'asiento': None,
            'andenOrigen': '2'
        },
        {
            'nombreTren': 'AVE-3107',
            'origenEstacion': 'Sevilla - Santa Justa',
            'destinoEstacion': 'Madrid - Atocha',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(15, 30),
            'horaLlegadaDestino': time(18, 0),
            'clase': 'Turista Plus',
            'precio': 58.00,
            'plazasDisponibles': 75,
            'coche': None,
            'asiento': None,
            'andenOrigen': '4'
        },
        
        # Valencia - Barcelona
        {
            'nombreTren': 'EUROMED-1420',
            'origenEstacion': 'Valencia - Joaquín Sorolla',
            'destinoEstacion': 'Barcelona - Sants',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(13, 0),
            'horaLlegadaDestino': time(16, 0),
            'clase': 'Turista',
            'precio': 35.00,
            'plazasDisponibles': 150,
            'coche': None,
            'asiento': None,
            'andenOrigen': '1'
        },
        
        # Málaga - Madrid
        {
            'nombreTren': 'AVE-4210',
            'origenEstacion': 'Málaga - María Zambrano',
            'destinoEstacion': 'Madrid - Atocha',
            'fechaViaje': hoy,
            'horaSalidaOrigen': time(12, 15),
            'horaLlegadaDestino': time(14, 50),
            'clase': 'Turista',
            'precio': 52.00,
            'plazasDisponibles': 130,
            'coche': None,
            'asiento': None,
            'andenOrigen': '3'
        },
        
        # Viajes para mañana
        {
            'nombreTren': 'AVE-2188',
            'origenEstacion': 'Madrid - Atocha',
            'destinoEstacion': 'Barcelona - Sants',
            'fechaViaje': manana,
            'horaSalidaOrigen': time(9, 0),
            'horaLlegadaDestino': time(11, 45),
            'clase': 'Turista',
            'precio': 46.00,
            'plazasDisponibles': 115,
            'coche': None,
            'asiento': None,
            'andenOrigen': '8'
        },
        {
            'nombreTren': 'AVE-2190',
            'origenEstacion': 'Madrid - Atocha',
            'destinoEstacion': 'Barcelona - Sants',
            'fechaViaje': manana,
            'horaSalidaOrigen': time(11, 30),
            'horaLlegadaDestino': time(14, 15),
            'clase': 'Preferente',
            'precio': 98.00,
            'plazasDisponibles': 40,
            'coche': None,
            'asiento': None,
            'andenOrigen': '4'
        }
    ]
    
    # Crear los viajes
    viajes_creados = []
    for datos_viaje in viajes_disponibles:
        viaje = Viaje.objects.create(
            usuario=None,  # Sin usuario asignado
            nombrePasajero=None,
            **datos_viaje
        )
        viajes_creados.append(viaje)
        print(f"✅ Creado: {viaje.nombreTren} - {viaje.origenEstacion} → {viaje.destinoEstacion} ({viaje.horaSalidaOrigen.strftime('%H:%M')})")
    
    print(f"\n✅ Total: {len(viajes_creados)} viajes disponibles creados")
    return viajes_creados


def crear_incidencia_ejemplo():
    """Crea un usuario de prueba con un viaje cancelado."""
    
    print("\n🎫 Creando usuario y viaje cancelado de ejemplo...")
    
    # Buscar o crear usuario de prueba
    usuario, created = Usuario.objects.get_or_create(
        email='usuario.test@example.com',
        defaults={
            'nombreUsuario': 'Usuario',
            'apellido1': 'Test',
            'apellido2': 'Prueba',
            'contrasenia': 'test123',
            'numeroTelefono': '666777888',
            'notificacionesViajes': True,
            'notificacionesRutas': True,
            'notificacionesAvisos': True
        }
    )
    
    if created:
        print(f"✅ Usuario creado: {usuario.email}")
    else:
        print(f"ℹ️  Usuario existente: {usuario.email}")
    
    # Crear un viaje cancelado para este usuario
    hoy = date.today()
    viaje_cancelado = Viaje.objects.create(
        usuario=usuario,
        nombrePasajero=f"{usuario.nombreUsuario} {usuario.apellido1}",
        nombreTren='AVE-2175',
        origenEstacion='Madrid - Atocha',
        destinoEstacion='Barcelona - Sants',
        fechaViaje=hoy,
        horaSalidaOrigen=time(9, 30),
        horaLlegadaDestino=time(12, 15),
        clase='Turista',
        coche='5',
        asiento='12A',
        andenOrigen='4',
        estadoViaje='cancelado',  # ESTADO: cancelado
        precio=55.00,
        plazasDisponibles=0
    )
    print(f"✅ Viaje cancelado creado: {viaje_cancelado.nombreTren} (Estado: {viaje_cancelado.estadoViaje})")
    
    print(f"\n📧 Credenciales de prueba:")
    print(f"   Email: {usuario.email}")
    print(f"   Contraseña: test123")
    print(f"   Viaje cancelado ID: {viaje_cancelado.id}")
    
    return usuario, viaje_cancelado


if __name__ == '__main__':
    print("=" * 60)
    print("CREACIÓN DE VIAJES DISPONIBLES Y EJEMPLO DE VIAJE CANCELADO")
    print("=" * 60)
    
    # Crear viajes disponibles
    viajes = crear_viajes_disponibles()
    
    # Crear ejemplo de viaje cancelado
    usuario, viaje = crear_incidencia_ejemplo()
    
    print("\n" + "=" * 60)
    print("✅ PROCESO COMPLETADO")
    print("=" * 60)
    print(f"\n📊 Resumen:")
    print(f"   • {len(viajes)} viajes disponibles")
    print(f"   • 1 usuario de prueba: {usuario.email}")
    print(f"   • 1 viaje cancelado")
    print(f"\n💡 Próximo paso:")
    print(f"   1. Inicia sesión con: {usuario.email} / test123")
    print(f"   2. Ve a 'Mis Viajes'")
    print(f"   3. Verás el viaje cancelado")
    print(f"   4. Haz clic en 'Ver Alternativas' para ver los viajes disponibles")
    print()
