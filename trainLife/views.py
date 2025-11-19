from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from django.http import JsonResponse
from .models import Usuario, Viaje, Ruta, Trayecto
from django.db.models import Q


# Create your views here.
def index(request):
    return render(request, 'home.html')


def login(request):
    """Muestra el formulario de login (GET) y procesa el login (POST).
    
    Esta es la vista para login.html (diseño moderno).
    Redirige a homeUsuario tras login exitoso.
    """
    if request.method == 'POST':
        email = request.POST.get('email')
        contrasenia = request.POST.get('contrasenia')
        
        # Debug: imprimir valores recibidos
        print(f"DEBUG - Email recibido: '{email}'")
        print(f"DEBUG - Contraseña recibida: '{contrasenia}'")

        if not email or not contrasenia:
            messages.error(request, 'Introduce el correo y la contraseña.')
            return render(request, 'login.html')

        try:
            # Intentar buscar el usuario
            usuario = Usuario.objects.get(email=email, contrasenia=contrasenia)
            print(f"DEBUG - Usuario encontrado: {usuario.nombreUsuario}")
            
            # Guardar datos mínimos en sesión
            request.session['usuario_id'] = usuario.id
            request.session['usuario_nombre'] = usuario.nombreUsuario
            print(f"DEBUG - Redirigiendo a inicio_usuario con id {usuario.id}")
            return redirect('inicio_usuario', usuario_id=usuario.id)
        except Usuario.DoesNotExist:
            print(f"DEBUG - Usuario NO encontrado")
            messages.error(request, 'Usuario o contraseña incorrectos.')
            return render(request, 'login.html')

    # GET
    return render(request, 'login.html')


def loginUsuario(request):
    """Muestra el formulario de login (GET) y procesa el login (POST).

    Campos esperados en el form: 'email' y 'contrasenia'.
    Si las credenciales coinciden con un `Usuario` se crea sesión y se redirige a inicio.
    """
    if request.method == 'POST':
        email = request.POST.get('email')
        contrasenia = request.POST.get('contrasenia')
        
        # Debug: imprimir valores recibidos
        print(f"DEBUG - Email recibido: '{email}'")
        print(f"DEBUG - Contraseña recibida: '{contrasenia}'")

        if not email or not contrasenia:
            messages.error(request, 'Introduce el correo y la contraseña.')
            return render(request, 'loginUsuario.html')

        try:
            # Intentar buscar el usuario
            usuario = Usuario.objects.get(email=email, contrasenia=contrasenia)
            print(f"DEBUG - Usuario encontrado: {usuario.nombreUsuario}")
            
            # Guardar datos mínimos en sesión
            request.session['usuario_id'] = usuario.id
            request.session['usuario_nombre'] = usuario.nombreUsuario
            print(f"DEBUG - Redirigiendo a inicio_usuario con id {usuario.id}")
            return redirect('inicio_usuario', usuario_id=usuario.id)
        except Usuario.DoesNotExist:
            print(f"DEBUG - Usuario NO encontrado")
            messages.error(request, 'Usuario o contraseña incorrectos.')
            return render(request, 'loginUsuario.html')

    # GET
    return render(request, 'loginUsuario.html')


def inicioRedirect(request):
    """Redirige desde /inicio/ a /inicio/<usuario_id>/ usando la sesión."""
    usuario_id = request.session.get('usuario_id')
    if not usuario_id:
        return redirect('login')
    return redirect('inicio_usuario', usuario_id=usuario_id)


def inicioUsuario(request, usuario_id):
    """Vista de inicio para usuarios autenticados por sesión."""
    # Verificar que el usuario de la sesión coincida con el de la URL
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')
    
    return render(request, 'homeUsuario.html', {'usuario': usuario})


def registroUsuario(request):
    # Stub para registro; puedes implementar la lógica de registro aquí.
    return render(request, 'crearUsuario.html')
    
def viajesUsuario(request, usuario_id):
    """Vista de viajes para usuarios autenticados por sesión."""
    # Verificar que el usuario de la sesión coincida con el de la URL
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')
    
    # Contar los viajes del usuario
    num_viajes = Viaje.objects.filter(usuario=usuario).count()
    
    # Obtener el próximo viaje (el más cercano en el futuro por fecha)
    from datetime import date
    proximo_viaje = Viaje.objects.filter(
        usuario=usuario,
        fechaViaje__gte=date.today()
    ).order_by('fechaViaje', 'horaSalidaOrigen').first()
    
    return render(request, 'Viajes.html', {
        'usuario': usuario,
        'num_viajes': num_viajes,
        'proximo_viaje': proximo_viaje
    })

def misViajes(request, usuario_id):
    session_usuario_id = request.session.get('usuario_id')
    usuario = Usuario.objects.filter(id=usuario_id).first()
    
    # Obtener todos los viajes del usuario
    viajes = Viaje.objects.filter(usuario=usuario).order_by('-fechaViaje', '-horaSalidaOrigen')
    
    return render(request, 'misViajes.html', {
        'usuario': usuario,
        'viajes': viajes
    })

def salir(request, usuario_id):
    session_usuario_id = request.session.get('usuario_id')
    usuario = Usuario.objects.filter(id=usuario_id).first()
    return render(request, 'salir.html', {'usuario' : usuario})


def verDetallesViaje(request, usuario_id, viaje_id):
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')

    viaje = Viaje.objects.filter(id=viaje_id, usuario=usuario).first()
    if not viaje:
        messages.error(request, 'Viaje no encontrado.')
        return redirect('mis_viajes', usuario_id=usuario_id)

    return render(request, 'ViajesDetalles.html', {
        'usuario': usuario,
        'viaje': viaje
    })


def buscarRutas(request, usuario_id):
    """Vista para buscar rutas disponibles."""
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')

    # Obtener TODAS las rutas (con y sin usuario asignado)
    rutas_disponibles = Ruta.objects.all().prefetch_related('trayectos').order_by('-fechaCreacion')
    
    # Si hay búsqueda
    busqueda = None
    if request.GET.get('origen') or request.GET.get('destino'):
        origen = request.GET.get('origen', '').strip()
        destino = request.GET.get('destino', '').strip()
        fecha = request.GET.get('fecha', '').strip()
        
        if origen or destino:
            query = Q()
            if origen:
                query &= Q(trayectos__estacionSalida__icontains=origen)
            if destino:
                query &= Q(trayectos__estacionLlegada__icontains=destino)
            
            rutas_disponibles = rutas_disponibles.filter(query).distinct()
            busqueda = {'origen': origen, 'destino': destino, 'fecha': fecha}
    
    # Fecha actual para el campo de fecha
    from datetime import date
    fecha_actual = date.today().strftime('%Y-%m-%d')
    
    return render(request, 'buscarRutas.html', {
        'usuario': usuario,
        'rutas': rutas_disponibles,
        'busqueda': busqueda,
        'fecha_actual': fecha_actual
    })


def misRutas(request, usuario_id):
    """Vista para ver las rutas guardadas del usuario."""
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')

    # Obtener rutas del usuario
    rutas = Ruta.objects.filter(usuario=usuario).prefetch_related('trayectos')
    
    return render(request, 'MisRutas.html', {
        'usuario': usuario,
        'rutas': rutas
    })


def agregarRutaFavorito(request, usuario_id, ruta_id):
    """Agregar una ruta a favoritos asignándola al usuario."""
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')

    ruta = Ruta.objects.filter(id=ruta_id, usuario__isnull=True).first()
    if ruta:
        ruta.usuario = usuario
        ruta.save()
        messages.success(request, f'Ruta "{ruta.nombre}" agregada a tus favoritos.')
    else:
        messages.error(request, 'Ruta no disponible.')
    
    return redirect('buscar_rutas', usuario_id=usuario_id)


def eliminarRutaFavorito(request, usuario_id, ruta_id):
    """Eliminar una ruta de favoritos (desasignarla del usuario)."""
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')

    ruta = Ruta.objects.filter(id=ruta_id, usuario=usuario).first()
    if ruta:
        nombre_ruta = ruta.nombre
        ruta.usuario = None
        ruta.save()
        messages.success(request, f'Ruta "{nombre_ruta}" eliminada de tus favoritos.')
    else:
        messages.error(request, 'Ruta no encontrada.')
    
    return redirect('mis_rutas', usuario_id=usuario_id)


def crearUsuario(request):
    """Vista para crear un nuevo usuario."""
    if request.method == 'POST':
        # Obtener datos del formulario
        nombre = request.POST.get('nombre', '').strip()
        apellido1 = request.POST.get('apellido1', '').strip()
        apellido2 = request.POST.get('apellido2', '').strip()
        telefono = request.POST.get('telefono', '').strip()
        email = request.POST.get('email', '').strip()
        contrasenia = request.POST.get('contrasenia', '').strip()
        confirmar_contrasenia = request.POST.get('confirmar_contrasenia', '').strip()
        aceptar_terminos = request.POST.get('terminos')
        
        # Validaciones
        errores = []
        
        if not nombre:
            errores.append('El nombre es obligatorio.')
        if not apellido1:
            errores.append('El primer apellido es obligatorio.')
        if not email:
            errores.append('El correo electrónico es obligatorio.')
        if not contrasenia:
            errores.append('La contraseña es obligatoria.')
        if contrasenia != confirmar_contrasenia:
            errores.append('Las contraseñas no coinciden.')
        if len(contrasenia) < 6:
            errores.append('La contraseña debe tener al menos 6 caracteres.')
        if not aceptar_terminos:
            errores.append('Debes aceptar los términos y condiciones.')
        
        # Verificar si el email ya existe
        if Usuario.objects.filter(email=email).exists():
            errores.append('El correo electrónico ya está registrado.')
        
        if errores:
            for error in errores:
                messages.error(request, error)
            return render(request, 'crearUsuario.html', {
                'nombre': nombre,
                'apellido1': apellido1,
                'apellido2': apellido2,
                'telefono': telefono,
                'email': email
            })
        
        # Crear el usuario
        try:
            usuario = Usuario.objects.create(
                nombreUsuario=nombre,
                apellido1=apellido1,
                apellido2=apellido2 if apellido2 else None,
                email=email,
                numeroTelefono=telefono if telefono else None,
                contrasenia=contrasenia
            )
            messages.success(request, '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.')
            return redirect('login')
        except Exception as e:
            messages.error(request, f'Error al crear la cuenta: {str(e)}')
            return render(request, 'crearUsuario.html', {
                'nombre': nombre,
                'apellido1': apellido1,
                'apellido2': apellido2,
                'telefono': telefono,
                'email': email
            })
    
    # GET
    return render(request, 'crearUsuario.html')


def api_buscar_rutas(request, usuario_id):
    """API JSON para buscar rutas dinámicamente."""
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autorizado'}, status=401)

    # Obtener todas las rutas
    rutas = Ruta.objects.all().prefetch_related('trayectos')
    
    # Aplicar filtros si existen
    origen = request.GET.get('origen', '').strip()
    destino = request.GET.get('destino', '').strip()
    
    if origen or destino:
        query = Q()
        if origen:
            query &= Q(trayectos__estacionSalida__icontains=origen)
        if destino:
            query &= Q(trayectos__estacionLlegada__icontains=destino)
        rutas = rutas.filter(query).distinct()
    
    # Serializar rutas
    rutas_data = []
    for ruta in rutas:
        trayectos = ruta.trayectos.all().order_by('orden')
        
        # Calcular datos de la ruta
        primer_trayecto = trayectos.first() if trayectos else None
        ultimo_trayecto = trayectos.last() if trayectos else None
        
        if primer_trayecto and ultimo_trayecto:
            ruta_data = {
                'id': ruta.id,
                'nombre': ruta.nombre,
                'descripcion': ruta.descripcion or '',
                'usuario_nombre': ruta.usuario.nombreUsuario if ruta.usuario else 'Sin asignar',
                'tiene_usuario': ruta.usuario is not None,
                'origen': primer_trayecto.estacionSalida,
                'destino': ultimo_trayecto.estacionLlegada,
                'hora_salida': primer_trayecto.horaSalida.strftime('%H:%M'),
                'hora_llegada': ultimo_trayecto.horaLlegada.strftime('%H:%M'),
                'num_transbordos': trayectos.count() - 1,
                'trayectos': [
                    {
                        'orden': t.orden,
                        'estacion_salida': t.estacionSalida,
                        'estacion_llegada': t.estacionLlegada,
                        'hora_salida': t.horaSalida.strftime('%H:%M'),
                        'hora_llegada': t.horaLlegada.strftime('%H:%M'),
                        'anden_salida': t.andenSalida or 'N/A',
                        'anden_llegada': t.andenLlegada or 'N/A',
                        'nombre_linea': t.nombreLinea,
                        'color_linea': t.colorLinea or '',
                        'imagen_url': t.imagenMapa.url if t.imagenMapa else None
                    }
                    for t in trayectos
                ]
            }
            rutas_data.append(ruta_data)
    
    return JsonResponse({'rutas': rutas_data})
