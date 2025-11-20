from trainLife.models import Viaje
from datetime import date

print("Verificando viajes en la base de datos...")
print(f"Fecha actual: {date.today()}")
print()

# Todos los viajes
todos_viajes = Viaje.objects.all()
print(f"Total de viajes: {todos_viajes.count()}")

# Viajes futuros
viajes_futuros = Viaje.objects.filter(fechaViaje__gte=date.today()).order_by('fechaViaje', 'horaSalidaOrigen')
print(f"Viajes futuros: {viajes_futuros.count()}")
print()

if viajes_futuros.exists():
    print("Próximos viajes:")
    for v in viajes_futuros[:5]:
        print(f"  - {v.origenEstacion} → {v.destinoEstacion}")
        print(f"    Fecha: {v.fechaViaje} a las {v.horaSalidaOrigen}")
        print(f"    Usuario: {v.usuario.nombreUsuario}")
        print()
else:
    print("No hay viajes futuros programados")
    print()
    print("Viajes existentes (cualquier fecha):")
    for v in todos_viajes[:5]:
        print(f"  - {v.origenEstacion} → {v.destinoEstacion}")
        print(f"    Fecha: {v.fechaViaje} a las {v.horaSalidaOrigen}")
        print(f"    Usuario: {v.usuario.nombreUsuario}")
        print()
