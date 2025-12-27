"""
Script para crear viajes alternativos para el viaje cancelado ID 6
Madrid - Chamartín -> Alicante - Terminal, 30 de junio de 2026, 18:45
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyecto.settings')
django.setup()

from trainLife.models import Viaje
from datetime import date, time
from decimal import Decimal

# Eliminar viajes antiguos disponibles de Madrid-Barcelona
print("Eliminando viajes disponibles antiguos...")
viajes_antiguos = Viaje.objects.filter(usuario__isnull=True)
count_eliminados = viajes_antiguos.count()
viajes_antiguos.delete()
print(f"Eliminados: {count_eliminados} viajes")

# Obtener el viaje cancelado
viaje_cancelado = Viaje.objects.get(id=6)
print(f"\nViaje cancelado: {viaje_cancelado.origenEstacion} -> {viaje_cancelado.destinoEstacion}")
print(f"Fecha: {viaje_cancelado.fechaViaje}, Hora: {viaje_cancelado.horaSalidaOrigen}")

# Crear viajes alternativos Madrid - Chamartín -> Alicante - Terminal
# Misma fecha (30 de junio de 2026), diferentes horarios
viajes_alternativos = [
    {
        'nombreTren': 'ALVIA-4220',
        'horaSalida': time(17, 30),
        'horaLlegada': time(21, 15),
        'clase': 'Turista Plus',
        'precio': Decimal('52.50'),
        'plazas': 85
    },
    {
        'nombreTren': 'ALVIA-4222',
        'horaSalida': time(19, 15),
        'horaLlegada': time(23, 0),
        'clase': 'Turista',
        'precio': Decimal('45.00'),
        'plazas': 120
    },
    {
        'nombreTren': 'ALVIA-4224',
        'horaSalida': time(20, 30),
        'horaLlegada': time(0, 15),
        'clase': 'Preferente',
        'precio': Decimal('68.00'),
        'plazas': 60
    },
    {
        'nombreTren': 'ALVIA-4226',
        'horaSalida': time(21, 45),
        'horaLlegada': time(1, 30),
        'clase': 'Turista Plus',
        'precio': Decimal('55.00'),
        'plazas': 95
    },
]

# Crear los viajes alternativos en la BD
print("\nCreando viajes alternativos...")
for idx, alt in enumerate(viajes_alternativos, 1):
    viaje = Viaje.objects.create(
        usuario=None,  # Viaje disponible sin usuario asignado
        nombrePasajero=None,
        coche=None,
        asiento=None,
        clase=alt['clase'],
        origenEstacion='Madrid - Chamartín Clara Campoamor',
        horaSalidaOrigen=alt['horaSalida'],
        andenOrigen=None,
        destinoEstacion='Alicante - Terminal',
        horaLlegadaDestino=alt['horaLlegada'],
        fechaViaje=date(2026, 6, 30),
        estadoViaje='confirmado',
        nombreTren=alt['nombreTren'],
        precio=alt['precio'],
        plazasDisponibles=alt['plazas']
    )
    print(f"{idx}. Creado: {viaje.nombreTren} - {viaje.horaSalidaOrigen} ({viaje.clase}) - €{viaje.precio} - {viaje.plazasDisponibles} plazas")

print(f"\n✅ Total viajes alternativos creados: {len(viajes_alternativos)}")
print(f"📍 Ruta: Madrid - Chamartín Clara Campoamor -> Alicante - Terminal")
print(f"📅 Fecha: 30 de junio de 2026")
print(f"🎫 Todos disponibles para asignar a usuarios")
