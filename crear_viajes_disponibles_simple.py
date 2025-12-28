"""
Script simple para crear viajes disponibles
"""
import os
import django
from datetime import date, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyecto.settings')
django.setup()

from trainLife.models import Viaje

# Limpiar viajes disponibles existentes
Viaje.objects.filter(usuario__isnull=True).delete()

# Crear viajes para Sevilla - Málaga (10/01/2026) - 6 horarios
viajes_sevilla_malaga = [
    {'horaSalida': time(9, 30), 'horaLlegada': time(11, 50), 'clase': 'Turista', 'anden': '2'},
    {'horaSalida': time(11, 0), 'horaLlegada': time(13, 20), 'clase': 'Turista Plus', 'anden': '3'},
    {'horaSalida': time(13, 30), 'horaLlegada': time(15, 50), 'clase': 'Turista', 'anden': '4'},
    {'horaSalida': time(15, 0), 'horaLlegada': time(17, 20), 'clase': 'Preferente', 'anden': '5'},
    {'horaSalida': time(17, 30), 'horaLlegada': time(19, 50), 'clase': 'Turista', 'anden': '6'},
    {'horaSalida': time(19, 0), 'horaLlegada': time(21, 20), 'clase': 'Turista Plus', 'anden': '7'},
]

for datos in viajes_sevilla_malaga:
    Viaje.objects.create(
        usuario=None,
        nombrePasajero=None,
        origenEstacion='Sevilla - Santa Justa',
        destinoEstacion='Málaga - María Zambrano',
        fechaViaje=date(2026, 1, 10),
        horaSalidaOrigen=datos['horaSalida'],
        horaLlegadaDestino=datos['horaLlegada'],
        clase=datos['clase'],
        andenOrigen=datos['anden'],
        estadoViaje='disponible'
    )
    print(f"✅ Creado viaje: Sevilla → Málaga, {datos['horaSalida']} - {datos['clase']}")

# Crear viajes para Barcelona - Valencia (05/01/2026) - 6 horarios
viajes_barcelona_valencia = [
    {'horaSalida': time(9, 0), 'horaLlegada': time(12, 15), 'clase': 'Turista', 'anden': '5'},
    {'horaSalida': time(11, 30), 'horaLlegada': time(14, 45), 'clase': 'Turista Plus', 'anden': '6'},
    {'horaSalida': time(13, 0), 'horaLlegada': time(16, 15), 'clase': 'Turista', 'anden': '7'},
    {'horaSalida': time(15, 30), 'horaLlegada': time(18, 45), 'clase': 'Preferente', 'anden': '8'},
    {'horaSalida': time(17, 0), 'horaLlegada': time(20, 15), 'clase': 'Turista Plus', 'anden': '9'},
    {'horaSalida': time(19, 30), 'horaLlegada': time(22, 45), 'clase': 'Turista', 'anden': '10'},
]

for datos in viajes_barcelona_valencia:
    Viaje.objects.create(
        usuario=None,
        nombrePasajero=None,
        origenEstacion='Barcelona - Sants',
        destinoEstacion='Valencia - Joaquín Sorolla',
        fechaViaje=date(2026, 1, 5),
        horaSalidaOrigen=datos['horaSalida'],
        horaLlegadaDestino=datos['horaLlegada'],
        clase=datos['clase'],
        andenOrigen=datos['anden'],
        estadoViaje='disponible'
    )
    print(f"✅ Creado viaje: Barcelona → Valencia, {datos['horaSalida']} - {datos['clase']}")

print("\n✅ Proceso completado: 12 viajes disponibles creados")
