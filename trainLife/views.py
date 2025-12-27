from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from django.http import JsonResponse
from .models import Usuario, Viaje, Ruta, Trayecto, Notificacion
from django.db.models import Q
from datetime import datetime


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

    # Obtener rutas del usuario (relación ManyToMany)
    rutas = Ruta.objects.filter(usuarios=usuario).prefetch_related('trayectos')
    
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

    ruta = Ruta.objects.filter(id=ruta_id).first()
    if ruta:
        # Verificar si ya está en favoritos
        if usuario in ruta.usuarios.all():
            messages.info(request, f'La ruta "{ruta.nombre}" ya está en tus favoritos.')
        else:
            ruta.usuarios.add(usuario)
            messages.success(request, f'Ruta "{ruta.nombre}" agregada a tus favoritos.')
    else:
        messages.error(request, 'Ruta no encontrada.')
    
    return redirect('buscar_rutas', usuario_id=usuario_id)


def eliminarRutaFavorito(request, usuario_id, ruta_id):
    """Eliminar una ruta de favoritos (desasignarla del usuario)."""
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')

    ruta = Ruta.objects.filter(id=ruta_id, usuarios=usuario).first()
    if ruta:
        nombre_ruta = ruta.nombre
        ruta.usuarios.remove(usuario)
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
                'usuarios_count': ruta.usuarios.count(),
                'tiene_usuarios': ruta.usuarios.exists(),
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


def aniadirBillete(request, usuario_id):
    """Vista para comprar billetes - mostrar viajes disponibles."""
    # Verificar que el usuario de la sesión coincida con el de la URL
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')
    
    # GET - Mostrar viajes disponibles
    return render(request, 'AniadirBillete.html', {
        'usuario': usuario,
    })


def notificaciones(request, usuario_id):
    """Vista para mostrar las notificaciones del usuario."""
    # Verificar que el usuario de la sesión coincida con el de la URL
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')

    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return redirect('login')
    
    # Obtener todas las notificaciones del usuario
    todas_notificaciones = Notificacion.objects.filter(usuario=usuario)
    
    # Contar no leídas
    num_no_leidas = todas_notificaciones.filter(leida=False).count()
    
    return render(request, 'notificaciones.html', {
        'usuario': usuario,
        'num_no_leidas': num_no_leidas,
    })


def api_notificaciones(request, usuario_id):
    """API para obtener notificaciones del usuario en formato JSON."""
    # Verificar autenticación
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autenticado'}, status=401)
    
    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    
    # Filtros
    filtro = request.GET.get('filtro', 'all')  # all, unread, alerts
    
    notificaciones = Notificacion.objects.filter(usuario=usuario)
    
    if filtro == 'unread':
        notificaciones = notificaciones.filter(leida=False)
    elif filtro == 'alerts':
        notificaciones = notificaciones.filter(importante=True)
    
    # Serializar notificaciones
    notificaciones_data = []
    for notif in notificaciones:
        notificaciones_data.append({
            'id': notif.id,
            'tipo': notif.tipo,
            'titulo': notif.titulo,
            'mensaje': notif.mensaje,
            'leida': notif.leida,
            'importante': notif.importante,
            'fechaCreacion': notif.fechaCreacion.strftime('%Y-%m-%d %H:%M:%S'),
            'viaje_id': notif.viaje.id if notif.viaje else None,
            'ruta_id': notif.ruta.id if notif.ruta else None,
        })
    
    return JsonResponse({
        'notificaciones': notificaciones_data,
        'total': len(notificaciones_data),
        'no_leidas': notificaciones.filter(leida=False).count()
    })


def marcar_notificacion_leida(request, usuario_id, notificacion_id):
    """Marca una notificación como leída."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    # Verificar autenticación
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autenticado'}, status=401)
    
    try:
        notificacion = Notificacion.objects.get(id=notificacion_id, usuario_id=usuario_id)
        notificacion.marcar_como_leida()
        return JsonResponse({'success': True, 'leida': True})
    except Notificacion.DoesNotExist:
        return JsonResponse({'error': 'Notificación no encontrada'}, status=404)


def marcar_todas_leidas(request, usuario_id):
    """Marca todas las notificaciones del usuario como leídas."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    # Verificar autenticación
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autenticado'}, status=401)
    
    usuario = Usuario.objects.filter(id=usuario_id).first()
    if not usuario:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    
    # Marcar todas como leídas
    notificaciones_no_leidas = Notificacion.objects.filter(usuario=usuario, leida=False)
    count = notificaciones_no_leidas.count()
    
    for notif in notificaciones_no_leidas:
        notif.marcar_como_leida()
    
    return JsonResponse({'success': True, 'marcadas': count})


def configuracion(request, usuario_id):
    usuario = Usuario.objects.get(id=usuario_id)
    
    if request.method == 'POST':
        # Actualizar información personal
        usuario.nombreUsuario = request.POST.get('nombreUsuario')
        usuario.apellido1 = request.POST.get('apellido1')
        usuario.apellido2 = request.POST.get('apellido2', '')
        usuario.numeroTelefono = request.POST.get('numeroTelefono', '')
        usuario.email = request.POST.get('email')
        
        # Actualizar preferencias de notificaciones
        usuario.notificacionesViajes = 'notificacionesViajes' in request.POST
        usuario.notificacionesRutas = 'notificacionesRutas' in request.POST
        usuario.notificacionesAvisos = 'notificacionesAvisos' in request.POST
        
        # Guardar cambios
        usuario.save()
        
        # Agregar mensaje de éxito
        messages.success(request, 'Configuración guardada correctamente.')
        
        # Redirigir para evitar reenvío del formulario
        return redirect('configuracion', usuario_id=usuario_id)
    
    return render(request, 'configuracion.html', {'usuario': usuario})


def api_verificar_email(request):
    """API para verificar si un email existe en la base de datos."""
    if request.method == 'POST':
        # Intentar obtener email de POST data o JSON
        import json
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip()
        except:
            email = request.POST.get('email', '').strip()
        
        if not email:
            return JsonResponse({'existe': False, 'mensaje': 'Email requerido'})
        
        try:
            existe = Usuario.objects.filter(email=email).exists()
            
            if existe:
                return JsonResponse({'existe': True, 'mensaje': 'Email encontrado'})
            else:
                return JsonResponse({'existe': False, 'mensaje': 'No existe ninguna cuenta con este correo electrónico'})
        except Exception as e:
            print(f"Error en api_verificar_email: {e}")
            return JsonResponse({'existe': False, 'mensaje': 'Error al verificar el email'}, status=500)
    
    return JsonResponse({'existe': False, 'mensaje': 'Método no permitido'}, status=405)


def recuperarContrasenia(request):
    """Muestra el formulario para cambiar la contraseña (GET) y procesa el cambio (POST)."""
    if request.method == 'POST':
        import json
        
        # Verificar si es una petición AJAX
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip()
            nueva_contrasenia = data.get('newPassword', '').strip()
            repetir_contrasenia = data.get('repeatPassword', '').strip()
        except:
            email = request.POST.get('email', '').strip()
            nueva_contrasenia = request.POST.get('newPassword', '').strip()
            repetir_contrasenia = request.POST.get('repeatPassword', '').strip()
        
        # Validaciones
        if not email or not nueva_contrasenia or not repetir_contrasenia:
            if is_ajax:
                return JsonResponse({'success': False, 'mensaje': 'Todos los campos son requeridos.'})
            messages.error(request, 'Todos los campos son requeridos.')
            return render(request, 'recuperarContrasenia.html')
        
        if nueva_contrasenia != repetir_contrasenia:
            if is_ajax:
                return JsonResponse({'success': False, 'mensaje': 'Las contraseñas no coinciden.'})
            messages.error(request, 'Las contraseñas no coinciden.')
            return render(request, 'recuperarContrasenia.html')
        
        if len(nueva_contrasenia) < 6:
            if is_ajax:
                return JsonResponse({'success': False, 'mensaje': 'La contraseña debe tener al menos 6 caracteres.'})
            messages.error(request, 'La contraseña debe tener al menos 6 caracteres.')
            return render(request, 'recuperarContrasenia.html')
        
        try:
            usuario = Usuario.objects.get(email=email)
            usuario.contrasenia = nueva_contrasenia
            usuario.save()
            
            if is_ajax:
                return JsonResponse({'success': True, 'mensaje': 'Contraseña cambiada correctamente'})
            
            messages.success(request, 'Contraseña cambiada correctamente. Ya puedes iniciar sesión.')
            return redirect('login')
        except Usuario.DoesNotExist:
            if is_ajax:
                return JsonResponse({'success': False, 'mensaje': 'No se encontró ningún usuario con ese correo electrónico.'})
            messages.error(request, 'No se encontró ningún usuario con ese correo electrónico.')
            return render(request, 'recuperarContrasenia.html')
    
    # GET
    return render(request, 'recuperarContrasenia.html')


# ===========================
# APIs para sistema de alternativas
# ===========================

def api_incidencias_viaje(request, usuario_id, viaje_id):
    """
    API para obtener estado del viaje y viajes disponibles como alternativas.
    Busca VIAJES REALES en la BD que no tengan usuario asignado.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autorizado'}, status=401)
    
    try:
        from datetime import timedelta, date, datetime as dt
        
        viaje = Viaje.objects.get(id=viaje_id, usuario_id=usuario_id)
        
        # Verificar si el viaje está cancelado o retrasado
        tiene_problema = viaje.estadoViaje in ['cancelado', 'retrasado']
        
        resultado = {
            'viaje': {
                'id': viaje.id,
                'origen': viaje.origenEstacion,
                'destino': viaje.destinoEstacion,
                'fecha': viaje.fechaViaje.strftime('%d/%m/%Y'),
                'horaSalida': viaje.horaSalidaOrigen.strftime('%H:%M'),
                'estado': viaje.estadoViaje
            },
            'incidencias': []
        }
        
        if tiene_problema:
            # NUEVA LÓGICA: Buscar viajes disponibles reales en la BD
            ciudad_origen = viaje.origenEstacion.split('-')[0].strip()
            ciudad_destino = viaje.destinoEstacion.split('-')[0].strip()
            
            # Buscar viajes en la misma fecha o al día siguiente
            viajes_alternativos = Viaje.objects.filter(
                usuario__isnull=True,  # Viajes sin usuario asignado
                origenEstacion__icontains=ciudad_origen,
                destinoEstacion__icontains=ciudad_destino,
                fechaViaje__gte=viaje.fechaViaje,
                fechaViaje__lte=viaje.fechaViaje + timedelta(days=1)
            ).order_by('fechaViaje', 'horaSalidaOrigen')[:10]
            
            alternativas_list = []
            for viaje_alt in viajes_alternativos:
                # Calcular duración aproximada
                salida = dt.combine(date.today(), viaje_alt.horaSalidaOrigen)
                llegada = dt.combine(date.today(), viaje_alt.horaLlegadaDestino)
                if llegada < salida:
                    llegada = dt.combine(date.today() + timedelta(days=1), viaje_alt.horaLlegadaDestino)
                duracion = llegada - salida
                duracion_str = f"{duracion.seconds // 3600}h {(duracion.seconds % 3600) // 60}min"
                
                alternativas_list.append({
                    'id': viaje_alt.id,
                    'tipo': 'viaje_disponible',
                    'tipo_codigo': 'siguiente_tren',
                    'descripcion': f"Tren - {viaje_alt.clase}",
                    'origen': viaje_alt.origenEstacion,
                    'destino': viaje_alt.destinoEstacion,
                    'horaSalida': viaje_alt.horaSalidaOrigen.strftime('%H:%M'),
                    'horaLlegada': viaje_alt.horaLlegadaDestino.strftime('%H:%M'),
                    'fecha': viaje_alt.fechaViaje.strftime('%d/%m/%Y'),
                    'duracion': duracion_str,
                    'coche': viaje_alt.coche or 'None',
                    'asiento': viaje_alt.asiento or 'None',
                    'clase': viaje_alt.clase or 'Turista Plus',
                    'anden': viaje_alt.andenOrigen or 'Por confirmar',
                    'nombrePasajero': viaje_alt.nombrePasajero or 'Sin asignar',
                    'estado': viaje_alt.estadoViaje.capitalize() if viaje_alt.estadoViaje else 'Disponible'
                })
            
            # Descripción según el estado
            if viaje.estadoViaje == 'cancelado':
                descripcion = 'Viaje cancelado. Seleccione una alternativa disponible.'
                tipo_display = 'Cancelación'
            else:  # retrasado
                descripcion = 'Viaje retrasado. Puede seleccionar una alternativa si lo desea.'
                tipo_display = 'Retraso'
            
            resultado['incidencias'].append({
                'id': viaje.id,
                'tipo': tipo_display,
                'descripcion': descripcion,
                'retrasoMinutos': None,
                'fechaDeteccion': datetime.now().strftime('%d/%m/%Y %H:%M'),
                'alternativas': alternativas_list,
                'hayAlternativas': len(alternativas_list) > 0
            })
        
        return JsonResponse(resultado)
    
    except Viaje.DoesNotExist:
        return JsonResponse({'error': 'Viaje no encontrado'}, status=404)
    except Exception as e:
        print(f"Error en api_incidencias_viaje: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Error interno del servidor'}, status=500)


def api_aplicar_alternativa(request, usuario_id, viaje_alternativo_id, viaje_cancelado_id):
    """
    API para aplicar una alternativa (asignar viaje disponible al usuario).
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autorizado'}, status=401)
    
    try:
        # Obtener el usuario
        usuario = Usuario.objects.get(id=usuario_id)
        
        # Obtener el viaje cancelado del usuario
        viaje_cancelado = Viaje.objects.get(id=viaje_cancelado_id, usuario=usuario)
        nombre_pasajero = viaje_cancelado.nombrePasajero
        
        # Obtener el viaje alternativo (sin usuario asignado)
        viaje_alternativo = Viaje.objects.get(id=viaje_alternativo_id, usuario__isnull=True)
        
        # Asignar el viaje alternativo al usuario
        viaje_alternativo.usuario = usuario
        viaje_alternativo.nombrePasajero = nombre_pasajero
        viaje_alternativo.estadoViaje = 'confirmado'
        viaje_alternativo.save()
        
        # Eliminar el viaje cancelado
        viaje_cancelado.delete()
        
        return JsonResponse({
            'success': True,
            'mensaje': 'Billete actualizado correctamente'
        })
    
    except Viaje.DoesNotExist:
        return JsonResponse({'error': 'Viaje no encontrado'}, status=404)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        print(f"Error en api_aplicar_alternativa: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Error interno del servidor'}, status=500)


def ver_alternativas_viaje(request, usuario_id, viaje_id):
    """Vista para mostrar la página de alternativas de un viaje."""
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return redirect('login')
    
    try:
        usuario = Usuario.objects.get(id=usuario_id)
        viaje = Viaje.objects.get(id=viaje_id, usuario=usuario)
        
        return render(request, 'alternativasViaje.html', {
            'usuario': usuario,
            'viaje': viaje
        })
    except (Usuario.DoesNotExist, Viaje.DoesNotExist):
        return redirect('inicio_usuario', usuario_id=usuario_id)


def api_incidencias_ruta(request, usuario_id, ruta_id):
    """
    API para obtener viajes con problemas (cancelados/retrasados) en una ruta.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autorizado'}, status=401)
    
    try:
        # Verificar que el usuario tiene acceso a esta ruta
        ruta = Ruta.objects.filter(id=ruta_id, usuarios__id=usuario_id).first()
        if not ruta:
            return JsonResponse({'error': 'Ruta no encontrada'}, status=404)
        
        # Obtener todos los trayectos de la ruta
        trayectos = Trayecto.objects.filter(ruta=ruta).order_by('orden')
        
        # Para cada trayecto, obtener su viaje si tiene problemas
        resultado = {
            'ruta': {
                'id': ruta.id,
                'nombre': ruta.nombre
            },
            'trayectos_con_incidencias': []
        }
        
        for trayecto in trayectos:
            if trayecto.viaje and trayecto.viaje.estadoViaje in ['cancelado', 'retrasado']:
                resultado['trayectos_con_incidencias'].append({
                    'trayecto_id': trayecto.id,
                    'viaje_id': trayecto.viaje.id,
                    'origen': trayecto.viaje.origenEstacion,
                    'destino': trayecto.viaje.destinoEstacion,
                    'estado': trayecto.viaje.estadoViaje
                })
        
        return JsonResponse(resultado)
    
    except Exception as e:
        print(f"Error en api_incidencias_ruta: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Error interno del servidor'}, status=500)


def api_viajes_disponibles(request, usuario_id):
    """API para obtener todos los viajes disponibles (sin usuario asignado)."""
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autorizado'}, status=401)
    
    try:
        from datetime import datetime as dt, date, timedelta
        
        # Obtener parámetros de búsqueda
        origen = request.GET.get('origen', '').strip()
        destino = request.GET.get('destino', '').strip()
        fecha = request.GET.get('fecha', '').strip()
        
        # Obtener viajes disponibles (sin usuario asignado)
        viajes_disponibles = Viaje.objects.filter(
            usuario__isnull=True,
            estadoViaje='disponible',
            fechaViaje__gte=date.today()  # Solo viajes futuros
        )
        
        # Aplicar filtros si se proporcionan
        if origen:
            viajes_disponibles = viajes_disponibles.filter(origenEstacion__icontains=origen)
        if destino:
            viajes_disponibles = viajes_disponibles.filter(destinoEstacion__icontains=destino)
        if fecha:
            try:
                fecha_obj = dt.strptime(fecha, '%Y-%m-%d').date()
                viajes_disponibles = viajes_disponibles.filter(fechaViaje=fecha_obj)
            except ValueError:
                pass
        
        viajes_disponibles = viajes_disponibles.order_by('fechaViaje', 'horaSalidaOrigen')
        
        viajes_list = []
        for viaje in viajes_disponibles:
            # Calcular duración
            salida = dt.combine(date.today(), viaje.horaSalidaOrigen)
            llegada = dt.combine(date.today(), viaje.horaLlegadaDestino)
            if llegada < salida:
                llegada = dt.combine(date.today() + timedelta(days=1), viaje.horaLlegadaDestino)
            duracion = llegada - salida
            duracion_str = f"{duracion.seconds // 3600}h {(duracion.seconds % 3600) // 60}min"
            
            viajes_list.append({
                'id': viaje.id,
                'origen': viaje.origenEstacion,
                'destino': viaje.destinoEstacion,
                'fecha': viaje.fechaViaje.strftime('%d/%m/%Y'),
                'horaSalida': viaje.horaSalidaOrigen.strftime('%H:%M'),
                'horaLlegada': viaje.horaLlegadaDestino.strftime('%H:%M'),
                'duracion': duracion_str,
                'coche': viaje.coche or 'N/A',
                'asiento': viaje.asiento or 'N/A',
                'clase': viaje.clase or 'Turista Plus',
                'anden': viaje.andenOrigen or 'Por confirmar',
                'estado': viaje.estadoViaje.capitalize() if viaje.estadoViaje else 'Disponible'
            })
        
        return JsonResponse({
            'viajes': viajes_list,
            'total': len(viajes_list)
        })
    
    except Exception as e:
        print(f"Error en api_viajes_disponibles: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Error interno del servidor'}, status=500)


def api_comprar_viaje(request, usuario_id, viaje_id):
    """API para comprar un viaje disponible (asignarlo al usuario)."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    session_usuario_id = request.session.get('usuario_id')
    if not session_usuario_id or session_usuario_id != usuario_id:
        return JsonResponse({'error': 'No autorizado'}, status=401)
    
    try:
        # Obtener el usuario
        usuario = Usuario.objects.get(id=usuario_id)
        
        # Obtener el viaje disponible
        viaje = Viaje.objects.get(id=viaje_id, usuario__isnull=True, estadoViaje='disponible')
        
        # Asignar el viaje al usuario
        viaje.usuario = usuario
        viaje.nombrePasajero = f"{usuario.nombreUsuario} {usuario.apellido1}"
        viaje.estadoViaje = 'confirmado'
        viaje.save()
        
        return JsonResponse({
            'success': True,
            'mensaje': 'Billete comprado exitosamente'
        })
    
    except Viaje.DoesNotExist:
        return JsonResponse({'error': 'Viaje no encontrado o ya no está disponible'}, status=404)
    except Usuario.DoesNotExist:
        return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        print(f"Error en api_comprar_viaje: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Error interno del servidor'}, status=500)
