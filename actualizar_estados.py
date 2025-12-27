import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyecto.settings')
django.setup()

from trainLife.models import Viaje

# Actualizar todos los viajes con estado "disponible" a "confirmado"
viajes_actualizados = Viaje.objects.filter(estadoViaje='disponible').update(estadoViaje='confirmado')

print(f"✅ Se actualizaron {viajes_actualizados} viajes de 'disponible' a 'confirmado'")

# Mostrar el conteo por estados
print("\nConteo de viajes por estado:")
for estado in ['confirmado', 'retrasado', 'cancelado']:
    count = Viaje.objects.filter(estadoViaje=estado).count()
    print(f"  - {estado}: {count} viajes")
