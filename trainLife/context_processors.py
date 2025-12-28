"""
Context processors para TrainLife.
Inyecta variables globales en todas las plantillas.
"""

def color_mode(request):
    """
    Inyecta el modo de color del usuario autenticado en todas las plantillas.
    Si no hay usuario autenticado, usa el modo 'normal' por defecto.
    """
    from .models import Usuario
    
    # Obtener el usuario_id de la sesión
    usuario_id = request.session.get('usuario_id')
    
    if usuario_id:
        try:
            usuario = Usuario.objects.get(id=usuario_id)
            return {'color_mode': usuario.color_mode}
        except Usuario.DoesNotExist:
            pass
    
    # Por defecto, modo normal
    return {'color_mode': 'normal'}
