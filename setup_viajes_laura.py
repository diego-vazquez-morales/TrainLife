"""
Script para crear viajes del usuario Laura con alternativas
Crea 5 viajes, 1 cancelado y 1 retrasado, cada uno con 5 alternativas disponibles
"""
import os
import django
from datetime import date, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyecto.settings')
django.setup()

from trainLife.models import Usuario, Viaje

# Obtener usuario Laura
try:
    laura = Usuario.objects.get(email='Laura1234@gmail.com')
    print(f"✓ Usuario encontrado: {laura.nombreUsuario}")
except Usuario.DoesNotExist:
    print("✗ Error: Usuario Laura no encontrado")
    exit(1)

# Eliminar viajes anteriores de Laura
print("\n🗑️  Eliminando viajes anteriores de Laura...")
viajes_eliminados = Viaje.objects.filter(usuario=laura).delete()[0]
print(f"   Eliminados: {viajes_eliminados} viajes")

# Eliminar viajes disponibles (sin usuario)
print("🗑️  Eliminando viajes disponibles anteriores...")
disponibles_eliminados = Viaje.objects.filter(usuario__isnull=True).delete()[0]
print(f"   Eliminados: {disponibles_eliminados} viajes disponibles")

print("\n" + "="*60)
print("📝 CREANDO VIAJES PARA LAURA")
print("="*60)

# === VIAJE 1: NORMAL (Confirmado) ===
viaje1 = Viaje.objects.create(
    usuario=laura,
    nombrePasajero='Laura García',
    coche='03',
    asiento='15A',
    clase='Turista',
    origenEstacion='Barcelona - Sants',
    horaSalidaOrigen=time(9, 30),
    andenOrigen='6',
    destinoEstacion='Valencia - Joaquín Sorolla',
    horaLlegadaDestino=time(12, 45),
    fechaViaje=date(2026, 3, 15),
    estadoViaje='confirmado'
)
print(f"\n✅ Viaje 1 (Confirmado): {viaje1.origenEstacion} → {viaje1.destinoEstacion}")
print(f"   Fecha: {viaje1.fechaViaje} | Salida: {viaje1.horaSalidaOrigen}")

# === VIAJE 2: CANCELADO (con alternativas) ===
viaje2 = Viaje.objects.create(
    usuario=laura,
    nombrePasajero='Laura García',
    coche='05',
    asiento='22B',
    clase='Preferente',
    origenEstacion='Madrid - Puerta de Atocha',
    horaSalidaOrigen=time(16, 30),
    andenOrigen='11',
    destinoEstacion='Málaga - María Zambrano',
    horaLlegadaDestino=time(19, 15),
    fechaViaje=date(2026, 3, 20),
    estadoViaje='cancelado'
)
print(f"\n🚫 Viaje 2 (CANCELADO): {viaje2.origenEstacion} → {viaje2.destinoEstacion}")
print(f"   Fecha: {viaje2.fechaViaje} | Salida original: {viaje2.horaSalidaOrigen}")

# Crear 5 alternativas para el viaje cancelado
print("\n   📋 Creando 5 alternativas para el viaje cancelado:")
alternativas_cancelado = [
    {'hora_salida': time(14, 30), 'hora_llegada': time(17, 15), 'clase': 'Turista', 'coche': '02', 'asiento': '10A', 'anden': '8'},
    {'hora_salida': time(15, 45), 'hora_llegada': time(18, 30), 'clase': 'Turista Plus', 'coche': '04', 'asiento': '15C', 'anden': '9'},
    {'hora_salida': time(17, 15), 'hora_llegada': time(20, 0), 'clase': 'Preferente', 'coche': '01', 'asiento': '5B', 'anden': '10'},
    {'hora_salida': time(18, 30), 'hora_llegada': time(21, 15), 'clase': 'Turista', 'coche': '03', 'asiento': '20D', 'anden': '11'},
    {'hora_salida': time(20, 0), 'hora_llegada': time(22, 45), 'clase': 'Turista Plus', 'coche': '02', 'asiento': '12B', 'anden': '7'},
]

for idx, alt in enumerate(alternativas_cancelado, 1):
    viaje_alt = Viaje.objects.create(
        usuario=None,  # Sin usuario = disponible
        nombrePasajero=None,
        coche=alt['coche'],
        asiento=alt['asiento'],
        clase=alt['clase'],
        origenEstacion='Madrid - Puerta de Atocha',
        horaSalidaOrigen=alt['hora_salida'],
        andenOrigen=alt['anden'],
        destinoEstacion='Málaga - María Zambrano',
        horaLlegadaDestino=alt['hora_llegada'],
        fechaViaje=date(2026, 3, 20),  # Misma fecha
        estadoViaje='disponible'
    )
    print(f"      {idx}. {alt['hora_salida']} → {alt['hora_llegada']} ({alt['clase']}) - Coche {alt['coche']}, Asiento {alt['asiento']}")

# === VIAJE 3: RETRASADO (con alternativas) ===
viaje3 = Viaje.objects.create(
    usuario=laura,
    nombrePasajero='Laura García',
    coche='02',
    asiento='8C',
    clase='Turista Plus',
    origenEstacion='Sevilla - Santa Justa',
    horaSalidaOrigen=time(10, 45),
    andenOrigen='4',
    destinoEstacion='Madrid - Puerta de Atocha',
    horaLlegadaDestino=time(13, 20),
    fechaViaje=date(2026, 3, 25),
    estadoViaje='retrasado'
)
print(f"\n⏰ Viaje 3 (RETRASADO): {viaje3.origenEstacion} → {viaje3.destinoEstacion}")
print(f"   Fecha: {viaje3.fechaViaje} | Salida original: {viaje3.horaSalidaOrigen}")

# Crear 5 alternativas para el viaje retrasado
print("\n   📋 Creando 5 alternativas para el viaje retrasado:")
alternativas_retrasado = [
    {'hora_salida': time(11, 30), 'hora_llegada': time(14, 5), 'clase': 'Turista', 'coche': '05', 'asiento': '18A', 'anden': '2'},
    {'hora_salida': time(12, 15), 'hora_llegada': time(14, 50), 'clase': 'Turista Plus', 'coche': '03', 'asiento': '9B', 'anden': '3'},
    {'hora_salida': time(13, 0), 'hora_llegada': time(15, 35), 'clase': 'Preferente', 'coche': '01', 'asiento': '4A', 'anden': '5'},
    {'hora_salida': time(14, 45), 'hora_llegada': time(17, 20), 'clase': 'Turista', 'coche': '04', 'asiento': '22C', 'anden': '6'},
    {'hora_salida': time(16, 30), 'hora_llegada': time(19, 5), 'clase': 'Turista Plus', 'coche': '02', 'asiento': '11D', 'anden': '4'},
]

for idx, alt in enumerate(alternativas_retrasado, 1):
    viaje_alt = Viaje.objects.create(
        usuario=None,  # Sin usuario = disponible
        nombrePasajero=None,
        coche=alt['coche'],
        asiento=alt['asiento'],
        clase=alt['clase'],
        origenEstacion='Sevilla - Santa Justa',
        horaSalidaOrigen=alt['hora_salida'],
        andenOrigen=alt['anden'],
        destinoEstacion='Madrid - Puerta de Atocha',
        horaLlegadaDestino=alt['hora_llegada'],
        fechaViaje=date(2026, 3, 25),  # Misma fecha
        estadoViaje='disponible'
    )
    print(f"      {idx}. {alt['hora_salida']} → {alt['hora_llegada']} ({alt['clase']}) - Coche {alt['coche']}, Asiento {alt['asiento']}")

# === VIAJE 4: NORMAL (Confirmado) ===
viaje4 = Viaje.objects.create(
    usuario=laura,
    nombrePasajero='Laura García',
    coche='01',
    asiento='3A',
    clase='Preferente',
    origenEstacion='Valencia - Joaquín Sorolla',
    horaSalidaOrigen=time(14, 15),
    andenOrigen='2',
    destinoEstacion='Alicante - Terminal',
    horaLlegadaDestino=time(16, 0),
    fechaViaje=date(2026, 4, 5),
    estadoViaje='confirmado'
)
print(f"\n✅ Viaje 4 (Confirmado): {viaje4.origenEstacion} → {viaje4.destinoEstacion}")
print(f"   Fecha: {viaje4.fechaViaje} | Salida: {viaje4.horaSalidaOrigen}")

# === VIAJE 5: NORMAL (Confirmado) ===
viaje5 = Viaje.objects.create(
    usuario=laura,
    nombrePasajero='Laura García',
    coche='06',
    asiento='25B',
    clase='Turista',
    origenEstacion='Madrid - Chamartín Clara Campoamor',
    horaSalidaOrigen=time(8, 0),
    andenOrigen='15',
    destinoEstacion='Barcelona - Sants',
    horaLlegadaDestino=time(10, 45),
    fechaViaje=date(2026, 4, 10),
    estadoViaje='confirmado'
)
print(f"\n✅ Viaje 5 (Confirmado): {viaje5.origenEstacion} → {viaje5.destinoEstacion}")
print(f"   Fecha: {viaje5.fechaViaje} | Salida: {viaje5.horaSalidaOrigen}")

print("\n" + "="*60)
print("✅ RESUMEN")
print("="*60)
total_viajes = Viaje.objects.filter(usuario=laura).count()
total_disponibles = Viaje.objects.filter(usuario__isnull=True).count()
print(f"📊 Viajes de Laura: {total_viajes}")
print(f"   - Confirmados: {Viaje.objects.filter(usuario=laura, estadoViaje='confirmado').count()}")
print(f"   - Cancelados: {Viaje.objects.filter(usuario=laura, estadoViaje='cancelado').count()}")
print(f"   - Retrasados: {Viaje.objects.filter(usuario=laura, estadoViaje='retrasado').count()}")
print(f"\n🎫 Viajes disponibles (alternativas): {total_disponibles}")
print("="*60)
