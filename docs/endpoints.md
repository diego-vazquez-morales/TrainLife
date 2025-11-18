# Endpoints - TrainLife

Este documento describe los endpoints (rutas) de la aplicación trainLife, los métodos HTTP esperados, los parámetros/form-data principales, las plantillas asociadas y las reglas de autorización (sesión).

Resumen de comportamiento de autenticación
- La aplicación utiliza autenticación basada en sesión implementada manualmente: después de un login exitoso se guarda request.session['usuario_id'] y request.session['usuario_nombre'].
- Las vistas protegidas comprueban que session['usuario_id'] exista y coincida con el usuario_id en la URL.
- No se usa django.contrib.auth (por ahora) y las contraseñas están almacenadas en claro en el modelo Usuario: revisar urgentemente (ver docs/models_and_er.md).

Endpoints

- GET / (name: index)
  - Vista: views.index
  - Template: home.html
  - Autorización: pública
  - Descripción: página principal del sitio.

- GET, POST /login/ (name: login)
  - Vista: views.login
  - Templates: login.html
  - Parámetros (POST): email, contrasenia
  - Comportamiento POST: busca Usuario.objects.get(email=email, contrasenia=contrasenia). Si existe, guarda en sesión usuario_id y usuario_nombre y redirige a /inicio/<usuario_id>/
  - Autorización: pública
  - Riesgo: credenciales en texto claro (ver docs/models_and_er.md)

- GET, POST /loginUsuario/ (name: login_usuario)
  - Vista: views.loginUsuario
  - Templates: loginUsuario.html
  - Parámetros (POST): email, contrasenia
  - Comportamiento POST: busca Usuario.objects.get(email=email, contrasenia=contrasenia). Si existe, guarda en sesión usuario_id y usuario_nombre y redirige a /inicio/<usuario_id>/
  - Autorización: pública
  - Descripción: versión alternativa del login con plantilla diferente
  - Riesgo: credenciales en texto claro (ver docs/models_and_er.md)

- GET /inicio/ (name: inicio_redirect)
  - Vista: views.inicioRedirect
  - Template: ninguna (redirige)
  - Autorización: requiere sesión activa
  - Comportamiento: obtiene usuario_id de la sesión y redirige a /inicio/<usuario_id>/. Si no hay sesión, redirige a /login/

- GET /inicio/<int:usuario_id>/ (name: inicio_usuario)
  - Vista: views.inicioUsuario
  - Template: homeUsuario.html
  - Autorización: requiere sesión activa y que session['usuario_id'] == usuario_id
  - Descripción: página de inicio del usuario autenticado
  - Si la autorización falla, redirige a /login/

- GET /registro/ (name: registro_usuario)
  - Vista: views.registroUsuario
  - Template: crearUsuario.html
  - Autorización: pública
  - Descripción: formulario de registro de nuevos usuarios (stub, lógica pendiente de implementar)

- GET /viajes/<int:usuario_id>/ (name: viajes_usuario)
  - Vista: views.viajesUsuario
  - Template: Viajes.html
  - Autorización: requiere sesión activa y que session['usuario_id'] == usuario_id
  - Descripción: muestra resumen de viajes del usuario (número de viajes y próximo viaje)
  - Context: usuario, num_viajes, proximo_viaje

- GET /misViajes/<int:usuario_id>/ (name: mis_viajes)
  - Vista: views.misViajes
  - Template: misViajes.html
  - Autorización: requiere sesión activa (verificación en template, no en vista - posible mejora)
  - Descripción: lista todos los viajes del usuario ordenados por fecha descendente
  - Context: usuario, viajes

- GET /salir/<int:usuario_id>/ (name: salir)
  - Vista: views.salir
  - Template: salir.html
  - Autorización: requiere sesión activa (verificación en template, no en vista - posible mejora)
  - Descripción: página de salida/logout del usuario

- GET /viajesDetalles/<int:usuario_id>/<int:viaje_id>/ (name: detalles_viaje)
  - Vista: views.verDetallesViaje
  - Template: ViajesDetalles.html
  - Autorización: requiere sesión activa y que session['usuario_id'] == usuario_id
  - Descripción: muestra detalles de un viaje específico del usuario
  - Context: usuario, viaje
  - Si el viaje no existe o no pertenece al usuario, redirige a mis_viajes con mensaje de error

Notas de seguridad y mejoras sugeridas

1. Contraseñas en texto claro: actualmente las contraseñas se almacenan sin cifrar en la base de datos (campo Usuario.contrasenia). Se recomienda migrar a django.contrib.auth o usar make_password() y check_password() de Django.

2. Autorización inconsistente: algunas vistas verifican la sesión correctamente (inicioUsuario, viajesUsuario, verDetallesViaje), mientras que otras (misViajes, salir) no verifican explícitamente. Unificar la verificación de sesión.

3. CSRF: asegurarse de que los formularios POST incluyan {% csrf_token %} en las plantillas.

4. Mensajes de error: usar el framework de mensajes de Django (django.contrib.messages) de forma consistente.

5. Validación de entrada: añadir validación adicional en las vistas para prevenir inyecciones y otros ataques.

6. Redirección tras login: considerar usar un parámetro 'next' para redirigir al usuario a la página que intentaba acceder antes del login.
