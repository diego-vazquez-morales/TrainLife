import os
import django
from datetime import datetime, timedelta, time

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyecto.settings')
django.setup()

from trainLife.models import Usuario, Viaje

# Limpiar viajes existentes (opcional)
print("Limpiando viajes existentes...")
Viaje.objects.all().delete()

# Rutas disponibles
rutas = [
    {
        'origen': 'Madrid - Chamartín Clara Campoamor',
        'destino': 'Alicante - Terminal',
        'duracion': timedelta(hours=2, minutes=45)
    },
    {
        'origen': 'Barcelona - Sants',
        'destino': 'Valencia - Joaquín Sorolla',
        'duracion': timedelta(hours=3, minutes=15)
    },
    {
        'origen': 'Sevilla - Santa Justa',
        'destino': 'Málaga - María Zambrano',
        'duracion': timedelta(hours=2, minutes=20)
    },
    {
        'origen': 'Madrid - Puerta de Atocha',
        'destino': 'Barcelona - Sants',
        'duracion': timedelta(hours=2, minutes=50)
    },
    {
        'origen': 'Valencia - Joaquín Sorolla',
        'destino': 'Sevilla - Santa Justa',
        'duracion': timedelta(hours=4, minutes=10)
    }
]

# Obtener todos los usuarios
usuarios = Usuario.objects.all()
print(f"Encontrados {usuarios.count()} usuarios")

# Contador de viajes creados
total_viajes = 0
total_alternativas = 0

# Para cada usuario
for usuario in usuarios:
    print(f"\n--- Creando viajes para {usuario.nombreUsuario} {usuario.apellido1} ---")
    
    # Crear 5 viajes para este usuario
    for i in range(5):
        ruta = rutas[i]
        
        # Fecha del viaje (próximos 30 días)
        fecha_viaje = datetime.now().date() + timedelta(days=(i * 5) + 3)
        
        # Hora de salida base
        hora_salida = time(hour=8 + (i * 2), minute=30)
        
        # Calcular hora de llegada
        fecha_hora_salida = datetime.combine(fecha_viaje, hora_salida)
        fecha_hora_llegada = fecha_hora_salida + ruta['duracion']
        hora_llegada = fecha_hora_llegada.time()
        
        # Definir estado del viaje
        # Viaje 2: retrasado, Viaje 3: cancelado, resto: confirmado
        if i == 1:
            estado_viaje = "retrasado"
            estado_texto = "⏱️ Retrasado"
        elif i == 2:
            estado_viaje = "cancelado"
            estado_texto = "❌ Cancelado"
        else:
            estado_viaje = "confirmado"
            estado_texto = "✓ Confirmado"
        
        # Crear viaje asignado al usuario
        viaje_usuario = Viaje.objects.create(
            usuario=usuario,
            nombrePasajero=f"{usuario.nombreUsuario} {usuario.apellido1}",
            coche=f"{(i % 10) + 1:02d}",
            asiento=f"{(i * 3 + 1) % 80 + 1}{'ABCD'[i % 4]}",
            clase="Turista Plus" if i % 2 == 0 else "Preferente",
            origenEstacion=ruta['origen'],
            horaSalidaOrigen=hora_salida,
            andenOrigen=str((i % 12) + 1),
            destinoEstacion=ruta['destino'],
            horaLlegadaDestino=hora_llegada,
            fechaViaje=fecha_viaje,
            estadoViaje=estado_viaje
        )
        
        total_viajes += 1
        print(f"  {estado_texto} Viaje {i+1}: {ruta['origen']} → {ruta['destino']} ({fecha_viaje})")
        
        # Crear alternativas para viajes cancelados o retrasados
        if estado_viaje in ["cancelado", "retrasado"]:
            print(f"    Creando alternativas para viaje {estado_viaje}...")
            # Crear 3 alternativas para este viaje (sin asignar a usuario)
            for j in range(3):
                # Hora de salida alternativa (1, 2, 3 horas después)
                hora_alt = (fecha_hora_salida + timedelta(hours=j+1)).time()
                fecha_hora_llegada_alt = datetime.combine(fecha_viaje, hora_alt) + ruta['duracion']
                hora_llegada_alt = fecha_hora_llegada_alt.time()
                
                # Crear alternativa sin usuario (misma ruta, diferente hora)
                alternativa = Viaje.objects.create(
                    usuario=None,  # Sin asignar
                    nombrePasajero=None,
                    coche=f"{((j + 5) % 10) + 1:02d}",
                    asiento=f"{(j * 7 + 10) % 80 + 1}{'ABCD'[j % 4]}",
                    clase="Turista Plus" if j % 2 == 0 else "Preferente",
                    origenEstacion=ruta['origen'],  # Misma ruta que el cancelado
                    horaSalidaOrigen=hora_alt,  # Diferente hora
                    andenOrigen=str((j % 12) + 1),
                    destinoEstacion=ruta['destino'],  # Mismo destino
                    horaLlegadaDestino=hora_llegada_alt,
                    fechaViaje=fecha_viaje,  # Misma fecha
                    estadoViaje="disponible"
                )
                
                total_alternativas += 1
                print(f"    - Alternativa {j+1}: Salida {hora_alt} (ID: {alternativa.id})")

print(f"\n{'='*60}")
print(f"✅ Proceso completado:")
print(f"   - Total viajes asignados: {total_viajes}")
print(f"   - Total alternativas disponibles: {total_alternativas}")
print(f"   - Total viajes en BD: {total_viajes + total_alternativas}")
print(f"{'='*60}")
