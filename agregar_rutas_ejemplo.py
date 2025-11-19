"""
Script para agregar rutas de ejemplo a la base de datos de TrainLife
Ejecutar con: python manage.py shell < agregar_rutas_ejemplo.py
"""

from trainLife.models import Ruta, Trayecto, Usuario
from datetime import time

# Función auxiliar para crear rutas con trayectos
def crear_ruta(nombre, descripcion, trayectos_data, usuario=None):
    ruta = Ruta.objects.create(
        nombre=nombre,
        descripcion=descripcion,
        usuario=usuario
    )
    
    for orden, trayecto_data in enumerate(trayectos_data, start=1):
        Trayecto.objects.create(
            ruta=ruta,
            orden=orden,
            **trayecto_data
        )
    
    print(f"✓ Ruta creada: {nombre}")
    return ruta

# Eliminar rutas existentes (opcional, comenta si no quieres eliminar)
print("Eliminando rutas existentes...")
Ruta.objects.all().delete()
print("✓ Rutas eliminadas\n")

# Crear rutas sin usuario asignado (disponibles para todos)
print("Creando rutas disponibles...\n")

# Ruta 1: Madrid → Barcelona (AVE)
crear_ruta(
    nombre="Madrid → Barcelona (AVE Directo)",
    descripcion="Ruta rápida por alta velocidad, conexión directa sin transbordos",
    trayectos_data=[
        {
            'estacionSalida': 'Madrid - Puerta de Atocha',
            'estacionLlegada': 'Barcelona - Sants',
            'horaSalida': time(9, 0),
            'horaLlegada': time(12, 30),
            'andenSalida': '4A',
            'andenLlegada': '2C',
            'nombreLinea': 'AVE Madrid-Barcelona',
            'colorLinea': 'Roja'
        }
    ],
    usuario=None
)

# Ruta 2: Madrid → Sevilla (AVE)
crear_ruta(
    nombre="Madrid → Sevilla (AVE)",
    descripcion="Conexión directa de alta velocidad a Andalucía",
    trayectos_data=[
        {
            'estacionSalida': 'Madrid - Chamartín',
            'estacionLlegada': 'Sevilla - Santa Justa',
            'horaSalida': time(11, 15),
            'horaLlegada': time(15, 45),
            'andenSalida': '3B',
            'andenLlegada': '5A',
            'nombreLinea': 'AVE Madrid-Sevilla',
            'colorLinea': 'Verde'
        }
    ],
    usuario=None
)

# Ruta 3: Madrid → Valencia (AVE)
crear_ruta(
    nombre="Madrid → Valencia (AVE)",
    descripcion="Viaje directo a la costa mediterránea",
    trayectos_data=[
        {
            'estacionSalida': 'Madrid - Puerta de Atocha',
            'estacionLlegada': 'Valencia - Joaquín Sorolla',
            'horaSalida': time(13, 0),
            'horaLlegada': time(16, 20),
            'andenSalida': '6C',
            'andenLlegada': '1A',
            'nombreLinea': 'AVE Madrid-Valencia',
            'colorLinea': 'Azul'
        }
    ],
    usuario=None
)

# Ruta 4: Barcelona → Málaga (con transbordo)
crear_ruta(
    nombre="Barcelona → Málaga",
    descripcion="Ruta con transbordo en Madrid, perfecta para turismo",
    trayectos_data=[
        {
            'estacionSalida': 'Barcelona - Sants',
            'estacionLlegada': 'Madrid - Puerta de Atocha',
            'horaSalida': time(15, 30),
            'horaLlegada': time(18, 30),
            'andenSalida': '2C',
            'andenLlegada': '4A',
            'nombreLinea': 'AVE Barcelona-Madrid',
            'colorLinea': 'Roja'
        },
        {
            'estacionSalida': 'Madrid - Puerta de Atocha',
            'estacionLlegada': 'Málaga - María Zambrano',
            'horaSalida': time(18, 30),
            'horaLlegada': time(20, 15),
            'andenSalida': '5B',
            'andenLlegada': '3D',
            'nombreLinea': 'AVE Madrid-Málaga',
            'colorLinea': 'Amarilla'
        }
    ],
    usuario=None
)

# Ruta 5: Madrid → Zaragoza → Barcelona (económica)
crear_ruta(
    nombre="Madrid → Barcelona (vía Zaragoza) - Económica",
    descripcion="Opción económica con transbordo en Zaragoza",
    trayectos_data=[
        {
            'estacionSalida': 'Madrid - Puerta de Atocha',
            'estacionLlegada': 'Zaragoza - Delicias',
            'horaSalida': time(16, 45),
            'horaLlegada': time(18, 15),
            'andenSalida': '6A',
            'andenLlegada': '2C',
            'nombreLinea': 'AVE Madrid-Zaragoza',
            'colorLinea': 'Naranja'
        },
        {
            'estacionSalida': 'Zaragoza - Delicias',
            'estacionLlegada': 'Barcelona - Sants',
            'horaSalida': time(18, 15),
            'horaLlegada': time(20, 15),
            'andenSalida': '3B',
            'andenLlegada': '4D',
            'nombreLinea': 'AVE Zaragoza-Barcelona',
            'colorLinea': 'Roja'
        }
    ],
    usuario=None
)

# Ruta 6: Valencia → Alicante
crear_ruta(
    nombre="Valencia → Alicante",
    descripcion="Recorrido corto por la costa mediterránea",
    trayectos_data=[
        {
            'estacionSalida': 'Valencia - Joaquín Sorolla',
            'estacionLlegada': 'Alicante - Terminal',
            'horaSalida': time(10, 30),
            'horaLlegada': time(12, 15),
            'andenSalida': '2A',
            'andenLlegada': '1B',
            'nombreLinea': 'Cercanías Valencia-Alicante',
            'colorLinea': 'Azul'
        }
    ],
    usuario=None
)

# Ruta 7: Madrid → Bilbao
crear_ruta(
    nombre="Madrid → Bilbao",
    descripcion="Conexión directa al País Vasco",
    trayectos_data=[
        {
            'estacionSalida': 'Madrid - Chamartín',
            'estacionLlegada': 'Bilbao - Abando',
            'horaSalida': time(8, 0),
            'horaLlegada': time(13, 30),
            'andenSalida': '1A',
            'andenLlegada': '3C',
            'nombreLinea': 'Alvia Madrid-Bilbao',
            'colorLinea': 'Morada'
        }
    ],
    usuario=None
)

print("\n" + "="*50)
print("✓ Todas las rutas han sido creadas exitosamente!")
print("="*50)
print("\nResumen:")
print(f"  - Total de rutas: {Ruta.objects.count()}")
print(f"  - Total de trayectos: {Trayecto.objects.count()}")
print(f"  - Rutas sin usuario: {Ruta.objects.filter(usuario__isnull=True).count()}")
print(f"  - Rutas asignadas: {Ruta.objects.filter(usuario__isnull=False).count()}")
