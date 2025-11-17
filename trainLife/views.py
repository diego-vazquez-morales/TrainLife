from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from .models import Usuario


# Create your views here.
def index(request):
    return render(request, 'index.html')


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
    
    return render(request, 'inicioUsuario.html', {'usuario': usuario})


def registroUsuario(request):
    # Stub para registro; puedes implementar la lógica de registro aquí.
    return render(request, 'crearUsuario.html')
    

